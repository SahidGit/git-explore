/**
 * Standard HTTP Error Classes for expressive and type-safe error handling.
 */

class HttpError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.status = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends HttpError {
    constructor(message = 'Bad Request', details = null) {
        super(400, message, details);
    }
}

class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized', details = null) {
        super(401, message, details);
    }
}

class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden: Access Denied', details = null) {
        super(403, message, details);
    }
}

class NotFoundError extends HttpError {
    constructor(message = 'Not Found', details = null) {
        super(404, message, details);
    }
}

class RateLimitError extends HttpError {
    constructor(message = 'Too Many Requests. Please retry later.', details = null) {
        super(429, message, details);
    }
}

class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error', details = null) {
        super(500, message, details);
    }
}

class ServiceUnavailableError extends HttpError {
    constructor(message = 'Service Unavailable', details = null) {
        super(503, message, details);
    }
}

module.exports = {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    RateLimitError,
    InternalServerError,
    ServiceUnavailableError
};
