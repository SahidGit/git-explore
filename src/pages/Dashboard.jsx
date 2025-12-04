import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import FilterPanel from '../components/FilterPanel';
import RepositoryList from '../components/RepositoryList';
import BookmarksPanel from '../components/BookmarksPanel';
import RepositoryDetail from '../components/RepositoryDetail';
import * as githubService from '../services/githubService';
import { storageService } from '../services/storageService';
import ContributionHeatmap from '../components/ContributionHeatmap';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard = ({ onBack, initialTab = 'explore', onNavigate }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [filters, setFilters] = useState({
        query: '',
        language: '',
        sort: 'stars',
        since: 'daily'
    });

    const [page, setPage] = useState(1);

    const [bookmarkedIds, setBookmarkedIds] = useState(new Set(storageService.getBookmarks().map(b => b.id)));

    useEffect(() => {
        if (activeTab === 'explore') {
            setPage(1); // Reset page on filter change
            fetchRepositories(1);
        }
    }, [filters, activeTab]);

    const fetchRepositories = async (pageNum = 1) => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (filters.query) {
                data = await githubService.searchRepositories({
                    query: filters.query,
                    sort: filters.sort,
                    language: filters.language,
                    page: pageNum
                });
            } else {
                data = await githubService.getTrendingRepositories(filters.language, filters.since, pageNum);
            }

            if (pageNum === 1) {
                setRepositories(data.items || []);
            } else {
                setRepositories(prev => [...prev, ...(data.items || [])]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRepositories(nextPage);
    };

    const handleBookmarkToggle = (repo) => {
        storageService.toggleBookmark(repo);
        setBookmarkedIds(prev => {
            const next = new Set(prev);
            if (next.has(repo.id)) {
                next.delete(repo.id);
            } else {
                next.add(repo.id);
            }
            return next;
        });
    };

    const handleTokenSave = (token) => {
        storageService.saveToken(token);
        // Optionally reload or show success message
    };

    return (
        <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
            <Header
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onTokenSave={handleTokenSave}
                onNavigate={onNavigate}
                showBackButton={true}
            />

            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {activeTab === 'explore' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Explore Repositories</h1>
                            <p className="text-slate-400">Discover trending projects and popular codebases.</p>
                        </div>

                        <FilterPanel filters={filters} onFilterChange={setFilters} />

                        <RepositoryList
                            repositories={repositories}
                            loading={loading}
                            error={error}
                            onRetry={fetchRepositories}
                            onRepoClick={(repo) => {
                                setSelectedRepo(repo);
                            }}
                            onBookmarkToggle={handleBookmarkToggle}
                            isBookmarked={(id) => bookmarkedIds.has(id)}
                            onLoadMore={handleLoadMore}
                            hasMore={repositories.length > 0 && repositories.length % 30 === 0}
                        />


                    </>
                )}

                {activeTab === 'bookmarks' && (
                    <BookmarksPanel
                        onRepoClick={setSelectedRepo}
                        onBookmarkToggle={handleBookmarkToggle}
                    />
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Developer Profile</h1>
                            <p className="text-slate-400">Analyze contribution activity and coding habits.</p>
                        </div>

                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Enter GitHub username..."
                                className="w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setFilters(prev => ({ ...prev, username: e.target.value }));
                                    }
                                }}
                                defaultValue={filters.username || ''}
                            />
                            <p className="text-xs text-slate-500 mt-2">Press Enter to search</p>
                        </div>

                        {filters.username && (
                            <div className="space-y-6">
                                <ErrorBoundary>
                                    <ContributionHeatmap username={filters.username} />
                                </ErrorBoundary>
                            </div>
                        )}

                        {!filters.username && (
                            <div className="text-center py-20 text-slate-500">
                                <p>Enter a username to view contributions.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {selectedRepo && (
                <RepositoryDetail
                    repo={selectedRepo}
                    onClose={() => setSelectedRepo(null)}
                    onBookmarkToggle={handleBookmarkToggle}
                    isBookmarked={bookmarkedIds.has(selectedRepo.id)}
                />
            )}
        </div>
    );
};

export default Dashboard;
