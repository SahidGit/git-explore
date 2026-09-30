const STORAGE_KEYS = {
    BOOKMARKS: 'gitexplorer_bookmarks',
    NOTES: 'gitexplorer_notes',
    TOKEN: 'gitexplorer_token',
};

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

        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
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
        const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}');
        notes[repoId] = note;
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    },

    // Token (Stored in sessionStorage only — never persisted beyond tab session)
    getToken: () => {
        try {
            const sessionToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
            if (sessionToken) return sessionToken;
        } catch {
            // sessionStorage restricted
        }

        // Migrate legacy localStorage token if present, then clear from localStorage
        try {
            const legacyToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (legacyToken) {
                try {
                    sessionStorage.setItem(STORAGE_KEYS.TOKEN, legacyToken);
                } catch {
                    // sessionStorage restricted
                }
                try {
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                } catch {
                    // localStorage restricted
                }
                return legacyToken;
            }
        } catch {
            // localStorage restricted
        }

        return null;
    },

    saveToken: (token) => {
        // 1. Session storage update
        try {
            if (token) {
                sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
            } else {
                sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
            }
        } catch {
            // Storage access restricted / private browsing fallback
        }

        // 2. Isolate legacy localStorage cleanup so access restrictions cannot prevent sessionStorage cleanup
        try {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
        } catch {
            // localStorage access restricted
        }
    },
};
