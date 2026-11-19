import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Tag,
  GitPullRequest,
  GitCommit,
  ExternalLink,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getWhatChangedDigest } from '../../../services/githubService';

const WhatChangedDigest = ({ repo }) => {
  const [days, setDays] = useState(30);
  const [debouncedDays, setDebouncedDays] = useState(30);
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  // Debounce days changes — prevents firing a new API call for every click
  const handleDaysChange = (val) => {
    setDays(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedDays(val), 350);
  };

  const owner = repo.owner?.login || repo.full_name?.split('/')[0] || '';
  const repoName = repo.name || repo.full_name?.split('/')[1] || '';

  useEffect(() => {
    let isMounted = true;
    const fetchDigest = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWhatChangedDigest(owner, repoName, debouncedDays);
        if (isMounted) setDigest(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch digest');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (owner && repoName) {
      fetchDigest();
    }
  }, [owner, repoName, debouncedDays]);

  const timeRangeOptions = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
  ];

  const releases = digest?.releases || [];
  const mergedPRs = digest?.mergedPRs || [];
  const commits = digest?.commits || [];

  return (
    <div className="space-y-4 font-sans text-left">
      {/* Header and Time Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-black/40 border border-white/[0.08]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>"What Changed?" Activity Digest</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Verifiable recent releases, merged PRs, and commits. No fabricated summaries.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-white/10 shrink-0">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleDaysChange(opt.value)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                days === opt.value
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {digest && (
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
          <span>Window: Past {days} days (since {new Date(digest.sinceDate).toLocaleDateString()})</span>
          <span>Fetched: {new Date(digest.fetchedAt).toLocaleTimeString()}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span>Indexing activity stream for past {days} days…</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Section 1: Recent Releases */}
          <div className="p-4 rounded-xl bg-[#0A0A0D] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Releases in Window ({releases.length})</span>
              </h4>
              <a
                href={`https://github.com/${owner}/${repoName}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View all releases</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {releases.length > 0 ? (
              <div className="divide-y divide-white/[0.05]">
                {releases.map((rel) => (
                  <div key={rel.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {rel.tagName}
                        </span>
                        <span className="text-xs font-medium text-white truncate">
                          {rel.name || rel.tagName}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">
                        Published on {new Date(rel.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={rel.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white p-1 transition-colors shrink-0"
                      title="Inspect release notes on GitHub"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-sans text-zinc-400 py-2">
                No official releases tagged within the last {days} days.
              </p>
            )}
          </div>

          {/* Section 2: Merged Pull Requests */}
          <div className="p-4 rounded-xl bg-[#0A0A0D] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
                <span>Merged Pull Requests ({mergedPRs.length})</span>
              </h4>
              <a
                href={`https://github.com/${owner}/${repoName}/pulls?q=is%3Apr+is%3Amerged`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {mergedPRs.length > 0 ? (
              <div className="divide-y divide-white/[0.05]">
                {mergedPRs.map((pr) => (
                  <div key={pr.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white hover:text-blue-400 transition-colors truncate">
                        <a href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
                          #{pr.number} {pr.title}
                        </a>
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">
                        Merged by @{pr.author} · {new Date(pr.mergedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={pr.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white p-1 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-sans text-zinc-400 py-2">
                No merged pull requests recorded in the last {days} days.
              </p>
            )}
          </div>

          {/* Section 3: Recent Commits */}
          <div className="p-4 rounded-xl bg-[#0A0A0D] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <GitCommit className="w-3.5 h-3.5 text-blue-400" />
                <span>Recent Commits in Window ({commits.length})</span>
              </h4>
              <a
                href={`https://github.com/${owner}/${repoName}/commits`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>All commits</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {commits.length > 0 ? (
              <div className="divide-y divide-white/[0.05]">
                {commits.map((c) => (
                  <div key={c.sha} className="py-2 flex items-center justify-between gap-3 font-mono text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-zinc-400">
                          {c.sha}
                        </span>
                        <span className="text-xs text-zinc-200 truncate font-sans">
                          {c.message}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {c.author} · {c.date ? new Date(c.date).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <a
                      href={c.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white p-1 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-sans text-zinc-400 py-2">
                No commits pushed to default branch in the selected timeframe.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatChangedDigest;
