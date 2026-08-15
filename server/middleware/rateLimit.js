/**
 * In-memory IP-based rate limiter.
 * Limits each IP to MAX_REQUESTS_PER_WINDOW requests within RATE_LIMIT_WINDOW_MS.
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 120;

const rateLimit = (req, res, next) => {
    const clientIp =
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';

    const now = Date.now();
    const record = rateLimitMap.get(clientIp);

    if (!record) {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    } else {
        record.count += 1;
        if (record.count > MAX_REQUESTS_PER_WINDOW) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again after 15 minutes.',
            });
        }
    }

    next();
};

module.exports = { rateLimit };
