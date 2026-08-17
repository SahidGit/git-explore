const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { securityHeaders } = require('./middleware/security');
const { rateLimit } = require('./middleware/rateLimit');
const reportsRouter = require('./routes/reports');
const githubRouter = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gitexplorer';

// ─── Global Middleware ────────────────────────────────
app.disable('x-powered-by');
app.use(securityHeaders);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json({ limit: '20kb' }));
app.use(rateLimit);

// ─── Routes ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/reports', reportsRouter);
app.use('/api/github', githubRouter);

// ─── MongoDB Connection ───────────────────────────────
console.log('Connecting to MongoDB database...');
mongoose
    .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s if unreachable
    })
    .then(() => console.log('✓ MongoDB connected'))
    .catch((err) => console.warn('⚠ MongoDB unavailable (reports will use disk store):', err.message));

// ─── Start ────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✓ GitExplorer API running on http://localhost:${PORT}`);
});
