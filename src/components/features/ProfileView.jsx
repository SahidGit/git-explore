import React, { useState, useEffect, useCallback } from 'react';
import { Key, User, AlertCircle, CheckCircle, RefreshCw, ExternalLink, Search, X } from 'lucide-react';
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

// ─── Profile quick cards ──────────────────────────────
const SUGGESTED_PROFILES = [
    { name: 'SahidSarfaraz', username: 'SahidGit', role: 'Project Owner', avatar: 'https://avatars.githubusercontent.com/u/106660867?v=4', owner: true },
    { name: 'Linus Torvalds', username: 'torvalds', role: 'Linux & Git creator', avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4' },
    { name: 'Evan You', username: 'yyx990803', role: 'Vue.js creator', avatar: 'https://avatars.githubusercontent.com/u/499550?v=4' },
    { name: 'Dan Abramov', username: 'gaearon', role: 'React core team', avatar: 'https://avatars.githubusercontent.com/u/810438?v=4' },
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
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Developer Profile</h1>
                    <p className="text-[13px] text-zinc-500">
                        Analyze contribution activity, followers, and coding patterns for any GitHub user.
                    </p>
                </div>

                {activeSearch && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
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
                                    className={`w-full bg-[#0A0A0C] border rounded-xl pl-10 pr-9 py-3 font-mono text-[13px] text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 ${
                                        inputFocused ? 'border-white/30 ring-1 ring-white/20' : 'border-white/[0.08] hover:border-white/20'
                                    }`}
                                />
                                {usernameInput && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5"
                                        aria-label="Clear input"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!usernameInput.trim()}
                                className={`px-5 py-3 rounded-xl font-semibold text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                                    usernameInput.trim()
                                        ? 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'
                                        : 'bg-white/10 text-zinc-500 cursor-not-allowed border border-white/10'
                                }`}
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
                        /* Suggested profiles when no user is searched */
                        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
                                Suggested Open Source Maintainers
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {SUGGESTED_PROFILES.map((profile) => (
                                    <button
                                        key={profile.username}
                                        id={`profile-${profile.username}`}
                                        type="button"
                                        onClick={() => {
                                            setUsernameInput(profile.username);
                                            triggerSearch(profile.username);
                                        }}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 group cursor-pointer ${
                                            profile.owner
                                                ? 'border-white/20 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]'
                                                : 'border-white/[0.06] bg-transparent hover:border-white/20 hover:bg-white/[0.03]'
                                        }`}
                                    >
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0 bg-[#0A0A0C]"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[13px] font-semibold text-white truncate group-hover:text-zinc-200">
                                                    {profile.name}
                                                </span>
                                                {profile.owner && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                                                        Owner
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-zinc-500 font-mono truncate">
                                                @{profile.username}
                                            </p>
                                        </div>
                                    </button>
                                ))}
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
                                    <span className="relative flex h-2 w-2 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
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
