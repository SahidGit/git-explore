import React, { useState, useEffect } from 'react';
import { Flame, Star, ChevronRight, Award, Trophy, Sparkles, Medal, Crown, TrendingUp } from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';
import { SkeletonTopFive } from '../../ui/SkeletonLoader';
import * as githubService from '../../../services/githubService';

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
    C:           '#555555',
    'Jupyter Notebook': '#DA5B0B',
};

const getLangColor = (lang) => LANG_COLORS[lang] || '#94A3B8';

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

    // Distinctive Medal Themes: Gold (#1), Silver (#2), Bronze (#3), Indigo/Emerald (#4), Cyan (#5)
    const rankThemes = [
        {
            label: '#1 GOLD',
            icon: Trophy,
            badgeStyle: 'bg-amber-400/15 text-amber-300 border-amber-400/30 shadow-sm shadow-amber-500/10',
            cardBorder: 'border-amber-500/25 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10',
            topGlow: 'before:bg-gradient-to-r before:from-amber-400/0 before:via-amber-400 before:to-amber-400/0',
            starColor: 'text-amber-300',
            starFill: 'fill-amber-400 text-amber-400',
            ambientBg: 'bg-gradient-to-b from-amber-500/[0.04] to-transparent',
            rankNum: 'text-amber-400/15',
        },
        {
            label: '#2 SILVER',
            icon: Medal,
            badgeStyle: 'bg-slate-300/15 text-slate-200 border-slate-300/35 shadow-sm shadow-slate-300/10',
            cardBorder: 'border-slate-400/25 hover:border-slate-300/60 hover:shadow-lg hover:shadow-slate-300/10',
            topGlow: 'before:bg-gradient-to-r before:from-slate-300/0 before:via-slate-300 before:to-slate-300/0',
            starColor: 'text-slate-200',
            starFill: 'fill-slate-300 text-slate-300',
            ambientBg: 'bg-gradient-to-b from-slate-300/[0.03] to-transparent',
            rankNum: 'text-slate-300/15',
        },
        {
            label: '#3 BRONZE',
            icon: Medal,
            badgeStyle: 'bg-orange-500/15 text-orange-300 border-orange-500/35 shadow-sm shadow-orange-500/10',
            cardBorder: 'border-orange-500/25 hover:border-orange-400/60 hover:shadow-lg hover:shadow-orange-500/10',
            topGlow: 'before:bg-gradient-to-r before:from-orange-500/0 before:via-orange-400 before:to-orange-500/0',
            starColor: 'text-orange-300',
            starFill: 'fill-orange-400 text-orange-400',
            ambientBg: 'bg-gradient-to-b from-orange-500/[0.03] to-transparent',
            rankNum: 'text-orange-400/15',
        },
        {
            label: '#4 TOP',
            icon: Flame,
            badgeStyle: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 shadow-sm shadow-indigo-500/5',
            cardBorder: 'border-indigo-500/20 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10',
            topGlow: 'before:bg-gradient-to-r before:from-indigo-500/0 before:via-indigo-400 before:to-indigo-500/0',
            starColor: 'text-indigo-200',
            starFill: 'fill-amber-400 text-amber-400',
            ambientBg: 'bg-gradient-to-b from-indigo-500/[0.02] to-transparent',
            rankNum: 'text-indigo-400/10',
        },
        {
            label: '#5 TOP',
            icon: Sparkles,
            badgeStyle: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-500/5',
            cardBorder: 'border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10',
            topGlow: 'before:bg-gradient-to-r before:from-cyan-500/0 before:via-cyan-400 before:to-cyan-500/0',
            starColor: 'text-cyan-200',
            starFill: 'fill-amber-400 text-amber-400',
            ambientBg: 'bg-gradient-to-b from-cyan-500/[0.02] to-transparent',
            rankNum: 'text-cyan-400/10',
        },
    ];

    return (
        <div className="mb-10 rounded-2xl bg-[#0E0F13]/90 border border-white/[0.09] p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Top Subtle Ambient Lighting */}
            <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 pointer-events-none mix-blend-screen opacity-40"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%)'
                }}
                aria-hidden="true"
            />

            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.07] pb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-transparent border border-amber-400/25 flex items-center justify-center text-amber-300 shadow-sm shadow-amber-500/10">
                        <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight font-heading">
                                Trending Leaderboard
                            </h2>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-sans text-zinc-200 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {timeRange === 'weekly' ? 'This Week' : currentMonthYear}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans mt-0.5">
                            {timeRange === 'weekly'
                                ? 'Highest velocity repositories created this week'
                                : 'Highest star growth repositories created this month'
                            }
                        </p>
                    </div>
                </div>

                {/* Time Range Switcher (Monthly vs Weekly) */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1 rounded-xl font-sans text-xs shadow-inner">
                        <button
                            type="button"
                            onClick={() => handleToggle('monthly')}
                            aria-label="View monthly top repositories"
                            className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-sans text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 ${
                                timeRange === 'monthly'
                                    ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                                    : 'text-zinc-400 hover:text-white font-medium'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggle('weekly')}
                            aria-label="View weekly top repositories"
                            className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-sans text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 ${
                                timeRange === 'weekly'
                                    ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                                    : 'text-zinc-400 hover:text-white font-medium'
                            }`}
                        >
                            Weekly
                        </button>
                    </div>

                    <div className="hidden sm:flex text-[11px] font-sans text-zinc-400 items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/10">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                        <span>{timeRange === 'weekly' ? 'Refreshed Weekly' : 'Auto-updated Monthly'}</span>
                    </div>
                </div>
            </div>

            {/* 5 Cards Showcase Grid */}
            {top5.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
                    {top5.map((repo, idx) => {
                        const theme = rankThemes[idx] || rankThemes[3];
                        const RankIcon = theme.icon;
                        const langColor = getLangColor(repo.language);

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
                                className={`group relative rounded-xl bg-[#111216]/95 border ${theme.cardBorder} p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 overflow-hidden ${theme.ambientBg} before:absolute before:inset-x-0 before:top-0 before:h-[2px] ${theme.topGlow}`}
                            >
                                {/* Giant Watermark Rank Digit */}
                                <div className={`absolute -bottom-2 -right-1 text-5xl font-black font-mono select-none pointer-events-none ${theme.rankNum} tracking-tighter`}>
                                    #{idx + 1}
                                </div>

                                {/* Card Top: Rank Badge & Stars */}
                                <div>
                                    <div className="flex items-center justify-between mb-3 gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-mono font-bold tracking-tight ${theme.badgeStyle}`}>
                                            <RankIcon className="w-3 h-3" />
                                            <span>{theme.label}</span>
                                        </span>
                                        <div className={`flex items-center gap-1 text-xs font-mono font-bold ${theme.starColor}`}>
                                            <Star className={`w-3.5 h-3.5 ${theme.starFill}`} />
                                            <span>{formatNumber(repo.stargazers_count)}</span>
                                        </div>
                                    </div>

                                    {/* Repo Avatar & Name */}
                                    <div className="flex items-center gap-2.5 mb-2.5">
                                        {repo.owner?.avatar_url ? (
                                            <img
                                                src={repo.owner?.avatar_url}
                                                alt={repo.owner?.login || ''}
                                                width={24}
                                                height={24}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-6 h-6 rounded-lg border border-white/10 flex-shrink-0 bg-[#0A0A0C]"
                                                onError={(e) => { e.target.src = 'https://github.com/github.png'; }}
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-mono text-zinc-400 flex-shrink-0">
                                                {repo.name?.charAt(0)?.toUpperCase() || 'R'}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            {repo.owner?.login && (
                                                <p className="text-[10px] font-mono text-zinc-500 truncate leading-none mb-0.5">
                                                    {repo.owner.login}
                                                </p>
                                            )}
                                            <h3 className="text-xs font-semibold font-mono text-white truncate group-hover:text-amber-300 transition-colors">
                                                {repo.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[11px] font-sans text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                                        {repo.description || 'No description provided for this repository.'}
                                    </p>
                                </div>

                                {/* Card Bottom: Language & Action */}
                                <div className="pt-2.5 border-t border-white/[0.07] flex items-center justify-between text-[11px] font-mono text-zinc-400 relative z-10">
                                    <span className="flex items-center gap-1.5 text-zinc-300 font-medium truncate max-w-[90px]">
                                        <span 
                                            className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                                            style={{ backgroundColor: langColor }}
                                        />
                                        <span className="truncate">{repo.language || 'Code'}</span>
                                    </span>
                                    <span className="flex items-center text-zinc-400 group-hover:text-white transition-colors font-sans text-xs font-medium">
                                        Inspect <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ml-0.5" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-10 text-center text-xs font-mono text-zinc-400">
                    No repositories found for this time window.
                </div>
            )}
        </div>
    );
};

export default TopFiveFeatured;
