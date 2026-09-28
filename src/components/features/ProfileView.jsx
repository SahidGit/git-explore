import React, { useState, useEffect, useCallback } from 'react';
import { Key, User, AlertCircle, CheckCircle, RefreshCw, ExternalLink, Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { storageService } from '../../services/storageService';
import * as githubService from '../../services/githubService';
import { SkeletonRateLimit } from '../ui/SkeletonLoader';
import ContributionHeatmap from './Charts/ContributionHeatmap';

// ─── Rate limit meter ─────────────────────────────────
const RateLimitMeter = ({ used, limit, resetIn }) => {
    const remaining = limit - used;
    const pct = Math.max(0, Math.min(100, (remaining / limit) * 100));

    const meterColor =
        pct > 50 ? 'bg-emerald-500' :
        pct > 20 ? 'bg-amber-500' :
        'bg-red-500';

    return (
        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5 space-y-4">
            {/* Label row */}
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                    API Rate Limit
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                    Resets in {resetIn ?? '—'}
                </span>
            </div>

            {/* Linear meter */}
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${meterColor}`}
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={remaining}
                    aria-valuemin={0}
                    aria-valuemax={limit}
                    aria-label={`${remaining} of ${limit} requests remaining`}
                />
            </div>

            {/* Numbers */}
            <div className="flex items-baseline justify-between">
                <span className="font-mono text-[13px] text-white font-semibold">
                    {remaining.toLocaleString()}
                    <span className="text-zinc-500 font-normal"> / {limit.toLocaleString()}</span>
                </span>
                <span className="text-[11px] text-zinc-500">requests remaining</span>
            </div>
        </div>
    );
};

// ─── Featured Owner & Popular OSS Maintainers ─────────
const OWNER_PROFILE = {
    name: 'Sahid Sarfaraz',
    username: 'SahidGit',
    role: 'ExploreGit Founder & Lead Engineer',
    bio: 'Student x Software Engineer · Building ExploreGit',
    avatar: 'https://avatars.githubusercontent.com/u/208873568?v=4',
    badge: 'Creator & Lead',
};

const SUGGESTED_PROFILES = [
    {
        name: 'Peter Steinberger',
        username: 'steipete',
        role: 'Clawdbot / OpenClaw Creator',
        avatar: 'https://avatars.githubusercontent.com/u/58493?v=4',
        tag: 'AI Agents',
    },
    {
        name: 'shadcn',
        username: 'shadcn',
        role: 'Creator of shadcn/ui',
        avatar: 'https://avatars.githubusercontent.com/u/124599?v=4',
        tag: 'Design Systems',
    },
    {
        name: 'Anthony Fu',
        username: 'antfu',
        role: 'Vue / Vite / Nuxt Core Team',
        avatar: 'https://avatars.githubusercontent.com/u/11247099?v=4',
        tag: 'Core Dev',
    },
    {
        name: 'Linus Torvalds',
        username: 'torvalds',
        role: 'Linux Kernel & Git Creator',
        avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4',
        tag: 'Systems',
    },
    {
        name: 'Evan You',
        username: 'yyx990803',
        role: 'Vue.js & Vite Creator · VoidZero',
        avatar: 'https://avatars.githubusercontent.com/u/499550?v=4',
        tag: 'Frameworks',
    },
    {
        name: 'Charlie Marsh',
        username: 'charliermarsh',
        role: 'Astral Founder · uv & Ruff Creator',
        avatar: 'https://avatars.githubusercontent.com/u/1309177?v=4',
        tag: 'Tooling',
    },
];

// ─── Main ProfileView ─────────────────────────────────
const ProfileView = ({ filters, onFilterChange }) => {
    const [rateLimit, setRateLimit] = useState(null);
    const [rateLimitLoading, setRateLimitLoading] = useState(false);
    const [rateLimitError, setRateLimitError] = useState(null);
    const [hasToken, setHasToken] = useState(false);
    const [usernameInput, setUsernameInput] = useState(filters?.username || '');
    const [inputFocused, setInputFocused] = useState(false);

    // Keep input field synced if username is set externally or from suggested profile
    useEffect(() => {
        if (filters?.username !== undefined) {
            setUsernameInput(filters.username);
        }
    }, [filters?.username]);

    // Check token on mount
    useEffect(() => {
        setHasToken(!!storageService.getToken());
    }, []);

    // Fetch rate limit
    const fetchRateLimit = useCallback(async () => {
        setRateLimitLoading(true);
        setRateLimitError(null);
        try {
            const data = await githubService.getRateLimit();
            setRateLimit(data);
        } catch (err) {
            setRateLimitError(err.message || 'Failed to fetch rate limit');
        } finally {
            setRateLimitLoading(false);
        }
    }, []);

    useEffect(() => { fetchRateLimit(); }, [fetchRateLimit]);

    // Format reset time
    const getResetIn = (resetTimestamp) => {
        if (!resetTimestamp) return null;
        const diffMs = resetTimestamp * 1000 - Date.now();
        if (diffMs <= 0) return 'now';
        const diffMin = Math.ceil(diffMs / 60000);
        if (diffMin < 60) return `${diffMin}m`;
        return `${Math.ceil(diffMin / 60)}h`;
    };

    const triggerSearch = (usernameToSearch) => {
        const query = (usernameToSearch || usernameInput).trim();
        if (query) {
            onFilterChange?.({ ...filters, username: query });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            triggerSearch();
        }
    };

    const handleClearSearch = () => {
        setUsernameInput('');
        onFilterChange?.({ ...filters, username: '' });
    };

    const activeSearch = filters?.username?.trim();

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* ── Page header ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading mb-1">Developer Profile</h1>
                    <p className="text-xs sm:text-sm font-sans text-zinc-400">
                        Analyze contribution activity, followers, and coding patterns for any GitHub user.
                    </p>
                </div>

                {activeSearch && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="btn-saas-secondary text-xs h-[34px] px-3 gap-1.5"
                    >
                        <X className="w-3.5 h-3.5" />
                        <span>Clear Search (@{activeSearch})</span>
                    </button>
                )}
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

                {/* ── Left: username search + active profile view ── */}
                <div className="space-y-6">
                    {/* Username search form */}
                    <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5 space-y-3">
                        <label
                            htmlFor="profile-username"
                            className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500"
                        >
                            GitHub Username Search
                        </label>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                triggerSearch();
                            }}
                            className="flex items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <User
                                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${inputFocused ? 'text-white' : 'text-zinc-500'}`}
                                />
                                <input
                                    id="profile-username"
                                    type="text"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter GitHub handle (e.g. torvalds, SahidGit)..."
                                    autoComplete="off"
                                    spellCheck={false}
                                    className={`w-full bg-[#0A0A0C] border rounded-xl pl-10 pr-9 py-2.5 font-mono text-[13px] text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 ${
                                        inputFocused ? 'border-white/30 ring-1 ring-white/20' : 'border-white/[0.08] hover:border-white/20'
                                    }`}
                                />
                                {usernameInput && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 cursor-pointer"
                                        aria-label="Clear input"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!usernameInput.trim()}
                                className="btn-saas-primary text-xs h-[42px] px-5 gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span>Search</span>
                            </button>
                        </form>
                    </div>

                    {/* Active Profile Result (Heatmap & User Header) */}
                    {activeSearch ? (
                        <ContributionHeatmap username={activeSearch} />
                    ) : (
                        <div className="space-y-4">
                            {/* Featured Owner / Project Creator Spotlight Card */}
                            <div className="rounded-xl border border-white/15 bg-gradient-to-br from-[#14151B] to-[#0E0F13] p-5 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
                                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                        <span>Featured Creator</span>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/15 border border-blue-500/30 text-blue-400">
                                        {OWNER_PROFILE.badge}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                                    <div className="flex items-center gap-3.5">
                                        <img
                                            src={OWNER_PROFILE.avatar}
                                            alt={OWNER_PROFILE.name}
                                            className="w-14 h-14 rounded-full border-2 border-blue-500/30 shadow-lg bg-[#0A0A0C] flex-shrink-0"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-bold text-white tracking-tight">
                                                    {OWNER_PROFILE.name}
                                                </h3>
                                                <span className="text-xs font-mono text-zinc-400">
                                                    @{OWNER_PROFILE.username}
                                                </span>
                                            </div>
                                            <p className="text-xs text-blue-300 font-mono mt-0.5">
                                                {OWNER_PROFILE.role}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 mt-1">
                                                {OWNER_PROFILE.bio}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUsernameInput(OWNER_PROFILE.username);
                                            triggerSearch(OWNER_PROFILE.username);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow cursor-pointer whitespace-nowrap"
                                    >
                                        <span>View Activity &amp; Heatmap</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Popular Open Source Maintainers */}
                            <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5 space-y-4">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                    Popular &amp; Viral Open Source Creators
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {SUGGESTED_PROFILES.map((profile) => (
                                        <button
                                            key={profile.username}
                                            id={`profile-${profile.username}`}
                                            type="button"
                                            onClick={() => {
                                                setUsernameInput(profile.username);
                                                triggerSearch(profile.username);
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-transparent hover:border-white/20 hover:bg-white/[0.03] text-left transition-all duration-200 group cursor-pointer"
                                        >
                                            <img
                                                src={profile.avatar}
                                                alt={profile.name}
                                                className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0 bg-[#0A0A0C]"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="text-[12px] font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                                                        {profile.name}
                                                    </span>
                                                    {profile.tag && (
                                                        <span className="text-[9px] font-mono text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 flex-shrink-0">
                                                            {profile.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-zinc-400 font-mono truncate">
                                                    @{profile.username}
                                                </p>
                                                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                                                    {profile.role}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right: rate limit + token status ── */}
                <div className="space-y-4">
                    {/* Rate limit card */}
                    {rateLimitLoading ? (
                        <SkeletonRateLimit />
                    ) : rateLimitError ? (
                        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 text-zinc-500" />
                                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">API Rate Limit</span>
                            </div>
                            <p className="text-[12px] text-zinc-500 mb-3">{rateLimitError}</p>
                            <button
                                type="button"
                                onClick={fetchRateLimit}
                                className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Retry
                            </button>
                        </div>
                    ) : rateLimit ? (
                        <RateLimitMeter
                            used={rateLimit.resources?.core?.used ?? 0}
                            limit={rateLimit.resources?.core?.limit ?? 60}
                            resetIn={getResetIn(rateLimit.resources?.core?.reset)}
                        />
                    ) : null}

                    {/* Token status card */}
                    <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Key className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
                            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                                Authentication Status
                            </span>
                        </div>

                        {hasToken ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                    <span className="text-[13px] font-medium text-white">Token Connected</span>
                                </div>
                                <p className="text-[12px] text-zinc-500 leading-relaxed">
                                    Your token unlocks 5,000 requests per hour. Stored in{' '}
                                    <code className="font-mono text-zinc-400">sessionStorage</code> only.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-zinc-600 flex-shrink-0" />
                                    <span className="text-[13px] font-medium text-zinc-300">Unauthenticated Mode</span>
                                </div>
                                <p className="text-[12px] text-zinc-500 leading-relaxed">
                                    Unauthenticated requests are rate limited to 60 req/hr. Connect a token in the top navigation to unlock 5,000 req/hr.
                                </p>
                                <a
                                    href="https://github.com/settings/tokens/new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-white transition-colors duration-200 group"
                                >
                                    Generate Token on GitHub
                                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Privacy note */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex items-start gap-2.5">
                            <CheckCircle className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                Searches and personal access tokens run client-side. Zero telemetry or server retention.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
