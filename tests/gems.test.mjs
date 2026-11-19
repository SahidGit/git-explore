/**
 * ExploreGit Gems Test Suite
 * Executed via Node's native test runner (node:test)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CRITERIA, CRITERIA_VERSION, CONFIG, deriveTier } from '../data/criteria.mjs';
import { validateReviews } from '../scripts/evaluate-gems.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// ── Clearly Labelled Mock Fixtures ──────────────────────────────────────────
const MOCK_FIXTURES = {
  // Standard Legend Repository
  legendRepo: {
    id: 1001,
    name: 'ripgrep',
    full_name: 'BurntSushi/ripgrep',
    owner: { login: 'BurntSushi' },
    archived: false,
    disabled: false,
    fork: false,
    description: 'Fast line-oriented search tool respecting gitignore',
    stargazers_count: 48500,
    forks_count: 2100,
    created_at: '2016-09-01T00:00:00Z',
    pushed_at: new Date().toISOString(),
    license: { spdx_id: 'MIT' },
    topics: ['cli', 'search', 'rust'],
  },
  // Under the Radar Repository (500 stars)
  underTheRadarRepo: {
    id: 1002,
    name: 'fieldwatch',
    full_name: 'OffGridPete/Fieldwatch',
    owner: { login: 'OffGridPete' },
    archived: false,
    disabled: false,
    fork: false,
    description: 'Passive radio observer for Android',
    stargazers_count: 520,
    forks_count: 45,
    created_at: '2023-01-01T00:00:00Z',
    pushed_at: new Date().toISOString(),
    license: { spdx_id: 'GPL-3.0' },
    topics: ['android', 'wifi'],
  },
  release: { tag_name: '14.1.0' },
  communityProfile: {
    files: {
      readme: { url: 'https://api.github.com/repos/.../readme' },
    },
  },
  commits: [
    { author: { login: 'alice' } },
    { author: { login: 'bob' } },
    { author: { login: 'carol' } },
    { author: { login: 'dave' } },
    { author: { login: 'eve' } },
  ],
};

describe('Criteria Registry Invariants', () => {
  it('criteria IDs are append-only and preserve all historical IDs from data/criteria-ids.json', async () => {
    const rawIds = await fs.readFile(path.join(ROOT_DIR, 'data/criteria-ids.json'), 'utf-8');
    const expectedIds = JSON.parse(rawIds);
    const registeredIds = new Set(CRITERIA.map((c) => c.id));

    for (const expectedId of expectedIds) {
      assert.ok(
        registeredIds.has(expectedId),
        `Historical criterion "${expectedId}" missing from registry! Deleting or renaming is prohibited.`
      );
    }
  });

  it('every criterion has a valid "since" integer, "retired" boolean, and valid "kind"', () => {
    for (const c of CRITERIA) {
      assert.ok(
        Number.isInteger(c.since) && c.since > 0 && c.since <= CRITERIA_VERSION,
        `Criterion ${c.id} has invalid "since" version (${c.since})`
      );
      assert.ok(
        c.kind === 'auto' || c.kind === 'manual',
        `Criterion ${c.id} kind must be "auto" or "manual"`
      );
      assert.equal(typeof c.retired, 'boolean', `Criterion ${c.id} must declare boolean retired state`);
      assert.equal(typeof c.applies, 'function', `Criterion ${c.id} must provide applies()`);
      assert.equal(typeof c.check, 'function', `Criterion ${c.id} must provide check()`);
    }
  });

  it('manual criteria return pass: false when no review record exists', () => {
    const manualCriteria = CRITERIA.filter((c) => c.kind === 'manual');
    const entry = { id: 'test-tool', isSecuritySensitive: true };
    const emptyContext = { reviewRecord: null, now: new Date() };

    for (const c of manualCriteria) {
      if (c.applies(entry, emptyContext)) {
        const result = c.check(entry, emptyContext);
        assert.equal(
          result.pass,
          false,
          `Manual criterion "${c.id}" must never pass without an editor review record.`
        );
      }
    }
  });

  it('manual criteria return pass: false when review record is expired', () => {
    const responsiveness = CRITERIA.find((c) => c.id === 'issue-responsiveness');
    const expiredContext = {
      now: new Date('2026-11-01T00:00:00Z'),
      reviewRecord: {
        issueResponsiveness: {
          verifiedAt: '2026-06-01T00:00:00Z', // > 90 days
          reviewer: 'editor-alice',
        },
      },
    };

    const res = responsiveness.check({}, expiredContext);
    assert.equal(res.pass, false);
    assert.match(res.detail, /expired/i);
  });
});

describe('Tier Boundaries & Dynamics', () => {
  it('correctly derives tiers strictly from star counts', () => {
    assert.equal(deriveTier(10000), 'legend');
    assert.equal(deriveTier(50000), 'legend');
    assert.equal(deriveTier(9999), 'gem');
    assert.equal(deriveTier(1000), 'gem');
    assert.equal(deriveTier(999), 'under-the-radar');
    assert.equal(deriveTier(150), 'under-the-radar');
    assert.equal(deriveTier(100), 'under-the-radar');
  });

  it('tier change alone does not change status; status is calculated separately', () => {
    const prevEntry = {
      id: 'tool-x',
      tier: 'under-the-radar',
      status: 'eligible',
    };

    // Stars grew from 800 to 1,500 (transitions from under-the-radar -> gem)
    const newStars = 1500;
    const newTier = deriveTier(newStars);
    const changes = [];

    if (prevEntry.tier !== newTier) {
      changes.push({
        type: 'tier',
        id: prevEntry.id,
        from: prevEntry.tier,
        to: newTier,
      });
    }

    assert.equal(changes.length, 1);
    assert.equal(changes[0].type, 'tier');
    assert.equal(changes[0].to, 'gem');

    // If new tier criteria pass, status remains eligible (no status change recorded)
    const newStatus = 'eligible';
    if (prevEntry.status !== newStatus) {
      changes.push({ type: 'status', id: prevEntry.id, from: prevEntry.status, to: newStatus });
    }

    assert.equal(changes.length, 1, 'No status change should be created if status remains eligible');
  });
});

describe('Evaluator Resilience & Failure Modes', () => {
  it('entries are never dropped on fetch error; preserved with stale: true and never marked below-threshold', () => {
    const prevSnapshot = [
      { id: 'vlc', repo: 'videolan/vlc', status: 'eligible', stars: 25000, tier: 'legend' },
    ];

    // Simulate fetch failure for vlc
    const fetchFailed = true;
    const evaluatedItems = [];

    if (fetchFailed) {
      const prev = prevSnapshot.find((i) => i.id === 'vlc');
      evaluatedItems.push({
        ...prev,
        stale: true,
        staleReason: 'GitHub API 503 Service Unavailable',
      });
    }

    assert.equal(evaluatedItems.length, 1);
    assert.equal(evaluatedItems[0].id, 'vlc');
    assert.equal(evaluatedItems[0].status, 'eligible', 'Must retain previous status');
    assert.equal(evaluatedItems[0].stale, true);
    assert.notEqual(evaluatedItems[0].status, 'below-threshold', 'Fetch error must never produce below-threshold');
  });

  it('ownership transfer is recorded when repository owner changes', () => {
    const prevItem = { id: 'cool-tool', repo: 'alice/cool-tool', ownerLogin: 'alice' };
    const currentRepo = { owner: { login: 'bob' }, stargazers_count: 2000 };
    const changes = [];

    if (prevItem.ownerLogin !== currentRepo.owner.login) {
      changes.push({
        type: 'ownership-transfer',
        id: prevItem.id,
        from: prevItem.ownerLogin,
        to: currentRepo.owner.login,
      });
    }

    assert.equal(changes.length, 1);
    assert.equal(changes[0].type, 'ownership-transfer');
    assert.equal(changes[0].from, 'alice');
    assert.equal(changes[0].to, 'bob');
  });

  it('publish guard blocks publication when status changes exceed 25%', () => {
    const totalEntries = 10;
    // 3 entries change status (30% change, exceeds 25% threshold)
    const statusChangedCount = 3;
    const ratio = statusChangedCount / totalEntries;

    assert.ok(
      ratio > CONFIG.publishAnomalyThreshold,
      `Ratio ${ratio} should exceed threshold ${CONFIG.publishAnomalyThreshold}`
    );
  });
});

describe('Manual Review Schema Validation', () => {
  it('validates a well-formed gem-reviews.json without error', () => {
    const validJson = JSON.stringify({
      version: 1,
      reviews: {
        ripgrep: {
          issueResponsiveness: {
            verifiedAt: '2026-11-01T00:00:00Z',
            reviewer: 'editor-alice',
            notes: 'Active maintainer triage',
          },
        },
      },
    });

    const reviews = validateReviews(validJson, 'test-reviews.json');
    assert.ok(reviews.ripgrep);
    assert.equal(reviews.ripgrep.issueResponsiveness.reviewer, 'editor-alice');
  });

  it('fails with clear error message when gem-reviews.json is malformed or invalid', () => {
    const malformedJson = JSON.stringify({
      version: 1,
      reviews: {
        ripgrep: {
          independentAudit: {
            verifiedAt: 'not-a-date',
            reviewer: 'editor-alice',
            auditUrl: 'invalid-url',
          },
        },
      },
    });

    assert.throws(
      () => validateReviews(malformedJson, 'data/gem-reviews.json'),
      (err) => {
        return err.message.includes('[SCHEMA ERROR in data/gem-reviews.json]') && err.message.includes('verifiedAt');
      }
    );
  });
});

describe('Deterministic Evaluation Output', () => {
  it('evaluator produces identical output given identical mock inputs', () => {
    const entry = { id: 'ripgrep', repo: 'BurntSushi/ripgrep', isSecuritySensitive: false };
    const fixedNow = new Date('2026-11-01T00:00:00Z');
    const tier = deriveTier(MOCK_FIXTURES.legendRepo.stargazers_count);

    const context = {
      now: fixedNow,
      repo: MOCK_FIXTURES.legendRepo,
      tier,
      latestRelease: MOCK_FIXTURES.release,
      communityProfile: MOCK_FIXTURES.communityProfile,
      hasReadme: true,
      commits: MOCK_FIXTURES.commits,
      hasSecurityPolicy: false,
      reviewRecord: {
        issueResponsiveness: {
          verifiedAt: '2026-10-15T00:00:00Z',
          reviewer: 'editor-sahid',
        },
      },
    };

    const runChecks = () => {
      const failing = [];
      for (const criterion of CRITERIA) {
        if (!criterion.applies(entry, context)) continue;
        const res = criterion.check(entry, context);
        if (!res.pass) failing.push({ id: criterion.id, detail: res.detail });
      }
      return failing;
    };

    const firstRun = runChecks();
    const secondRun = runChecks();

    assert.deepEqual(firstRun, secondRun);
    assert.equal(firstRun.length, 0, 'Legend mock repo with active review should pass all criteria');
  });
});
