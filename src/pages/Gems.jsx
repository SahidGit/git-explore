import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import { SubFooter } from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import { GemsNavIcon } from '../components/ui/Icons';
import { gemsService, STATUS_LABELS } from '../services/gemsService';
import {
  Search,
  Star,
  GitFork,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Sparkles,
  ShieldCheck,
  Cpu,
  Compass,
  X,
  Flame,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  Loader2,
  Globe,
  Package,
  Layers,
  Smartphone,
  Laptop
} from 'lucide-react';

const PlayStoreIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-1.61-.416C1.999 21.77 2 21.6 2 21.37V2.63c0-.23-.001-.4.001-.4a1.996 1.996 0 0 1 1.608-.416zm11.597 11.598l2.793 2.793-13.627 7.787 10.834-10.58zm0-2.824L4.372 0l13.627 7.787-2.793 2.801zm1.414 1.412l3.868 2.21c1.042.595 1.042 1.567 0 2.162l-3.868 2.21-2.433-2.434 2.433-2.148z"/>
  </svg>
);

const AppStoreIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.7c.64-.78 1.08-1.86.96-2.95-1 .04-2.14.65-2.78 1.4-.57.64-1.07 1.74-.93 2.8 1.11.09 2.18-.55 2.75-1.25z"/>
  </svg>
);

const MicrosoftStoreIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.551H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.051-1.898"/>
  </svg>
);

const CATEGORY_ICONS = {
  Sparkles,
  Compass,
  ShieldCheck,
  Terminal,
  Cpu,
};

