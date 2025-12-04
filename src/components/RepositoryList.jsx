import React from 'react';
import { Star, GitFork, Bookmark, ExternalLink, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber, getRelativeTime } from '../utils/formatters';
import { SkeletonCard } from './SkeletonLoader';
import ErrorMessage from './ErrorMessage';

const RepositoryList = ({
    repositories,
    loading,
    error,
    onRetry,
    onRepoClick,
    onBookmarkToggle,
    isBookmarked,
    onLoadMore,
    hasMore
}) => {
    if (loading && (!repositories || repositories.length === 0)) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

    if (!repositories || repositories.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-slate-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No repositories found</h3>
                <p className="text-slate-400">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <AnimatePresence mode="popLayout">
                    {repositories.map((repo, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={repo.id}
                            className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-blue-500/50 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={repo.owner.avatar_url}
                                        alt={repo.owner.login}
                                        className="w-10 h-10 rounded-full border border-slate-700"
                                    />
                                    <div>
                                        <h3
                                            onClick={() => onRepoClick(repo)}
                                            className="font-semibold text-white hover:text-blue-400 cursor-pointer truncate max-w-[160px] transition-colors"
                                        >
                                            {repo.name}
                                        </h3>
                                        <p className="text-xs text-slate-400">{repo.owner.login}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onBookmarkToggle(repo);
                                    }}
                                    className={`p-2 rounded-lg transition-all duration-200 ${isBookmarked(repo.id)
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isBookmarked(repo.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <p className="text-sm text-slate-300 mb-4 line-clamp-2 min-h-[40px]">
                                {repo.description || 'No description available'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500" />
                                        {formatNumber(repo.stargazers_count)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <GitFork className="w-3 h-3 text-blue-500" />
                                        {formatNumber(repo.forks_count)}
                                    </span>
                                </div>
                                <span className="text-slate-500">{getRelativeTime(repo.updated_at)}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLoadMore}
                        className="group relative px-8 py-3 bg-slate-900/50 hover:bg-slate-800/50 text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/20 backdrop-blur-md overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-3">
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Loading Repositories...</span>
                                </>
                            ) : (
                                <>
                                    <span>View More Repositories</span>
                                    <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </motion.button>
                </div>
            )}
        </>
    );
};

export default RepositoryList;
