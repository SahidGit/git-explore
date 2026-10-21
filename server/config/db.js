const mongoose = require('mongoose');
const logger = require('../services/logger');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gitexplorer';

let cachedPromise = null;

/**
 * Serverless-safe cached MongoDB connection manager.
 * Reuses existing connections or in-flight connection promises across invocations.
 */
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (mongoose.connection.readyState === 2 && cachedPromise) return cachedPromise;

    cachedPromise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    }).catch((err) => {
        cachedPromise = null;
        logger.warn('[db] MongoDB connection attempt failed:', { error: err.message });
        throw err;
    });

    return cachedPromise;
};

module.exports = { connectDB, MONGODB_URI };