const Gems = () => {
  const [gems, setGems] = useState([]);
  const [allGems, setAllGems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluatedAt, setEvaluatedAt] = useState(null);
  const [criteriaVersion, setCriteriaVersion] = useState(1);
  const [runSummary, setRunSummary] = useState(null);
  const [staleNotice, setStaleNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [showBelowThreshold, setShowBelowThreshold] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedGem, setSelectedGem] = useState(null);

  const loadGemsData = useCallback(async (includeBelow = false) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await gemsService.getGems({ includeBelowThreshold: includeBelow });
      setGems(result.items || []);
      setAllGems(result.allItems || []);
      setEvaluatedAt(result.evaluatedAt);
      setCriteriaVersion(result.criteriaVersion);
      setRunSummary(result.runSummary);
      setStaleNotice(result.staleNotice);

      if (result.error && (!result.items || result.items.length === 0)) {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load gems dataset');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
    loadGemsData(showBelowThreshold);
  }, [loadGemsData, showBelowThreshold]);

  const handleCopyCommand = (e, gem) => {
    e.stopPropagation();
    if (gem.installCommand && navigator.clipboard) {
      navigator.clipboard.writeText(gem.installCommand);
      setCopiedId(gem.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const dynamicCategories = useMemo(() => {
    return gemsService.getCategories(gems);
  }, [gems]);

  const belowThresholdCount = useMemo(() => {
    return allGems.filter((g) => g.status === 'below-threshold').length;
  }, [allGems]);

  // Filter and sort items
  const filteredGems = useMemo(() => {
    let list = gems.filter((gem) => {
      const matchesCategory =
        selectedCategory === 'all' || gem.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        gem.name.toLowerCase().includes(q) ||
        gem.repo.toLowerCase().includes(q) ||
        (gem.tagline && gem.tagline.toLowerCase().includes(q)) ||
        (gem.description && gem.description.toLowerCase().includes(q)) ||
        (gem.topics && gem.topics.some((t) => t.toLowerCase().includes(q))) ||
        (gem.platforms && gem.platforms.some((p) => p.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (a.rank || 99) - (b.rank || 99);
    });
  }, [gems, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO
        title="Hidden Gems & Essential Software Tools · ExploreGit"
        description="Discover trustworthy open-source GitHub repositories and timeless developer utilities evaluated monthly against strict durability and security criteria."
        canonical="https://exploregit.vercel.app/gems"
      />

      <Header activeTab="gems" showBackButton={true} />

      <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32">
        {/* ── Hero & Filter Frame ── */}
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 px-4 sm:px-6 md:px-8 py-8 sm:py-10">
            
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4 text-xs font-sans text-zinc-400">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">Gems & Essential Tools</li>
              </ol>
            </nav>

            {/* Title & Tagline */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FA6423]">
                  Curated Discovery & Staple Tools
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Criteria v{criteriaVersion} Verified
                </span>
                {evaluatedAt && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    Evaluated: {evaluatedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-heading flex items-center gap-2.5 sm:gap-3 text-white">
                <GemsNavIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" size={32} />
                <span>Hidden & Essential Software Gems</span>
              </h1>

              <p className="text-xs sm:text-sm font-sans text-zinc-400 max-w-2xl leading-relaxed">
                Discover under-the-radar open-source repositories evaluated automatically against durability, licensing, and activity criteria, alongside timeless utilities and developer powerhouses.
              </p>

              {staleNotice && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 pt-1">
                  <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{staleNotice}</span>
                </div>
              )}
            </div>

            {/* Search & Toolbar Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-white/10">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, keyword, topic, or platform..."
                  className="w-full bg-[#121215] border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 font-sans focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort & Transparency Controls */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#121215] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-sans focus:outline-none focus:border-purple-500/50 cursor-pointer"
                >
                  <option value="featured">Sort by: Curated & Rising</option>
                  <option value="stars">Sort by: Star Count</option>
                  <option value="name">Sort by: Alphabetical</option>
                </select>

                {/* Transparency Toggle for Below-Threshold Entries */}
                <button
                  type="button"
                  onClick={() => setShowBelowThreshold((prev) => !prev)}
                  title="Toggle visibility of failing or below-threshold repositories"
                  className={`px-3 py-1.5 rounded-xl border text-xs font-sans flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    showBelowThreshold
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-semibold'
                      : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>
                    {showBelowThreshold ? 'Hide Failing' : `Show Failing (${belowThresholdCount})`}
                  </span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills with Dynamic Counts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-4 no-scrollbar">
              {dynamicCategories.map((cat) => {
                const IconComponent = CATEGORY_ICONS[cat.icon] || Sparkles;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-zinc-950 font-bold shadow-md'
                        : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-purple-100 text-purple-900' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* ── Main Gem Cards Grid ── */}
        <section aria-label="Gems Catalog" className="border-b border-white/10 py-10 bg-[#0E0E11]/40">
          <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 px-4 sm:px-6 md:px-8 space-y-4">
            
            {/* Header info / count */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2">
              <div className="flex items-center gap-2">
                <span>Showing {filteredGems.length} tools & repositories</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-semibold">Precomputed Static Dataset</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Zero Browser API Calls</span>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading && gems.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label="Loading Gems">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-[#121215] border border-white/10 rounded-2xl p-5 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/5" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-28 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                    <div className="h-7 w-full bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : errorMessage && gems.length === 0 ? (
              /* Error State */
              <div className="text-center py-20 bg-[#121215] border border-rose-500/20 rounded-2xl p-8 space-y-3" role="alert">
                <AlertTriangle className="w-12 h-12 mx-auto text-rose-400" />
                <h3 className="text-base font-bold text-white font-heading">Could Not Load Gems Dataset</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => loadGemsData(showBelowThreshold)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors cursor-pointer"
                >
                  Retry Loading
                </button>
              </div>
            ) : filteredGems.length === 0 ? (
              /* Empty Search State */
              <div className="text-center py-20 bg-[#121215] border border-white/10 rounded-2xl p-8 space-y-3" role="status">
                <GemsNavIcon className="w-12 h-12 mx-auto text-purple-400 opacity-60" size={48} />
                <h3 className="text-base font-bold text-white font-heading">No matching gems found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGems.map((gem) => {
                  const statusInfo = STATUS_LABELS[gem.status] || STATUS_LABELS.unknown;

                  return (
                    <article
                      key={gem.id}
                      onClick={() => setSelectedGem(gem)}
                      className={`group relative flex flex-col bg-[#121215] hover:bg-[#16161a] border rounded-2xl p-5 transition-all duration-200 shadow-xl cursor-pointer ${
                        gem.status === 'below-threshold'
                          ? 'border-rose-500/30 opacity-80'
                          : 'border-white/10 hover:border-purple-500/40'
                      }`}
                    >
                      {/* Top Row: Avatar + Title + Status Text Badge */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <img
                          src={gem.avatarUrl}
                          alt={`${gem.name} logo`}
                          className="w-11 h-11 rounded-xl border border-white/10 object-cover bg-white/5 shrink-0"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = '/favicon.png';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <h3 className="text-base font-bold text-white font-heading truncate group-hover:text-[#FFC95C] transition-colors">
                              {gem.name}
                            </h3>
                            {/* Accessible Text Status Badge */}
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusInfo.colorClass}`}
                              title={statusInfo.description}
                            >
                              {statusInfo.badge}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-zinc-400 truncate">
                            {gem.repo}
                          </p>
                        </div>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed line-clamp-2 mb-3">
                        {gem.tagline}
                      </p>

                      {/* Below Threshold Failing Criteria Accordion */}
                      {gem.status === 'below-threshold' && gem.failingCriteria && gem.failingCriteria.length > 0 && (
                        <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-sans">
                          <p className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider mb-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Unmet Criteria:</span>
                          </p>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-rose-200/90">
                            {gem.failingCriteria.map((f, i) => (
                              <li key={i}>{f.detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Stale Warning Indicator */}
                      {gem.stale && (
                        <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-mono flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{gem.staleReason || 'Last known metrics preserved (stale)'}</span>
                        </div>
                      )}

                      {/* Metric pills: Stars, Forks, Tier, Language */}
                      <div className="flex items-center gap-3 flex-wrap mb-4 text-xs font-mono">
                        <span className="flex items-center gap-1 text-[#FFC95C] font-semibold" title="Total stars">
                          <Star className="w-3.5 h-3.5 fill-[#FFC95C]" />
                          <span>{gem.starsFormatted}</span>
                        </span>

                        <span className="flex items-center gap-1 text-zinc-400" title="Total forks">
                          <GitFork className="w-3.5 h-3.5" />
                          <span>{gem.forksFormatted || gem.forks || 0}</span>
                        </span>

                        <span className="text-[11px] text-zinc-400 capitalize px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          {gem.tier || (gem.isLegend ? 'Legend' : 'Under the Radar')}
                        </span>

                        {gem.language && (
                          <span className="flex items-center gap-1 text-zinc-400 ml-auto">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: gem.languageColor || '#71717A' }}
                            />
                            <span>{gem.language}</span>
                          </span>
                        )}
                      </div>

                      {/* Platforms Pill List */}
                      {gem.platforms && gem.platforms.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mb-4">
                          {gem.platforms.map((p) => (
                            <span
                              key={p}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card Bottom Action Bar */}
                      <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        {/* Terminal Install Quick-Copy Button */}
                        {gem.installCommand ? (
                          <button
                            type="button"
                            onClick={(e) => handleCopyCommand(e, gem)}
                            title={`Copy install command: ${gem.installCommand}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer group/btn"
                          >
                            {copiedId === gem.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[11px]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Terminal className="w-3 h-3 text-purple-400" />
                                <span className="text-[11px] truncate max-w-[110px]">Install CLI</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-zinc-500">Free & Open</span>
                        )}

                        {/* Store & Direct Action Icons */}
                        <div className="flex items-center gap-1.5">
                          {gem.playStoreUrl && (
                            <a
                              href={gem.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                              title="Get on Google Play Store"
                            >
                              <PlayStoreIcon className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {gem.appStoreUrl && (
                            <a
                              href={gem.appStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                              title="Download on Apple App Store"
                            >
                              <AppStoreIcon className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {gem.microsoftStoreUrl && (
                            <a
                              href={gem.microsoftStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition-colors"
                              title="Get from Microsoft Store"
                            >
                              <MicrosoftStoreIcon className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {gem.websiteUrl && (
                            <a
                              href={gem.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                              title="Official Website"
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <a
                            href={gem.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Open on GitHub"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          </div>
        </section>

        {/* ── Detail Inspection Modal ── */}
        {selectedGem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedGem(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-[#121215] border border-white/15 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedGem.avatarUrl}
                    alt={selectedGem.name}
                    className="w-12 h-12 rounded-xl border border-white/15 object-cover bg-white/5"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                      <span>{selectedGem.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        STATUS_LABELS[selectedGem.status]?.colorClass || 'text-zinc-400'
                      }`}>
                        {STATUS_LABELS[selectedGem.status]?.label || selectedGem.status}
                      </span>
                    </h2>
                    <p className="text-xs font-mono text-zinc-400">{selectedGem.repo}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedGem(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                  {selectedGem.description}
                </p>

                {/* Criteria Evaluation Detail Box */}
                {selectedGem.failingCriteria && selectedGem.failingCriteria.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                    <p className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Unmet Criteria Diagnostic</span>
                    </p>
                    <ul className="text-xs text-rose-200 space-y-1 list-disc pl-4">
                      {selectedGem.failingCriteria.map((f, i) => (
                        <li key={i}>
                          <span className="font-mono text-rose-400 font-semibold">{f.id}</span>: {f.detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Editorial Review Record Details */}
                {selectedGem.verifiedReview && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 font-mono text-xs">
                    <span className="text-zinc-400 text-[11px] uppercase tracking-wider block font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Editorial Audit & Verification Record</span>
                    </span>
                    {selectedGem.verifiedReview.issueResponsiveness && (
                      <p className="text-zinc-300 text-[11px]">
                        • <strong className="text-white">Issue Triage:</strong> Verified on{' '}
                        {new Date(selectedGem.verifiedReview.issueResponsiveness.verifiedAt).toLocaleDateString()}.{' '}
                        <span className="text-zinc-400">"{selectedGem.verifiedReview.issueResponsiveness.notes}"</span>
                      </p>
                    )}
                    {selectedGem.verifiedReview.independentAudit && (
                      <p className="text-zinc-300 text-[11px]">
                        • <strong className="text-white">Independent Audit:</strong>{' '}
                        <a
                          href={selectedGem.verifiedReview.independentAudit.auditUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 underline hover:text-purple-300"
                        >
                          View Report
                        </a>{' '}
                        ({selectedGem.verifiedReview.independentAudit.auditor || 'Independent Auditor'}).
                      </p>
                    )}
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block font-bold">Stars</span>
                    <span className="text-white font-bold text-sm">{selectedGem.starsFormatted}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block font-bold">Forks</span>
                    <span className="text-zinc-300 font-bold text-sm">{selectedGem.forksFormatted || selectedGem.forks || 0}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block font-bold">Tier</span>
                    <span className="text-white font-bold text-sm capitalize">{selectedGem.tier || 'Curated'}</span>
                  </div>
                </div>

                {/* Direct Download & App Store Hub */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono font-bold text-[#FA6423] uppercase tracking-wider flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download & Official Channels</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedGem.downloadUrl && (
                      <a
                        href={selectedGem.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-100 transition-all shadow-sm group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Download className="w-4 h-4 text-purple-400 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-white truncate">Direct Download</p>
                            <p className="text-[10px] text-purple-200/70 truncate">Installer & Binaries</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                      </a>
                    )}

                    {selectedGem.playStoreUrl && (
                      <a
                        href={selectedGem.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-100 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <PlayStoreIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-white truncate">Google Play Store</p>
                            <p className="text-[10px] text-emerald-200/70 truncate">Android App</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      </a>
                    )}

                    {selectedGem.appStoreUrl && (
                      <a
                        href={selectedGem.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-blue-100 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <AppStoreIcon className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-white truncate">Apple App Store</p>
                            <p className="text-[10px] text-blue-200/70 truncate">iOS & macOS</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      </a>
                    )}

                    {selectedGem.microsoftStoreUrl && (
                      <a
                        href={selectedGem.microsoftStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-100 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MicrosoftStoreIcon className="w-4 h-4 text-sky-400 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-white truncate">Microsoft Store</p>
                            <p className="text-[10px] text-sky-200/70 truncate">Windows</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                      </a>
                    )}

                    {selectedGem.websiteUrl && (
                      <a
                        href={selectedGem.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-100 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-white truncate">Official Website</p>
                            <p className="text-[10px] text-zinc-400 truncate">Visit Product Page</p>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Quick Install Command */}
                {selectedGem.installCommand && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      Terminal Install Command
                    </span>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-white/10 font-mono text-xs text-zinc-200">
                      <code className="truncate mr-2">{selectedGem.installCommand}</code>
                      <button
                        type="button"
                        onClick={(e) => handleCopyCommand(e, selectedGem)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 transition-colors"
                        title="Copy command"
                      >
                        {copiedId === selectedGem.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-zinc-500">
                  {selectedGem.license || 'Open Source'}
                </span>

                <a
                  href={selectedGem.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-colors ml-auto shadow-md"
                >
                  <span>Open GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <BackToTop />
      <SubFooter />
    </div>
  );
};

export default Gems;
