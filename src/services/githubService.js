import { FALLBACK_TRENDING, FALLBACK_TOP_FIVE } from '../data/fallbackTrending';
import { storageService } from './storageService';

const GITHUB_API_BASE = import.meta.env.VITE_GITHUB_API_URL || 'https://api.github.com';
const RATE_LIMIT_CACHE_KEY = 'gitexplorer_ratelimit_cache';
const RATE_LIMIT_TTL_MS = 60_000; // Cache rate-limit for 60 seconds

// Active auth token for this session
let _authToken = null;

/** Set or clear the GitHub Personal Access Token for all subsequent requests */
export const setGithubToken = (token) => {
  _authToken = token ? token.trim() : null;
};

/** Retrieve the active auth token from memory or sessionStorage */
export const getActiveToken = () => {
  return _authToken || storageService.getToken();
};

/** Build headers for every GitHub API request */
const buildHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const token = getActiveToken();

  if (token) {
    const prefix = token.startsWith('token ') || token.startsWith('Bearer ') ? '' : 'Bearer ';
    headers['Authorization'] = `${prefix}${token}`;
  }

  return headers;
};

/** Parse GitHub API error responses into user-actionable messages */
const parseGithubError = async (response) => {
  const status = response.status;
  const remaining = response.headers.get('x-ratelimit-remaining');
  const isRateLimited = remaining === '0';

  let message = `GitHub API error (${status})`;

  if (status === 401) {
    message = 'Invalid GitHub Token. Check for typos or generate a new token at github.com/settings/tokens';
  } else if (status === 403) {
    message = isRateLimited
      ? 'API rate limit reached (60 req/hr). Connect a Personal Access Token in the header to unlock 5,000 req/hr.'
      : 'Access forbidden. Your token may lack the required public_repo read permission.';
  } else if (status === 422) {
    message = 'Invalid search query (422). Simplify your search terms and try again.';
  } else if (status === 404) {
    message = 'Not found (404). The repository or user does not exist or is private.';
  }

  const error = new Error(message);
  error.status = status;
  error.isRateLimited = isRateLimited;
  return error;
};

/**
 * Core fetch wrapper with retry logic.
 */
const fetchWithRetry = async (url, options = {}, maxAttempts = 2) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, { ...options, headers: buildHeaders() });

      if (!response.ok) {
        const err = await parseGithubError(response);
        if (response.status < 500) throw err;
        lastError = err;
      } else {
        return response;
      }
    } catch (err) {
      lastError = err;
      if (err.status && err.status < 500) throw err;
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
    }
  }

  throw lastError;
};

/** Check if the browser currently has a network connection */
export const getIsOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

// ─────────────────────────────────────────────────────────────────────────────
// Repository Search
// ─────────────────────────────────────────────────────────────────────────────

export const searchRepositories = async ({
  query,
  sort = 'stars',
  order = 'desc',
  page = 1,
  perPage = 30,
  language = '',
}) => {
  let q = (query || '').trim() || 'stars:>1000';

  if (language && !q.toLowerCase().includes('language:')) {
    q = `${q} language:${language}`;
  }

  const params = new URLSearchParams({ q, sort, order, page, per_page: perPage });
  const response = await fetchWithRetry(`${GITHUB_API_BASE}/search/repositories?${params}`);
  return response.json();
};

export const getTrendingRepositories = async (language = '', since = 'daily', page = 1) => {
  if (!getIsOnline()) {
    return { items: FALLBACK_TRENDING, total_count: FALLBACK_TRENDING.length, isFallback: true };
  }

  const date = new Date();
  if (since === 'daily')   date.setDate(date.getDate() - 1);
  else if (since === 'weekly')  date.setDate(date.getDate() - 7);
  else if (since === 'monthly') date.setMonth(date.getMonth() - 1);

  const dateStr = date.toISOString().split('T')[0];
  const query = `created:>${dateStr}${language ? ` language:${language}` : ''}`;

  try {
    return await searchRepositories({ query, sort: 'stars', order: 'desc', page });
  } catch (err) {
    if (err.isRateLimited || !getIsOnline()) {
      return { items: FALLBACK_TRENDING, total_count: FALLBACK_TRENDING.length, isFallback: true };
    }
    throw err;
  }
};

export const getMonthlyTopRepositories = async (perPage = 6) => {
  const cacheKey = `exploregit_monthly_top_${perPage}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 15 * 60 * 1000 && Array.isArray(parsed.data) && parsed.data.length > 0) {
        return parsed.data;
      }
    }
  } catch {}

  try {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const query = `created:>${date.toISOString().split('T')[0]}`;
    const data = await searchRepositories({ query, sort: 'stars', order: 'desc', page: 1, perPage });
    if (data.items?.length) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data.items }));
      } catch {}
      return data.items;
    }
    return FALLBACK_TOP_FIVE.slice(0, perPage);
  } catch {
    return FALLBACK_TOP_FIVE.slice(0, perPage);
  }
};

export const getWeeklyTopRepositories = async () => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const query = `created:>${date.toISOString().split('T')[0]}`;
    const data = await searchRepositories({ query, sort: 'stars', order: 'desc', page: 1, perPage: 5 });
    return data.items?.length ? data.items : FALLBACK_TOP_FIVE;
  } catch {
    return FALLBACK_TOP_FIVE;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Repository Detail, Languages, Contributors
// ─────────────────────────────────────────────────────────────────────────────

export const getRepositoryDetails = async (owner, repo) => {
  const [repoRes, langRes, contribRes] = await Promise.all([
    fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}`),
    fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`),
    fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=10`),
  ]);

  const [repoData, languages, contributors] = await Promise.all([
    repoRes.json(),
    langRes.json(),
    contribRes.json(),
  ]);

  return { ...repoData, languages, contributors };
};

