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
});
