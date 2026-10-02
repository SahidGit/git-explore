const logger = require('../services/logger');
const { renderErrorHtml } = require('../utils/renderErrorHtml');

/**
 * Centralized Error Handling Middleware.
 * Detects error types, returns correct HTTP status codes, logs error details,
 * and serves appropriate JSON or styled HTML error pages.
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'An unexpected error occurred.';

    // 1. Detect specific error types & map status codes
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // Malformed JSON body
        statusCode = 400;
        message = 'Malformed JSON in request payload.';
    } else if (err.name === 'ValidationError') {
        // Mongoose Schema Validation
        statusCode = 400;
        message = Object.values(err.errors || {})
            .map((e) => e.message)
            .join('; ') || 'Validation error in request payload.';
    } else if (err.name === 'CastError') {
        // Mongoose invalid ObjectId / Cast Error
        statusCode = 400;
        message = `Invalid format for resource identifier: ${err.value}`;
    } else if (err.message && err.message.includes('CORS policy')) {
        statusCode = 403;
        message = 'Forbidden: Origin is not permitted by CORS policy.';
    } else if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkTimeoutError') {
        statusCode = 503;
        message = 'Database service is temporarily unreachable.';
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        statusCode = 503;
        message = 'Upstream service is unreachable.';
    }

    // 2. Structured Error Logging
    logger.logRequestError(err, req, statusCode);

    // 3. Set standard response status
    res.status(statusCode);

    // 4. Content Negotiation: Render HTML for browser navigations or JSON for API clients
    const isApiRequest =
        req.originalUrl?.startsWith('/api/') ||
        req.originalUrl?.startsWith('/reports') ||
        req.originalUrl?.startsWith('/github') ||
        req.originalUrl?.startsWith('/models') ||
        req.xhr;

    const acceptsHtml = req.accepts('html') && !isApiRequest;

    if (acceptsHtml) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(renderErrorHtml(statusCode, statusCode >= 500 ? null : message));
    }

    // JSON response for API endpoints
    return res.json({
        success: false,
        status: statusCode,
        error: statusCode >= 500 ? 'InternalServerError' : err.name || 'Error',
        message: statusCode >= 500 && process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred. Please try again later.'
            : message,
        timestamp: new Date().toISOString()
    });
};

module.exports = { errorHandler };
