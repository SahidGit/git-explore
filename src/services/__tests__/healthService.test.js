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
});
