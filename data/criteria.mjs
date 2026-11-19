/**
 * ExploreGit Gems Criteria Registry
 *
 * Rules:
 * 1. Criteria IDs are permanent and immutable. Never delete, rename, or reuse an ID.
 * 2. To change a rule, add a new criterion that supersedes it and bump CRITERIA_VERSION.
 * 3. Criteria can be marked `retired: true` with a `retiredIn` version.
 *    Retired criteria remain in the registry, can be evaluated for historical snapshots,
 *    and stop affecting current status.
 * 4. Update data/criteria-ids.json whenever a criterion is added.
 * 5. All thresholds reside in the CONFIG object below.
 */

export const CRITERIA_VERSION = 2;

export const CONFIG = {
  // Star bounds per tier
  tiers: {
    legend: { min: 10000, max: Infinity, label: 'Legend' },
    gem: { min: 1000, max: 9999, label: 'Curated Gem' },
    'under-the-radar': { min: 150, max: 999, label: 'Under the Radar' },
  },
  // Minimum repository age in days
  minAgeDays: {
    legend: 3 * 365,       // 3 years (1095 days)
    gem: 2 * 365,          // 2 years (730 days)
    'under-the-radar': 180, // 6 months (180 days)
  },
  // Maximum days since last git push
  recentPushDays: {
    legend: 180,
    gem: 90,
    'under-the-radar': 60,
  },
  // Minimum distinct commit contributors in past 365 days (floor based on recent commit sample)
  minRecentContributors: {
    legend: 5,
    gem: 2,
    'under-the-radar': 1,
  },
  // Expiry limits for human manual reviews
  reviewExpiryDays: {
    issueResponsiveness: 90,
    independentAudit: 365,
  },
  // Publish guard: fail and alert if status changes exceed this ratio
  publishAnomalyThreshold: 0.25, // 25%
  // Safety cap on total API calls allowed per single evaluation run
  maxAllowedApiCalls: 500,
  // Minimum rate-limit buffer required to begin evaluation
  minRateLimitRemaining: 150,
  // Advisory criteria for the current version (run diagnostics without failing current status)
  advisoryCriteriaIds: [],
};

// Recognized OSI-approved SPDX license identifiers
export const OSI_APPROVED_LICENSES = new Set([
  'MIT', 'Apache-2.0', 'GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-2.1', 'LGPL-3.0',
  'BSD-2-Clause', 'BSD-3-Clause', 'MPL-2.0', 'ISC', 'Unlicense', 'EUPL-1.2',
  '0BSD', 'CC0-1.0', 'Artistic-2.0'
]);

/**
 * Derives the canonical tier strictly from the repository's current star count.
 * @param {number} stars
 * @returns {'legend' | 'gem' | 'under-the-radar'}
 */
export function deriveTier(stars = 0) {
  if (stars >= CONFIG.tiers.legend.min) return 'legend';
  if (stars >= CONFIG.tiers.gem.min) return 'gem';
  return 'under-the-radar';
}

/**
 * Registry of evaluation criteria
 */
