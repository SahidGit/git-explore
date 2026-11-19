#!/usr/bin/env node

/**
 * ExploreGit Monthly Gems Evaluator
 * Dependency-free Node 20 script evaluating repositories against data/criteria.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CRITERIA, CRITERIA_VERSION, CONFIG, deriveTier } from '../data/criteria.mjs';
import { GEMS_MANIFEST } from '../src/data/gemsManifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const RATE_LIMIT_DELAY_MS = 600; // Spacing between individual requests

let totalApiCallsMade = 0;
let lastKnownRateLimitRemaining = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates data/gem-reviews.json strictly without external dependencies.
 * Fails with a clear error naming the file and the exact issue if malformed.
 */
export function validateReviews(rawContent, filePath = 'data/gem-reviews.json') {
  let parsed;
  try {
    parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
  } catch (err) {
    throw new Error(`[SCHEMA ERROR in ${filePath}]: Invalid JSON syntax: ${err.message}`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`[SCHEMA ERROR in ${filePath}]: Root must be a JSON object`);
  }

  if (typeof parsed.version !== 'number' || parsed.version < 1) {
    throw new Error(`[SCHEMA ERROR in ${filePath}]: Missing or invalid "version" integer`);
  }

  if (!parsed.reviews || typeof parsed.reviews !== 'object' || Array.isArray(parsed.reviews)) {
    throw new Error(`[SCHEMA ERROR in ${filePath}]: Missing or invalid "reviews" dictionary`);
  }

  for (const [key, item] of Object.entries(parsed.reviews)) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`[SCHEMA ERROR in ${filePath}]: Review entry for "${key}" must be an object`);
    }

    if (item.issueResponsiveness) {
      const ir = item.issueResponsiveness;
      if (!ir.verifiedAt || Number.isNaN(Date.parse(ir.verifiedAt))) {
        throw new Error(`[SCHEMA ERROR in ${filePath}]: "${key}.issueResponsiveness.verifiedAt" must be a valid ISO date-time`);
      }
      if (!ir.reviewer || typeof ir.reviewer !== 'string' || ir.reviewer.trim().length === 0) {
        throw new Error(`[SCHEMA ERROR in ${filePath}]: "${key}.issueResponsiveness.reviewer" must be a non-empty string`);
      }
    }

    if (item.independentAudit) {
      const ia = item.independentAudit;
      if (!ia.verifiedAt || Number.isNaN(Date.parse(ia.verifiedAt))) {
        throw new Error(`[SCHEMA ERROR in ${filePath}]: "${key}.independentAudit.verifiedAt" must be a valid ISO date-time`);
      }
      if (!ia.reviewer || typeof ia.reviewer !== 'string' || ia.reviewer.trim().length === 0) {
        throw new Error(`[SCHEMA ERROR in ${filePath}]: "${key}.independentAudit.reviewer" must be a non-empty string`);
      }
      if (!ia.auditUrl || typeof ia.auditUrl !== 'string') {
        throw new Error(`[SCHEMA ERROR in ${filePath}]: "${key}.independentAudit.auditUrl" must be a valid URL string`);
      }
      try {
        new URL(ia.auditUrl);
      } catch {
        throw new Error(`[SCHEMA ERROR in ${filePath}]: "${key}.independentAudit.auditUrl" is not a valid absolute URL`);
      }
    }
  }

  return parsed.reviews;
}

/**
 * Fetch GitHub REST API with exponential backoff and rate-limit tracking
 */
async function fetchGithub(url, options = {}, retries = 3) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'ExploreGit-Gems-Evaluator/2.0',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    ...options.headers,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    await sleep(RATE_LIMIT_DELAY_MS);
    totalApiCallsMade++;

    try {
      const res = await fetch(url, { ...options, headers });

      const remainingHeader = res.headers.get('x-ratelimit-remaining');
      if (remainingHeader) {
        lastKnownRateLimitRemaining = parseInt(remainingHeader, 10);
      }

      if (res.status === 404) {
        return { ok: false, status: 404, data: null };
      }

      if (res.status === 403 || res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        const resetTime = res.headers.get('x-ratelimit-reset');
        let waitMs = 4000 * Math.pow(2, attempt);

        if (retryAfter) {
          waitMs = parseInt(retryAfter, 10) * 1000;
        } else if (resetTime) {
          waitMs = Math.max(1000, parseInt(resetTime, 10) * 1000 - Date.now() + 1000);
        }

        console.warn(`[THROTTLE] Rate limit hit on ${url}. Backing off for ${Math.round(waitMs / 1000)}s (Attempt ${attempt}/${retries})...`);
        await sleep(waitMs);
        continue;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return { ok: true, status: res.status, data };
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(1500 * attempt);
    }
  }
}

