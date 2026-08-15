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

/** Proxy helper — forwards a GitHub API request and relays the response */
const proxyGithub = async (res, url, headers) => {
    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
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
