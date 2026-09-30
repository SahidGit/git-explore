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
            return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
        } catch {
            return null;
        }
    },

    saveToken: (token) => {
        try {
            if (token) {
                sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
            } else {
                sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
            }
        } catch {
            // Storage access restricted / private browsing fallback
        }
    },
};
