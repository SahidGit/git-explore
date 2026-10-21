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
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(RATE_LIMIT_CACHE_KEY);
  }
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

/** Sync rate limit state from GitHub response headers */
const syncRateLimitFromHeaders = (response) => {
  try {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const limit = response.headers.get('x-ratelimit-limit');
    const reset = response.headers.get('x-ratelimit-reset');

    if (remaining !== null && limit !== null) {
      const data = {
        remaining: parseInt(remaining, 10),
        limit: parseInt(limit, 10),
        reset: reset ? parseInt(reset, 10) : Math.floor(Date.now() / 1000) + 3600,
      };

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(
          RATE_LIMIT_CACHE_KEY,
          JSON.stringify({ data, ts: Date.now() })
        );
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('github-ratelimit-updated', { detail: data })
        );
      }
    }
  } catch {
    // Non-critical header sync fallback
  }
};

/** Parse GitHub API error responses into user-actionable messages */
const parseGithubError = async (response) => {
  syncRateLimitFromHeaders(response);
  const status = response.status;
  const remaining = response.headers.get('x-ratelimit-remaining');
  const isRateLimited = remaining === '0';

  let message = `GitHub API error (${status})`;

  if (status === 401) {
    message = 'Invalid or Expired GitHub Token. Please generate a new token at github.com/settings/tokens';
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('github-token-exhausted', {
          detail: { status: 401, type: 'expired', message },
        })
      );
    }
  } else if (status === 403) {
    message = isRateLimited
      ? 'API rate limit reached. Connect or generate a Personal Access Token to unlock 5,000 req/hr.'
      : 'Access forbidden. Your token may lack the required public_repo read permission.';
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('github-token-exhausted', {
          detail: { status: 403, type: isRateLimited ? 'exhausted' : 'forbidden', message, isRateLimited },
        })
      );
    }
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
        syncRateLimitFromHeaders(response);
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
        const list = parsed.data.map((repo) => ({
          ...repo,
          source: 'cached',
          isFallback: false,
          fetchedAt: new Date(parsed.timestamp).toISOString(),
        }));
        list.source = 'cached';
        list.isLive = true;
        list.fromCache = true;
        list.lastUpdated = new Date(parsed.timestamp).toISOString();
        list.rankingRule = 'Ranked by total stars among repositories created in the past 30 days (GitHub Search API)';
        list.items = list;
        return list;
      }
    }
  } catch {}

  try {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const query = `created:>${date.toISOString().split('T')[0]}`;
    const data = await searchRepositories({ query, sort: 'stars', order: 'desc', page: 1, perPage });
    if (data.items?.length) {
      const nowIso = new Date().toISOString();
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data.items }));
      } catch {}
      const list = data.items.map((repo) => ({
        ...repo,
        source: 'live',
        isFallback: false,
        fetchedAt: nowIso,
      }));
      list.source = 'live';
      list.isLive = true;
      list.fromCache = false;
      list.lastUpdated = nowIso;
      list.rankingRule = 'Ranked by total stars among repositories created in the past 30 days (GitHub Search API)';
      list.items = list;
      return list;
    }
    const fallbackList = FALLBACK_TOP_FIVE.slice(0, perPage).map((repo) => ({
      ...repo,
      source: 'static',
      isFallback: true,
      fetchedAt: null,
    }));
    fallbackList.source = 'static';
    fallbackList.isLive = false;
    fallbackList.fromCache = false;
    fallbackList.lastUpdated = null;
    fallbackList.rankingRule = 'Curated static developer repositories (Offline / Rate-limit fallback)';
    fallbackList.items = fallbackList;
    return fallbackList;
  } catch {
    const fallbackList = FALLBACK_TOP_FIVE.slice(0, perPage).map((repo) => ({
      ...repo,
      source: 'static',
      isFallback: true,
      fetchedAt: null,
    }));
    fallbackList.source = 'static';
    fallbackList.isLive = false;
    fallbackList.fromCache = false;
    fallbackList.lastUpdated = null;
    fallbackList.rankingRule = 'Curated static developer repositories (Offline / Rate-limit fallback)';
    fallbackList.items = fallbackList;
    return fallbackList;
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

export const getRateLimit = async (force = false) => {
  try {
    if (!force) {
      const cached = sessionStorage.getItem(RATE_LIMIT_CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < RATE_LIMIT_TTL_MS) return data;
      }
    }

    const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, { headers: buildHeaders() });
    if (!response.ok) throw new Error('Failed to fetch rate limit');
    const data = await response.json();

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(
        RATE_LIMIT_CACHE_KEY,
        JSON.stringify({ data: data.resources?.core, ts: Date.now() })
      );
    }

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

