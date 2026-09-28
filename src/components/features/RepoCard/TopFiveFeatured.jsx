import React, { useState, useEffect } from 'react';
import { Flame, Star, ChevronRight, Award, Trophy, Sparkles, Calendar } from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';
import { SkeletonTopFive } from '../../ui/SkeletonLoader';
import * as githubService from '../../../services/githubService';

const TopFiveFeatured = ({
    repositories: initialRepos,
    loading: externalLoading,
    onRepoClick,
    timeRange: externalTimeRange,
    onTimeRangeChange
}) => {
    const [timeRange, setTimeRange] = useState(externalTimeRange || 'monthly');
    const [repos, setRepos] = useState(initialRepos || []);
    const [internalLoading, setInternalLoading] = useState(false);

    // Keep internal timeRange in sync if controlled externally
    useEffect(() => {
        if (externalTimeRange) {
            setTimeRange(externalTimeRange);
        }
    }, [externalTimeRange]);

    // Update internal repos if external props update and no explicit toggle action was taken
    useEffect(() => {
        if (initialRepos && initialRepos.length > 0 && !externalTimeRange) {
            setRepos(initialRepos);
        }
    }, [initialRepos, externalTimeRange]);

    // Fetch repositories whenever timeRange changes
    useEffect(() => {
        let isMounted = true;
        setInternalLoading(true);

        const fetchTopRepos = async () => {
            try {
                const fetched = timeRange === 'weekly'
                    ? await githubService.getWeeklyTopRepositories()
                    : await githubService.getMonthlyTopRepositories();

                if (isMounted) {
                    setRepos(fetched || []);
                }
            } catch (err) {
                if (isMounted) {
                    setRepos([]);
                }
            } finally {
                if (isMounted) {
                    setInternalLoading(false);
                }
            }
        };

        fetchTopRepos();

        return () => {
            isMounted = false;
        };
    }, [timeRange]);

    const handleToggle = (range) => {
        setTimeRange(range);
        if (onTimeRangeChange) {
            onTimeRangeChange(range);
        }
    };

    const loading = externalLoading || internalLoading;

    // Current Month & Year (e.g. August 2026)
    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    if (loading && (!repos || repos.length === 0)) return <SkeletonTopFive />;

    const top5 = (repos && repos.length > 0) ? repos.slice(0, 5) : [];

    const rankBadges = [
        { bg: 'bg-white/10 text-white border-white/20', label: '#1 HOT', icon: Trophy },
        { bg: 'bg-white/[0.08] text-zinc-200 border-white/15', label: '#2 HOT', icon: Award },
        { bg: 'bg-white/[0.06] text-zinc-300 border-white/10', label: '#3 HOT', icon: Award },
        { bg: 'bg-white/[0.05] text-zinc-300 border-white/10', label: '#4 TOP', icon: Flame },
        { bg: 'bg-white/[0.04] text-zinc-400 border-white/[0.08]', label: '#5 TOP', icon: Flame },
    ];

    return (
        <div className="mb-10 rounded-lg bg-[#121316] border border-white/[0.08] p-5 sm:p-6 shadow-sm relative overflow-hidden">

            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/15 flex items-center justify-center text-white">
                        <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
                                Top 5 Hot Repositories
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-xs font-sans text-zinc-200 font-semibold">
                                {timeRange === 'weekly' ? 'This Week' : currentMonthYear}
                            </span>
                        </div>
                        <p className="text-xs text-[#94A3B8] font-sans mt-0.5">
                            {timeRange === 'weekly'
                                ? 'Highest star growth created this week • Live Weekly Leaderboard'
                                : 'Highest star growth created this month • Live Monthly Leaderboard'
                            }
                        </p>
                    </div>
                </div>

                {/* Time Range Switcher (Monthly vs Weekly) */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#0D0E11] border border-white/10 p-1 rounded-full font-sans text-xs">
                        <button
                            type="button"
                            onClick={() => handleToggle('monthly')}
                            aria-label="View monthly top repositories"
                            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 shadow-none ${
                                timeRange === 'monthly'
                                    ? 'bg-white text-black font-bold'
                                    : 'text-zinc-400 hover:text-white font-medium'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggle('weekly')}
                            aria-label="View weekly top repositories"
                            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 shadow-none ${
                                timeRange === 'weekly'
                                    ? 'bg-white text-black font-bold'
                                    : 'text-zinc-400 hover:text-white font-medium'
                            }`}
                        >
                            Weekly
                        </button>
                    </div>

                    <div className="hidden sm:flex text-[11px] font-sans text-zinc-400 items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/10">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{timeRange === 'weekly' ? 'Refreshed Weekly' : 'Auto-updated Monthly'}</span>
                    </div>
                </div>
            </div>

            {/* 5 Cards Showcase Grid */}
            {top5.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {top5.map((repo, idx) => {
                        const badge = rankBadges[idx] || rankBadges[3];
                        const RankIcon = badge.icon;

                        return (
                            <div
                                key={repo.id || repo.name}
                                onClick={() => onRepoClick && onRepoClick(repo)}
                                tabIndex={0}
                                role="button"
                                aria-label={`View details for ${repo.name}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onRepoClick && onRepoClick(repo);
                                    }
                                }}
                                className="group relative rounded-lg bg-[#0D0E11] border border-white/[0.08] hover:border-white/30 p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                            >
                                {/* Card Top: Rank Badge & Stars */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-sans font-bold ${badge.bg}`}>
                                            <RankIcon className="w-3 h-3" />
                                            {badge.label}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs font-sans text-amber-300 font-bold">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span>{formatNumber(repo.stargazers_count)}</span>
                                        </div>
                                    </div>

                                    {/* Repo Avatar & Name */}
                                    <div className="flex items-center gap-2 mb-2">
                                        {repo.owner?.avatar_url && (
                                            <img
                                                src={repo.owner?.avatar_url}
                                                alt={repo.owner?.login || ''}
                                                className="w-5 h-5 rounded-md border border-white/10 flex-shrink-0 bg-[#121215]"
                                            />
                                        )}
                                        <h3 className="text-xs font-semibold font-sans text-white truncate group-hover:text-zinc-200 transition-colors">
                                            {repo.name}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[11px] font-sans text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                                        {repo.description || 'No description provided.'}
                                    </p>
                                </div>

                                {/* Card Bottom: Language & Action */}
                                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                                    <span className="text-zinc-300 font-medium truncate max-w-[80px]">
                                        {repo.language || 'Code'}
                                    </span>
                                    <span className="flex items-center text-zinc-400 group-hover:text-white transition-colors font-sans">
                                        Details <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform ml-0.5" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-8 text-center text-xs font-mono text-zinc-400">
                    No repositories found for this time window.
                </div>
            )}
        </div>
    );
};

export default TopFiveFeatured;

