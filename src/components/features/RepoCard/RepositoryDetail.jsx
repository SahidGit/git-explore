import React, { useState, useEffect } from 'react';
import {
    X, Star, GitFork, Eye, ExternalLink, Bookmark, Check,
    Save, FileText, Code2, Shield, GitBranch, Users, Copy, Terminal, Share2, Layers
} from 'lucide-react';
import { getRepositoryDetails, getRepositoryActivity, getIssueStats } from '../../../services/githubService';
import { storageService } from '../../../services/storageService';
import { formatNumber } from '../../../utils/formatters';
import ActivityChart from '../Charts/ActivityChart';
import IssueChart from '../Charts/IssueChart';
import ShareRepoModal from './ShareRepoModal';
import RepoHealthScorecard from './RepoHealthScorecard';

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
};

const getLangColor = (lang) => LANG_COLORS[lang] || '#71717A';

const RepositoryDetail = ({ repo, onClose, isBookmarked, onBookmarkToggle }) => {
    const [details, setDetails] = useState(null);
    const [activity, setActivity] = useState(null);
    const [issueStats, setIssueStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);
    const [copiedClone, setCopiedClone] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

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

    if (!repo) return null;

    const cloneCommand = `git clone ${repo.clone_url || repo.html_url + '.git'}`;

    // ── Calculate Language Stack Ratios ──
    const rawLanguages = details?.languages || {};
    const totalLangBytes = Object.values(rawLanguages).reduce((a, b) => a + b, 0);

    const languageBreakdown = totalLangBytes > 0
        ? Object.entries(rawLanguages).map(([name, bytes]) => ({
            name,
            bytes,
            percentage: ((bytes / totalLangBytes) * 100).toFixed(1),
            color: getLangColor(name),
        }))
        : repo.language ? [{ name: repo.language, percentage: '100.0', color: getLangColor(repo.language) }] : [];

    // ── Maintainers / Contributors List ──
    const contributors = details?.contributors || [
        {
            login: repo.owner?.login || 'owner',
            avatar_url: repo.owner?.avatar_url,
            html_url: `https://github.com/${repo.owner?.login}`,
            contributions: Math.max(45, (repo.stargazers_count || 10) / 10),
        }
    ];

    return (
        <>
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
                                onClick={() => setShowShareModal(true)}
                                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                                title="Share Repository"
                            >
                                <Share2 className="w-4 h-4" />
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

                    {/* ── Scrollable Body ── */}
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-white font-sans">
                        
                        {/* Primary Stat Badges Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-3.5 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                    <Star className="w-4 h-4 fill-amber-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Stars</p>
                                    <p className="text-sm font-mono font-bold text-white">{formatNumber(repo.stargazers_count)}</p>
                                </div>
                            </div>

                            <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-3.5 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <GitFork className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Forks</p>
                                    <p className="text-sm font-mono font-bold text-white">{formatNumber(repo.forks_count)}</p>
                                </div>
                            </div>

                            <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-3.5 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Eye className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Watchers</p>
                                    <p className="text-sm font-mono font-bold text-white">{formatNumber(details?.subscribers_count || repo.watchers_count)}</p>
                                </div>
                            </div>

                            <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-3.5 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                                    <GitBranch className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Open Issues</p>
                                    <p className="text-sm font-mono font-bold text-white">{formatNumber(repo.open_issues_count)}</p>
                                </div>
                            </div>
                        </div>

                        {/* ── NEW: Open Source Repository Health & Security Scorecard ── */}
                        <RepoHealthScorecard
                            repo={repo}
                            details={details}
                            activity={activity}
                            issueStats={issueStats}
                        />

                        {/* Description & Topics */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">About Repository</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed bg-[#0A0A0C] border border-white/[0.06] rounded-xl p-4">
                                {repo.description || 'No description provided for this repository.'}
                            </p>

                            {repo.topics && repo.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {repo.topics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 hover:border-white/20 transition-colors"
                                        >
                                            #{topic}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tech Stack Language Breakdown */}
                        <div className="space-y-3 bg-[#0A0A0C] border border-white/10 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Tech Stack Language Breakdown</span>
                                </h3>
                                <span className="text-[10px] font-mono text-zinc-500">
                                    {languageBreakdown.length} {languageBreakdown.length === 1 ? 'Language' : 'Languages'}
                                </span>
                            </div>

                            {/* Multi-colored Progress Bar */}
                            <div className="h-2.5 w-full rounded-full bg-white/10 flex overflow-hidden">
                                {languageBreakdown.map((item) => (
                                    <div
                                        key={item.name}
                                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                        className="h-full transition-all duration-300"
                                        title={`${item.name}: ${item.percentage}%`}
                                    />
                                ))}
                            </div>

                            {/* Language Pills List */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {languageBreakdown.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300"
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="font-semibold text-white">{item.name}</span>
                                        <span className="text-zinc-500 text-[10px]">{item.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Maintainers & Contributors */}
                        <div className="space-y-3 bg-[#0A0A0C] border border-white/10 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Top Maintainers &amp; Contributors</span>
                                </h3>
                                <span className="text-[10px] font-mono text-zinc-500">
                                    Top {Math.min(6, contributors.length)} Active
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                {contributors.slice(0, 6).map((c) => (
                                    <a
                                        key={c.login}
                                        href={c.html_url || `https://github.com/${c.login}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <img
                                                src={c.avatar_url}
                                                alt={c.login}
                                                className="w-7 h-7 rounded-md border border-white/10 object-cover shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-mono font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                                                    @{c.login}
                                                </p>
                                                <p className="text-[10px] font-mono text-zinc-500">
                                                    {c.contributions ? `${formatNumber(c.contributions)} commits` : 'Maintainer'}
                                                </p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Clone Command Line */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">Quick Clone</h3>
                            <div className="flex items-center justify-between bg-[#0A0A0C] border border-white/10 rounded-xl p-3 font-mono text-xs text-zinc-300">
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pr-2">
                                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="whitespace-nowrap">{cloneCommand}</span>
                                </div>
                                <button
                                    onClick={handleCopyClone}
                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                                >
                                    {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Activity Chart & Issue Chart */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-4">
                                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">Commit Activity Rhythms</h4>
                                {loading ? (
                                    <div className="h-40 flex items-center justify-center text-xs font-mono text-zinc-600">Loading commit trends...</div>
                                ) : (
                                    <ActivityChart data={activity} />
                                )}
                            </div>

                            <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-4">
                                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">Issue Distribution</h4>
                                {loading ? (
                                    <div className="h-40 flex items-center justify-center text-xs font-mono text-zinc-600">Loading issue metrics...</div>
                                ) : (
                                    <IssueChart
                                        open={issueStats?.open ?? repo.open_issues_count ?? 15}
                                        closed={issueStats?.closed ?? Math.max(25, Math.round((repo.open_issues_count || 10) * 2.8))}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Local Notes Section */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Private Developer Note (Saved Locally)</span>
                                </h3>
                                {saved && <span className="text-xs font-mono text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Saved!</span>}
                            </div>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add private notes about this repo (e.g. key architecture components, integration ideas)..."
                                rows={3}
                                className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 font-mono focus:outline-none focus:border-white/30 transition-all resize-none"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveNote}
                                    className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold font-mono hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Local Note</span>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* ── Footer ── */}
                    <div className="bg-[#0E0E10] border-t border-white/[0.08] px-5 py-3.5 flex items-center justify-between text-xs font-mono text-zinc-400 shrink-0">
                        <span className="truncate max-w-[200px] sm:max-w-none">
                            GitHub ID: {repo.id}
                        </span>
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                        >
                            <span>Open on GitHub</span>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Share Repo Modal */}
            {showShareModal && (
                <ShareRepoModal repo={repo} onClose={() => setShowShareModal(false)} />
            )}
        </>
    );
};

export default RepositoryDetail;
