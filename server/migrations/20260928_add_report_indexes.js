/**
 * Database Migration: Add query performance indexes to Report collection
 * Created: 2026-09-28
 *
 * Usage:
 *   node server/migrations/20260928_add_report_indexes.js up
 *   node server/migrations/20260928_add_report_indexes.js down
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined in server/.env');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('[Migration] Connected to MongoDB');
}

async function up() {
    await connectDB();
    const collection = mongoose.connection.collection('reports');

    console.log('[Migration] Creating index: { status: 1, createdAt: -1 }...');
    await collection.createIndex({ status: 1, createdAt: -1 }, { name: 'status_1_createdAt_-1' });

    console.log('[Migration] Creating index: { createdAt: -1 }...');
    await collection.createIndex({ createdAt: -1 }, { name: 'createdAt_-1' });

    console.log('[Migration] Successfully created indexes on reports collection.');
}

async function down() {
    await connectDB();
    const collection = mongoose.connection.collection('reports');

    console.log('[Migration] Dropping index: status_1_createdAt_-1...');
    try {
        await collection.dropIndex('status_1_createdAt_-1');
        console.log('[Migration] Dropped status_1_createdAt_-1.');
    } catch (err) {
        console.warn('[Migration] Note:', err.message);
    }

    console.log('[Migration] Dropping index: createdAt_-1...');
    try {
        await collection.dropIndex('createdAt_-1');
        console.log('[Migration] Dropped createdAt_-1.');
    } catch (err) {
        console.warn('[Migration] Note:', err.message);
    }

    console.log('[Migration] Successfully reverted indexes.');
}

async function run() {
    const action = process.argv[2];
    try {
        if (action === 'up') {
            await up();
        } else if (action === 'down') {
            await down();
        } else {
            console.log('Usage: node server/migrations/20260928_add_report_indexes.js [up|down]');
        }
    } catch (error) {
        console.error('[Migration] Failed:', error);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('[Migration] Disconnected from MongoDB');
        }
    }
}

if (require.main === module) {
    run();
}

module.exports = { up, down };
