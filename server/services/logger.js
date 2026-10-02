/**
 * Structured Logging Service for HTTP status codes, error details, and system monitoring.
 */

const formatLog = (level, message, meta = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta
    };
    return JSON.stringify(logEntry);
};

const logger = {
    info: (message, meta) => {
        console.log(`[INFO] ${formatLog('info', message, meta)}`);
    },
    warn: (message, meta) => {
        console.warn(`[WARN] ${formatLog('warn', message, meta)}`);
    },
    error: (message, meta) => {
        console.error(`[ERROR] ${formatLog('error', message, meta)}`);
    },
    logRequestError: (err, req, statusCode) => {
        const clientIp =
            req.headers['x-forwarded-for']?.split(',')[0].trim() ||
            req.socket?.remoteAddress ||
            '127.0.0.1';

        const errorMeta = {
            statusCode: statusCode || err.statusCode || err.status || 500,
            method: req.method,
            path: req.originalUrl || req.url,
            ip: clientIp,
            userAgent: req.headers['user-agent'] || 'unknown',
            errorMessage: err.message || 'Unknown server error',
            errorCode: err.code || undefined,
            stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        };

        if (errorMeta.statusCode >= 500) {
            console.error(`[HTTP ${errorMeta.statusCode}] 💥 SERVER_ERROR:`, formatLog('error', err.message, errorMeta));
        } else if (errorMeta.statusCode === 404) {
            console.warn(`[HTTP 404] 🔍 NOT_FOUND: ${req.method} ${req.originalUrl || req.url} from ${clientIp}`);
        } else {
            console.warn(`[HTTP ${errorMeta.statusCode}] ⚠️ CLIENT_ERROR:`, formatLog('warn', err.message, errorMeta));
        }
    }
};

module.exports = logger;
