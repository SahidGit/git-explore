const express = require('express');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const { appendReport, readReports } = require('../services/fileStore');

const router = express.Router();

/** Escape HTML special characters to neutralize XSS in stored strings */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// ─── POST /api/reports — Submit a new report ──────────
router.post('/', async (req, res) => {
    try {
        const { issueType, pageUrl, description, email, cfTurnstileToken } = req.body;

        // Field validation
        if (!issueType) {
            return res.status(400).json({ success: false, message: 'Validation failed: issueType is required.' });
        }
        if (!description?.trim()) {
            return res.status(400).json({ success: false, message: 'Validation failed: description is required.' });
        }
        if (description.length > 2000) {
            return res.status(400).json({ success: false, message: 'Validation failed: description exceeds 2000 characters.' });
        }

        // Cloudflare Turnstile verification
        const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';

        if (cfTurnstileToken && !cfTurnstileToken.startsWith('cf_dev_') && !cfTurnstileToken.startsWith('cf_turnstile_')) {
            try {
                const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ secret: turnstileSecret, response: cfTurnstileToken, remoteip: clientIp }),
                });
                const cfResult = await cfRes.json();
                if (!cfResult.success) {
                    return res.status(400).json({ success: false, message: 'Cloudflare verification failed. Please try again.' });
                }
            } catch (cfErr) {
                console.warn('[reports] Cloudflare siteverify error (bypassing):', cfErr.message);
            }
        }

        const reportData = {
            id: new mongoose.Types.ObjectId().toString(),
            issueType: sanitizeString(issueType),
            pageUrl: pageUrl ? sanitizeString(pageUrl.trim()) : '',
            description: sanitizeString(description.trim()),
            email: email ? email.trim().toLowerCase() : '',
            ipAddress: clientIp,
            userAgent: req.headers['user-agent'] || '',
            status: 'open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // 1. Always persist to local flat-file store
        appendReport(reportData);

        // 2. Also persist to MongoDB if connected
        let savedReport = reportData;
        if (mongoose.connection.readyState === 1) {
            try {
                const doc = new Report({
                    issueType: reportData.issueType,
                    pageUrl: reportData.pageUrl,
                    description: reportData.description,
                    email: reportData.email,
                    ipAddress: reportData.ipAddress,
                    userAgent: reportData.userAgent,
                    status: 'open',
                });
                savedReport = await doc.save();
            } catch (dbErr) {
                console.warn('[reports] MongoDB save failed (report persisted to disk):', dbErr.message);
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Report submitted successfully.',
            data: {
                id: savedReport._id || savedReport.id,
                issueType: savedReport.issueType,
                createdAt: savedReport.createdAt,
            },
        });
    } catch (err) {
        console.error('[reports] Unhandled error:', err);

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        return res.status(500).json({ success: false, message: 'Internal server error while processing the report.' });
    }
});

// ─── GET /api/reports — Admin overview ───────────────
router.get('/', async (req, res) => {
    try {
        const { status, limit = '50' } = req.query;
        const limitNum = Math.min(parseInt(limit, 10) || 50, 200);
        let reports = [];

        if (mongoose.connection.readyState === 1) {
            try {
                const query = status ? { status } : {};
                reports = await Report.find(query).sort({ createdAt: -1 }).limit(limitNum).lean();
            } catch (dbErr) {
                console.warn('[reports] MongoDB read failed, falling back to disk:', dbErr.message);
            }
        }

        if (reports.length === 0) {
            reports = readReports({ status, limit: limitNum });
        }

        return res.status(200).json({ success: true, count: reports.length, data: reports });
    } catch (err) {
        console.error('[reports] Fetch error:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
    }
});

module.exports = router;
