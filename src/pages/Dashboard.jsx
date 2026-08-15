import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import FilterPanel from '../components/features/FilterPanel';
import RepositoryList from '../components/features/RepoCard/RepositoryList';
import BookmarksPanel from '../components/features/BookmarksPanel';
import ProfileView from '../components/features/ProfileView';
import RepositoryDetail from '../components/features/RepoCard/RepositoryDetail';
import TopFiveFeatured from '../components/features/RepoCard/TopFiveFeatured';
import * as githubService from '../services/githubService';
import { storageService } from '../services/storageService';
import ContributionHeatmap from '../components/features/Charts/ContributionHeatmap';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import ErrorMessage from '../components/ui/ErrorMessage';
import BackToTop from '../components/ui/BackToTop';

const Dashboard = ({ activeTab }) => {
    const [searchParams] = useSearchParams();

    const [repositories, setRepositories] = useState([]);
    const [monthlyTopRepos, setMonthlyTopRepos] = useState([]);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [isFallback, setIsFallback] = useState(false);

    const [filters, setFilters] = useState(() => ({
        query: searchParams.get('query') || '',
        language: searchParams.get('language') || '',
        sort: searchParams.get('sort') || 'stars',
        since: searchParams.get('since') || 'daily'
    }));

    // Keep filters in sync when URL search params change
    useEffect(() => {
        const q = searchParams.get('query') || '';
        const lang = searchParams.get('language') || '';
        if (q || lang) {
            setFilters(prev => ({
                ...prev,
                query: q || prev.query,
                language: lang || prev.language
            }));
        }
    }, [searchParams]);

    const [page, setPage] = useState(1);
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set(storageService.getBookmarks().map(b => b.id)));

    // Fetch Monthly Top 5 Hot Repositories
    useEffect(() => {
        if (activeTab === 'explore') {
            setMonthlyLoading(true);
            githubService.getMonthlyTopRepositories()
                .then((items) => setMonthlyTopRepos(items))
                .catch(() => setMonthlyTopRepos([]))
                .finally(() => setMonthlyLoading(false));
        }
    }, [activeTab]);

    const fetchRepositories = useCallback(async (pageNum = 1) => {
        setLoading(true);
        setError(null);
        setIsFallback(false);
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

            if (data.isFallback) setIsFallback(true);

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
    }, [filters]);

    useEffect(() => {
        if (activeTab === 'explore') {
            setPage(1); // Reset page on filter change
            fetchRepositories(1);
        }
    }, [filters, activeTab, fetchRepositories]);

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
    };

    const getSEOProps = () => {
        switch (activeTab) {
            case 'bookmarks': return {
                title: 'Bookmarks — GitExplorer',
                description: 'Your curated collection of repositories. Stored locally, private by default.',
                canonical: 'https://git-explore-one.vercel.app/bookmarks'
            };
            case 'profile': return {
                title: 'Developer Profile — GitExplorer',
                description: 'Analyze GitHub contributor profiles with activity heatmaps and contribution history.',
                canonical: 'https://git-explore-one.vercel.app/profile'
            };
            default: return {
                title: 'Explore Repositories — GitExplorer',
                description: 'Discover trending open-source repositories by language, time window, and momentum. Raw GitHub data, structured into signal.',
                canonical: 'https://git-explore-one.vercel.app/dashboard'
            };
        }
    };

    const seo = getSEOProps();

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
            <SEO
                title={seo.title}
                description={seo.description}
                canonical={seo.canonical}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "GitExplorer",
                    "applicationCategory": "DeveloperApplication",
                    "operatingSystem": "Web",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    }
                }}
            />
            <Header
                activeTab={activeTab}
                onTokenSave={handleTokenSave}
                showBackButton={true}
            />

            <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32 border-b border-white/10">
                <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 px-4 sm:px-6 md:px-8 py-8 space-y-6">

                    {/* Offline/fallback banner */}
                    {isFallback && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
                            <span>
                                GitHub API unavailable — showing curated essential stacks.
                                <a
                                    href="https://github.com/settings/tokens/new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 underline text-amber-300 hover:text-white transition-colors"
                                >
                                    Connect a token to restore live data ↗
                                </a>
                            </span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <ErrorMessage
                            message={error}
                            onRetry={() => fetchRepositories(page)}
                        />
                    )}

                    {/* Dashboard Content */}
                    <div className="min-h-[60vh]">
                        {activeTab === 'explore' && (
                            <section aria-label="Explore Repositories">
                                {/* Top 5 Hot Repositories of the Month Showcase */}
                                <TopFiveFeatured
                                    repositories={monthlyTopRepos}
                                    loading={monthlyLoading}
                                    onRepoClick={setSelectedRepo}
                                />

                                <FilterPanel
                                    filters={filters}
                                    onFilterChange={setFilters}
                                />

                                <RepositoryList
                                    repositories={repositories}
                                    loading={loading}
                                    onRepoClick={setSelectedRepo}
                                    onBookmarkToggle={handleBookmarkToggle}
                                    bookmarkedIds={bookmarkedIds}
                                    hasMore={!loading && repositories.length > 0 && !filters.query}
                                    onLoadMore={handleLoadMore}
                                />

                            </section>
                        )}

                        {activeTab === 'bookmarks' && (
                            <BookmarksPanel
                                onRepoSelect={setSelectedRepo}
                                onBookmarkToggle={handleBookmarkToggle}
                                bookmarkedIds={bookmarkedIds}
                            />
                        )}

                        {activeTab === 'profile' && (
                            <ProfileView
                                filters={filters}
                                onFilterChange={setFilters}
                            />
                        )}
                    </div>
                </div>
            </main>

            {selectedRepo && (
                <RepositoryDetail
                    repo={selectedRepo}
                    onClose={() => setSelectedRepo(null)}
                    onBookmarkToggle={handleBookmarkToggle}
                    isBookmarked={bookmarkedIds.has(selectedRepo.id)}
                />
            )}

            <BackToTop />
            <Footer />
        </div>
    );
};

export default Dashboard;
