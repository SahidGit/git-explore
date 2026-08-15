import React, { useState } from 'react';
import { Star, GitFork, Bookmark, Share2 } from 'lucide-react';
import { formatNumber, getRelativeTime } from '../../../utils/formatters';
import ShareRepoModal from './ShareRepoModal';

// ─── Language color map (subset) ─────────────────────
const LANG_COLORS = {
    JavaScript:  '#F7DF1E',
    TypeScript:  '#3178C6',
    Python:      '#3572A5',
    Java:        '#B07219',
    Go:          '#00ADD8',
    Rust:        '#DEA584',
    'C++':       '#F34B7D',
    'C#':        '#178600',
    PHP:         '#4F5D95',
    Ruby:        '#CC342D',
    Swift:       '#F05138',
    Kotlin:      '#A97BFF',
    Dart:        '#00B4AB',
    Scala:       '#C22D40',
    Haskell:     '#5E5086',
    Elixir:      '#6E4A7E',
    Zig:         '#EC915C',
    CSS:         '#563D7C',
    HTML:        '#E34C26',
    Shell:       '#89E051',
    Vue:         '#41B883',
};

const getLangColor = (lang) => LANG_COLORS[lang] || '#71717A';

// ─── RepoCard ─────────────────────────────────────────
const RepoCard = ({ repo, onRepoClick, onBookmarkToggle, isBookmarked }) => {
    const [showShareModal, setShowShareModal] = useState(false);

    if (!repo) return null;

    const langColor = getLangColor(repo.language);
    const relativeTime = getRelativeTime(repo.updated_at);
    const ownerLogin = repo.owner?.login ?? 'unknown';
    const avatarUrl = repo.owner?.avatar_url;

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onBookmarkToggle(repo);
    };

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowShareModal(true);
    };

    const handleCardClick = () => {
        if (typeof onRepoClick === 'function') onRepoClick(repo);
    };

    return (
        <>
            <article
                className="group relative flex flex-col bg-[#121215] border border-white/[0.08] rounded-xl p-5 hover:border-white/20 hover:bg-white/[0.015] transition-all duration-200 cursor-pointer h-full"
                onClick={handleCardClick}
                aria-label={`${ownerLogin}/${repo.name}`}
            >
                {/* ── Header row ── */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Owner avatar */}
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={ownerLogin}
                                loading="lazy"
                                onError={(e) => { e.target.src = 'https://github.com/github.png'; }}
                                className="w-7 h-7 rounded-md border border-white/[0.08] flex-shrink-0 bg-[#0A0A0C]"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-md border border-white/[0.08] bg-white/[0.04] flex-shrink-0" />
                        )}

                        {/* Owner + Repo name */}
                        <div className="min-w-0">
                            <p className="text-[11px] font-mono text-zinc-600 truncate leading-none mb-0.5">
                                {ownerLogin}
                            </p>
                            <h3 className="font-mono text-[13px] font-semibold text-white tracking-tight truncate leading-tight group-hover:text-white transition-colors duration-200">
                                {repo.name}
                            </h3>
                        </div>
                    </div>

                    {/* Action buttons (Share & Bookmark) */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={handleShare}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                            aria-label={`Share ${repo.name}`}
                            title="Share Repository"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={handleBookmark}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                                isBookmarked
                                    ? 'text-white bg-white/[0.08] hover:bg-white/[0.12]'
                                    : 'text-zinc-600 hover:text-white hover:bg-white/[0.06]'
                            }`}
                            aria-label={isBookmarked ? `Remove ${repo.name} from bookmarks` : `Bookmark ${repo.name}`}
                            aria-pressed={isBookmarked}
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Repository'}
                        >
                            <Bookmark
                                className="w-3.5 h-3.5 transition-all duration-200"
                                fill={isBookmarked ? 'currentColor' : 'none'}
                            />
                        </button>
                    </div>
                </div>

                {/* ── Description ── */}
                <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-2 flex-1 mb-4 min-h-[36px]">
                    {repo.description || (
                        <span className="text-zinc-600 italic">No description provided.</span>
                    )}
                </p>

                {/* ── Footer row ── */}
                <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.06] mt-auto gap-2 flex-wrap">
                    {/* Left: language + star + fork */}
                    <div className="flex items-center gap-3 min-w-0">
                        {repo.language && (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-300 flex-shrink-0">
                                <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: langColor }}
                                />
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

                    {/* Right: timestamp */}
                    <span className="font-mono text-[10px] text-zinc-600 flex-shrink-0 whitespace-nowrap">
                        {relativeTime}
                    </span>
                </div>
            </article>

            {/* Share Modal Trigger */}
            {showShareModal && (
                <ShareRepoModal repo={repo} onClose={() => setShowShareModal(false)} />
            )}
        </>
    );
};

export default RepoCard;