// ─────────────────────────────────────────────────────────────────────────────
// Discovery Features: Releases, Community Profile, Good First Issues,
// Repository Alternatives, What Changed Digest, Dependency Footprint, Compare
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch latest published release for a repository.
 * Returns null if the repository has no releases published (404).
 */
export const getLatestRelease = async (owner, repo) => {
  try {
    const res = await fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases/latest`);
    const data = await res.json();
    return {
      id: data.id,
      name: data.name || data.tag_name,
      tagName: data.tag_name,
      publishedAt: data.published_at,
      htmlUrl: data.html_url,
      body: data.body || '',
      author: data.author ? { login: data.author.login, avatarUrl: data.author.avatar_url } : null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    // 404 means no releases published on GitHub
    if (err.status === 404) return null;
    throw err;
  }
};

/**
 * Fetch recent published releases for a repository.
 */
export const getRepositoryReleases = async (owner, repo, perPage = 5) => {
  try {
    const res = await fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=${perPage}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((r) => ({
        id: r.id,
        name: r.name || r.tag_name,
        tagName: r.tag_name,
        publishedAt: r.published_at,
        htmlUrl: r.html_url,
        body: r.body || '',
        author: r.author ? { login: r.author.login, avatarUrl: r.author.avatar_url } : null,
      }));
    }
    return [];
  } catch (err) {
    if (err.status === 404) return [];
    throw err;
  }
};

/**
 * Fetch community profile signals (license, contributing, security advisory)
 * without computing an unsupported health score.
 */
export const getCommunityProfile = async (owner, repo) => {
  try {
    const res = await fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/community/profile`);
    const data = await res.json();
    return {
      healthPercentage: data.health_percentage ?? null,
      files: data.files || {},
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    return { healthPercentage: null, files: {}, fetchedAt: new Date().toISOString() };
  }
};

/**
 * Fetch open issues labeled 'good first issue' or 'help wanted'.
 */
export const getGoodFirstIssues = async ({ owner, repo, language = '', perPage = 15 }) => {
  let q;
  if (owner && repo) {
    q = `repo:${owner}/${repo} is:issue is:open label:"good first issue","help wanted"`;
  } else {
    q = `is:issue is:open label:"good first issue","help wanted"${language ? ` language:${language}` : ''}`;
  }

  const res = await fetchWithRetry(`${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=${perPage}`);
  const data = await res.json();

  const items = Array.isArray(data.items)
    ? data.items.map((issue) => {
        const repoUrlParts = (issue.repository_url || '').split('/');
        const repoFullName = repoUrlParts.length >= 2 ? `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}` : (owner && repo ? `${owner}/${repo}` : 'GitHub Repository');

        return {
          id: issue.id,
          number: issue.number,
          title: issue.title,
          htmlUrl: issue.html_url,
          comments: issue.comments,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
          labels: (issue.labels || []).map((l) => ({ name: l.name, color: l.color })),
          author: issue.user ? { login: issue.user.login, avatarUrl: issue.user.avatar_url } : null,
          repoFullName,
        };
      })
    : [];

  return {
    items,
    totalCount: data.total_count ?? items.length,
    fetchedAt: new Date().toISOString(),
  };
};

/**
 * Recommend similar repositories using explainable signals (shared language, overlapping topics).
 * Never invents an opaque or synthetic similarity score.
 */
