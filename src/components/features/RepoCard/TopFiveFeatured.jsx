import React from 'react';
import { Flame, Star, ChevronRight, Award, Trophy, Sparkles } from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';
import { SkeletonTopFive } from '../../ui/SkeletonLoader';


const TopFiveFeatured = ({ repositories, onRepoClick, loading }) => {
    // Current Month & Year (e.g. August 2026)
    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    if (loading) return <SkeletonTopFive />;

    if (!repositories || repositories.length === 0) return null;

    const top5 = repositories.slice(0, 5);

    const rankBadges = [
        { bg: 'bg-amber-400/10 text-amber-300 border-amber-400/30', label: '#1 HOT', icon: Trophy },
        { bg: 'bg-zinc-300/10 text-zinc-200 border-zinc-300/30', label: '#2 HOT', icon: Award },
        { bg: 'bg-amber-700/20 text-amber-400 border-amber-600/30', label: '#3 HOT', icon: Award },
        { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: '#4 TOP', icon: Flame },
        { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: '#5 TOP', icon: Flame },
    ];

    return (
        <div className="mb-10 rounded-2xl bg-gradient-to-b from-[#16161a] to-[#0d0d10] border border-white/[0.10] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            {/* Background Accent Glow */}
            <div
                className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />

            {/* Header Title */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Flame className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                Top 5 Hot Repositories
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono text-amber-300 font-semibold">
                                {currentMonthYear}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                            Highest star growth created this month &bull; Live Monthly Leaderboard
                        </p>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto-updated Monthly</span>
                </div>
            </div>

            {/* 5 Cards Showcase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {top5.map((repo, idx) => {
                    const badge = rankBadges[idx] || rankBadges[3];
                    const RankIcon = badge.icon;

                    return (
                        <div
                            key={repo.id}
                            onClick={() => onRepoClick(repo)}
                            className="group relative rounded-xl bg-[#0A0A0C] border border-white/[0.08] hover:border-amber-500/40 p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
                        >
                            {/* Card Top: Rank Badge & Stars */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${badge.bg}`}>
                                        <RankIcon className="w-3 h-3" />
                                        {badge.label}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs font-mono text-amber-300 font-bold">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span>{formatNumber(repo.stargazers_count)}</span>
                                    </div>
                                </div>

                                {/* Repo Avatar & Name */}
                                <div className="flex items-center gap-2 mb-2">
                                    <img
                                        src={repo.owner?.avatar_url}
                                        alt={repo.owner?.login}
                                        className="w-5 h-5 rounded-md border border-white/10 flex-shrink-0 bg-[#121215]"
                                    />
                                    <h3 className="text-xs font-bold font-mono text-white truncate group-hover:text-amber-300 transition-colors">
                                        {repo.name}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                                    {repo.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Card Bottom: Language & Action */}
                            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                                <span className="text-zinc-300 font-medium truncate max-w-[80px]">
                                    {repo.language || 'Code'}
                                </span>
                                <span className="flex items-center text-zinc-400 group-hover:text-white transition-colors">
                                    Details <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopFiveFeatured;
