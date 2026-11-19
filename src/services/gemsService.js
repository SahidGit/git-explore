/**
 * ExploreGit Gems Client Service
 *
 * Consumes precomputed static dataset at `/data/gems.json`.
 * All client-side GitHub API rate-limiting and authorization headers have been removed.
 */

import { GEMS_MANIFEST, GEMS_CATEGORIES } from '../data/gemsManifest';

const GEMS_STATIC_URL = '/data/gems.json';

// Language color mappings for UI badges
const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Rust: '#DEA584',
  Go: '#00ADD8',
  C: '#555555',
  'C++': '#F34B7D',
  'C#': '#178600',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Swift: '#F05138',
};

const formatStars = (num) => {
  if (!num) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return `${num}`;
};

/**
 * Format status for human readability and accessible assistive technology
 */
export const STATUS_LABELS = {
  eligible: {
    label: 'Eligible Gem',
    badge: 'Eligible',
    description: 'Passed all active automated and editorial criteria.',
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  'pending-review': {
    label: 'Pending Review',
    badge: 'Under Review',
    description: 'Passed automated metrics; awaiting annual or quarterly editorial verification.',
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  'below-threshold': {
    label: 'Below Threshold',
    badge: 'Below Threshold',
    description: 'Currently does not meet one or more activity, licensing, or freshness criteria.',
    colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  unavailable: {
    label: 'Unavailable',
    badge: '404 Missing',
    description: 'Repository was deleted, privatized, or moved without a redirect.',
    colorClass: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  },
  unknown: {
    label: 'Fetch Incomplete',
    badge: 'Unknown',
    description: 'Could not obtain upstream GitHub metrics during the latest evaluation run.',
    colorClass: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  },
};

export const gemsService = {
  /**
   * Fetch precomputed monthly gems dataset.
   *
   * By default, returns only eligible, pending-review, and stale entries.
   * Pass includeBelowThreshold: true to display failing entries with transparency reasons.
   */
  async getGems(options = {}) {
    const includeBelowThreshold = typeof options === 'boolean' ? options : Boolean(options.includeBelowThreshold);

    try {
      const res = await fetch(GEMS_STATIC_URL, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const payload = await res.json();
      const rawItems = Array.isArray(payload.items) ? payload.items : [];

      const hydratedItems = rawItems.map((item, idx) => ({
        ...item,
        rank: idx + 1,
        starsFormatted: formatStars(item.stars),
        forksFormatted: formatStars(item.forks),
        languageColor: LANG_COLORS[item.language] || '#71717A',
        statusMeta: STATUS_LABELS[item.status] || STATUS_LABELS.unknown,
      }));

      // Filter default visibility: eligible, pending-review, and stale
      const visibleItems = includeBelowThreshold
        ? hydratedItems
        : hydratedItems.filter(
            (item) =>
              item.status === 'eligible' ||
              item.status === 'pending-review' ||
              item.stale === true
          );

      const evaluatedDate = payload.evaluatedAt ? new Date(payload.evaluatedAt) : new Date();

      return {
        items: visibleItems,
        allItems: hydratedItems,
        isCached: true,
        lastUpdated: evaluatedDate,
        evaluatedAt: evaluatedDate,
        criteriaVersion: payload.criteriaVersion || 1,
        runSummary: payload.runSummary || {},
        staleNotice: 'Metrics and star counts are evaluated monthly and may be up to 30 days old.',
      };
    } catch (err) {
      console.warn('[gemsService] Failed to load static dataset, falling back to local manifest:', err.message);

      // Fallback baseline for local development before first evaluation run
      const fallbackItems = GEMS_MANIFEST.map((item, idx) => ({
        ...item,
        rank: idx + 1,
        description: item.tagline,
        stars: item.isLegend ? 15000 : 2500,
        starsFormatted: item.isLegend ? '15k' : '2.5k',
        forks: 150,
        forksFormatted: '150',
        language: 'Code',
        languageColor: '#71717A',
        topics: ['open-source', 'curated'],
        license: 'Open Source',
        githubUrl: `https://github.com/${item.repo}`,
        status: 'eligible',
        statusMeta: STATUS_LABELS.eligible,
        stale: true,
        staleReason: 'Static dataset not yet generated. Showing baseline manifest.',
        failingCriteria: [],
        evaluatedAt: null,
      }));

      return {
        items: fallbackItems,
        allItems: fallbackItems,
        isCached: false,
        lastUpdated: new Date(),
        evaluatedAt: null,
        criteriaVersion: 1,
        runSummary: {},
        staleNotice: 'Static dataset not yet generated. Showing baseline manifest.',
        error: err.message,
      };
    }
  },

  /**
   * Derive dynamic categories with accurate item counts
   */
  getCategories(items = []) {
    return GEMS_CATEGORIES.map((cat) => {
      const count =
        cat.id === 'all'
          ? items.length
          : items.filter((item) => item.category === cat.id).length;
      return { ...cat, count };
    });
  },

  /**
   * No-op cache reset retained for interface compatibility
   */
  clearCache() {
    // Static files are cached by browser HTTP semantics; no client storage key is used.
  },
};
