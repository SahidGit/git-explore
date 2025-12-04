import React, { useState, useEffect } from 'react';
import { X, Star, GitFork, Eye, ExternalLink, Calendar, Save, MessageSquare } from 'lucide-react';
import { getRepositoryDetails, getRepositoryActivity, getIssueStats } from '../services/githubService';
import { storageService } from '../services/storageService';
import { formatNumber, formatDate } from '../utils/formatters';
import ActivityChart from './charts/ActivityChart';
import LanguageChart from './charts/LanguageChart';
import IssueChart from './charts/IssueChart';
import LoadingSpinner from './LoadingSpinner';

const RepositoryDetail = ({ repo, onClose }) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto">
                <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold truncate pr-4">{repo.full_name}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400 hover:text-white" />
                    </button>
                </div>

                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {/* Header Info */}
                        <div className="flex items-start gap-4">
                            <img
                                src={repo.owner.avatar_url}
                                alt={repo.owner.login}
                                className="w-12 h-12 rounded-xl border border-slate-700"
                            />
                            <div className="flex-1">
                                <p className="text-slate-300 mb-2 text-sm">{repo.description}</p>
                                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-400 hover:underline"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        View on GitHub
                                    </a>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Created {formatDate(repo.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                                <div className="flex justify-center mb-1">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="text-lg font-bold text-white">{formatNumber(details?.stargazers_count)}</div>
                                <div className="text-xs text-slate-400">Stars</div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                                <div className="flex justify-center mb-1">
                                    <GitFork className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-lg font-bold text-white">{formatNumber(details?.forks_count)}</div>
                                <div className="text-xs text-slate-400">Forks</div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                                <div className="flex justify-center mb-1">
                                    <Eye className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="text-lg font-bold text-white">{formatNumber(details?.subscribers_count)}</div>
                                <div className="text-xs text-slate-400">Watchers</div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 col-span-1 md:col-span-2">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-blue-400" />
                                    Activity Trends
                                </h3>
                                <ActivityChart data={activity} />
                            </div>

                            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                <h3 className="text-sm font-semibold mb-3">Languages</h3>
                                <LanguageChart languages={details?.languages} />
                            </div>

                            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                <h3 className="text-sm font-semibold mb-3">Issue Analytics</h3>
                                <IssueChart open={issueStats?.open || 0} closed={issueStats?.closed || 0} />
                            </div>

                            {/* Notes Section */}
                            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">My Notes</h3>
                                    {saved && <span className="text-xs text-green-400 animate-pulse">Saved!</span>}
                                </div>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add private notes about this repository..."
                                    className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none mb-3"
                                />
                                <button
                                    onClick={handleSaveNote}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium ml-auto"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepositoryDetail;
