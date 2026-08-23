import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layouts/Header';
import SEO from '../components/ui/SEO';
import DashboardTabs from '../components/features/DashboardTabs';
import { githubService } from '../services/githubService';
import { storageService } from '../services/storageService';

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('explore');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFallback, setIsFallback] = useState(false);
    const [page, setPage] = useState(1);
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
    const [monthlyStats, setMonthlyStats] = useState(null);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [filters, setFilters] = useState({
        language: 'all',
        since: 'weekly',
        sort: 'stars',
        query: ''
    });

    // Initialize bookmarked repos
    useEffect(() => {
        const bookmarks = storageService.getBookmarks();
        setBookmarkedIds(new Set(bookmarks.map(b => b.id)));
    }, []);

    // Update monthly stats when tab or language changes
    useEffect(() => {
        if (activeTab === 'stats') {
            setMonthlyLoading(true);
            githubService.getMonthlyStats(filters.language)
                .then(data => setMonthlyStats(data))
                .catch(err => console.error('Failed to load stats:', err))
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
            setPage(1);
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
                canonical: 'https://exploregit.vercel.app/dashboard'
            };
            case 'profile': return {
                title: 'Developer Profile — GitExplorer',
                description: 'Analyze GitHub contributor profiles with activity heatmaps and contribution history.',
                canonical: 'https://exploregit.vercel.app/dashboard'
            };
            default: return {
                title: 'Explore Repositories — GitExplorer',
                description: 'Discover trending open-source repositories by language, time window, and momentum. Raw GitHub data, structured into signal.',
                canonical: 'https://exploregit.vercel.app/dashboard'
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
                            <span>⚠️ GitHub API unavailable — displaying cached data</span>
                        </div>
                    )}

                    {/* Dashboard Tabs */}
                    <DashboardTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        repositories={repositories}
                        loading={loading}
                        error={error}
                        bookmarkedIds={bookmarkedIds}
                        onBookmarkToggle={handleBookmarkToggle}
                        onLoadMore={handleLoadMore}
                        filters={filters}
                        setFilters={setFilters}
                        monthlyStats={monthlyStats}
                        monthlyLoading={monthlyLoading}
                    />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
