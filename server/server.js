const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { securityHeaders } = require('./middleware/security');
const { rateLimit } = require('./middleware/rateLimit');
const reportsRouter = require('./routes/reports');
const githubRouter = require('./routes/github');
const modelsRouter = require('./routes/models');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gitexplorer';

// ─── Global Middleware ────────────────────────────────
app.disable('x-powered-by');
app.use(securityHeaders);

const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    'https://exploregit.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(new Error('Blocked by CORS policy: Origin not allowed'), false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json({ limit: '20kb' }));
app.use(rateLimit);

// ─── MongoDB Cached Connection (Serverless-Safe) ──────
let cachedPromise = null;
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (mongoose.connection.readyState === 2 && cachedPromise) return cachedPromise;
    cachedPromise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    }).catch((err) => {
        cachedPromise = null;
        console.warn('⚠ MongoDB unavailable (reports will use disk store):', err.message);
    });
    return cachedPromise;
};

// Initial connection attempt when executed directly
if (require.main === module) {
    connectDB().then(() => {
        if (mongoose.connection.readyState === 1) {
            console.log('✓ MongoDB connected');
        }
    });
}

// Middleware to ensure DB connection is ready
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState === 0) {
        connectDB().catch(() => {});
    }
    next();
});

// ─── Routes (Dual Prefix for Standalone & Serverless Rewrites) ─
const healthHandler = (req, res) => {
    res.status(200).json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

app.use('/api/reports', reportsRouter);
app.use('/reports', reportsRouter);

app.use('/api/github', githubRouter);
app.use('/github', githubRouter);

app.use('/api/models', modelsRouter);
app.use('/models', modelsRouter);

// ─── Start (Only when executed directly) ──────────────
if (process.env.NODE_ENV !== 'test' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`✓ GitExplorer API running on http://localhost:${PORT}`);
    });
}

module.exports = app;
