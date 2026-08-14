import React, { useState, useEffect } from 'react';
import {
    X, Star, GitFork, Eye, ExternalLink, Bookmark, Check,
    Save, FileText, Code2, Shield, GitBranch, Users, Copy, Terminal, Share2
} from 'lucide-react';
import { getRepositoryDetails, getRepositoryActivity, getIssueStats } from '../../../services/githubService';
import { storageService } from '../../../services/storageService';
import { formatNumber } from '../../../utils/formatters';
import ActivityChart from '../Charts/ActivityChart';
import IssueChart from '../Charts/IssueChart';

const RepositoryDetail = ({ repo, onClose, isBookmarked, onBookmarkToggle }) => {
    const [details, setDetails] = useState(null);
    const [activity, setActivity] = useState(null);
    const [issueStats, setIssueStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);
    const [copiedClone, setCopiedClone] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);

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
                console.error('Failed to load repository details:', error);
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

    const handleCopyClone = () => {
        const cloneCmd = `git clone ${repo.clone_url || repo.html_url + '.git'}`;
        navigator.clipboard.writeText(cloneCmd);
        setCopiedClone(true);
        setTimeout(() => setCopiedClone(false), 2000);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(repo.html_url);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
    };

    if (!repo) return null;

    const cloneCommand = `git clone ${repo.clone_url || repo.html_url + '.git'}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="repo-detail-title"
        >
            <div className="w-full max-w-3xl bg-[#121215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                
                {/* ── Top Header Bar ── */}
                <div className="sticky top-0 z-10 bg-[#0E0E10] border-b border-white/[0.08] px-5 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                        <img
                            src={repo.owner?.avatar_url}
                            alt={repo.owner?.login}
                            className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0 bg-[#0A0A0C]"
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 id="repo-detail-title" className="text-sm sm:text-base font-mono font-bold truncate text-white">
                                    {repo.full_name}
                                </h2>
                                {details?.license && (
                                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-400">
                                        <Shield className="w-3 h-3 text-emerald-400" />
                                        {details.license.spdx_id || details.license.name}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] font-mono text-zinc-500 truncate">
                                Primary Branch: {details?.default_branch || repo.default_branch || 'main'}
                            </p>
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors relative"
                            title="Share Repository URL"
                        >
                            {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={() => onBookmarkToggle(repo)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                isBookmarked
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark repository'}
                        >
                            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                            title="Close modal"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable Body Content ── */}
                <div className="overflow-y-auto custom-scrollbar flex-1 p-5 space-y-6">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center space-y-3">
                            <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                            <p className="text-xs font-mono text-zinc-400">Loading GitHub Repository Metrics...</p>
                        </div>
                    ) : (
                        <>
                            {/* Description & External CTA */}
                            <div className="space-y-3">
                                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                                    {repo.description || <span className="italic text-zinc-500">No description provided.</span>}
                                </p>

                                {/* Topic Tags */}
                                {repo.topics && repo.topics.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {repo.topics.map((topic) => (
                                            <span
                                                key={topic}
                                                className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-sky-300"
                                            >
                                                #{topic}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Open on GitHub
                                    </a>

                                    <a
                                        href={`${repo.html_url}/issues`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
                                    >
                                        Open Issues ({details?.open_issues_count ?? repo.open_issues_count ?? 0})
                                    </a>
                                </div>
                            </div>

                            {/* Quick Terminal Clone Snippet */}
                            <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.08] p-3.5 space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block flex items-center gap-1.5">
                                    <Terminal className="w-3 h-3 text-emerald-400" />
                                    Quick Clone Command
                                </span>
                                <div className="flex items-center justify-between font-mono text-xs overflow-x-auto">
                                    <code className="text-emerald-400 select-all whitespace-pre pr-4">
                                        $ {cloneCommand}
                                    </code>
                                    <button
                                        onClick={handleCopyClone}
                                        className={`px-2.5 py-1 rounded-md border text-[11px] transition-all flex items-center gap-1 shrink-0 ${
                                            copiedClone
                                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                                : 'bg-white/[0.06] border-white/10 text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        {copiedClone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-white/[0.06] text-center space-y-1">
                                    <div className="flex justify-center text-amber-400">
                                        <Star className="w-4 h-4 fill-amber-400" />
                                    </div>
                                    <div className="font-mono text-base font-bold text-white">
                                        {formatNumber(details?.stargazers_count || repo.stargazers_count)}
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-500">Total Stars</div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-white/[0.06] text-center space-y-1">
                                    <div className="flex justify-center text-sky-400">
                                        <GitFork className="w-4 h-4" />
                                    </div>
                                    <div className="font-mono text-base font-bold text-white">
                                        {formatNumber(details?.forks_count || repo.forks_count)}
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-500">Forks</div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-white/[0.06] text-center space-y-1">
                                    <div className="flex justify-center text-indigo-400">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <div className="font-mono text-base font-bold text-white">
                                        {formatNumber(details?.subscribers_count || repo.watchers_count)}
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-500">Watchers</div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-white/[0.06] text-center space-y-1">
                                    <div className="flex justify-center text-emerald-400">
                                        <Code2 className="w-4 h-4" />
                                    </div>
                                    <div className="font-mono text-base font-bold text-white truncate">
                                        {repo.language || 'Multi-stack'}
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-500">Language</div>
                                </div>
                            </div>

                            {/* Stack Language Breakdown */}
                            {details?.languages && Object.keys(details.languages).length > 0 && (
                                <div className="p-4 rounded-xl bg-[#0E0E10] border border-white/[0.06] space-y-3">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                                        Stack Language Breakdown
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(details.languages).map(([lang, bytes]) => (
                                            <div
                                                key={lang}
                                                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-xs text-zinc-300 flex items-center gap-2"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                                <span className="font-semibold text-white">{lang}</span>
                                                <span className="text-[10px] text-zinc-500">({formatNumber(bytes)} B)</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Maintainers & Top Contributors */}
                            {details?.contributors && details.contributors.length > 0 && (
                                <div className="p-4 rounded-xl bg-[#0E0E10] border border-white/[0.06] space-y-3">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-sky-400" />
                                        Top Maintainers &amp; Contributors ({details.contributors.length})
                                    </span>
                                    <div className="flex flex-wrap gap-3">
                                        {details.contributors.slice(0, 8).map((contributor) => (
                                            <a
                                                key={contributor.id}
                                                href={contributor.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all group"
                                                title={`${contributor.login} (${contributor.contributions} commits)`}
                                            >
                                                <img
                                                    src={contributor.avatar_url}
                                                    alt={contributor.login}
                                                    className="w-6 h-6 rounded-full border border-white/10"
                                                />
                                                <span className="text-xs font-mono text-zinc-300 group-hover:text-white">
                                                    {contributor.login}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 52-Week Commit Activity Rhythm */}
                            <div className="p-4 rounded-xl bg-[#0E0E10] border border-white/[0.06] space-y-2">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                                    52-Week Commit Activity Rhythm
                                </span>
                                <div className="h-32">
                                    <ActivityChart data={activity} />
                                </div>
                            </div>

                            {/* Issues + Private Notes Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Issue Distribution */}
                                <div className="p-4 rounded-xl bg-[#0E0E10] border border-white/[0.06] space-y-2 flex flex-col justify-between">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                        Open vs Closed Issue Ratio
                                    </span>
                                    <div className="h-28 flex items-center justify-center">
                                        <IssueChart open={issueStats?.open || 0} closed={issueStats?.closed || 0} />
                                    </div>
                                </div>

                                {/* Private Notes Editor */}
                                <div className="p-4 rounded-xl bg-[#0E0E10] border border-white/[0.06] flex flex-col justify-between space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                            <FileText className="w-3 h-3" />
                                            Private Evaluation Note
                                        </span>
                                        {saved && (
                                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Saved
                                            </span>
                                        )}
                                    </div>

                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add private evaluation notes..."
                                        rows={3}
                                        className="w-full bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/25 resize-none font-mono"
                                    />

                                    <button
                                        onClick={handleSaveNote}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-mono text-xs transition-colors"
                                    >
                                        <Save className="w-3 h-3" />
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepositoryDetail;
