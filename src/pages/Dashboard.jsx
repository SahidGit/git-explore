import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import Header from '../components/layouts/Header';
import FilterPanel from '../components/features/FilterPanel';
import RepositoryList from '../components/features/RepoCard/RepositoryList';
import BookmarksPanel from '../components/features/BookmarksPanel';
import RepositoryDetail from '../components/features/RepoCard/RepositoryDetail';
import * as githubService from '../services/githubService';
import { storageService } from '../services/storageService';
import ContributionHeatmap from '../components/features/Charts/ContributionHeatmap';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const Dashboard = ({ activeTab }) => {
// activeTab is now passed from the Route in App.jsx (explore, bookmarks, profile)
    // const navigate = useNavigate();
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

    // ... existing fetchRepositories ...
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
        <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
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
                            />

                            {!loading && repositories.length > 0 && !filters.query && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-full text-sm font-medium transition-colors border border-white/10"
                                    >
                                        Load More Trending
                                    </button>
                                </div>
                            )}
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
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                                    <h3 className="text-lg font-semibold text-white mb-4">Legends of Open Source</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { name: 'SahidGit', username: 'SahidGit', role: 'Project Owner', avatar: 'https://avatars.githubusercontent.com/u/106660867?v=4', isOwner: true },
                                            { name: 'Linus Torvalds', username: 'torvalds', role: 'Creator of Linux & Git', avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4' },
                                            { name: 'Evan You', username: 'yyx990803', role: 'Creator of Vue.js', avatar: 'https://avatars.githubusercontent.com/u/499550?v=4' },
                                            { name: 'Dan Abramov', username: 'gaearon', role: 'React Core Team', avatar: 'https://avatars.githubusercontent.com/u/810438?v=4' }
                                        ].map((profile) => (
                                            <button
                                                key={profile.username}
                                                onClick={() => setFilters(prev => ({ ...prev, username: profile.username }))}
                                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all group text-left ${profile.isOwner
                                                    ? 'bg-blue-500/10 border-blue-500/50 hover:bg-blue-500/20'
                                                    : 'bg-[#161B22] border-[#30363D] hover:border-indigo-500/50 hover:bg-[#1C2128]'
                                                    }`}
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={profile.avatar}
                                                        alt={profile.name}
                                                        className={`w-12 h-12 rounded-full border transition-colors ${profile.isOwner ? 'border-blue-400' : 'border-slate-700 group-hover:border-indigo-500/50'
                                                            }`}
                                                    />
                                                    {profile.isOwner && (
                                                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border border-[#0D1117]" title="Verified Owner">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.751zM11 8a1 1 0 01-1 1H9v2a1 1 0 012 0V9a1 1 0 011-1z" clipRule="evenodd" />
                                                                <path d="M10 8a1 1 0 100-2 1 1 0 000 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`font-medium transition-colors ${profile.isOwner ? 'text-blue-400' : 'text-white group-hover:text-indigo-400'}`}>
                                                            {profile.name}
                                                        </div>
                                                        {profile.isOwner && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                                OWNER
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">@{profile.username} • {profile.role}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
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
        </div >
    );
};

export default Dashboard;