/**
 * Check GitHub rate limit pre-flight
 */
async function checkPreFlightRateLimit(expectedCalls) {
  if (!GITHUB_TOKEN) {
    console.warn('[WARN] GITHUB_TOKEN is not set. Running unauthenticated (limited to 60 req/hr).');
  }

  if (expectedCalls > CONFIG.maxAllowedApiCalls) {
    throw new Error(`Anticipated calls (${expectedCalls}) exceeds safety cap of ${CONFIG.maxAllowedApiCalls}. Evaluation aborted.`);
  }

  try {
    const res = await fetchGithub('https://api.github.com/rate_limit');
    if (res.ok && res.data?.resources?.core) {
      const core = res.data.resources.core;
      lastKnownRateLimitRemaining = core.remaining;
      console.log(`[PRE-FLIGHT] GitHub Rate Limit Remaining: ${core.remaining}/${core.limit} (Reset: ${new Date(core.reset * 1000).toISOString()})`);

      if (core.remaining < Math.min(CONFIG.minRateLimitRemaining, expectedCalls)) {
        throw new Error(`Insufficient rate limit remaining (${core.remaining} available, minimum ${expectedCalls} required). Evaluation aborted.`);
      }
    }
  } catch (err) {
    console.warn(`[PRE-FLIGHT WARN] Could not check rate limit endpoint: ${err.message}`);
  }
}

/**
 * Load previous public/data/gems.json state
 */
