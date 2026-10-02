/**
 * In-memory IP-based rate limiter with automated memory cleanup.
 * Limits each IP to MAX_REQUESTS_PER_WINDOW requests within RATE_LIMIT_WINDOW_MS.
 */
const logger = require('../services/logger');
const { renderErrorHtml } = require('../utils/renderErrorHtml');

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 120;
const MAX_TRACKED_IPS = 10000;

// Periodic cleanup to prevent memory leaks from expired IP records
const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(ip);
        }
    }
}, 5 * 60 * 1000);

if (cleanupTimer.unref) {
    cleanupTimer.unref();
}

const rateLimit = (req, res, next) => {
    const clientIp =
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';

    const now = Date.now();
    const record = rateLimitMap.get(clientIp);

    if (!record) {
        if (rateLimitMap.size >= MAX_TRACKED_IPS) {
            const firstKey = rateLimitMap.keys().next().value;
            if (firstKey) rateLimitMap.delete(firstKey);
        }
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    } else {
        record.count += 1;
        if (record.count > MAX_REQUESTS_PER_WINDOW) {
            logger.warn(`Rate limit exceeded for IP ${clientIp} on ${req.method} ${req.originalUrl}`);

            res.status(429);
            res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));

            const isApiRequest =
                req.originalUrl.startsWith('/api/') ||
                req.originalUrl.startsWith('/reports') ||
                req.originalUrl.startsWith('/github') ||
                req.originalUrl.startsWith('/models') ||
                req.xhr;

            if (req.accepts('html') && !isApiRequest) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                return res.send(renderErrorHtml(429, 'Too many requests. Please try again after 15 minutes.'));
            }

            return res.json({
                success: false,
                status: 429,
                error: 'RateLimitError',
                message: 'Too many requests. Please try again after 15 minutes.',
                retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
                timestamp: new Date().toISOString()
            });
        }
    }

    next();
};

module.exports = { rateLimit };
