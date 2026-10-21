import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../storageService';

describe('storageService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('token management (in-memory only)', () => {
    it('saves and retrieves token in-memory', () => {
      storageService.saveToken(null);
      expect(storageService.getToken()).toBeNull();
      storageService.saveToken('ghp_test12345');
      expect(storageService.getToken()).toBe('ghp_test12345');
      // Verify nothing is written to web storage
      expect(sessionStorage.getItem('gitexplorer_token')).toBeNull();
      expect(localStorage.getItem('gitexplorer_token')).toBeNull();
    });

    it('clears in-memory token on null or empty save', () => {
      storageService.saveToken('ghp_test12345');
      storageService.saveToken(null);
      expect(storageService.getToken()).toBeNull();
    });

    it('purges legacy localStorage and sessionStorage tokens during saveToken', () => {
      localStorage.setItem('gitexplorer_token', 'ghp_legacy_token');
      sessionStorage.setItem('gitexplorer_token', 'ghp_session_token');

      storageService.saveToken('ghp_new_in_memory_token');

      expect(storageService.getToken()).toBe('ghp_new_in_memory_token');
      expect(localStorage.getItem('gitexplorer_token')).toBeNull();
      expect(sessionStorage.getItem('gitexplorer_token')).toBeNull();
    });
  });

  describe('bookmarks management (localStorage)', () => {
    it('toggles bookmarks correctly', () => {
      const sampleRepo = { id: 101, name: 'react', full_name: 'facebook/react' };
      
      expect(storageService.isBookmarked(101)).toBe(false);
      storageService.toggleBookmark(sampleRepo);
      expect(storageService.isBookmarked(101)).toBe(true);
      expect(storageService.getBookmarks()).toHaveLength(1);

      // Toggle off
      storageService.toggleBookmark(sampleRepo);
      expect(storageService.isBookmarked(101)).toBe(false);
      expect(storageService.getBookmarks()).toHaveLength(0);
    });
  });

  describe('notes management', () => {
    it('saves and reads notes by repoId', () => {
      expect(storageService.getNote(202)).toBe('');
      storageService.saveNote(202, 'Great state management architecture.');
      expect(storageService.getNote(202)).toBe('Great state management architecture.');
    });
  });

  describe('release radar (followed releases)', () => {
    it('toggles following releases and checks follow status', () => {
      const sample = { id: 501, name: 'vllm-project/vllm', full_name: 'vllm-project/vllm' };
      expect(storageService.isFollowingRelease('vllm-project/vllm')).toBe(false);

      storageService.toggleFollowRelease(sample);
      expect(storageService.isFollowingRelease('vllm-project/vllm')).toBe(true);
      expect(storageService.getFollowedReleases()).toHaveLength(1);

      // Unfollow
      storageService.toggleFollowRelease(sample);
      expect(storageService.isFollowingRelease('vllm-project/vllm')).toBe(false);
      expect(storageService.getFollowedReleases()).toHaveLength(0);
    });
  });

  describe('change watch (device-local star observation)', () => {
    it('adds repository to change watch with initial star count', () => {
      const sample = { id: 601, name: 'astral-sh/uv', full_name: 'astral-sh/uv', stargazers_count: 42000 };
      storageService.addToChangeWatch(sample, 42000);

      expect(storageService.isInChangeWatch('astral-sh/uv')).toBe(true);
      const list = storageService.getChangeWatchRepos();
      expect(list).toHaveLength(1);
      expect(list[0].firstObservedStars).toBe(42000);
      expect(list[0].lastCheckedStars).toBe(42000);
    });

    it('records subsequent star observation and updates delta telemetry', () => {
      const sample = { id: 601, name: 'astral-sh/uv', full_name: 'astral-sh/uv' };
      storageService.addToChangeWatch(sample, 42000);
      storageService.recordChangeWatchObservation('astral-sh/uv', 42150);

      const list = storageService.getChangeWatchRepos();
      expect(list[0].firstObservedStars).toBe(42000);
      expect(list[0].lastCheckedStars).toBe(42150);
      expect(list[0].observations).toHaveLength(2);
    });

    it('removes repository from change watch', () => {
      const sample = { id: 601, name: 'astral-sh/uv', full_name: 'astral-sh/uv' };
      storageService.addToChangeWatch(sample, 42000);
      storageService.removeFromChangeWatch('astral-sh/uv');

      expect(storageService.isInChangeWatch('astral-sh/uv')).toBe(false);
      expect(storageService.getChangeWatchRepos()).toHaveLength(0);
    });
  });
});