async function loadPreviousState() {
  const currentPath = path.join(ROOT_DIR, 'public/data/gems.json');
  try {
    const raw = await fs.readFile(currentPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Load and strictly validate manual review file
 */
async function loadManualReviews() {
  const reviewPath = path.join(ROOT_DIR, 'data/gem-reviews.json');
  let raw;
  try {
    raw = await fs.readFile(reviewPath, 'utf-8');
  } catch (err) {
    throw new Error(`[FATAL] Missing required review file ${reviewPath}: ${err.message}`);
  }

  return validateReviews(raw, reviewPath);
}

/**
 * Fetch data for an individual repository
 */
async function fetchRepoData(repoFullName, isSecuritySensitive, now) {
  const [owner, repo] = repoFullName.split('/');
  const base = `https://api.github.com/repos/${owner}/${repo}`;
  const oneYearAgoISO = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Core repo metadata
  const repoRes = await fetchGithub(base);
  if (!repoRes.ok && repoRes.status === 404) {
    return { unavailable: true };
  }
  if (!repoRes.ok) {
    throw new Error(`Failed to fetch repo ${repoFullName} (HTTP ${repoRes.status})`);
  }

  // 2. Latest release
  const releaseRes = await fetchGithub(`${base}/releases/latest`).catch(() => ({ ok: false, data: null }));

  // 3. Community profile (README presence)
  const communityRes = await fetchGithub(`${base}/community/profile`).catch(() => ({ ok: false, data: null }));

  // 4. Commits in the last 365 days (max 100 sample)
  const commitsRes = await fetchGithub(`${base}/commits?since=${encodeURIComponent(oneYearAgoISO)}&per_page=100`).catch(() => ({ ok: false, data: [] }));

  // 5. Security policy (verified file presence if security-sensitive)
  let hasSecurityPolicy = false;
  if (isSecuritySensitive) {
    const secResRoot = await fetchGithub(`${base}/contents/SECURITY.md`).catch(() => ({ ok: false }));
    if (secResRoot.ok) {
      hasSecurityPolicy = true;
    } else {
      const secResDot = await fetchGithub(`${base}/contents/.github/SECURITY.md`).catch(() => ({ ok: false }));
      if (secResDot.ok) hasSecurityPolicy = true;
    }
  }

  return {
    unavailable: false,
    repo: repoRes.data,
    latestRelease: releaseRes?.data || null,
    communityProfile: communityRes?.data || null,
    hasReadme: Boolean(communityRes?.data?.files?.readme),
    commits: Array.isArray(commitsRes?.data) ? commitsRes.data : [],
    hasSecurityPolicy,
  };
}

/**
 * Strip reviewer names from review records for public consumption
 */
function sanitizeReviewForPublish(reviewRecord) {
  if (!reviewRecord) return null;
  const sanitized = {};
  if (reviewRecord.issueResponsiveness) {
    sanitized.issueResponsiveness = {
      verifiedAt: reviewRecord.issueResponsiveness.verifiedAt,
      notes: reviewRecord.issueResponsiveness.notes,
    };
  }
  if (reviewRecord.independentAudit) {
    sanitized.independentAudit = {
      verifiedAt: reviewRecord.independentAudit.verifiedAt,
      auditUrl: reviewRecord.independentAudit.auditUrl,
      auditor: reviewRecord.independentAudit.auditor,
      notes: reviewRecord.independentAudit.notes,
    };
  }
  return sanitized;
}

/**
 * Main Evaluation Engine
 */
export async function evaluateGems() {
  const now = new Date();
  console.log(`[EVALUATOR] Starting Gems evaluation at ${now.toISOString()} (Criteria v${CRITERIA_VERSION})...`);

  // Validate reviews upfront
  const reviews = await loadManualReviews();

  // Load previous state
  const previousState = await loadPreviousState();
  const isBaselineRun = !previousState;
  const previousItemsMap = new Map((previousState?.items || []).map((i) => [i.id || i.repo.toLowerCase(), i]));

  // Pre-flight rate limit check (est 4 calls per entry + 1 sec check)
  const estimatedApiCalls = GEMS_MANIFEST.length * 4;
  await checkPreFlightRateLimit(estimatedApiCalls);

  const evaluatedItems = [];
  const changes = [];
  let statusChangedCount = 0;
  let fetchFailureCount = 0;

  for (const manifestItem of GEMS_MANIFEST) {
    const itemKey = manifestItem.id || manifestItem.repo.toLowerCase();
    const prev = previousItemsMap.get(itemKey);
    console.log(`[EVALUATOR] Evaluating ${manifestItem.id} (${manifestItem.repo})...`);

    let repoData;
    let fetchError = null;

    try {
      repoData = await fetchRepoData(manifestItem.repo, manifestItem.isSecuritySensitive === true, now);
    } catch (err) {
      fetchError = err;
      fetchFailureCount++;
    }

    // Handle Network / API Fetch Failures
    if (fetchError) {
      if (prev) {
        console.warn(`[WARN] Fetch failed for ${manifestItem.repo}. Retaining previous state with stale: true`);
        evaluatedItems.push({
          ...prev,
          stale: true,
          staleReason: `GitHub fetch failed: ${fetchError.message}`,
        });
      } else {
        console.warn(`[WARN] Initial fetch failed for new entry ${manifestItem.repo}. Marking unknown.`);
        evaluatedItems.push({
          ...manifestItem,
          status: 'unknown',
          tier: 'under-the-radar',
          stale: true,
          staleReason: `Initial fetch failed: ${fetchError.message}`,
          failingCriteria: [],
          evaluatedAt: now.toISOString(),
        });
      }
      continue;
    }

    // Handle 404 Deleted or Renamed Repos
    if (repoData.unavailable) {
      const item = {
        ...manifestItem,
        status: 'unavailable',
        tier: prev?.tier || 'under-the-radar',
        stale: false,
        failingCriteria: [{ id: 'repository-exists', detail: 'Repository returned 404 Not Found' }],
        evaluatedAt: now.toISOString(),
      };
      evaluatedItems.push(item);

      if (prev && prev.status !== 'unavailable') {
        changes.push({
          type: 'status',
          id: manifestItem.id,
          repo: manifestItem.repo,
          from: prev.status,
          to: 'unavailable',
        });
        statusChangedCount++;
      }
      continue;
    }

    // 1. Derive Tier dynamically from current star count
    const stars = repoData.repo.stargazers_count ?? 0;
    const currentTier = deriveTier(stars);
    const prevTier = prev?.tier;

    if (prevTier && prevTier !== currentTier) {
      changes.push({
        type: 'tier',
        id: manifestItem.id,
        repo: manifestItem.repo,
        from: prevTier,
        to: currentTier,
      });
    }

    // 2. Ownership transfer detection
    const currentOwner = repoData.repo.owner?.login;
    const prevOwner = prev?.ownerLogin;
    if (prevOwner && currentOwner && prevOwner.toLowerCase() !== currentOwner.toLowerCase()) {
      changes.push({
        type: 'ownership-transfer',
        id: manifestItem.id,
        repo: manifestItem.repo,
        from: prevOwner,
        to: currentOwner,
      });
    }

    // 3. Evaluate criteria against derived tier
    const reviewRecord = reviews[manifestItem.id] || reviews[manifestItem.repo] || null;
    const context = {
      now,
      repo: repoData.repo,
      tier: currentTier,
      latestRelease: repoData.latestRelease,
      communityProfile: repoData.communityProfile,
      hasReadme: repoData.hasReadme,
      commits: repoData.commits,
      hasSecurityPolicy: repoData.hasSecurityPolicy,
      reviewRecord,
    };

    const failingCriteria = [];
    let hasFailedAuto = false;
    let hasFailedManual = false;

    for (const criterion of CRITERIA) {
      if (criterion.retired) continue;
      if (!criterion.applies(manifestItem, context)) continue;

      const result = criterion.check(manifestItem, context);
      if (!result.pass) {
        failingCriteria.push({
          id: criterion.id,
          kind: criterion.kind,
          detail: result.detail || 'Criterion check failed',
        });

        if (criterion.kind === 'auto') {
          hasFailedAuto = true;
        } else if (criterion.kind === 'manual') {
          hasFailedManual = true;
        }
      }
    }

    // Status assignment
    let status = 'eligible';
    if (hasFailedAuto) {
      status = 'below-threshold';
    } else if (hasFailedManual) {
      status = 'pending-review';
    }

    // Construct final entry
    const entry = {
      ...manifestItem,
      name: manifestItem.name || repoData.repo.name,
      description: repoData.repo.description || manifestItem.tagline,
      stars,
      forks: repoData.repo.forks_count ?? 0,
      language: repoData.repo.language || 'Multi',
      license: repoData.repo.license?.spdx_id || 'Open Source',
      topics: repoData.repo.topics || [],
      githubUrl: repoData.repo.html_url,
      avatarUrl: repoData.repo.owner?.avatar_url,
      ownerLogin: currentOwner,
      tier: currentTier,
      status,
      stale: false,
      failingCriteria,
      verifiedReview: sanitizeReviewForPublish(reviewRecord),
      evaluatedAt: now.toISOString(),
    };

    evaluatedItems.push(entry);

    if (prev && prev.status !== status) {
      changes.push({
        type: 'status',
        id: manifestItem.id,
        repo: manifestItem.repo,
        from: prev.status,
        to: status,
        reasons: failingCriteria.map((f) => f.detail),
      });
      statusChangedCount++;
    }
  }

  // 4. Run-Level Failure Check: abort if too many fetch failures occurred (> 50%)
  if (GEMS_MANIFEST.length > 0 && fetchFailureCount / GEMS_MANIFEST.length > 0.5) {
    const partialPath = path.join(ROOT_DIR, 'reports/gems-eval-partial.json');
    await fs.mkdir(path.dirname(partialPath), { recursive: true });
    await fs.writeFile(partialPath, JSON.stringify({ evaluatedItems, changes }, null, 2), 'utf-8');
    throw new Error(`[FATAL] More than 50% of fetches failed (${fetchFailureCount}/${GEMS_MANIFEST.length}). Run aborted without publishing.`);
  }

  // 5. Publish Guard (25% anomaly check)
  if (!isBaselineRun && previousState.items?.length > 0) {
    const totalPrevious = previousState.items.length;
    const changeRatio = statusChangedCount / totalPrevious;

    if (changeRatio > CONFIG.publishAnomalyThreshold) {
      const yearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
      const anomalyReportPath = path.join(ROOT_DIR, `reports/gems-anomaly-${yearMonth}.json`);
      const anomalyReport = {
        evaluatedAt: now.toISOString(),
        totalEntries: totalPrevious,
        statusChangedCount,
        changeRatio,
        threshold: CONFIG.publishAnomalyThreshold,
        changes,
      };

      await fs.mkdir(path.dirname(anomalyReportPath), { recursive: true });
      await fs.writeFile(anomalyReportPath, JSON.stringify(anomalyReport, null, 2), 'utf-8');

      console.error(`[ANOMALY GUARD] ${Math.round(changeRatio * 100)}% of entries changed status (limit: ${CONFIG.publishAnomalyThreshold * 100}%).`);
      console.error(`[ANOMALY GUARD] Anomaly report written to ${anomalyReportPath}. Exiting without publishing.`);
      process.exit(1);
    }
  }

  // 6. Summary and Observability
  const runSummary = {
    evaluatedAt: now.toISOString(),
    criteriaVersion: CRITERIA_VERSION,
    totalEntries: evaluatedItems.length,
    statusCounts: {
      eligible: evaluatedItems.filter((i) => i.status === 'eligible').length,
      pendingReview: evaluatedItems.filter((i) => i.status === 'pending-review').length,
      belowThreshold: evaluatedItems.filter((i) => i.status === 'below-threshold').length,
      unavailable: evaluatedItems.filter((i) => i.status === 'unavailable').length,
      unknown: evaluatedItems.filter((i) => i.status === 'unknown').length,
    },
    staleCount: evaluatedItems.filter((i) => i.stale).length,
    apiCallsMade: totalApiCallsMade,
    rateLimitRemaining: lastKnownRateLimitRemaining,
    anomalyGuard: isBaselineRun
      ? { skipped: true, reason: 'Baseline run: no prior state exists to compare' }
      : { passed: true, statusChangedCount, threshold: CONFIG.publishAnomalyThreshold },
  };

  const snapshotPayload = {
    criteriaVersion: CRITERIA_VERSION,
    evaluatedAt: now.toISOString(),
    runSummary,
    changes,
    items: evaluatedItems,
  };

  // 7. Write Immutable Monthly Snapshot (public/data/gems-history/YYYY-MM.json)
  const yearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const historyPath = path.join(ROOT_DIR, `public/data/gems-history/${yearMonth}.json`);
  await fs.mkdir(path.dirname(historyPath), { recursive: true });

  try {
    await fs.access(historyPath);
    throw new Error(`[IMMUTABLE SNAPSHOT VIOLATION]: History file ${historyPath} already exists! Monthly snapshots cannot be overwritten.`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(historyPath, JSON.stringify(snapshotPayload, null, 2), 'utf-8');
      console.log(`[OUTPUT] Wrote immutable snapshot to ${historyPath}`);
    } else {
      throw err;
    }
  }

  // 8. Write Current Active State (public/data/gems.json)
  const currentPath = path.join(ROOT_DIR, 'public/data/gems.json');
  await fs.mkdir(path.dirname(currentPath), { recursive: true });
  await fs.writeFile(currentPath, JSON.stringify(snapshotPayload, null, 2), 'utf-8');
  console.log(`[OUTPUT] Updated active dataset at ${currentPath}`);

  // Observability Log Output
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('                 EXPLOREGIT GEMS RUN SUMMARY                   ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Criteria Version:     v${CRITERIA_VERSION}`);
  console.log(`Total Repositories:   ${runSummary.totalEntries}`);
  console.log(`  - Eligible:         ${runSummary.statusCounts.eligible}`);
  console.log(`  - Pending Review:   ${runSummary.statusCounts.pendingReview}`);
  console.log(`  - Below Threshold:  ${runSummary.statusCounts.belowThreshold}`);
  console.log(`  - Unavailable:      ${runSummary.statusCounts.unavailable}`);
  console.log(`  - Unknown:          ${runSummary.statusCounts.unknown}`);
  console.log(`Stale Entries:        ${runSummary.staleCount}`);
  console.log(`Total API Calls Made: ${runSummary.apiCallsMade}`);
  console.log(`Rate Limit Remaining: ${runSummary.rateLimitRemaining ?? 'N/A'}`);
  console.log(`Changes Recorded:     ${changes.length}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  return snapshotPayload;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  evaluateGems().catch((err) => {
    console.error('[FATAL EVALUATION FAILURE]:', err.message);
    process.exit(1);
  });
}
