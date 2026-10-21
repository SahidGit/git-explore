import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  Plus,
  X,
  Star,
  GitFork,
  GitBranch,
  Tag,
  Clock,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  Scale,
  Sparkles,
} from 'lucide-react';
import Header from '../components/layouts/Header';
import { SubFooter } from '../components/layouts/Footer';
import SEO from '../components/ui/SEO';
import BackToTop from '../components/ui/BackToTop';
import { getRepositoryCompareData, searchRepositories } from '../services/githubService';
import { checkLicenseCompatibility, normalizeSpdx } from '../data/licenseCompatibility';
import { formatNumber, getRelativeTime } from '../utils/formatters';

const PRESET_COMPARISONS = [
  { label: 'uv vs pip', repos: ['astral-sh/uv', 'pypa/pip'] },
  { label: 'vLLM vs Ollama vs Llama.cpp', repos: ['vllm-project/vllm', 'ollama/ollama', 'ggml-org/llama.cpp'] },
  { label: 'Biome vs Prettier', repos: ['biomejs/biome', 'prettier/prettier'] },
  { label: 'Tauri vs Electron', repos: ['tauri-apps/tauri', 'electron/electron'] },
];

const RepositoryCompare = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial repositories from searchParams
  const getInitialRepos = () => {
    const r1 = searchParams.get('repo1') || 'astral-sh/uv';
    const r2 = searchParams.get('repo2') || 'pypa/pip';
    const r3 = searchParams.get('repo3');
    return [r1, r2, r3].filter(Boolean);
  };

  const [selectedRepoNames, setSelectedRepoNames] = useState(getInitialRepos);
  const [compareData, setCompareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New repo search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Sync to URL
  const syncToUrl = (repos) => {
    const params = {};
    if (repos[0]) params.repo1 = repos[0];
    if (repos[1]) params.repo2 = repos[1];
    if (repos[2]) params.repo3 = repos[2];
    setSearchParams(params, { replace: true });
  };

  const loadData = useCallback(async (repoList) => {
    if (!repoList || repoList.length === 0) {
      setCompareData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getRepositoryCompareData(repoList);
      setCompareData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedRepoNames);
  }, [selectedRepoNames, loadData]);

  // Handle removing a repo from comparison
  const handleRemoveRepo = (indexToRemove) => {
    if (selectedRepoNames.length <= 1) return;
    const updated = selectedRepoNames.filter((_, idx) => idx !== indexToRemove);
    setSelectedRepoNames(updated);
    syncToUrl(updated);
  };

  // Handle adding a repo to comparison (up to 3)
  const handleAddRepo = (fullName) => {
    if (!fullName || selectedRepoNames.includes(fullName) || selectedRepoNames.length >= 3) return;
    const updated = [...selectedRepoNames, fullName];
    setSelectedRepoNames(updated);
    syncToUrl(updated);
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle preset click
  const handleSelectPreset = (presetRepos) => {
    setSelectedRepoNames(presetRepos);
    syncToUrl(presetRepos);
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
        const res = await searchRepositories({ query: trimmed, perPage: 6 });
        setSearchResults(res.items || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // License compatibility comparisons between pairs
  const repo1 = compareData[0];
  const repo2 = compareData[1];
  const repo3 = compareData[2];

  const licensePair12 =
    repo1 && repo2
      ? checkLicenseCompatibility(repo1.license?.spdx_id || repo1.license?.name, repo2.license?.spdx_id || repo2.license?.name)
      : null;

  const licensePair13 =
    repo1 && repo3
      ? checkLicenseCompatibility(repo1.license?.spdx_id || repo1.license?.name, repo3.license?.spdx_id || repo3.license?.name)
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO
        title="Repository Compare — Side-by-Side Metadata & Signals — ExploreGit"
        description="Compare 2 to 3 GitHub repositories side by side. Verifiable stars, forks, release rhythms, and license compatibility."
        canonical="https://exploregit.vercel.app/compare"
      />
      <Header activeTab="compare" showBackButton={true} />

      <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32 pb-16 border-b border-white/10">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 space-y-6">
          {/* Page Title & Presets Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E12] border border-white/10 shadow-sm">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Repository Compare
                </h1>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Inspect 2 or 3 open-source repositories side by side. Every metric links directly to its GitHub source with verified fetch timestamps.
              </p>
            </div>

            {/* Quick Preset Comparisons */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-mono text-zinc-500 mr-1 uppercase">Presets:</span>
              {PRESET_COMPARISONS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleSelectPreset(p.repos)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition-all active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Comparison Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="font-mono">Loading side-by-side repository metadata…</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Columns & Add Slot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareData.map((repo, idx) => (
                  <div
                    key={repo.fullName || idx}
                    className="p-4 rounded-2xl bg-[#0E0E12] border border-white/10 flex flex-col justify-between space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {repo.owner?.avatar_url && (
                          <img
                            src={repo.owner.avatar_url}
                            alt={repo.fullName}
                            className="w-10 h-10 rounded-xl border border-white/10 object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
                            Repository {idx + 1}
                          </span>
                          <h2 className="text-sm sm:text-base font-bold text-white truncate">
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>{repo.fullName}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                            </a>
                          </h2>
                        </div>
                      </div>

                      {compareData.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRepo(idx)}
                          className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                          title="Remove from comparison"
                          aria-label={`Remove ${repo.fullName}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>

                    <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Fetched: {new Date(repo.fetchedAt).toLocaleTimeString()}</span>
                      <span className="text-emerald-400">Live REST API</span>
                    </div>
                  </div>
                ))}

                {/* Add 3rd repo button if less than 3 */}
                {compareData.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setShowSearchModal(true)}
                    className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-blue-500/50 hover:bg-blue-500/[0.03] text-zinc-400 hover:text-blue-400 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div className="p-3 rounded-full bg-white/[0.05] group-hover:bg-blue-500/10 transition-colors">
                      <Plus className="w-5 h-5 text-zinc-400 group-hover:text-blue-400" />
                    </div>
                    <span className="text-xs font-mono font-semibold">
                      Add Third Repository to Compare
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Compare up to 3 projects side by side
                    </span>
                  </button>
                )}
              </div>

              {/* Side-by-side Metrics Comparison Table */}
              <div className="rounded-2xl bg-[#0E0E12] border border-white/10 overflow-hidden divide-y divide-white/[0.08]">
                {/* Metric Row: Stargazers */}
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span>Stars (Current)</span>
                  </div>
                  {compareData.map((r, i) => (
                    <div key={i} className="text-sm font-mono font-bold text-white">
                      <a
                        href={`https://github.com/${r.fullName}/stargazers`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-amber-400 inline-flex items-center gap-1"
                        title="View stargazers on GitHub"
                      >
                        <span>{r.stars?.toLocaleString() || '0'}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    </div>
                  ))}
                </div>

                {/* Metric Row: Forks */}
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-indigo-400" />
                    <span>Forks</span>
                  </div>
                  {compareData.map((r, i) => (
                    <div key={i} className="text-sm font-mono font-bold text-white">
                      <a
                        href={`https://github.com/${r.fullName}/forks`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-indigo-400 inline-flex items-center gap-1"
                      >
                        <span>{r.forks?.toLocaleString() || '0'}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    </div>
                  ))}
                </div>

                {/* Metric Row: Primary Language */}
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-blue-400" />
                    <span>Primary Language</span>
                  </div>
                  {compareData.map((r, i) => (
                    <div key={i} className="text-sm font-mono text-zinc-200">
                      {r.language ? (
                        <a
                          href={`https://github.com/${r.fullName}/search?l=${encodeURIComponent(r.language)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-blue-400 inline-flex items-center gap-1"
                        >
                          <span>{r.language}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                      ) : (
                        <span className="text-zinc-500">Unspecified</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Metric Row: Open Issues */}
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-rose-400" />
                    <span>Open Issues</span>
                  </div>
                  {compareData.map((r, i) => (
                    <div key={i} className="text-sm font-mono font-bold text-white">
                      <a
                        href={`https://github.com/${r.fullName}/issues`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-rose-400 inline-flex items-center gap-1"
                      >
                        <span>{r.openIssues?.toLocaleString() || '0'}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    </div>
                  ))}
                </div>

                {/* Metric Row: Latest Release */}
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>Latest Release</span>
                  </div>
                  {compareData.map((r, i) => (
                    <div key={i} className="text-xs font-mono">
                      {r.latestRelease ? (
                        <div>
                          <a
                            href={r.latestRelease.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>{r.latestRelease.tagName}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="block text-[10px] text-zinc-500 mt-0.5">
                            {new Date(r.latestRelease.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-xs">No releases published</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Metric Row: Last Push */}
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>Last Commit / Push</span>
                  </div>
                  {compareData.map((r, i) => (
                    <div key={i} className="text-xs font-mono text-zinc-300">
                      <a
                        href={`https://github.com/${r.fullName}/commits`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-white inline-flex items-center gap-1"
                      >
                        <span>{r.pushedAt ? getRelativeTime(r.pushedAt) : 'Unknown'}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                      <span className="block text-[10px] text-zinc-500 mt-0.5">
                        {r.pushedAt ? new Date(r.pushedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Metric Row: License */}
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>License</span>
                  </div>
                  {compareData.map((r, i) => (
                    <div key={i} className="text-xs font-mono">
                      <a
                        href={`https://github.com/${r.fullName}/blob/HEAD/LICENSE`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>{r.license?.spdx_id || r.license?.name || 'Unspecified'}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* License Compatibility Evaluation between Compared Repositories */}
              {licensePair12 && (
                <div className="p-5 rounded-2xl bg-[#0E0E12] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      License Compatibility: {repo1.fullName} vs {repo2.fullName}
                    </h3>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border text-xs ${
                      licensePair12.level === 'success'
                        ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-300'
                        : licensePair12.level === 'danger'
                        ? 'bg-rose-500/5 border-rose-500/25 text-rose-300'
                        : 'bg-amber-500/5 border-amber-500/25 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <strong className="font-mono uppercase">{licensePair12.title}</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase">
                        {licensePair12.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {licensePair12.basis}
                    </p>
                  </div>

                  {licensePair13 && repo3 && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs mt-2 ${
                        licensePair13.level === 'success'
                          ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-300'
                          : licensePair13.level === 'danger'
                          ? 'bg-rose-500/5 border-rose-500/25 text-rose-300'
                          : 'bg-amber-500/5 border-amber-500/25 text-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="font-mono uppercase">
                          {repo1.fullName} vs {repo3.fullName}: {licensePair13.title}
                        </strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase">
                          {licensePair13.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {licensePair13.basis}
                      </p>
                    </div>
                  )}

                  <p className="text-[10px] font-mono text-zinc-500">
                    Disclaimer: Results provided for general technical guidance based on standard SPDX criteria. Not legal advice.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Repository Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#121216] border border-white/10 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                Add Repository to Compare
              </h3>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repository (e.g. astral-sh/uv or python)…"
                autoFocus
                className="w-full bg-[#0A0A0D] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {isSearching ? (
              <div className="py-8 flex justify-center items-center text-xs text-zinc-400 font-mono gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Searching GitHub API…</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-60 overflow-y-auto divide-y divide-white/[0.05]">
                {searchResults.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleAddRepo(r.full_name || r.name)}
                    className="w-full text-left p-2.5 hover:bg-white/[0.05] rounded-lg transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-white group-hover:text-blue-400 truncate">
                        {r.full_name || r.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate font-sans">
                        {r.description || 'Open source project'}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 shrink-0 ml-2">
                      ★ {formatNumber(r.stargazers_count)}
                    </span>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <p className="text-xs text-zinc-500 py-4 text-center font-mono">
                No matching repositories found.
              </p>
            ) : (
              <p className="text-xs text-zinc-500 py-4 text-center font-mono">
                Type an owner/repo name or topic to search.
              </p>
            )}
          </div>
        </div>
      )}

      <BackToTop />
      <SubFooter />
    </div>
  );
};

export default RepositoryCompare;
