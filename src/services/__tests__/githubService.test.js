import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRepositoryActivity } from '../githubService';

describe('githubService - getRepositoryActivity', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns commit activity array when GitHub returns 200 with stats', async () => {
    const mockActivityData = [{ total: 10, week: 1700000000, days: [1, 2, 3, 4, 0, 0, 0] }];
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: { get: () => null },
      json: async () => mockActivityData,
    });

    const result = await getRepositoryActivity('facebook', 'react');
    expect(result).toEqual(mockActivityData);
  });

  it('returns null when GitHub returns 202 Accepted (computing stats in background)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 202,
      ok: true,
      headers: { get: () => null },
      json: async () => ({}),
    });

    const result = await getRepositoryActivity('facebook', 'react');
    expect(result).toBeNull();
  });

  it('returns null when the request fails or is rate limited', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await getRepositoryActivity('facebook', 'react');
    expect(result).toBeNull();
  });
});
