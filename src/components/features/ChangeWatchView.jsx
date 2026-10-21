import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  TrendingUp,
  RefreshCw,
  Trash2,
  ExternalLink,
  Plus,
  Clock,
  Star,
  Search,
  Loader2,
  Info,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { getRepositoryDetails, searchRepositories } from '../../services/githubService';
import { formatNumber, getRelativeTime } from '../../utils/formatters';

const SUGGESTED_WATCH = [
  { name: 'vllm-project/vllm', desc: 'High-throughput LLM serving engine.', stars: 38600 },
  { name: 'astral-sh/uv', desc: 'Fast Python package installer and resolver in Rust.', stars: 41200 },
  { name: 'ollama/ollama', desc: 'Local runtime for quantised GGUF model execution.', stars: 112500 },
  { name: 'biomejs/biome', desc: 'Sub-millisecond AST parser toolchain.', stars: 16800 },
];

const ChangeWatchView = ({ onSelectRepo }) => {
  const [watchedRepos, setWatchedRepos] = useState(() => storageService.getChangeWatchRepos());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTimestamps, setRefreshTimestamps] = useState({});

  // Search input for adding repos
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Refresh observation for a single watched repo
  const refreshSingleRepo = async (repoName) => {
    const [owner, repoShort] = repoName.includes('/') ? repoName.split('/') : ['', repoName];
    if (!owner || !repoShort) return;

    try {
      const details = await getRepositoryDetails(owner, repoShort);
      if (details?.stargazers_count !== undefined) {
        const updated = storageService.recordChangeWatchObservation(repoName, details.stargazers_count);
        setWatchedRepos(updated);
        setRefreshTimestamps((prev) => ({ ...prev, [repoName]: new Date().toISOString() }));
      }
    } catch (err) {
      console.error(`Failed to refresh observation for ${repoName}:`, err);
    }
  };

  // Refresh all watched repos
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.allSettled(watchedRepos.map((r) => refreshSingleRepo(r.name)));
    setIsRefreshing(false);
  };

  const handleAddRepo = (repoObj) => {
    const stars = repoObj.stargazers_count || repoObj.stars || 0;
    const updated = storageService.addToChangeWatch(repoObj, stars);
    setWatchedRepos(updated);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveRepo = (repoName) => {
    const updated = storageService.removeFromChangeWatch(repoName);
    setWatchedRepos(updated);
  };

  // Debounced search for adding repositories
  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await searchRepositories({ query: trimmed, perPage: 5 });
        setSearchResults(res.items || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E12] border border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
              Repository Change Watch
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Save repositories locally and compare current stars with your prior device-local observations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {watchedRepos.length > 0 && (
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              <span>{isRefreshing ? 'Checking…' : 'Refresh All'}</span>
            </button>
          )}

          {/* Add repo input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Watch repo for changes…"
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
            />

            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 p-1 rounded-xl bg-[#141419] border border-white/15 shadow-2xl z-30 divide-y divide-white/[0.05]">
                {searchResults.map((r) => (
                  <div
                    key={r.id}
                    className="p-2 flex items-center justify-between gap-2 hover:bg-white/[0.05] rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-white truncate">
                        {r.full_name || r.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddRepo(r)}
                      className="px-2.5 py-1 rounded text-[11px] font-mono bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 transition-colors shrink-0"
                    >
                      + Watch
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Device-Local Disclaimer Notice */}
      <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-200 font-mono text-[10px] uppercase block tracking-wider mb-0.5">
            Device-Local Observation Policy
          </strong>
          All observation timestamps and star baseline counts are stored privately in your browser's localStorage. ExploreGit never represents device-local observations as global metrics or fixed 7-day intervals.
        </div>
      </div>

      {watchedRepos.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0E0E12] border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              No Repositories on Change Watch
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
              Add repositories to record initial star baselines and monitor changes between your visits to ExploreGit.
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-2">
              Suggested Repositories to Watch:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTED_WATCH.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleAddRepo({ name: s.name, full_name: s.name, description: s.desc, stargazers_count: s.stars })}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {watchedRepos.map((repo) => {
            const firstStars = repo.firstObservedStars || 0;
            const currentStars = repo.lastCheckedStars || firstStars;
            const delta = currentStars - firstStars;
            const elapsedMs = Math.max(0, (repo.lastCheckedAt || Date.now()) - (repo.firstObservedAt || Date.now()));
            const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
            const elapsedHours = Math.floor(elapsedMs / (60 * 60 * 1000));

            const elapsedLabel =
              elapsedDays >= 1
                ? `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'}`
                : `${elapsedHours} ${elapsedHours === 1 ? 'hour' : 'hours'}`;

            return (
              <div
                key={repo.name}
                className="p-5 rounded-2xl bg-[#0E0E12] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold font-mono text-white truncate">
                        <a
                          href={repo.html_url || `https://github.com/${repo.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{repo.name}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {repo.description || 'Monitored repository on this device.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => refreshSingleRepo(repo.name)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Check current stars now"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRepo(repo.name)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove from change watch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 rounded-xl bg-black/40 border border-white/[0.05] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">First Observed</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        ★ {firstStars.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">
                        {new Date(repo.firstObservedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Current / Last Checked</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        ★ {currentStars.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">
                        {getRelativeTime(new Date(repo.lastCheckedAt).toISOString())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Measured Delta Banner */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    {delta > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-emerald-400">
                          +{delta.toLocaleString()} stars on this device
                        </span>
                      </>
                    ) : delta < 0 ? (
                      <span className="font-bold text-rose-400">
                        {delta.toLocaleString()} stars on this device
                      </span>
                    ) : (
                      <span className="text-zinc-400">
                        ±0 stars since baseline recorded
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-zinc-500">
                    over {elapsedLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChangeWatchView;
