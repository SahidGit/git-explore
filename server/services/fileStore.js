const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

/**
 * Append a report object to the local JSON flat-file store asynchronously.
 * Creates the data directory and file if they don't exist.
 *
 * @param {Object} reportData
 */
const appendReport = async (reportData) => {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            await fsPromises.mkdir(DATA_DIR, { recursive: true });
        }

        let existing = [];
        try {
            const raw = await fsPromises.readFile(REPORTS_FILE, 'utf8');
            existing = JSON.parse(raw);
            if (!Array.isArray(existing)) existing = [];
        } catch {
            existing = [];
        }

        existing.unshift(reportData);
        // Write to temporary file then rename for atomic file replacement
        const tempFile = `${REPORTS_FILE}.tmp.${Date.now()}`;
        await fsPromises.writeFile(tempFile, JSON.stringify(existing, null, 2), 'utf8');
        await fsPromises.rename(tempFile, REPORTS_FILE);
    } catch (err) {
        console.error('[fileStore] Failed to write report to disk:', err.message);
    }
};

/**
 * Read all reports from the local JSON store asynchronously, with optional status filter.
 *
 * @param {{ status?: string, limit?: number }} options
 * @returns {Promise<Array>}
 */
const readReports = async ({ status, limit = 50 } = {}) => {
    try {
        if (!fs.existsSync(REPORTS_FILE)) return [];
        const raw = await fsPromises.readFile(REPORTS_FILE, 'utf8');
        const items = JSON.parse(raw);
        const validItems = Array.isArray(items) ? items : [];
        const filtered = status ? validItems.filter((r) => r.status === status) : validItems;
        return filtered.slice(0, limit);
    } catch (err) {
        console.error('[fileStore] Failed to read reports from disk:', err.message);
        return [];
    }
};

module.exports = { appendReport, readReports };