/** Fetch weekly commit activity (returns null when statistics are unavailable/computing on GitHub) */
export const getRepositoryActivity = async (owner, repo) => {
  try {
    const response = await fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/commit_activity`);
    if (response.status === 202) {
      // 202 Accepted: GitHub is currently computing statistics in the background
      return null;
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
  } catch {
    // Request failed or rate limited — return null for distinct unavailable status
  }
  return null;
};

/** Fetch open + closed issue counts without synthetic estimations */
export const getIssueStats = async (owner, repo) => {
  try {
    const [openRes, closedRes] = await Promise.all([
      fetchWithRetry(`${GITHUB_API_BASE}/search/issues?q=repo:${owner}/${repo}+type:issue+state:open`),
      fetchWithRetry(`${GITHUB_API_BASE}/search/issues?q=repo:${owner}/${repo}+type:issue+state:closed`),
    ]);
    const [openData, closedData] = await Promise.all([openRes.json(), closedRes.json()]);
    return {
      open: typeof openData.total_count === 'number' ? openData.total_count : null,
      closed: typeof closedData.total_count === 'number' ? closedData.total_count : null,
    };
  } catch {
    return { open: null, closed: null };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// User Profile & Contributions
// ─────────────────────────────────────────────────────────────────────────────

export const getUser = async (username) => {
  const response = await fetchWithRetry(`${GITHUB_API_BASE}/users/${username}`);
  return response.json();
};

export const getUserContributions = async (username) => {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
  );
  if (!response.ok) {
    throw new Error(`Contributions API error (${response.status})`);
  }
  return response.json();
};

export const getRateLimit = async () => {
  try {
    const cached = sessionStorage.getItem(RATE_LIMIT_CACHE_KEY);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < RATE_LIMIT_TTL_MS) return data;
    }

    const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, { headers: buildHeaders() });
    if (!response.ok) throw new Error('Failed to fetch rate limit');
    const data = await response.json();

    sessionStorage.setItem(
      RATE_LIMIT_CACHE_KEY,
      JSON.stringify({ data: data.resources?.core, ts: Date.now() })
    );

    return data.resources?.core;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Live Language Momentum & Aggregations
// ─────────────────────────────────────────────────────────────────────────────

const LANG_CACHE_PREFIX = 'gitexplore_lang_chart_';
const LANG_CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache

/**
 * Dynamically queries GitHub Search API to aggregate real repository counts and star metrics per language
 */
export const getLiveLanguageRankings = async (timeframe = 'today') => {
  const cacheKey = `${LANG_CACHE_PREFIX}${timeframe}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < LANG_CACHE_TTL && Array.isArray(data) && data.length > 0) {
        return { data, isLive: true, fromCache: true, lastUpdated: new Date(ts).toISOString() };
      }
    }
  } catch {
    // ignore parse error
  }

  // Calculate timeframe date query
  const date = new Date();
  if (timeframe === 'today') date.setDate(date.getDate() - 1);
  else if (timeframe === '7d') date.setDate(date.getDate() - 7);
  else if (timeframe === '30d') date.setDate(date.getDate() - 30);
  else if (timeframe === '365d') date.setFullYear(date.getFullYear() - 1);

  const dateStr = date.toISOString().split('T')[0];

  try {
    // Fetch top high-velocity repositories created or pushed in this timeframe
    const response = await fetchWithRetry(
      `${GITHUB_API_BASE}/search/repositories?q=created:>${dateStr}+stars:>50&sort=stars&order=desc&per_page=100`
    );
    const result = await response.json();
    const items = result.items || [];

    // Aggregate by language
    const langStats = {};
    for (const repo of items) {
      const lang = repo.language;
      if (!lang) continue;
      if (!langStats[lang]) {
        langStats[lang] = {
          totalStars: 0,
          repoCount: 0,
          topRepos: [],
        };
      }
      langStats[lang].totalStars += repo.stargazers_count || 0;
      langStats[lang].repoCount += 1;
      if (langStats[lang].topRepos.length < 3) {
        langStats[lang].topRepos.push({
          fullName: repo.full_name,
          name: repo.name,
          stars: repo.stargazers_count >= 1000 ? `${(repo.stargazers_count / 1000).toFixed(1)}k` : `${repo.stargazers_count}`,
          desc: repo.description || 'No description provided.',
          link: `/dashboard?query=${encodeURIComponent(repo.full_name)}`,
        });
      }
    }

    const payload = {
      langStats,
      totalIndexed: items.length,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify({ data: payload, ts: Date.now() }));
    } catch {
      // localStorage quota
    }

    return { data: payload, isLive: true, fromCache: false, lastUpdated: new Date().toISOString() };
  } catch (err) {
    // If rate limited or offline, return fallback
    return { data: null, isLive: false, error: err.message };
  }
};

