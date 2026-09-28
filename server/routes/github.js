const express = require('express');

const router = express.Router();
const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';

/** Build headers for proxied GitHub API requests */
const getGithubHeaders = (req) => {
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'GitExplorer-Backend/2.0',
    };

    const authHeader = req.headers['authorization'];
    const envToken = process.env.GITHUB_TOKEN;

    if (authHeader) {
        headers['Authorization'] = authHeader;
    } else if (envToken) {
        headers['Authorization'] = `token ${envToken}`;
    }

    return headers;
};

/** In-memory cache for GitHub API requests (60s TTL) */
const proxyCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

// Periodic cleanup of expired cache entries
const cacheCleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of proxyCache.entries()) {
        if (now > entry.expiresAt) {
            proxyCache.delete(key);
        }
    }
}, 60 * 1000);

if (cacheCleanupTimer.unref) {
    cacheCleanupTimer.unref();
}

/** Proxy helper — forwards a GitHub API request, caches successful responses, and relays rate-limit headers */
const proxyGithub = async (res, url, headers) => {
    const cacheKey = `${url}::${headers['Authorization'] || 'public'}`;
    const now = Date.now();
    const cached = proxyCache.get(cacheKey);

    if (cached && now < cached.expiresAt) {
        res.setHeader('X-Cache', 'HIT');
        for (const [headerName, headerVal] of Object.entries(cached.headers)) {
            res.setHeader(headerName, headerVal);
        }
        return res.status(cached.status).json(cached.data);
    }

    try {
        const response = await fetch(url, { headers });
        const rateLimitHeaders = {};
        ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-ratelimit-used', 'etag'].forEach((h) => {
            const val = response.headers.get(h);
            if (val) {
                res.setHeader(h, val);
                rateLimitHeaders[h] = val;
            }
        });

        const data = await response.json();

        if (response.ok) {
            proxyCache.set(cacheKey, {
                status: response.status,
                data,
                headers: rateLimitHeaders,
                expiresAt: now + CACHE_TTL_MS,
            });
        }

        res.setHeader('X-Cache', 'MISS');
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to reach GitHub API', error: err.message });
    }
};

// GET /api/github/search/repositories
router.get('/search/repositories', async (req, res) => {
    const params = new URLSearchParams(req.query).toString();
    await proxyGithub(res, `${GITHUB_API_URL}/search/repositories?${params}`, getGithubHeaders(req));
});

// GET /api/github/repos/:owner/:repo
router.get('/repos/:owner/:repo', async (req, res) => {
    const { owner, repo } = req.params;
    await proxyGithub(res, `${GITHUB_API_URL}/repos/${owner}/${repo}`, getGithubHeaders(req));
});

// GET /api/github/repos/:owner/:repo/languages
router.get('/repos/:owner/:repo/languages', async (req, res) => {
    const { owner, repo } = req.params;
    await proxyGithub(res, `${GITHUB_API_URL}/repos/${owner}/${repo}/languages`, getGithubHeaders(req));
});

// GET /api/github/repos/:owner/:repo/contributors
router.get('/repos/:owner/:repo/contributors', async (req, res) => {
    const { owner, repo } = req.params;
    const params = new URLSearchParams(req.query).toString();
    await proxyGithub(res, `${GITHUB_API_URL}/repos/${owner}/${repo}/contributors?${params}`, getGithubHeaders(req));
});

// GET /api/github/rate_limit
router.get('/rate_limit', async (req, res) => {
    await proxyGithub(res, `${GITHUB_API_URL}/rate_limit`, getGithubHeaders(req));
});

module.exports = router;
