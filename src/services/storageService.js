const STORAGE_KEYS = {
  BOOKMARKS: "gitexplorer_bookmarks",
  NOTES: "gitexplorer_notes",
  TOKEN: "gitexplorer_token",
  FOLLOWED_RELEASES: "exploregit_followed_releases_v1",
  CHANGE_WATCH: "exploregit_change_watch_v1",
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
      localStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(newBookmarks),
      );
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
      const notes = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NOTES) || "{}",
      );
      return notes[repoId] || "";
    } catch {
      return "";
    }
  },

  saveNote: (repoId, note) => {
    try {
      const notes = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NOTES) || "{}",
      );
      notes[repoId] = note;
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch {
      // Storage access restricted
    }
  },

  // ── Release Radar (Followed Repositories for Release Tracking) ──
  getFollowedReleases: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FOLLOWED_RELEASES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleFollowRelease: (repo) => {
    const followed = storageService.getFollowedReleases();
    const repoName = repo.full_name || repo.name;
    const exists = followed.find(
      (f) => f.name === repoName || f.id === repo.id,
    );

    let updated;
    if (exists) {
      updated = followed.filter((f) => f.name !== repoName && f.id !== repo.id);
    } else {
      const [ownerLogin, repoShortName] = repoName.includes("/")
        ? repoName.split("/")
        : [repo.owner?.login || "", repo.name];
      updated = [
        ...followed,
        {
          id: repo.id || repoName,
          name: repoName,
          owner: ownerLogin || repo.owner?.login,
          repo: repoShortName || repo.name,
          html_url: repo.html_url || `https://github.com/${repoName}`,
          description: repo.description || "",
          followedAt: Date.now(),
        },
      ];
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.FOLLOWED_RELEASES,
        JSON.stringify(updated),
      );
    } catch {
      // Storage access restricted
    }
    return updated;
  },

  isFollowingRelease: (repoNameOrId) => {
    const followed = storageService.getFollowedReleases();
    return followed.some(
      (f) => f.id === repoNameOrId || f.name === repoNameOrId,
    );
  },

  // ── Repository Change Watch (Device-Local Star Observation) ──
  getChangeWatchRepos: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHANGE_WATCH);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addToChangeWatch: (repo, currentStars = 0) => {
    const list = storageService.getChangeWatchRepos();
    const repoName = repo.full_name || repo.name;
    const existingIndex = list.findIndex(
      (item) => item.name === repoName || item.id === repo.id,
    );
    const now = Date.now();
    const numericStars = Number(currentStars) || repo.stargazers_count || 0;

    let updated;
    if (existingIndex >= 0) {
      // Update last checked
      const existing = list[existingIndex];
      const observations = Array.isArray(existing.observations)
        ? existing.observations
        : [];
      updated = [...list];
      updated[existingIndex] = {
        ...existing,
        lastCheckedStars: numericStars,
        lastCheckedAt: now,
        observations: [
          ...observations,
          { stars: numericStars, timestamp: now },
        ].slice(-20), // retain last 20 observations
      };
    } else {
      const [ownerLogin, repoShortName] = repoName.includes("/")
        ? repoName.split("/")
        : [repo.owner?.login || "", repo.name];
      updated = [
        ...list,
        {
          id: repo.id || repoName,
          name: repoName,
          owner: ownerLogin || repo.owner?.login,
          repo: repoShortName || repo.name,
          html_url: repo.html_url || `https://github.com/${repoName}`,
          description: repo.description || "",
          language: repo.language || "",
          firstObservedStars: numericStars,
          firstObservedAt: now,
          lastCheckedStars: numericStars,
          lastCheckedAt: now,
          observations: [{ stars: numericStars, timestamp: now }],
        },
      ];
    }

    try {
      localStorage.setItem(STORAGE_KEYS.CHANGE_WATCH, JSON.stringify(updated));
    } catch {
      // Storage access restricted
    }
    return updated;
  },

  recordChangeWatchObservation: (repoNameOrId, currentStars) => {
    const list = storageService.getChangeWatchRepos();
    const numericStars = Number(currentStars);
    if (isNaN(numericStars)) return list;

    const updated = list.map((item) => {
      if (item.name === repoNameOrId || item.id === repoNameOrId) {
        const observations = Array.isArray(item.observations)
          ? item.observations
          : [];
        return {
          ...item,
          lastCheckedStars: numericStars,
          lastCheckedAt: Date.now(),
          observations: [
            ...observations,
            { stars: numericStars, timestamp: Date.now() },
          ].slice(-20),
        };
      }
      return item;
    });

    try {
      localStorage.setItem(STORAGE_KEYS.CHANGE_WATCH, JSON.stringify(updated));
    } catch {
      // Storage access restricted
    }
    return updated;
  },

  removeFromChangeWatch: (repoNameOrId) => {
    const list = storageService.getChangeWatchRepos();
    const updated = list.filter(
      (item) => item.name !== repoNameOrId && item.id !== repoNameOrId,
    );
    try {
      localStorage.setItem(STORAGE_KEYS.CHANGE_WATCH, JSON.stringify(updated));
    } catch {
      // Storage access restricted
    }
    return updated;
  },

  isInChangeWatch: (repoNameOrId) => {
    const list = storageService.getChangeWatchRepos();
    return list.some(
      (item) => item.name === repoNameOrId || item.id === repoNameOrId,
    );
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
