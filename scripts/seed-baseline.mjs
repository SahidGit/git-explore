import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GEMS_MANIFEST } from '../src/data/gemsManifest.js';
import { CRITERIA_VERSION, CONFIG, deriveTier } from '../data/criteria.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

async function seed() {
  const reviewsRaw = await fs.readFile(path.join(ROOT_DIR, 'data/gem-reviews.json'), 'utf-8');
  const reviewsData = JSON.parse(reviewsRaw).reviews || {};
  const now = new Date();

  // Baseline star approximations for seeding
  const starMap = {
    entire: 850,
    opendots: 920,
    fieldwatch: 640,
    'clearai-dsh': 420,
    madeira: 780,
    'thinkwatch-lite': 890,
    'gh-secure': 950,
    vlc: 45000,
    localsend: 52000,
    '7zip': 38000,
    sharex: 29000,
    handbrake: 24000,
    bleachbit: 18000,
    lazygit: 49000,
    starship: 46000,
    ripgrep: 49500,
    zoxide: 22000,
    ollama: 110000,
    jan: 27000,
    fabric: 28000,
    'llama-cpp': 69000,
    kdenlive: 15000,
    'stirling-pdf': 44000,
    keepassxc: 23000,
    'lossless-cut': 26000,
  };

  const items = GEMS_MANIFEST.map((manifestItem) => {
    const stars = starMap[manifestItem.id] || (manifestItem.isLegend ? 25000 : 850);
    const tier = deriveTier(stars);
    const review = reviewsData[manifestItem.id] || null;

    let status = 'eligible';
    const failingCriteria = [];

    // If security sensitive without audit, mark pending-review
    if (manifestItem.isSecuritySensitive) {
      if (!review?.independentAudit) {
        status = 'pending-review';
        failingCriteria.push({
          id: 'independent-audit',
          kind: 'manual',
          detail: 'Manual review required: independent audit has not been verified',
        });
      }
    }

    return {
      ...manifestItem,
      stars,
      forks: Math.round(stars * 0.08),
      language: manifestItem.category === 'cli-devtools' ? 'Rust' : 'Multi',
      license: 'Open Source',
      topics: [manifestItem.category, 'open-source', 'curated'],
      githubUrl: `https://github.com/${manifestItem.repo}`,
      avatarUrl: `https://github.com/${manifestItem.repo.split('/')[0]}.png?size=120`,
      ownerLogin: manifestItem.repo.split('/')[0],
      tier,
      status,
      stale: false,
      failingCriteria,
      verifiedReview: review ? {
        issueResponsiveness: review.issueResponsiveness ? {
          verifiedAt: review.issueResponsiveness.verifiedAt,
          notes: review.issueResponsiveness.notes,
        } : undefined,
        independentAudit: review.independentAudit ? {
          verifiedAt: review.independentAudit.verifiedAt,
          auditUrl: review.independentAudit.auditUrl,
          auditor: review.independentAudit.auditor,
          notes: review.independentAudit.notes,
        } : undefined,
      } : null,
      evaluatedAt: now.toISOString(),
    };
  });

  const runSummary = {
    evaluatedAt: now.toISOString(),
    criteriaVersion: CRITERIA_VERSION,
    totalEntries: items.length,
    statusCounts: {
      eligible: items.filter((i) => i.status === 'eligible').length,
      pendingReview: items.filter((i) => i.status === 'pending-review').length,
      belowThreshold: items.filter((i) => i.status === 'below-threshold').length,
      unavailable: items.filter((i) => i.status === 'unavailable').length,
      unknown: items.filter((i) => i.status === 'unknown').length,
    },
    staleCount: 0,
    apiCallsMade: 0,
    rateLimitRemaining: 5000,
    anomalyGuard: {
      skipped: true,
      reason: 'Baseline seed run: no prior state exists to compare',
    },
  };

  const payload = {
    criteriaVersion: CRITERIA_VERSION,
    evaluatedAt: now.toISOString(),
    runSummary,
    changes: [],
    items,
  };

  const currentPath = path.join(ROOT_DIR, 'public/data/gems.json');
  await fs.mkdir(path.dirname(currentPath), { recursive: true });
  await fs.writeFile(currentPath, JSON.stringify(payload, null, 2), 'utf-8');

  const yearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const historyPath = path.join(ROOT_DIR, `public/data/gems-history/${yearMonth}.json`);
  await fs.mkdir(path.dirname(historyPath), { recursive: true });
  await fs.writeFile(historyPath, JSON.stringify(payload, null, 2), 'utf-8');

  console.log(`Seeded baseline public/data/gems.json and ${historyPath}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
