const STORAGE_KEYS = {
    BOOKMARKS: 'gitexplorer_bookmarks',
    NOTES: 'gitexplorer_notes',
    TOKEN: 'gitexplorer_token',
};

// In-memory token storage — never written to sessionStorage or localStorage to prevent XSS credential extraction
let _inMemoryToken = null;

export const storageService = {
    // Bookmarks
    getBookmarks: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    },

    toggleBookmark: (repo) => {
        const bookmarks = storageService.getBookmarks();
        const exists = bookmarks.find((b) => b.id === repo.id);

        let newBookmarks;
        if (exists) {
            newBookmarks = bookmarks.filter((b) => b.id !== repo.id);
        } else {
            newBookmarks = [...bookmarks, repo];
        }

        try {
            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
        } catch {
            // Storage access restricted
        }
        return newBookmarks;
    },

    isBookmarked: (repoId) => {
        const bookmarks = storageService.getBookmarks();
        return bookmarks.some((b) => b.id === repoId);
    },

    // Notes
    getNote: (repoId) => {
        try {
            const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}');
            return notes[repoId] || '';
        } catch {
            return '';
        }
    },

    saveNote: (repoId, note) => {
        try {
            const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}');
            notes[repoId] = note;
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        } catch {
            // Storage access restricted
        }
    },

    // Token (In-memory only — never written to web storage; cleared on page reload)
    getToken: () => {
        return _inMemoryToken;
    },

    saveToken: (token) => {
        _inMemoryToken = token ? token.trim() : null;

        // Clean any legacy persistent storage keys so no plain-text tokens remain in browser storage
        try {
            sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        } catch {
            // sessionStorage access restricted
        }
        try {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
        } catch {
            // localStorage access restricted
        }
    },
};
