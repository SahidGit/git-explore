import React, { useEffect, useState } from 'react';
import { getUserContributions, getUser } from '../../../services/githubService';
import { SkeletonProfile, SkeletonHeatmap } from '../../ui/SkeletonLoader';
import { Calendar, MapPin, Link as LinkIcon, Users } from 'lucide-react';

const ContributionHeatmap = ({ username }) => {
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const results = await Promise.allSettled([
                    getUserContributions(username),
                    getUser(username)
                ]);

                const contributionResult = results[0];
                const userResult = results[1];

                if (contributionResult.status === 'fulfilled') {
                    const contributionData = contributionResult.value;
                    // contributions.contributions is array of { date, count, level }
                    // Group by weeks
                    const days = contributionData.contributions;
                    const weeks = [];
                    let currentWeek = [];

                    // Pad the beginning of the first week if necessary
                    // This is a simplified logic; real GitHub graph logic is more complex with dates
                    // For now, we'll just chunk by 7
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
                        totalContributions: contributionData.totalContributions,
                        weeks: weeks
                    });
                } else {

                    setError('Failed to load contribution data');
                }

                if (userResult.status === 'fulfilled') {
                    setUser(userResult.value);
                } else {

                    // We don't set error here to allow heatmap to show if possible
                }

            } catch {

                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    if (loading) {
        return (
            <div className="space-y-6">
                <SkeletonProfile />
                <SkeletonHeatmap />
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="p-6 bg-[#0D1117] rounded-xl border border-slate-800 text-center text-slate-400">
                <p>{error}</p>
            </div>
        );
    }

    const getLevelColor = (level) => {
        switch (level) {
            case 0: return 'bg-slate-800/50';
            case 1: return 'bg-green-900/40 border border-green-800/30';
            case 2: return 'bg-green-700/60 border border-green-600/30 shadow-[0_0_5px_rgba(34,197,94,0.2)]';
            case 3: return 'bg-green-500 border border-green-400/30 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
            case 4: return 'bg-green-400 border border-green-300/30 shadow-[0_0_12px_rgba(34,197,94,0.6)]';
            default: return 'bg-slate-800/50';
        }
    };

    return (
        <div className="space-y-6">
            {/* User Profile Header */}
            {user && (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#0D1117] border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-24 h-24 rounded-full border-2 border-slate-700 shadow-xl relative z-10"
                    />

                    <div className="flex-1 text-center md:text-left relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-1">{user.name || user.login}</h2>
                        <p className="text-slate-400 text-sm mb-4">@{user.login}</p>

                        {user.bio && (
                            <p className="text-slate-300 mb-4 max-w-2xl">{user.bio}</p>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
                            {user.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                            {user.blog && (
                                <a
                                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                                >
                                    <LinkIcon className="w-4 h-4 text-slate-500" />
                                    <span>Website</span>
                                </a>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-500" />
                                <span><strong className="text-white">{user.followers}</strong> followers</span>
                                <span className="mx-1">·</span>
                                <span><strong className="text-white">{user.following}</strong> following</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Heatmap */}
            {data && (
                <div className="p-6 bg-[#0D1117] rounded-xl border border-slate-800 shadow-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                        <Calendar className="w-5 h-5 text-green-400" />
                        Contribution Activity
                        <span className="text-xs font-normal text-green-200/70 px-2 py-0.5 rounded-full bg-green-900/20 border border-green-800/30 ml-auto">
                            {data.totalContributions} contributions in the last year
                        </span>
                    </h3>

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
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover/cell:opacity-100 pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                                                {day.count} contributions
                                                <div className="text-slate-400 text-[10px]">{new Date(day.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400 relative z-10">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-slate-800/50"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-green-900/40 border border-green-800/30"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-green-700/60 border border-green-600/30"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-green-500 border border-green-400/30"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-green-400 border border-green-300/30"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContributionHeatmap;
