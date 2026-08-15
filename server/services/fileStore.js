const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

/**
 * Append a report object to the local JSON flat-file store.
 * Creates the data directory and file if they don't exist.
 *
 * @param {Object} reportData
 */
const appendReport = (reportData) => {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        let existing = [];
        if (fs.existsSync(REPORTS_FILE)) {
            try {
                existing = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
                if (!Array.isArray(existing)) existing = [];
            } catch {
                existing = [];
            }
        }

        existing.unshift(reportData);
        fs.writeFileSync(REPORTS_FILE, JSON.stringify(existing, null, 2), 'utf8');
    } catch (err) {
        console.error('[fileStore] Failed to write report to disk:', err.message);
    }
};

/**
 * Read all reports from the local JSON store, with optional status filter.
 *
 * @param {{ status?: string, limit?: number }} options
 * @returns {Array}
 */
const readReports = ({ status, limit = 50 } = {}) => {
    try {
        if (!fs.existsSync(REPORTS_FILE)) return [];
        const raw = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
        const items = Array.isArray(raw) ? raw : [];
        const filtered = status ? items.filter((r) => r.status === status) : items;
        return filtered.slice(0, limit);
    } catch (err) {
        console.error('[fileStore] Failed to read reports from disk:', err.message);
        return [];
    }
};

module.exports = { appendReport, readReports };
