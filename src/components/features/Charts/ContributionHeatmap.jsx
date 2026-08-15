import React, { useEffect, useState } from 'react';
import { getUserContributions, getUser } from '../../../services/githubService';
import { SkeletonProfile, SkeletonHeatmap } from '../../ui/SkeletonLoader';
import { Calendar, MapPin, Link as LinkIcon, Users, ExternalLink, AlertCircle } from 'lucide-react';

const ContributionHeatmap = ({ username }) => {
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [heatmapError, setHeatmapError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!username?.trim()) return;
            setLoading(true);
            setError(null);
            setHeatmapError(null);
            setData(null);
            setUser(null);

            try {
                const results = await Promise.allSettled([
                    getUserContributions(username.trim()),
                    getUser(username.trim()),
                ]);

                const contributionResult = results[0];
                const userResult = results[1];

                // 1. Check GitHub User Profile Result
                if (userResult.status === 'fulfilled' && userResult.value?.login) {
                    setUser(userResult.value);
                } else {
                    const errMsg = userResult.reason?.message || `GitHub user "${username}" not found or rate limit reached.`;
                    setError(errMsg);
                }

                // 2. Check Contribution Heatmap Result
                if (contributionResult.status === 'fulfilled' && contributionResult.value?.contributions) {
                    const contributionData = contributionResult.value;
                    const days = contributionData.contributions || [];
                    const weeks = [];
                    let currentWeek = [];

                    for (let i = 0; i < days.length; i++) {
                        currentWeek.push(days[i]);
                        if (currentWeek.length === 7) {
                            weeks.push(currentWeek);
                            currentWeek = [];
                        }
                    }
                    if (currentWeek.length > 0) {
                        weeks.push(currentWeek);
                    }

                    setData({
                        totalContributions: contributionData.totalContributions || 0,
                        weeks: weeks,
                    });
                } else {
                    setHeatmapError('Contribution heatmap API is temporarily unavailable.');
                }
            } catch (err) {
                setError(err.message || 'An unexpected error occurred while searching for profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (loading) {
        return (
            <div className="space-y-6 animate-fadeInUp">
                <SkeletonProfile />
                <SkeletonHeatmap />
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="p-8 bg-[#121215] rounded-xl border border-white/[0.08] text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Profile Search Failed</h4>
                <p className="text-xs text-zinc-400 font-mono max-w-sm mx-auto">{error}</p>
            </div>
        );
    }

    const getLevelColor = (level) => {
        switch (level) {
            case 0: return 'bg-white/[0.04]';
            case 1: return 'bg-emerald-950/60 border border-emerald-800/40';
            case 2: return 'bg-emerald-700/80 border border-emerald-600/40 shadow-[0_0_5px_rgba(16,185,129,0.3)]';
            case 3: return 'bg-emerald-500 border border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
            case 4: return 'bg-emerald-400 border border-emerald-300/40 shadow-[0_0_12px_rgba(16,185,129,0.7)]';
            default: return 'bg-white/[0.04]';
        }
    };

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* User Profile Header */}
            {user && (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#121215] border border-white/[0.08] rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-24 h-24 rounded-full border-2 border-white/10 shadow-xl relative z-10 bg-[#0A0A0C]"
                    />

                    <div className="flex-1 text-center md:text-left relative z-10">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-white tracking-tight">{user.name || user.login}</h2>
                            <span className="text-xs font-mono text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                                @{user.login}
                            </span>
                        </div>

                        {user.bio && (
                            <p className="text-zinc-300 text-xs sm:text-sm mb-4 max-w-2xl leading-relaxed">{user.bio}</p>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-zinc-400">
                            {user.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                            {user.blog && (
                                <a
                                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="truncate max-w-[150px]">{user.blog}</span>
                                </a>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-zinc-500" />
                                <span><strong className="text-white">{user.followers?.toLocaleString()}</strong> followers</span>
                                <span>·</span>
                                <span><strong className="text-white">{user.following?.toLocaleString()}</strong> following</span>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-center md:justify-start">
                            <a
                                href={user.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View on GitHub ↗
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Heatmap */}
            {data ? (
                <div className="p-6 bg-[#121215] rounded-xl border border-white/[0.08] shadow-xl overflow-hidden relative group">
                    <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-sm font-bold text-white font-mono">
                                Contribution Activity
                            </h3>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            {data.totalContributions.toLocaleString()} contributions in last year
                        </span>
                    </div>

                    <div className="overflow-x-auto pb-2 relative z-10 custom-scrollbar">
                        <div className="flex gap-1 min-w-max">
                            {data.weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-1">
                                    {week.map((day, dayIndex) => (
                                        <div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-200 hover:scale-125 hover:z-10 relative group/cell ${getLevelColor(day.level)}`}
                                            title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-[10px] font-mono rounded shadow-lg opacity-0 group-hover/cell:opacity-100 pointer-events-none whitespace-nowrap z-20 border border-white/10">
                                                {day.count} contributions on {day.date}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-500 relative z-10">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-white/[0.04]" />
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-950/60 border border-emerald-800/40" />
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-700/80 border border-emerald-600/40" />
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-500 border border-emerald-400/40" />
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-400 border border-emerald-300/40" />
                        </div>
                        <span>More</span>
                    </div>
                </div>
            ) : heatmapError ? (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-xs font-mono text-zinc-500">
                    {heatmapError}
                </div>
            ) : null}
        </div>
    );
};

export default ContributionHeatmap;
