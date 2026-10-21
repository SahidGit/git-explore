import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as githubService from '../githubService';

describe('Discovery Services Data Flow & Integrity', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getLatestRelease', () => {
    it('returns null when a repository has no releases (404 status)', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers(),
        json: async () => ({ message: 'Not Found' }),
      });

      const release = await githubService.getLatestRelease('owner', 'no-releases-repo');
      expect(release).toBeNull();
    });

    it('returns formatted release object when published', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          id: 1234,
          name: 'v1.2.0 Production',
          tag_name: 'v1.2.0',
          published_at: '2026-10-15T12:00:00Z',
          html_url: 'https://github.com/astral-sh/uv/releases/tag/v1.2.0',
          body: 'Changelog notes',
          author: { login: 'charliermarsh', avatar_url: 'https://avatar' },
        }),
      });

      const release = await githubService.getLatestRelease('astral-sh', 'uv');
      expect(release).not.toBeNull();
      expect(release.tagName).toBe('v1.2.0');
      expect(release.htmlUrl).toBe('https://github.com/astral-sh/uv/releases/tag/v1.2.0');
      expect(release.fetchedAt).toBeDefined();
    });
  });

  describe('getWhatChangedDigest', () => {
    it('summarizes verifiable commits, releases, and merged PRs without fabrication', async () => {
      vi.spyOn(global, 'fetch')
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => [
            {
              sha: 'abc123456789',
              commit: { message: 'feat: add zero-copy linking', author: { name: 'Alice', date: '2026-10-10' } },
              html_url: 'https://github.com/commit/abc',
            },
          ],
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => [
            {
              id: 99,
              name: 'v0.4.0',
              tag_name: 'v0.4.0',
              published_at: '2026-10-12T00:00:00Z',
              html_url: 'https://github.com/release/v0.4.0',
            },
          ],
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            items: [
              {
                id: 888,
                number: 42,
                title: 'perf: accelerate AST resolver',
                html_url: 'https://github.com/pull/42',
                closed_at: '2026-10-11T00:00:00Z',
                user: { login: 'bob' },
              },
            ],
          }),
        });

      const digest = await githubService.getWhatChangedDigest('astral-sh', 'uv', 30);
      expect(digest.commits).toHaveLength(1);
      expect(digest.commits[0].sha).toBe('abc1234');
      expect(digest.releases).toHaveLength(1);
      expect(digest.mergedPRs).toHaveLength(1);
      expect(digest.fetchedAt).toBeDefined();
    });
  });

  describe('getRepositoryAlternatives', () => {
    it('explains match reasons using shared primary language and topics', async () => {
      const mockRepo = {
        name: 'uv',
        full_name: 'astral-sh/uv',
        language: 'Rust',
        topics: ['package-manager', 'python', 'cli'],
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          items: [
            {
              full_name: 'astral-sh/uv', // will be excluded
              name: 'uv',
            },
            {
              full_name: 'biomejs/biome',
              name: 'biome',
              language: 'Rust',
              topics: ['cli', 'linter', 'typescript'],
              stargazers_count: 16800,
            },
          ],
        }),
      });

      const alternatives = await githubService.getRepositoryAlternatives(mockRepo);
      expect(alternatives.items).toHaveLength(1);
      const alt = alternatives.items[0];
      expect(alt.name).toBe('biome');
      expect(alt.matchReason).toContain('primary language Rust');
      expect(alt.matchReason).toContain('topic #cli');
      // Must not invent arbitrary score
      expect(alt.similarityScore).toBeUndefined();
    });
  });

  describe('getDependencyFootprint', () => {
    it('parses dependencies from package.json and provides registry links', async () => {
      const mockPackageJson = JSON.stringify({
        name: 'test-app',
        dependencies: {
          react: '^18.3.1',
          'lucide-react': '^0.395.0',
        },
        devDependencies: {
          vite: '^5.4.0',
        },
      });

      const base64Content = Buffer.from(mockPackageJson).toString('base64');

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          content: base64Content,
          html_url: 'https://github.com/owner/repo/blob/HEAD/package.json',
        }),
      });

      const footprint = await githubService.getDependencyFootprint('owner', 'repo');
      expect(footprint.manifestFound).toBe(true);
      expect(footprint.manifestPath).toBe('package.json');
      expect(footprint.ecosystem).toBe('npm');
      expect(footprint.dependencies).toHaveLength(2);
      expect(footprint.devDependencies).toHaveLength(1);
      expect(footprint.dependencies[0].url).toContain('npmjs.com/package/react');
      expect(footprint.scanTime).toBeDefined();
    });

    it('reports missing/unsupported manifests cleanly when none are found', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers(),
        json: async () => ({ message: 'Not Found' }),
      });

      const footprint = await githubService.getDependencyFootprint('unknown', 'repo');
      expect(footprint.manifestFound).toBe(false);
      expect(footprint.error).toContain('No supported package manifest detected');
      expect(footprint.scanTime).toBeDefined();
    });
  });
});
