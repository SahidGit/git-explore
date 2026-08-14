import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Download, X, Star, GitFork, FileText } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { formatNumber } from '../../utils/formatters';
import { Link } from 'react-router-dom';

// ─── Language color map (mini) ────────────────────────
const LANG_COLORS = {
    JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5',
    Java: '#B07219', Go: '#00ADD8', Rust: '#DEA584', 'C++': '#F34B7D',
    'C#': '#178600', PHP: '#4F5D95', Ruby: '#CC342D', Swift: '#F05138',
};
const getLangColor = (lang) => LANG_COLORS[lang] || '#71717A';

// ─── Empty state ──────────────────────────────────────
const EmptyBookmarks = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
        {/* Terminal-style prompt */}
        <div className="mb-6 font-mono text-[13px] text-left bg-[#0E0E10] border border-white/[0.06] rounded-xl px-5 py-4 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="ml-1 text-[10px] text-zinc-600">~ /bookmarks</span>
            </div>
            <p className="text-zinc-500 mb-1.5">
                <span className="text-emerald-400/70">❯</span>{' '}
                <span className="text-zinc-400">git-explorer bookmarks --list</span>
            </p>
            <p className="text-zinc-600">0 records found in local storage.</p>
        </div>

        <h3 className="text-sm font-semibold text-white mb-2">No bookmarks yet</h3>
        <p className="text-[13px] text-zinc-500 max-w-xs mb-6 leading-relaxed">
            Bookmark repositories from the Explore tab to save them here for quick access.
        </p>

        <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-[#E4E4E7] transition-colors duration-200 active:scale-[0.98]"
        >
            Explore Trending Repos
        </Link>
    </div>
);

// ─── Bookmark card ────────────────────────────────────
const BookmarkCard = ({ repo, onRepoClick, onRemove }) => {
    const note = storageService.getNote(repo.id);
    const langColor = getLangColor(repo.language);

    return (
        <article
            className="group flex flex-col bg-[#121215] border border-white/[0.08] rounded-xl p-5 hover:border-white/20 hover:bg-white/[0.015] transition-all duration-200 cursor-pointer h-full"
            onClick={() => onRepoClick(repo)}
            aria-label={`${repo.owner?.login}/${repo.name}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <img
                        src={repo.owner?.avatar_url}
                        alt={repo.owner?.login}
                        loading="lazy"
                        className="w-7 h-7 rounded-md border border-white/[0.08] flex-shrink-0 bg-[#0A0A0C]"
                    />
                    <div className="min-w-0">
                        <p className="font-mono text-[10px] text-zinc-600 truncate leading-none mb-0.5">
                            {repo.owner?.login}
                        </p>
                        <h3 className="font-mono text-[13px] font-semibold text-white tracking-tight truncate">
                            {repo.name}
                        </h3>
                    </div>
                </div>

                {/* Remove button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(repo); }}
                    className="flex-shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                    aria-label={`Remove ${repo.name} from bookmarks`}
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Description */}
            <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-2 flex-1 mb-3 min-h-[36px]">
                {repo.description || <span className="text-zinc-600 italic">No description provided.</span>}
            </p>

            {/* Note (if any) */}
            {note && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-1.5 mb-1">
                        <FileText className="w-3 h-3 text-zinc-600" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Note</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 italic">&ldquo;{note}&rdquo;</p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                {repo.language && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: langColor }} />
                        {repo.language}
                    </span>
                )}
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                    <Star className="w-3 h-3" strokeWidth={1.5} />
                    {formatNumber(repo.stargazers_count)}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                    <GitFork className="w-3 h-3" strokeWidth={1.5} />
                    {formatNumber(repo.forks_count)}
                </span>
            </div>
        </article>
    );
};

// ─── BookmarksPanel ───────────────────────────────────
const BookmarksPanel = ({ onRepoSelect, onBookmarkToggle }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const loadBookmarks = useCallback(() => {
        setBookmarks(storageService.getBookmarks());
    }, []);

    useEffect(() => { loadBookmarks(); }, [loadBookmarks]);

    const handleRemove = useCallback((repo) => {
        onBookmarkToggle(repo);
        setBookmarks((prev) => prev.filter((b) => b.id !== repo.id));
    }, [onBookmarkToggle]);

    const handleExportJSON = () => {
        try {
            const json = JSON.stringify(bookmarks, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gitexplorer-bookmarks-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    const handleClearAll = () => {
        if (!window.confirm(`Remove all ${bookmarks.length} bookmarks? This cannot be undone.`)) return;
        bookmarks.forEach((repo) => storageService.toggleBookmark(repo));
        setBookmarks([]);
    };

    const filtered = bookmarks.filter(
        (r) =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (bookmarks.length === 0) return <EmptyBookmarks />;

    return (
        <div className="max-w-7xl mx-auto">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-white tracking-tight">Saved Repositories</h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.04] font-mono text-xs text-zinc-400">
                        {bookmarks.length}
                    </span>
                </div>

                {/* Toolbar actions */}
                <div className="flex items-center gap-2 sm:ml-auto">
                    <button
                        id="export-bookmarks-btn"
                        onClick={handleExportJSON}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-[#121215] text-[12px] font-medium text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export JSON
                    </button>

                    <button
                        id="clear-bookmarks-btn"
                        onClick={handleClearAll}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-[#121215] text-[12px] font-medium text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-200"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All
                    </button>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="relative mb-6">
                <Search
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${searchFocused ? 'text-zinc-400' : 'text-zinc-600'}`}
                />
                <input
                    id="bookmark-search"
                    type="text"
                    placeholder="Search your bookmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full max-w-sm bg-[#121215] border rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 ${
                        searchFocused ? 'border-white/20' : 'border-white/[0.08] hover:border-white/15'
                    }`}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* No filter results */}
            {filtered.length === 0 && searchQuery && (
                <div className="py-12 text-center">
                    <p className="text-[13px] text-zinc-500">
                        No bookmarks match <span className="text-zinc-300 font-mono">&quot;{searchQuery}&quot;</span>
                    </p>
                </div>
            )}

            {/* ── Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((repo) => (
                    <BookmarkCard
                        key={repo.id}
                        repo={repo}
                        onRepoClick={onRepoSelect}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookmarksPanel;
