import React, { useState, useEffect, useCallback } from 'react';
import {
  Radio,
  Tag,
  ExternalLink,
  Plus,
  Trash2,
  Calendar,
  Loader2,
  AlertCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { getRepositoryReleases, searchRepositories } from '../../services/githubService';

const SUGGESTED_REPOS = [
  { name: 'astral-sh/uv', desc: 'Fast Python package installer and resolver in Rust.' },
  { name: 'vllm-project/vllm', desc: 'High-throughput LLM serving engine.' },
  { name: 'biomejs/biome', desc: 'Unified toolchain for JS/TS formatting and linting.' },
  { name: 'tauri-apps/tauri', desc: 'Cross-platform app runtime with native webviews.' },
];

const ReleaseRadarView = ({ onSelectRepo }) => {
  const [followedRepos, setFollowedRepos] = useState(() => storageService.getFollowedReleases());
  const [radarData, setRadarData] = useState({});
  const [loading, setLoading] = useState(true);

  // Search input for adding repos to radar
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch releases for all followed repos
  const fetchRadar = useCallback(async (repos) => {
    if (!repos || repos.length === 0) {
      setRadarData({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const results = {};

    await Promise.allSettled(
      repos.map(async (r) => {
        const [owner, repoShort] = r.name.includes('/') ? r.name.split('/') : [r.owner, r.repo || r.name];
        try {
          const releases = await getRepositoryReleases(owner, repoShort, 3);
          results[r.name] = {
            releases,
            fetchedAt: new Date().toISOString(),
          };
        } catch {
          results[r.name] = {
            releases: [],
            fetchedAt: new Date().toISOString(),
          };
        }
      })
    );

    setRadarData(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRadar(followedRepos);
  }, [followedRepos, fetchRadar]);

  const handleToggleFollow = (repoObj) => {
    const updated = storageService.toggleFollowRelease(repoObj);
    setFollowedRepos(updated);
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
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
              Release Radar
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Track published version releases from open-source repositories you follow. Links directly to GitHub release notes.
          </p>
        </div>

        {/* Add repository input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Follow repo for releases…"
            className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
          />

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 p-1 rounded-xl bg-[#141419] border border-white/15 shadow-2xl z-30 divide-y divide-white/[0.05]">
              {searchResults.map((r) => {
                const isFollowed = followedRepos.some((f) => f.name === (r.full_name || r.name));
                return (
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
                      onClick={() => {
                        handleToggleFollow(r);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono shrink-0 transition-colors ${
                        isFollowed
                          ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
                          : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                      }`}
                    >
                      {isFollowed ? 'Unfollow' : '+ Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {followedRepos.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0E0E12] border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              No Repositories Followed in Release Radar
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
              Follow open-source projects to monitor their latest tagged versions, changelog notes, and publish dates.
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-2">
              Suggested Repositories to Follow:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTED_REPOS.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleToggleFollow({ name: s.name, full_name: s.name, description: s.desc })}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {followedRepos.map((repo) => {
            const data = radarData[repo.name];
            const releases = data?.releases || [];
            const hasFetched = Boolean(data);

            return (
              <div
                key={repo.name}
                className="p-5 rounded-2xl bg-[#0E0E12] border border-white/10 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2 truncate">
                      <span>{repo.name}</span>
                      <a
                        href={repo.html_url || `https://github.com/${repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {repo.description || 'Monitored repository on GitHub.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFollow(repo)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Unfollow</span>
                    </button>
                  </div>
                </div>

                {loading && !hasFetched ? (
                  <div className="py-4 flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Fetching releases from GitHub API…</span>
                  </div>
                ) : releases.length === 0 ? (
                  <div className="py-3 px-4 rounded-xl bg-black/40 border border-white/[0.04] text-xs text-zinc-400 font-sans flex items-center justify-between">
                    <span>
                      No official releases published on GitHub for this project (development tracks main branch).
                    </span>
                    <a
                      href={`https://github.com/${repo.name}/commits`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-[11px] font-mono shrink-0 ml-2"
                    >
                      View commits ↗
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {releases.map((rel) => (
                      <div
                        key={rel.id}
                        className="p-3 rounded-xl bg-black/40 border border-white/[0.06] hover:border-white/15 transition-all flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {rel.tagName}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {new Date(rel.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-white font-medium mt-1.5 truncate">
                            {rel.name || rel.tagName}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/[0.04] flex justify-end">
                          <a
                            href={rel.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:underline"
                          >
                            <span>Release Notes</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReleaseRadarView;
