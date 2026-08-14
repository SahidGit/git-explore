import React, { useState, useEffect, useCallback } from 'react';
import { Key, User, AlertCircle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { storageService } from '../../services/storageService';
import * as githubService from '../../services/githubService';

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
    { name: 'SahidGit', username: 'SahidGit', role: 'Project Owner', avatar: 'https://avatars.githubusercontent.com/u/106660867?v=4', owner: true },
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

    const handleUsernameSearch = (e) => {
        if (e.key === 'Enter' && usernameInput.trim()) {
            onFilterChange?.({ ...filters, username: usernameInput.trim() });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* ── Page header ── */}
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Developer Profile</h1>
                <p className="text-[13px] text-zinc-500">
                    Analyze contribution activity and coding patterns for any GitHub user.
                </p>
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

                {/* ── Left: username search + heatmap slot ── */}
                <div className="space-y-5">
                    {/* Username input */}
                    <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5">
                        <label
                            htmlFor="profile-username"
                            className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3"
                        >
                            GitHub Username
                        </label>
                        <div className="relative">
                            <User
                                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${inputFocused ? 'text-zinc-400' : 'text-zinc-600'}`}
                            />
                            <input
                                id="profile-username"
                                type="text"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                onKeyDown={handleUsernameSearch}
                                placeholder="e.g. torvalds"
                                autoComplete="off"
                                spellCheck={false}
                                className={`w-full bg-[#0A0A0C] border rounded-xl pl-10 pr-4 py-3 font-mono text-[13px] text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 ${
                                    inputFocused ? 'border-white/25' : 'border-white/[0.08] hover:border-white/15'
                                }`}
                            />
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-2 font-mono">
                            Press <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-500 text-[10px]">Enter</kbd> to search
                        </p>
                    </div>

                    {/* Suggested profiles */}
                    {!filters?.username && (
                        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
                                Legends of Open Source
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {SUGGESTED_PROFILES.map((profile) => (
                                    <button
                                        key={profile.username}
                                        id={`profile-${profile.username}`}
                                        onClick={() => {
                                            setUsernameInput(profile.username);
                                            onFilterChange?.({ ...filters, username: profile.username });
                                        }}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 group ${
                                            profile.owner
                                                ? 'border-white/15 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'
                                                : 'border-white/[0.06] bg-transparent hover:border-white/15 hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-9 h-9 rounded-lg border border-white/[0.08] flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[13px] font-semibold text-white truncate">
                                                    {profile.name}
                                                </span>
                                                {profile.owner && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white/[0.06] border border-white/10 text-zinc-400 flex-shrink-0">
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
                        <div className="rounded-xl border border-white/[0.06] bg-[#121215] p-5 animate-pulse h-32">
                            <div className="h-2 w-24 rounded-full bg-white/[0.06] mb-4" />
                            <div className="h-1.5 w-full rounded-full bg-white/[0.06] mb-3" />
                            <div className="h-3 w-40 rounded-full bg-white/[0.07]" />
                        </div>
                    ) : rateLimitError ? (
                        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 text-zinc-500" />
                                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">API Rate Limit</span>
                            </div>
                            <p className="text-[12px] text-zinc-500 mb-3">{rateLimitError}</p>
                            <button
                                onClick={fetchRateLimit}
                                className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-white transition-colors duration-200"
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
                                Authentication
                            </span>
                        </div>

                        {hasToken ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    <span className="text-[13px] font-medium text-white">Token connected</span>
                                </div>
                                <p className="text-[12px] text-zinc-500 leading-relaxed">
                                    Your token provides 5,000 requests per hour. Stored in{' '}
                                    <code className="font-mono text-zinc-400">sessionStorage</code> only.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-zinc-600 flex-shrink-0" />
                                    <span className="text-[13px] font-medium text-zinc-300">No token</span>
                                </div>
                                <p className="text-[12px] text-zinc-500 leading-relaxed">
                                    Without a token, the GitHub API allows 60 requests per hour. Connect a token
                                    via the nav to unlock 5,000 req/hr.
                                </p>
                                <a
                                    href="https://github.com/settings/tokens/new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-white transition-colors duration-200 group"
                                >
                                    Generate token on GitHub
                                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Privacy note */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex items-start gap-2.5">
                            <CheckCircle className="w-3.5 h-3.5 text-zinc-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                Your token is stored exclusively in your browser&apos;s sessionStorage and is
                                never transmitted to GitExplorer servers. It is only used to authenticate
                                requests to the GitHub API directly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