export const CRITERIA = [
  // ── Version 1: Core Quality & Activity Baseline ───────────────────────────
  {
    id: 'not-archived-or-disabled',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { repo }) => {
      if (repo.archived) return { pass: false, detail: 'Repository is archived' };
      if (repo.disabled) return { pass: false, detail: 'Repository is disabled' };
      return { pass: true };
    },
  },
  {
    id: 'not-a-fork',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { repo }) => {
      if (repo.fork) return { pass: false, detail: 'Repository is a fork, not upstream source' };
      return { pass: true };
    },
  },
  {
    id: 'osi-approved-license',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { repo }) => {
      const spdx = repo.license?.spdx_id;
      if (!spdx || spdx === 'NOASSERTION' || spdx === 'NONE') {
        return { pass: false, detail: `Unrecognized or missing license (${spdx || 'none'})` };
      }
      if (!OSI_APPROVED_LICENSES.has(spdx)) {
        return { pass: false, detail: `License (${spdx}) is not recognized as OSI-approved` };
      }
      return { pass: true };
    },
  },
  {
    id: 'has-description',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { repo }) => {
      if (!repo.description || repo.description.trim().length === 0) {
        return { pass: false, detail: 'Repository has no description on GitHub' };
      }
      return { pass: true };
    },
  },
  {
    id: 'stars-within-tier',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (entry, { repo, tier }) => {
      const activeTier = tier || deriveTier(repo.stargazers_count);
      const bounds = CONFIG.tiers[activeTier];
      const stars = repo.stargazers_count ?? 0;
      if (stars < bounds.min || stars > bounds.max) {
        return {
          pass: false,
          detail: `Stars (${stars}) outside window for tier "${activeTier}" (${bounds.min} - ${bounds.max})`,
        };
      }
      return { pass: true };
    },
  },
  {
    id: 'min-repo-age',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { repo, tier, now = new Date() }) => {
      const activeTier = tier || deriveTier(repo.stargazers_count);
      const minDays = CONFIG.minAgeDays[activeTier];
      const createdAt = new Date(repo.created_at);
      const ageDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays < minDays) {
        return {
          pass: false,
          detail: `Repository age (${Math.floor(ageDays)} days) is below required ${minDays} days for tier "${activeTier}"`,
        };
      }
      return { pass: true };
    },
  },
  {
    id: 'recent-push',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { repo, tier, now = new Date() }) => {
      const activeTier = tier || deriveTier(repo.stargazers_count);
      const maxDays = CONFIG.recentPushDays[activeTier];
      const pushedAt = new Date(repo.pushed_at);
      const inactiveDays = (now.getTime() - pushedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (inactiveDays > maxDays) {
        return {
          pass: false,
          detail: `Last push was ${Math.floor(inactiveDays)} days ago (limit: ${maxDays} days for "${activeTier}")`,
        };
      }
      return { pass: true };
    },
  },
  {
    id: 'min-recent-contributors',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { repo, commits = [], tier }) => {
      const activeTier = tier || deriveTier(repo.stargazers_count);
      const minRequired = CONFIG.minRecentContributors[activeTier];
      const authors = new Set();
      for (const commit of commits) {
        const authorId = commit.author?.login || commit.commit?.author?.email;
        if (authorId) authors.add(authorId);
      }
      if (authors.size < minRequired) {
        return {
          pass: false,
          detail: `Found only ${authors.size} recent contributor author(s) in sample (minimum ${minRequired} required for "${activeTier}")`,
        };
      }
      return { pass: true };
    },
  },
  {
    id: 'tagged-release-required',
    since: 1,
    kind: 'auto',
    retired: false,
    applies: (_entry, { repo, tier }) => {
      const activeTier = tier || deriveTier(repo?.stargazers_count);
      return activeTier === 'legend' || activeTier === 'gem';
    },
    check: (_entry, { latestRelease }) => {
      if (!latestRelease || !latestRelease.tag_name) {
        return { pass: false, detail: 'No tagged releases found (required for Legend and Gem tiers)' };
      }
      return { pass: true };
    },
  },

  // ── Version 2: Security, Governance & Verification ────────────────────────
  {
    id: 'readme-present',
    since: 2,
    kind: 'auto',
    retired: false,
    applies: () => true,
    check: (_entry, { communityProfile, hasReadme }) => {
      const exists = hasReadme ?? Boolean(communityProfile?.files?.readme);
      if (!exists) {
        return { pass: false, detail: 'Repository lacks a verified README file' };
      }
      return { pass: true };
    },
  },
  {
    id: 'published-security-policy',
    since: 2,
    kind: 'auto',
    retired: false,
    applies: (entry) => entry.isSecuritySensitive === true,
    check: (_entry, { hasSecurityPolicy }) => {
      if (!hasSecurityPolicy) {
        return { pass: false, detail: 'No published SECURITY.md policy found for security-sensitive tool' };
      }
      return { pass: true };
    },
  },
  {
    id: 'issue-responsiveness',
    since: 2,
    kind: 'manual',
    retired: false,
    applies: () => true,
    check: (_entry, { reviewRecord, now = new Date() }) => {
      const review = reviewRecord?.issueResponsiveness;
      if (!review || !review.verifiedAt) {
        return { pass: false, detail: 'Manual review required: issue responsiveness has not been verified' };
      }
      const verifiedAt = new Date(review.verifiedAt);
      const elapsedDays = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (elapsedDays > CONFIG.reviewExpiryDays.issueResponsiveness) {
        return {
          pass: false,
          detail: `Issue responsiveness review expired (${Math.floor(elapsedDays)} days old, max ${CONFIG.reviewExpiryDays.issueResponsiveness} days)`,
        };
      }
      return { pass: true };
    },
  },
  {
    id: 'independent-audit',
    since: 2,
    kind: 'manual',
    retired: false,
    applies: (entry) => entry.isSecuritySensitive === true,
    check: (_entry, { reviewRecord, now = new Date() }) => {
      const review = reviewRecord?.independentAudit;
      if (!review || !review.verifiedAt || !review.auditUrl) {
        return { pass: false, detail: 'Manual review required: independent audit has not been verified' };
      }
      const verifiedAt = new Date(review.verifiedAt);
      const elapsedDays = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (elapsedDays > CONFIG.reviewExpiryDays.independentAudit) {
        return {
          pass: false,
          detail: `Independent audit verification expired (${Math.floor(elapsedDays)} days old, max ${CONFIG.reviewExpiryDays.independentAudit} days)`,
        };
      }
      return { pass: true };
    },
  },
];