export const getRepositoryAlternatives = async (repo) => {
  if (!repo) return { items: [], fetchedAt: new Date().toISOString() };

  const targetLang = repo.language || '';
  const targetTopics = Array.isArray(repo.topics) ? repo.topics : [];
  const fullName = repo.full_name || repo.name || '';

  // Formulate a targeted search query
  let queryTerms = [];
  if (targetLang) queryTerms.push(`language:${targetLang}`);
  if (targetTopics.length > 0) {
    queryTerms.push(targetTopics.slice(0, 2).map((t) => `topic:${t}`).join(' '));
  } else {
    queryTerms.push('stars:>500');
  }

  const query = `${queryTerms.join(' ')} stars:>100`;

  try {
    const res = await searchRepositories({ query, sort: 'stars', order: 'desc', perPage: 8 });
    const candidates = (res.items || []).filter((item) => (item.full_name || item.name) !== fullName);

    const mapped = candidates.slice(0, 4).map((item) => {
      const itemTopics = Array.isArray(item.topics) ? item.topics : [];
      const sharedTopics = itemTopics.filter((t) => targetTopics.includes(t));
      const sharedLanguage = item.language && item.language === targetLang ? item.language : null;

      const reasons = [];
      if (sharedLanguage) reasons.push(`primary language ${sharedLanguage}`);
      if (sharedTopics.length > 0) reasons.push(`shared ${sharedTopics.length === 1 ? 'topic' : 'topics'} #${sharedTopics.join(', #')}`);
      if (reasons.length === 0) reasons.push('similar open-source development ecosystem');

      return {
        ...item,
        matchReason: `Matched because both projects share ${reasons.join(' and ')}.`,
        sharedTopics,
        sharedLanguage,
      };
    });

    return {
      items: mapped,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    return { items: [], error: err.message, fetchedAt: new Date().toISOString() };
  }
};

/**
 * What Changed? Digest
 * Summarizes verifiable recent releases, merged pull requests, and commits.
 * Never invents activity or summaries.
 */
export const getWhatChangedDigest = async (owner, repo, days = 30) => {
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const sinceDateOnly = sinceDate.split('T')[0];

  const [commitsRes, releasesRes, prsRes] = await Promise.allSettled([
    fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?since=${sinceDate}&per_page=10`),
    fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=5`),
    fetchWithRetry(`${GITHUB_API_BASE}/search/issues?q=repo:${owner}/${repo}+is:pr+is:merged+merged:>${sinceDateOnly}&sort=updated&order=desc&per_page=10`),
  ]);

  let commits = [];
  if (commitsRes.status === 'fulfilled' && commitsRes.value?.ok) {
    const data = await commitsRes.value.json();
    if (Array.isArray(data)) {
      commits = data.map((c) => ({
        sha: c.sha ? c.sha.slice(0, 7) : 'commit',
        message: c.commit?.message ? c.commit.message.split('\n')[0] : 'Commit',
        author: c.commit?.author?.name || c.author?.login || 'contributor',
        date: c.commit?.author?.date || c.commit?.committer?.date,
        htmlUrl: c.html_url,
      }));
    }
  }

  let releases = [];
  if (releasesRes.status === 'fulfilled' && releasesRes.value?.ok) {
    const data = await releasesRes.value.json();
    if (Array.isArray(data)) {
      releases = data
        .filter((r) => r.published_at && new Date(r.published_at) >= new Date(sinceDate))
        .map((r) => ({
          id: r.id,
          name: r.name || r.tag_name,
          tagName: r.tag_name,
          publishedAt: r.published_at,
          htmlUrl: r.html_url,
        }));
    }
  }

  let mergedPRs = [];
  if (prsRes.status === 'fulfilled' && prsRes.value?.ok) {
    const data = await prsRes.value.json();
    if (Array.isArray(data.items)) {
      mergedPRs = data.items.map((pr) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        htmlUrl: pr.html_url,
        mergedAt: pr.pull_request?.merged_at || pr.closed_at,
        author: pr.user?.login || 'contributor',
      }));
    }
  }

  return {
    days,
    sinceDate,
    commits,
    releases,
    mergedPRs,
    fetchedAt: new Date().toISOString(),
  };
};

/**
 * Dependency Footprint Explorer
 * Reads declared dependencies from supported package manifests (package.json, Cargo.toml, requirements.txt, go.mod).
 */
