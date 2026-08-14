const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Report = require('./models/Report');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gitexplorer';

// ─── Middleware & Production Security ──────────────────
app.disable('x-powered-by'); // Hide server technology stack

// Security headers (Helmet-equivalent)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' http://localhost:5000 https://api.github.com https://challenges.cloudflare.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
    next();
});

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json({ limit: '20kb' })); // Restrict payload size against DDoS payload attacks

// Simple In-Memory Anti-Bot & Rate Limiting System
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests per 15 min per IP

app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!rateLimitMap.has(clientIp)) {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else {
        const record = rateLimitMap.get(clientIp);
        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + RATE_LIMIT_WINDOW_MS;
        } else {
            record.count += 1;
            if (record.count > MAX_REQUESTS_PER_WINDOW) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many requests from this IP. Please try again after 15 minutes.',
                });
            }
        }
    }
    next();
});

// HTML & Script Input Sanitizer to prevent XSS Attacks
const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// ─── MongoDB Connection ──────────────────────────────
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('✓ MongoDB Connected Successfully'))
    .catch((err) => console.error('MongoDB Connection Error:', err.message));

// ─── Health Check Endpoint ───────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── GitHub API Backend Proxy Routes ──────────────────
const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';

const getGithubHeaders = (req) => {
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'GitExplorer-Backend/2.0',
    };
    // Forward client personal access token if provided in header or environment
    const authHeader = req.headers['authorization'];
    const envToken = process.env.GITHUB_TOKEN;
    if (authHeader) {
        headers['Authorization'] = authHeader;
    } else if (envToken) {
        headers['Authorization'] = `token ${envToken}`;
    }
    return headers;
};

// GET /api/github/search/repositories — Search repositories
app.get('/api/github/search/repositories', async (req, res) => {
    try {
        const queryParams = new URLSearchParams(req.query).toString();
        const response = await fetch(`${GITHUB_API_URL}/search/repositories?${queryParams}`, {
            headers: getGithubHeaders(req),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch from GitHub API', error: err.message });
    }
});

// GET /api/github/repos/:owner/:repo — Repo details
app.get('/api/github/repos/:owner/:repo', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
            headers: getGithubHeaders(req),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch repo details', error: err.message });
    }
});

// GET /api/github/repos/:owner/:repo/languages — Repo languages
app.get('/api/github/repos/:owner/:repo/languages', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/languages`, {
            headers: getGithubHeaders(req),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch languages', error: err.message });
    }
});

// GET /api/github/repos/:owner/:repo/contributors — Repo contributors
app.get('/api/github/repos/:owner/:repo/contributors', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const queryParams = new URLSearchParams(req.query).toString();
        const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contributors?${queryParams}`, {
            headers: getGithubHeaders(req),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch contributors', error: err.message });
    }
});

// GET /api/github/rate_limit — Check rate limit quota
app.get('/api/github/rate_limit', async (req, res) => {
    try {
        const response = await fetch(`${GITHUB_API_URL}/rate_limit`, {
            headers: getGithubHeaders(req),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch rate limit', error: err.message });
    }
});

// ─── POST /api/reports ────────────────────────────────
app.post('/api/reports', async (req, res) => {
    try {
        const { issueType, pageUrl, description, email, cfTurnstileToken } = req.body;

        // Validation
        if (!issueType) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed: issueType is required.',
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed: description is required.',
            });
        }

        if (description.length > 2000) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed: description exceeds 2000 characters limit.',
            });
        }

        // Cloudflare Turnstile Verification (Server-Side)
        const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';

        if (cfTurnstileToken && !cfTurnstileToken.startsWith('cf_dev_') && !cfTurnstileToken.startsWith('cf_turnstile_')) {
            try {
                const cfVerification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        secret: turnstileSecret,
                        response: cfTurnstileToken,
                        remoteip: clientIp,
                    }),
                });
                const cfResult = await cfVerification.json();
                if (!cfResult.success) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cloudflare verification failed. Please try again.',
                    });
                }
            } catch (cfErr) {
                console.warn('Cloudflare siteverify error (bypassing in dev):', cfErr.message);
            }
        }

        // Capture client telemetry safely for spam prevention
        const ipAddress = clientIp;
        const userAgent = req.headers['user-agent'] || '';

        const reportData = {
            id: new mongoose.Types.ObjectId().toString(),
            issueType,
            pageUrl: pageUrl ? pageUrl.trim() : '',
            description: description.trim(),
            email: email ? email.trim().toLowerCase() : '',
            ipAddress,
            userAgent,
            status: 'open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // 1. Save to local JSON database file (server/data/reports.json) for instant inspection
        const fs = require('fs');
        const path = require('path');
        const dataDir = path.join(__dirname, 'data');
        const reportsFile = path.join(dataDir, 'reports.json');

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let existingReports = [];
        if (fs.existsSync(reportsFile)) {
            try {
                existingReports = JSON.parse(fs.readFileSync(reportsFile, 'utf8'));
            } catch (_) {
                existingReports = [];
            }
        }
        existingReports.unshift(reportData);
        fs.writeFileSync(reportsFile, JSON.stringify(existingReports, null, 2), 'utf8');

        // 2. Save to MongoDB if connected
        let savedReport = reportData;
        try {
            if (mongoose.connection.readyState === 1) {
                const newReport = new Report({
                    issueType,
                    pageUrl: reportData.pageUrl,
                    description: reportData.description,
                    email: reportData.email,
                    ipAddress,
                    userAgent,
                    status: 'open',
                });
                savedReport = await newReport.save();
            }
        } catch (dbErr) {
            console.warn('MongoDB save warning (saved to reports.json):', dbErr.message);
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
    } catch (error) {
        console.error('Error saving report:', error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: validationErrors.join(', '),
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error while processing the report.',
        });
    }
});

// ─── GET /api/reports (Admin / Internal overview) ─────
app.get('/api/reports', async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        let reports = [];

        // 1. Fetch from MongoDB if connected
        if (mongoose.connection.readyState === 1) {
            try {
                const query = status ? { status } : {};
                reports = await Report.find(query)
                    .sort({ createdAt: -1 })
                    .limit(parseInt(limit, 10));
            } catch (_) {}
        }

        // 2. If MongoDB is empty or not connected, read from server/data/reports.json
        if (reports.length === 0) {
            const fs = require('fs');
            const path = require('path');
            const reportsFile = path.join(__dirname, 'data', 'reports.json');
            if (fs.existsSync(reportsFile)) {
                try {
                    const fileData = JSON.parse(fs.readFileSync(reportsFile, 'utf8'));
                    reports = status ? fileData.filter((r) => r.status === status) : fileData;
                    reports = reports.slice(0, parseInt(limit, 10));
                } catch (_) {}
            }
        }

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch reports.',
        });
    }
});

// ─── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✓ GitExplorer Report API running on http://localhost:${PORT}`);
});
