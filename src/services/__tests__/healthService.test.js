import { describe, it, expect } from 'vitest';
import { calculateRepoHealth } from '../healthService';

describe('calculateRepoHealth', () => {
  it('returns N/A and null totalScore when repo metadata is not provided', () => {
    const result = calculateRepoHealth(null);
    expect(result.totalScore).toBeNull();
    expect(result.grade).toBe('N/A');
    expect(result.findings).toContain('No repository metadata available to evaluate');
  });

  it('calculates health score accurately for an active MIT repository', () => {
    const mockRepo = {
      id: 1,
      name: 'awesome-tool',
      stargazers_count: 15000,
      forks_count: 1200,
      open_issues_count: 5,
      license: { spdx_id: 'MIT' },
    };
    const mockDetails = {
      license: { spdx_id: 'MIT' },
      contributors: new Array(8).fill({ id: 1 }),
    };
    const mockActivity = new Array(12).fill({ total: 15 });
    const mockIssueStats = { open: 5, closed: 45 };

    const result = calculateRepoHealth(mockRepo, mockDetails, mockActivity, mockIssueStats);

    expect(result.totalScore).toBeGreaterThanOrEqual(90);
    expect(['A+', 'A']).toContain(result.grade);
    expect(result.licenseScore).toBe(25);
    expect(result.commitScore).toBe(25);
    expect(result.issueScore).toBe(25);
  });

  it('handles unavailable activity (null) without scoring it as inactivity penalty', () => {
    const mockRepo = {
      id: 1,
      name: 'computing-stats-tool',
      stargazers_count: 15000,
      forks_count: 1200,
      open_issues_count: 5,
      license: { spdx_id: 'MIT' },
    };
    const mockDetails = {
      license: { spdx_id: 'MIT' },
      contributors: new Array(8).fill({ id: 1 }),
    };
    const mockIssueStats = { open: 5, closed: 45 };

    // When activity is null (HTTP 202 or fetch failure)
    const result = calculateRepoHealth(mockRepo, mockDetails, null, mockIssueStats);

    expect(result.commitScore).toBeNull();
    expect(result.findings).toContain('Commit Rhythm: Currently computing / unavailable on GitHub');
    // Total score is calculated proportionally from remaining 3 pillars (75 max)
    // License: 25, Issues: 25, Community: 25 => 75/75 = 100%
    expect(result.totalScore).toBe(100);
    expect(result.grade).toBe('A+');
  });

  it('scores genuinely empty/zero activity as low/inactive recent commits', () => {
    const mockRepo = {
      id: 1,
      name: 'inactive-tool',
      stargazers_count: 15000,
      forks_count: 1200,
      open_issues_count: 5,
      license: { spdx_id: 'MIT' },
    };
    const mockDetails = {
      license: { spdx_id: 'MIT' },
      contributors: new Array(8).fill({ id: 1 }),
    };
    const mockEmptyActivity = new Array(12).fill({ total: 0 });
    const mockIssueStats = { open: 5, closed: 45 };

    const result = calculateRepoHealth(mockRepo, mockDetails, mockEmptyActivity, mockIssueStats);

    expect(result.commitScore).toBe(10);
    expect(result.findings).toContain('Low / Inactive Recent Commits');
  });
});
