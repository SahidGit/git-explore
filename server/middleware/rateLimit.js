/**
 * Dual-Mode IP-based Rate Limiter.
 * 
 * Mode 1 (Distributed Serverless): If UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN
 * are defined, uses atomic Redis pipelines via native fetch for global synchronization
 * across all concurrent Vercel serverless function instances.
 * 
 * Mode 2 (In-Memory Fallback): If Redis is not configured or fails, gracefully falls back
 * to a local in-memory Map with automated LRU cleanup (capped at MAX_TRACKED_IPS).
 * 
 * Standards: Emits X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers.
 */
const logger = require('../services/logger');
const { renderErrorHtml } = require('../utils/renderErrorHtml');

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_WINDOW_SECONDS = Math.floor(RATE_LIMIT_WINDOW_MS / 1000); // 900 seconds
const MAX_REQUESTS_PER_WINDOW = 120;
const MAX_TRACKED_IPS = 10000;

// Periodic cleanup of local in-memory map
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

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const isDistributedConfigured = !!(upstashUrl && upstashToken);

/**
 * Execute atomic counter check against Upstash Redis REST API
 */
const checkUpstashRateLimit = async (clientIp) => {
    const key = `exploregit:ratelimit:${clientIp}`;
    const pipelineUrl = `${upstashUrl.replace(/\/$/, '')}/pipeline`;

    const res = await fetch(pipelineUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${upstashToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([
            ['INCR', key],
            ['EXPIRE', key, RATE_LIMIT_WINDOW_SECONDS],
            ['TTL', key],
        ]),
        signal: AbortSignal.timeout(1000), // 1s timeout to ensure non-blocking fallback
    });

    if (!res.ok) throw new Error(`Upstash returned HTTP ${res.status}`);
    const results = await res.json();
    const count = typeof results[0]?.result === 'number' ? results[0].result : 1;
    const ttl = results[2]?.result > 0 ? results[2].result : RATE_LIMIT_WINDOW_SECONDS;

    return { count, ttl };
};

/**
 * Fallback in-memory rate limiting check
 */
const checkLocalRateLimit = (clientIp, now) => {
    let record = rateLimitMap.get(clientIp);

    if (!record || now > record.resetTime) {
        if (!record && rateLimitMap.size >= MAX_TRACKED_IPS) {
            const firstKey = rateLimitMap.keys().next().value;
            if (firstKey) rateLimitMap.delete(firstKey);
        }
        record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
        rateLimitMap.set(clientIp, record);
    } else {
        record.count += 1;
    }

    const ttl = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return { count: record.count, ttl, resetTime: record.resetTime };
};

const rateLimit = async (req, res, next) => {
    const clientIp =
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';

    const now = Date.now();
    let count = 1;
    let ttl = RATE_LIMIT_WINDOW_SECONDS;

    if (isDistributedConfigured) {
        try {
            const distributedResult = await checkUpstashRateLimit(clientIp);
            count = distributedResult.count;
            ttl = distributedResult.ttl;
        } catch (redisErr) {
            logger.warn(`[rateLimit] Distributed check failed, using local fallback: ${redisErr.message}`);
            const localResult = checkLocalRateLimit(clientIp, now);
            count = localResult.count;
            ttl = localResult.ttl;
        }
    } else {
        const localResult = checkLocalRateLimit(clientIp, now);
        count = localResult.count;
        ttl = localResult.ttl;
    }

    const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - count);
    const resetTimestamp = Math.floor(now / 1000) + ttl;

    // Set standard IETF rate-limit telemetry headers on all responses
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTimestamp);

    if (count > MAX_REQUESTS_PER_WINDOW) {
        logger.warn(`Rate limit exceeded for IP ${clientIp} on ${req.method} ${req.originalUrl}`);

        res.status(429);
        res.setHeader('Retry-After', ttl);

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
            retryAfterSeconds: ttl,
            timestamp: new Date().toISOString(),
        });
    }

    next();
};

module.exports = { rateLimit };
