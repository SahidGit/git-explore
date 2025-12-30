import React, { useState, useEffect } from 'react';
import { X, Star, GitFork, Eye, ExternalLink, Calendar, Save, MessageSquare, Bookmark } from 'lucide-react';
import { getRepositoryDetails, getRepositoryActivity, getIssueStats } from '../../../services/githubService';
import { storageService } from '../../../services/storageService';
import { formatNumber } from '../../../utils/formatters';
import ActivityChart from '../Charts/ActivityChart';
import IssueChart from '../Charts/IssueChart';
import LoadingSpinner from '../../ui/LoadingSpinner';

const RepositoryDetail = ({ repo, onClose, isBookmarked, onBookmarkToggle }) => {
    const [details, setDetails] = useState(null);
    const [activity, setActivity] = useState(null);
    const [issueStats, setIssueStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [detailsData, activityData, issueData] = await Promise.all([
                    getRepositoryDetails(repo.owner.login, repo.name),
                    getRepositoryActivity(repo.owner.login, repo.name),
                    getIssueStats(repo.owner.login, repo.name),
                ]);
                setDetails(detailsData);
                setActivity(activityData);
                setIssueStats(issueData);

                // Load saved note
                const savedNote = storageService.getNote(repo.id);
                setNote(savedNote);
            } catch (error) {
                console.error('Failed to load details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (repo) {
            fetchData();
        }
    }, [repo]);

    const handleSaveNote = () => {
        storageService.saveNote(repo.id, note);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!repo) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#161B22] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                <div className="sticky top-0 z-10 bg-[#161B22]/95 backdrop-blur-md border-b border-slate-800 p-3 flex justify-between items-center shrink-0">
                    <h2 className="text-base font-bold truncate pr-4 text-slate-100 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                        {repo.full_name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onBookmarkToggle(repo)}
                            className={`p-1.5 rounded-full transition-all ${
                                isBookmarked 
                                    ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' 
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                            title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                        >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-800 rounded-full transition-colors group"
                            title="Close (Esc)"
                        >
                            <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="p-3 space-y-3">
                            {/* Header Info */}
                            <div className="flex items-start gap-3">
                                <img
                                    src={repo.owner.avatar_url}
                                    alt={repo.owner.login}
                                    className="w-10 h-10 rounded-lg border border-slate-700"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-300 text-sm line-clamp-2 leading-snug">{repo.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs rounded-md transition-all font-medium border border-[rgba(255,255,255,0.1)] shadow-sm"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            View on GitHub
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack Chips (Compact) */}
                            {details?.languages && Object.keys(details.languages).length > 0 ? (
                                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide mask-linear-fade">
                                    {Object.keys(details.languages).map((lang) => (
                                        <span key={lang} className="flex-none px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium whitespace-nowrap">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-slate-500 italic">No language details available</div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 text-center">
                                    <div className="flex justify-center mb-0.5">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    <div className="text-sm font-bold text-white">{formatNumber(details?.stargazers_count)}</div>
                                    <div className="text-[10px] text-slate-400">Stars</div>
                                </div>
                                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 text-center">
                                    <div className="flex justify-center mb-0.5">
                                        <GitFork className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="text-sm font-bold text-white">{formatNumber(details?.forks_count)}</div>
                                    <div className="text-[10px] text-slate-400">Forks</div>
                                </div>
                                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 text-center">
                                    <div className="flex justify-center mb-0.5">
                                        <Eye className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div className="text-sm font-bold text-white">{formatNumber(details?.subscribers_count)}</div>
                                    <div className="text-[10px] text-slate-400">Watchers</div>
                                </div>
                            </div>

                            {/* Charts Area */}
                            <div className="space-y-3">
                                {/* Activity Trends */}
                                <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                                    <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-slate-300">
                                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                                        Activity Trends
                                    </h3>
                                    <div className="h-32"> {/* Constrained Height */}
                                        <ActivityChart data={activity} />
                                    </div>
                                </div>

                                {/* Issue Analytics & Notes Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                                        <h3 className="text-xs font-semibold mb-2 text-slate-300">Issue Analytics</h3>
                                        <div className="h-32 flex items-center justify-center">
                                            <IssueChart open={issueStats?.open || 0} closed={issueStats?.closed || 0} />
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-xs font-semibold text-slate-300">My Notes</h3>
                                            {saved && <span className="text-[10px] text-green-400 animate-pulse">Saved!</span>}
                                        </div>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Add notes..."
                                            className="w-full flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none mb-2"
                                        />
                                        <button
                                            onClick={handleSaveNote}
                                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-xs font-medium w-full"
                                        >
                                            <Save className="w-3 h-3" />
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepositoryDetail;
