import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import { SubFooter } from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import { GemsNavIcon } from '../components/ui/Icons';
import { gemsService } from '../services/gemsService';
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
  RefreshCw,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('week');
  const [sortBy, setSortBy] = useState('velocity');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedGem, setSelectedGem] = useState(null);

  const loadGemsData = useCallback(async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const result = await gemsService.getGems(force);
      setGems(result.items || []);
      setIsCached(result.isCached);
      setLastUpdated(result.lastUpdated || new Date());
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
    loadGemsData(false);
  }, [loadGemsData]);

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
        description="Discover underrated open-source GitHub repositories under 2,000 stars with explosive momentum, alongside timeless legendary software tools and developer utilities."
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
                <li className="flex items-center gap-1.5">
                  <span className="text-zinc-600">/</span>
                  <span className="text-zinc-200 font-medium">Gems</span>
                </li>
              </ol>
            </nav>

            {/* Overline & Exact One-Line Heading */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FA6423]">
                  Curated Discovery & Staple Tools
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#FFC95C]">
                  <Flame className="w-3.5 h-3.5 text-[#FA6423]" />
                  Live Velocity
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-heading flex items-center gap-2.5 sm:gap-3 text-white">
                <GemsNavIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" size={32} />
                <span>Hidden & Essential Software Gems</span>
              </h1>

              <p className="text-xs sm:text-sm font-sans text-zinc-400 max-w-2xl leading-relaxed">
                Discover under-the-radar open-source repositories with high community engagement, alongside legendary timeless utilities (VLC, 7-Zip, LocalSend, ShareX) and CLI powerhouses.
              </p>
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

              {/* Timeframe & Sort Controls */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Timeframe pills */}
                <div className="flex items-center p-1 rounded-xl bg-[#121215] border border-white/10 text-xs">
                  {[
                    { id: 'today', label: 'Today' },
                    { id: 'week', label: 'This Week' },
                    { id: 'alltime', label: 'All Time' },
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      onClick={() => setTimeframe(tf.id)}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        timeframe === tf.id
                          ? 'bg-purple-600 text-white font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#121215] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-sans focus:outline-none focus:border-purple-500/50 cursor-pointer"
                >
                  <option value="velocity">Sort by: High Velocity</option>
                  <option value="stars">Sort by: Star Count</option>
                  <option value="name">Sort by: Alphabetical</option>
                </select>

                {/* Live Sync / Refresh Button */}
                <button
                  type="button"
                  onClick={() => loadGemsData(true)}
                  disabled={isRefreshing}
                  title="Sync live stats from GitHub API"
                  className={`p-2 rounded-xl border text-xs font-sans flex items-center gap-1.5 transition-all duration-200 ease-out cursor-pointer active:scale-90 bg-white/[0.06] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.12] ${
                    isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isRefreshing ? 'animate-spin text-purple-400' : ''
                    }`}
                  />
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
            
            {/* Header info / count & Live Sync Status */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2">
              <div className="flex items-center gap-2">
                <span>Showing {filteredGems.length} curated tools & repos</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-semibold">100% Free & Open Source</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>{isCached ? 'Cached (6h TTL)' : 'Live API Active'}</span>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading && gems.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            ) : filteredGems.length === 0 ? (
              <div className="text-center py-20 bg-[#121215] border border-white/10 rounded-2xl p-8 space-y-3">
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
                {filteredGems.map((gem) => (
                  <article
                    key={gem.id}
                    onClick={() => setSelectedGem(gem)}
                    className="group relative flex flex-col bg-[#121215] hover:bg-[#16161a] border border-white/10 hover:border-purple-500/40 rounded-2xl p-5 transition-all duration-200 shadow-xl cursor-pointer"
                  >
                    {/* Top Row: Avatar + Title + Gem Badge */}
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
                          {gem.isUnderTheRadar ? (
                            <span className="text-[11px] font-mono font-bold text-[#FA6423] shrink-0">
                              Gem #{gem.rank}
                            </span>
                          ) : gem.isLegend ? (
                            <span className="text-[11px] font-mono font-bold text-[#589D88] shrink-0">
                              Essential Legend
                            </span>
                          ) : null}
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

                    {/* Metric pills: Stars, Growth, Language (No BG, Clean Typography) */}
                    <div className="flex items-center gap-3 flex-wrap mb-4 text-xs font-mono">
                      <span className="flex items-center gap-1 text-[#FFC95C] font-semibold">
                        <Star className="w-3.5 h-3.5 fill-[#FFC95C]" />
                        <span>{gem.starsFormatted}</span>
                      </span>

                      <span className="flex items-center gap-1 text-[#FA6423] font-semibold">
                        <Flame className="w-3.5 h-3.5 text-[#FA6423]" />
                        <span>{gem.growth}</span>
                      </span>

                      {gem.language && (
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: gem.languageColor || '#71717A' }}
                          />
                          <span>{gem.language}</span>
                        </span>
                      )}
                    </div>

                    {/* Platforms & Topics */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      {gem.platforms?.slice(0, 3).map((plat) => (
                        <span
                          key={plat}
                          className="text-[11px] font-mono text-zinc-400"
                        >
                          {plat}
                        </span>
                      ))}
                      {gem.license && (
                        <span className="text-[11px] font-mono text-zinc-500 ml-auto">
                          {gem.license}
                        </span>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                      {gem.downloadUrl ? (
                        <a
                          href={gem.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                          title="Download tool installer or app"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      ) : gem.installCommand ? (
                        <button
                          type="button"
                          onClick={(e) => handleCopyCommand(e, gem)}
                          className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors"
                          title={`Copy: ${gem.installCommand}`}
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
                          className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors pl-1"
                        >
                          <span>Repo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ── Gem Detail Modal with Full Store & Download Hub ── */}
        {selectedGem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedGem(null)}
          >
            <div
              className="relative w-full max-w-xl bg-[#121215] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedGem.avatarUrl}
                    alt={selectedGem.name}
                    className="w-12 h-12 rounded-xl border border-white/15 object-cover bg-white/5"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                      <span>{selectedGem.name}</span>
                      {selectedGem.isUnderTheRadar && (
                        <span className="text-xs font-mono font-bold text-[#FA6423]">
                          Gem #{selectedGem.rank}
                        </span>
                      )}
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

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block font-bold">Stars</span>
                    <span className="text-white font-bold text-sm">{selectedGem.starsFormatted}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block font-bold">Momentum</span>
                    <span className="text-[#FA6423] font-bold text-sm">{selectedGem.growth}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block font-bold">Language</span>
                    <span className="text-white font-bold text-sm">{selectedGem.language || 'Multi'}</span>
                  </div>
                </div>

                {/* Direct Download & App Store Hub */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono font-bold text-[#FA6423] uppercase tracking-wider block flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download & Official Channels</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Direct Installer / Binary */}
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

                    {/* Google Play Store */}
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
                            <p className="text-[10px] text-emerald-200/70 truncate">Android APK & App</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      </a>
                    )}

                    {/* Apple App Store */}
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
                            <p className="text-[10px] text-blue-200/70 truncate">iOS, iPadOS & macOS</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      </a>
                    )}

                    {/* Microsoft Store */}
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
                            <p className="text-[10px] text-sky-200/70 truncate">Windows 10 / 11</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                      </a>
                    )}

                    {/* Official Website */}
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

                {/* Topics */}
                {selectedGem.topics && selectedGem.topics.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      Topic Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedGem.topics.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-mono text-zinc-300"
                        >
                          ◇ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Install Command */}
                {selectedGem.installCommand && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      Terminal / Package Manager Install
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