export const getDependencyFootprint = async (owner, repo) => {
  const supportedManifests = [
    { path: 'package.json', ecosystem: 'npm', registryUrl: (name) => `https://www.npmjs.com/package/${name}` },
    { path: 'Cargo.toml', ecosystem: 'crates.io', registryUrl: (name) => `https://crates.io/crates/${name}` },
    { path: 'requirements.txt', ecosystem: 'PyPI', registryUrl: (name) => `https://pypi.org/project/${name}/` },
    { path: 'pyproject.toml', ecosystem: 'PyPI', registryUrl: (name) => `https://pypi.org/project/${name}/` },
    { path: 'go.mod', ecosystem: 'Go', registryUrl: (name) => `https://pkg.go.dev/${name}` },
  ];

  for (const manifest of supportedManifests) {
    try {
      const res = await fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${manifest.path}`);
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.content) continue;

      let rawText = '';
      try {
        const cleanBase64 = data.content.replace(/\s/g, '');
        rawText = decodeURIComponent(
          Array.prototype.map.call(atob(cleanBase64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
      } catch {
        rawText = atob(data.content.replace(/\s/g, ''));
      }

      const dependencies = [];
      const devDependencies = [];

      if (manifest.path === 'package.json') {
        const pkg = JSON.parse(rawText);
        Object.entries(pkg.dependencies || {}).forEach(([name, spec]) => {
          dependencies.push({ name, spec: String(spec), url: manifest.registryUrl(name), type: 'runtime' });
        });
        Object.entries(pkg.devDependencies || {}).forEach(([name, spec]) => {
          devDependencies.push({ name, spec: String(spec), url: manifest.registryUrl(name), type: 'dev' });
        });
      } else if (manifest.path === 'Cargo.toml') {
        let currentSection = '';
        rawText.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('[dependencies]')) {
            currentSection = 'dependencies';
          } else if (trimmed.startsWith('[dev-dependencies]')) {
            currentSection = 'dev-dependencies';
          } else if (trimmed.startsWith('[')) {
            currentSection = '';
          } else if (currentSection && trimmed && !trimmed.startsWith('#')) {
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex > 0) {
              const name = trimmed.slice(0, eqIndex).trim();
              const spec = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
              const item = { name, spec, url: manifest.registryUrl(name), type: currentSection === 'dependencies' ? 'runtime' : 'dev' };
              if (currentSection === 'dependencies') dependencies.push(item);
              else devDependencies.push(item);
            }
          }
        });
      } else if (manifest.path === 'requirements.txt') {
        rawText.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return;
          const match = trimmed.match(/^([a-zA-Z0-9_.-]+)(.*)$/);
          if (match) {
            const name = match[1];
            const spec = match[2]?.trim() || 'any';
            dependencies.push({ name, spec, url: manifest.registryUrl(name), type: 'runtime' });
          }
        });
      } else if (manifest.path === 'go.mod') {
        let inRequire = false;
        rawText.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('require (')) {
            inRequire = true;
          } else if (inRequire && trimmed.startsWith(')')) {
            inRequire = false;
          } else if (inRequire || trimmed.startsWith('require ')) {
            const cleanLine = trimmed.replace(/^require\s+/, '');
            const parts = cleanLine.split(/\s+/);
            if (parts.length >= 2) {
              dependencies.push({ name: parts[0], spec: parts[1], url: manifest.registryUrl(parts[0]), type: 'runtime' });
            }
          }
        });
      }

      return {
        manifestFound: true,
        manifestPath: manifest.path,
        ecosystem: manifest.ecosystem,
        fileUrl: data.html_url || `https://github.com/${owner}/${repo}/blob/HEAD/${manifest.path}`,
        dependencies,
        devDependencies,
        totalCount: dependencies.length + devDependencies.length,
        scanTime: new Date().toISOString(),
      };
    } catch {
      // Continue to next manifest
    }
  }

  return {
    manifestFound: false,
    manifestPath: null,
    ecosystem: null,
    dependencies: [],
    devDependencies: [],
    totalCount: 0,
    scanTime: new Date().toISOString(),
    error: 'No supported package manifest detected (package.json, Cargo.toml, requirements.txt, pyproject.toml, go.mod).',
  };
};

/**
 * Repository Compare
 * Fetches current metadata and latest release for 2-3 repositories side-by-side.
 */
export const getRepositoryCompareData = async (repoIdentifiers = []) => {
  const promises = repoIdentifiers.map(async (identifier) => {
    const trimmed = identifier.trim();
    if (!trimmed) return null;
    const parts = trimmed.split('/');
    if (parts.length < 2) return null;
    const [owner, repo] = parts;

    try {
      const [details, latestRelease] = await Promise.allSettled([
        getRepositoryDetails(owner, repo),
        getLatestRelease(owner, repo),
      ]);

      const repoData = details.status === 'fulfilled' ? details.value : null;
      const releaseData = latestRelease.status === 'fulfilled' ? latestRelease.value : null;

      if (!repoData) return { error: `Repository ${owner}/${repo} could not be loaded.` };

      return {
        id: repoData.id,
        fullName: repoData.full_name || `${owner}/${repo}`,
        name: repoData.name,
        owner: repoData.owner,
        htmlUrl: repoData.html_url,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        languages: repoData.languages || {},
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        license: repoData.license,
        archived: repoData.archived,
        latestRelease: releaseData,
        fetchedAt: new Date().toISOString(),
      };
    } catch (err) {
      return { fullName: `${owner}/${repo}`, error: err.message };
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};


