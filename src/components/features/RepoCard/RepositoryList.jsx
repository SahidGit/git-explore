import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import RepoCard from './RepoCard';
import ErrorMessage from '../../ui/ErrorMessage';

// ─── Skeleton card ────────────────────────────────────
const SkeletonCard = () => (
    <div className="flex flex-col bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 animate-pulse h-44">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-md bg-white/[0.06] flex-shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-2 w-16 rounded-full bg-white/[0.05]" />
                <div className="h-3 w-28 rounded-full bg-white/[0.07]" />
            </div>
        </div>
        {/* Description lines */}
        <div className="space-y-2 flex-1 mb-4">
            <div className="h-2.5 w-full rounded-full bg-white/[0.05]" />
            <div className="h-2.5 w-4/5 rounded-full bg-white/[0.04]" />
        </div>
        {/* Footer */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
            <div className="h-2 w-14 rounded-full bg-white/[0.05]" />
            <div className="h-2 w-10 rounded-full bg-white/[0.04]" />
            <div className="h-2 w-10 rounded-full bg-white/[0.04]" />
            <div className="h-2 w-12 rounded-full bg-white/[0.03] ml-auto" />
        </div>
    </div>
);

// ─── Empty state ──────────────────────────────────────
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
            <Search className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-semibold text-white mb-2">No repositories found</h3>
        <p className="text-[13px] text-zinc-500 max-w-xs">
            Try adjusting your search query or filter criteria to find what you&apos;re looking for.
        </p>
    </div>
);

// ─── RepositoryList ───────────────────────────────────
const RepositoryList = ({
    repositories,
    loading,
    error,
    onRetry,
    onRepoClick,
    onLoadMore,
    hasMore,
    bookmarkedIds,
    onBookmarkToggle,
}) => {
    // Loading — initial fetch (empty list)
    if (loading && (!repositories || repositories.length === 0)) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" aria-busy="true" aria-label="Loading repositories">
                {[...Array(9)].map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

    if (!repositories || repositories.length === 0) return <EmptyState />;

    return (
        <section aria-label="Repository results">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {repositories.map((repo) => (
                    <RepoCard
                        key={repo.id}
                        repo={repo}
                        onRepoClick={onRepoClick}
                        onBookmarkToggle={onBookmarkToggle}
                        isBookmarked={bookmarkedIds?.has(repo.id) ?? false}
                    />
                ))}
                {/* Inline skeleton cards appended during "load more" */}
                {loading && [...Array(3)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
            </div>

            {/* Load more */}
            {hasMore && !loading && (
                <div className="flex justify-center mt-2 mb-8">
                    <button
                        id="load-more-btn"
                        onClick={onLoadMore}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] bg-[#121215] text-[13px] font-medium text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200"
                    >
                        Load more repositories
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-y-0.5 transition-all duration-200" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default RepositoryList;
