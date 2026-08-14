import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import Header from '../components/layouts/Header';
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
    const [repositories, setRepositories] = useState([]);
    const [monthlyTopRepos, setMonthlyTopRepos] = useState([]);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
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
        console.log('Toggling bookmark ID:', repo.id);
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
            case 'bookmarks': return { title: 'My Bookmarks | GitExplorer', description: 'View your saved repositories.', canonical: 'https://git-explore-one.vercel.app/bookmarks' };
            case 'profile': return { title: 'Developer Profile | GitExplorer', description: 'Analyze GitHub profiles and stats.', canonical: 'https://git-explore-one.vercel.app/profile' };
            default: return { title: 'Explore Repositories | GitExplorer', description: 'Discover trending open source projects.', canonical: 'https://git-explore-one.vercel.app/dashboard' };
        }
    };

    const seo = getSEOProps();

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 space-y-6">

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
        </div>
    );
};

export default Dashboard;
