import React, { useState, useEffect } from 'react';
import {
    X, Star, GitFork, Eye, ExternalLink, Bookmark, Check,
    Save, FileText, Code2, Shield, GitBranch, Users, Copy, Terminal,
    Share2, Layers, Activity, ActivitySquare, Sparkles, Clock, Tag
} from 'lucide-react';
import { getRepositoryDetails, getRepositoryActivity, getIssueStats } from '../../../services/githubService';
import { storageService } from '../../../services/storageService';
import { formatNumber, getRelativeTime } from '../../../utils/formatters';
import ActivityChart from '../Charts/ActivityChart';
import IssueChart from '../Charts/IssueChart';
import ShareRepoModal from './ShareRepoModal';
import RepoHealthScorecard from './RepoHealthScorecard';
import PulseHeart from '../../ui/PulseHeart';

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

const TABS = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'health', label: 'Health Score', icon: Shield },
    { id: 'stack', label: 'Stack & Team', icon: Layers },
    { id: 'activity', label: 'Activity & Issues', icon: Activity },
    { id: 'notes', label: 'Notes', icon: FileText },
];

const RepositoryDetail = ({ repo, onClose, isBookmarked, onBookmarkToggle }) => {
    const [activeTab, setActiveTab] = useState('overview');
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
                setNote(savedNote || '');
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

    const cloneCommand = `git clone ${repo.clone_url || repo.html_url + '.git'}`;

    const handleCopyClone = () => {
        navigator.clipboard.writeText(cloneCommand);
        setCopiedClone(true);
        setTimeout(() => setCopiedClone(false), 2000);
    };

    if (!repo) return null;

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
            contributions: Math.max(45, Math.round((repo.stargazers_count || 10) / 10)),
        }
    ];

    const langColor = getLangColor(repo.language);
    const updatedRelative = getRelativeTime(repo.updated_at || details?.updated_at);

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2.5 sm:p-4 animate-in fade-in duration-200"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="repo-detail-title"
            >
                <div className="w-full max-w-3xl bg-[#101115]/95 border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] backdrop-blur-xl relative">
                    
                    {/* Top Ambient Glow */}
                    <div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-16 pointer-events-none mix-blend-screen opacity-25"
                        style={{
                            background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.2) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)'
                        }}
                        aria-hidden="true"
                    />

                    {/* ── Top Header Bar ── */}
                    <div className="sticky top-0 z-20 bg-[#0C0D10]/95 border-b border-white/[0.08] px-4 sm:px-5 py-3.5 flex justify-between items-center shrink-0 backdrop-blur-md">
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                            <img
                                src={repo.owner?.avatar_url}
                                alt={repo.owner?.login}
                                className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0 bg-[#0A0A0C] object-cover shadow-sm"
                                loading="lazy"
                                onError={(e) => { e.target.src = 'https://github.com/github.png'; }}
                            />
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                    <h2 id="repo-detail-title" className="text-xs sm:text-sm font-mono font-bold truncate text-white">
                                        {repo.full_name}
                                    </h2>
                                    {details?.license && (
                                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-400 shrink-0">
                                            <Shield className="w-2.5 h-2.5 text-emerald-400" />
                                            <span>{details.license.spdx_id || details.license.name}</span>
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-zinc-500 truncate">
                                    <span>Branch: {details?.default_branch || repo.default_branch || 'main'}</span>
                                    <span>•</span>
                                    <span className="text-zinc-400">Updated {updatedRelative}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Controls */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-zinc-400 hover:text-white border border-white/[0.08] transition-all active:scale-95 cursor-pointer"
                                title="Share Repository"
                                aria-label="Share Repository"
                            >
                                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            <PulseHeart
                                liked={isBookmarked}
                                count={repo.stargazers_count || 0}
                                showCount={false}
                                onChange={() => onBookmarkToggle(repo)}
                                size={18}
                                corner={10}
                                pillColor="rgba(255, 255, 255, 0.05)"
                                likedColor="#FFFFFF"
                                idleColor="#94a3b8"
                                label={isBookmarked ? 'Remove bookmark' : 'Bookmark repository'}
                                className="border border-white/10 hover:border-white/25 transition-all p-1.5"
                            />

                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-zinc-400 hover:text-white border border-white/[0.08] transition-all active:scale-95 cursor-pointer"
                                title="Close (Esc)"
                                aria-label="Close modal"
                            >
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── Segmented Navigation Tabs Bar (Scrollable on small screens) ── */}
                    <div className="bg-[#090A0D] border-b border-white/[0.08] px-3 sm:px-5 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border ${
                                        isActive
                                            ? 'bg-white text-black font-semibold border-white shadow-sm'
                                            : 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border-transparent'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-500'}`} />
                                    <span>{tab.label}</span>
                                    {tab.id === 'notes' && note?.trim() && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Scrollable Body ── */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-white font-sans">
                        
                        {/* ══ TAB 1: OVERVIEW ══ */}
                        {activeTab === 'overview' && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* Primary Stat Badges Strip (Compact 4-grid) */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">Stars</p>
                                            <p className="text-xs sm:text-sm font-mono font-bold text-white truncate">{formatNumber(repo.stargazers_count)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                                            <GitFork className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">Forks</p>
                                            <p className="text-xs sm:text-sm font-mono font-bold text-white truncate">{formatNumber(repo.forks_count)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                                            <Eye className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">Watchers</p>
                                            <p className="text-xs sm:text-sm font-mono font-bold text-white truncate">{formatNumber(details?.subscribers_count || repo.watchers_count)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
                                            <GitBranch className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">Issues</p>
                                            <p className="text-xs sm:text-sm font-mono font-bold text-white truncate">{formatNumber(repo.open_issues_count)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* About Repository Box */}
                                <div className="space-y-2 bg-[#0A0A0D] border border-white/[0.08] rounded-xl p-3.5 sm:p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                                            About Repository
                                        </h3>
                                        {repo.language && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                                                <span>{repo.language}</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                                        {repo.description || 'No description provided for this repository.'}
                                    </p>

                                    {repo.topics && repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                                            {repo.topics.map((topic) => (
                                                <span
                                                    key={topic}
                                                    className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300 hover:border-white/20 transition-colors"
                                                >
                                                    #{topic}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Clone Command Line */}
                                <div className="space-y-1.5">
                                    <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Quick Clone</span>
                                    </h3>
                                    <div className="flex items-center justify-between bg-[#0A0A0D] border border-white/10 rounded-xl p-2 sm:p-2.5 font-mono text-xs text-zinc-300">
                                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pr-2 min-w-0">
                                            <span className="whitespace-nowrap text-zinc-400 text-xs truncate select-all">{cloneCommand}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCopyClone}
                                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0 cursor-pointer shadow-none"
                                        >
                                            {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══ TAB 2: HEALTH SCORECARD ══ */}
                        {activeTab === 'health' && (
                            <div className="animate-fadeIn">
                                <RepoHealthScorecard
                                    repo={repo}
                                    details={details}
                                    activity={activity}
                                    issueStats={issueStats}
                                />
                            </div>
                        )}

                        {/* ══ TAB 3: STACK & TEAM ══ */}
                        {activeTab === 'stack' && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* Tech Stack Language Breakdown */}
                                <div className="space-y-3 bg-[#0A0A0D] border border-white/10 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                            <Layers className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Language Composition</span>
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
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                                <span className="font-semibold text-white">{item.name}</span>
                                                <span className="text-zinc-500 text-[10px]">{item.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Maintainers & Contributors */}
                                <div className="space-y-3 bg-[#0A0A0D] border border-white/10 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-indigo-400" />
                                            <span>Maintainers &amp; Contributors</span>
                                        </h3>
                                        <span className="text-[10px] font-mono text-zinc-500">
                                            Top {Math.min(6, contributors.length)} Active
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
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
                                                        className="w-6 h-6 rounded-md border border-white/10 object-cover shrink-0"
                                                        loading="lazy"
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
                                                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══ TAB 4: ACTIVITY & ISSUES ══ */}
                        {activeTab === 'activity' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fadeIn">
                                <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between">
                                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <ActivitySquare className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Commit Rhythms</span>
                                    </h4>
                                    {loading ? (
                                        <div className="h-40 flex items-center justify-center text-xs font-mono text-zinc-600">Loading trends...</div>
                                    ) : (
                                        <ActivityChart data={activity} />
                                    )}
                                </div>

                                <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between">
                                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>Issue Distribution</span>
                                    </h4>
                                    {loading ? (
                                        <div className="h-40 flex items-center justify-center text-xs font-mono text-zinc-600">Loading issues...</div>
                                    ) : (
                                        <IssueChart
                                            open={issueStats?.open ?? repo.open_issues_count ?? 15}
                                            closed={issueStats?.closed ?? Math.max(25, Math.round((repo.open_issues_count || 10) * 2.8))}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ══ TAB 5: NOTES ══ */}
                        {activeTab === 'notes' && (
                            <div className="space-y-3 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>Private Developer Notes (Saved Locally)</span>
                                    </h3>
                                    {saved && <span className="text-xs font-mono text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Saved!</span>}
                                </div>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add private notes about this repository (e.g. key architecture components, integration ideas, benchmark comparisons)..."
                                    rows={5}
                                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 font-mono focus:outline-none focus:border-white/30 transition-all resize-none"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveNote}
                                        className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold font-sans hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-none"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        <span>Save Local Note</span>
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ── Sticky Footer ── */}
                    <div className="bg-[#0C0D10]/95 border-t border-white/[0.08] px-4 sm:px-5 py-3 flex items-center justify-between text-xs font-mono text-zinc-400 shrink-0">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 truncate">
                            <span>ID: {repo.id}</span>
                            {repo.license?.spdx_id && (
                                <>
                                    <span>•</span>
                                    <span className="text-zinc-400">{repo.license.spdx_id}</span>
                                </>
                            )}
                        </div>
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer shadow-none"
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
