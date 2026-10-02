const path = require('path');
const fs = require('fs');
const logger = require('../services/logger');
const { renderErrorHtml } = require('../utils/renderErrorHtml');

// Known valid SPA routes in ExploreGit
const VALID_FRONTEND_ROUTES = new Set([
    '/',
    '/dashboard',
    '/bookmarks',
    '/profile',
    '/languages',
    '/report',
    '/cheatsheet',
    '/ai-news',
    '/company',
    '/changelog',
    '/docs',
    '/api',
    '/disclaimer',
    '/terms',
    '/privacy',
    '/500',
    '/error',
    '/404'
]);

/**
 * 404 Not Found & SPA Route Handler Middleware.
 * - Serves HTTP 404 with status code and branded error page for unknown routes.
 * - Ensures search engines see HTTP 404 status header for non-existent pages.
 * - Serves valid frontend routes with HTTP 200.
 */
const notFoundHandler = (req, res, next) => {
    const rawPath = req.path.replace(/\/$/, '') || '/';
    const isApiRoute =
        req.originalUrl.startsWith('/api/') ||
        req.originalUrl.startsWith('/reports') ||
        req.originalUrl.startsWith('/github') ||
        req.originalUrl.startsWith('/models');

    const isExplicitErrorRoute = rawPath === '/500' || rawPath === '/error';

    // 1. Explicit 500 error route preview
    if (isExplicitErrorRoute && req.accepts('html')) {
        res.status(500);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(renderErrorHtml(500));
    }

    // 2. Check if route is a valid frontend application route
    const isValidRoute = VALID_FRONTEND_ROUTES.has(rawPath);

    // If valid frontend route and client wants HTML, serve SPA entry point if dist exists
    if (isValidRoute && !isApiRoute && req.accepts('html')) {
        const distIndexPath = path.resolve(__dirname, '../../dist/index.html');
        if (fs.existsSync(distIndexPath)) {
            res.status(200);
            return res.sendFile(distIndexPath);
        }
    }

    // 3. If it's not a valid route or is an unmatched API route -> 404
    const err = new Error(`Cannot ${req.method} ${req.originalUrl}`);
    err.statusCode = 404;

    logger.logRequestError(err, req, 404);

    res.status(404);

    if (req.accepts('html') && !isApiRoute) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(renderErrorHtml(404, `The requested route "${req.originalUrl}" does not exist.`));
    }

    return res.json({
        success: false,
        status: 404,
        error: 'NotFoundError',
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
    });
};

module.exports = { notFoundHandler, VALID_FRONTEND_ROUTES };
