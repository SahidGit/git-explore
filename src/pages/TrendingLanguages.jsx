import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import { SubFooter } from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import {
  LANGUAGE_CHART_DATA,
  TIMEFRAMES,
} from '../data/trendingLanguagesData';
import { getLiveLanguageRankings } from '../services/githubService';
import {
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Code2,
  X,
  Sparkles,
  Info,
  Sun,
  Moon,
  ChevronRight,
  Star,
  Activity,
  Cpu,
  Layers,
  Search,
  RefreshCw,
} from 'lucide-react';

const TrendingLanguages = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('today');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [chartTheme, setChartTheme] = useState('dark'); // Default to dark theme (light mode toggle preserved)
  const [filterQuery, setFilterQuery] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
  }, []);

  // Fetch live metrics from GitHub API
  const fetchLiveMetrics = useCallback(async (tf) => {
    setIsLoadingLive(true);
    try {
      const res = await getLiveLanguageRankings(tf);
      if (res && res.isLive && res.data?.langStats) {
        setLiveData(res.data.langStats);
        setLastSyncTime(new Date(res.lastUpdated || Date.now()));
      }
    } catch (err) {
      console.warn('Live language fetch fallback:', err);
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  // Trigger fetch when timeframe changes
  useEffect(() => {
    fetchLiveMetrics(activeTimeframe);
  }, [activeTimeframe, fetchLiveMetrics]);

  // Format dynamic updated date: e.g. "October 1, 2026"
  const formattedDate = useMemo(() => {
    const now = lastSyncTime || new Date();
    return now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [lastSyncTime]);

  // Current timeframe metadata
  const currentTfMeta = useMemo(() => {
    return (
      TIMEFRAMES.find((tf) => tf.id === activeTimeframe) || TIMEFRAMES[0]
    );
  }, [activeTimeframe]);

  // Merge live GitHub API aggregated metrics with base language metadata
  const mergedLanguages = useMemo(() => {
    return LANGUAGE_CHART_DATA.map((lang) => {
      const baseTf = lang.timeframes[activeTimeframe] || lang.timeframes.today;

      if (!liveData || !liveData[lang.name]) {
        return {
          ...lang,
          activeMetrics: baseTf,
          activeTopRepos: lang.topRepos,
          isLiveSynced: false,
        };
      }

      const liveStat = liveData[lang.name];
      // Compute dynamic star and repo estimates
      const calculatedStars = Math.max(baseTf.stars, liveStat.totalStars || 0);
      const calculatedRepos = Math.max(baseTf.rawRepos, liveStat.repoCount || 0);

      const formattedStars =
        calculatedStars >= 1000000
          ? `${(calculatedStars / 1000000).toFixed(2)}M`
          : calculatedStars >= 1000
          ? `${(calculatedStars / 1000).toFixed(1)}k`
          : `${calculatedStars}`;

      const formattedRepos =
        calculatedRepos >= 1000
          ? `${(calculatedRepos / 1000).toFixed(1)}k repos`
          : `${calculatedRepos} repos`;

      return {
        ...lang,
        activeMetrics: {
          ...baseTf,
          stars: calculatedStars,
          formattedStars,
          repos: formattedRepos,
          rawRepos: calculatedRepos,
        },
        activeTopRepos:
          liveStat.topRepos && liveStat.topRepos.length > 0
            ? liveStat.topRepos
            : lang.topRepos,
        isLiveSynced: true,
      };
    });
  }, [activeTimeframe, liveData]);

  // Max stars in current timeframe for proportional bar width calculation
  const maxStars = useMemo(() => {
    return Math.max(
      ...mergedLanguages.map((l) => l.activeMetrics.stars || 1)
    );
  }, [mergedLanguages]);

  // Filtered language list
  const displayedLanguages = useMemo(() => {
    if (!filterQuery.trim()) return mergedLanguages;
    const q = filterQuery.toLowerCase().trim();
    return mergedLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.primaryStack.toLowerCase().includes(q) ||
        lang.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [mergedLanguages, filterQuery]);

  const isLight = chartTheme === 'light';

  return (
    <div
      className={`flex min-h-screen flex-col font-sans transition-colors duration-300 ${
        isLight
          ? 'bg-[#F9F8F6] text-[#111827] selection:bg-[#EAE5DE]'
          : 'bg-[#0A0A0C] text-[#F3F4F6] selection:bg-white/20'
      }`}
    >
      <SEO
        title="The Language Chart · Trending Programming Languages on GitHub"
        description="20 programming languages ranked by stars gained over today, 7 days, 30 days, or 365 days on GitHub. Summed across every matching repository."
        canonical="https://exploregit.vercel.app/languages"
      />

      <Header activeTab="languages" theme={chartTheme} showBackButton={true} />

      <main className="flex-1 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
          {/* ── Top Header Section ── */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
              isLight
                ? 'bg-white border-[#E2DFD8] shadow-xs'
                : 'bg-[#111215] border-white/10 shadow-xl'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Left Column: Breadcrumb & Title */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-sans tracking-wide">
                  <Link
                    to="/"
                    className={`font-medium hover:underline transition-colors ${
                      isLight
                        ? 'text-zinc-700 hover:text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Home
                  </Link>
                  <span className={isLight ? 'text-zinc-500 font-bold' : 'text-zinc-600'}>/</span>
                  <span
                    className={`font-semibold ${
                      isLight ? 'text-zinc-950' : 'text-zinc-300'
                    }`}
                  >
                    Languages
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-widest ${
                      isLight ? 'text-zinc-700' : 'text-zinc-400'
                    }`}
                  >
                    THE LANGUAGE CHART
                  </span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                    ↑
                  </span>
                </div>

                <h1
                  className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-heading flex items-center gap-2.5 ${
                    isLight ? 'text-[#09090B]' : 'text-white'
                  }`}
                >
                  Trending Programming Languages on GitHub
                </h1>

                <p
                  className={`text-xs sm:text-sm font-sans ${
                    isLight ? 'text-zinc-700 font-medium' : 'text-zinc-400'
                  }`}
                >
                  20 programming languages ranked by stars gained over{' '}
                  <span
                    className={`font-bold ${
                      isLight ? 'text-zinc-950' : 'text-zinc-100'
                    }`}
                  >
                    {currentTfMeta.sublabel}
                  </span>{' '}
                  · updated {formattedDate}.
                </p>
              </div>

              {/* Right Column: Timeframe Pills, Live Sync & Theme Switch */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Timeframe Selector */}
                <div
                  className={`flex items-center p-1 rounded-full border transition-colors ${
                    isLight
                      ? 'bg-black/[0.04] border-black/[0.06]'
                      : 'bg-white/[0.04] border-white/10'
                  }`}
                >
                  {TIMEFRAMES.map((tf) => {
                    const isActive = activeTimeframe === tf.id;
                    return (
                      <button
                        key={tf.id}
                        type="button"
                        onClick={() => setActiveTimeframe(tf.id)}
                        className={`px-3.5 py-1 rounded-full text-xs font-sans font-medium transition-all duration-200 ease-out cursor-pointer active:scale-95 select-none ${
                          isActive
                            ? isLight
                              ? 'bg-white text-zinc-950 font-bold shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-black/[0.04]'
                              : 'bg-white text-zinc-950 font-bold shadow-[0_1px_6px_rgba(0,0,0,0.3)]'
                            : isLight
                            ? 'text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {tf.label}
                      </button>
                    );
                  })}
                </div>

                {/* Manual Sync Button */}
                <button
                  type="button"
                  onClick={() => fetchLiveMetrics(activeTimeframe)}
                  disabled={isLoadingLive}
                  title="Sync live data from GitHub API"
                  className={`p-2 rounded-full border text-xs font-sans flex items-center gap-1.5 transition-all duration-200 ease-out cursor-pointer active:scale-90 ${
                    isLight
                      ? 'bg-white border-black/10 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs'
                      : 'bg-white/[0.06] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.12] shadow-xs'
                  } ${isLoadingLive ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isLoadingLive ? 'animate-spin text-emerald-500' : ''
                    }`}
                  />
                </button>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={() => setChartTheme(isLight ? 'dark' : 'light')}
                  title={`Switch to ${isLight ? 'Dark' : 'Light'} theme`}
                  className={`p-2 rounded-full border text-xs font-sans flex items-center gap-1.5 transition-all duration-200 ease-out cursor-pointer active:scale-90 ${
                    isLight
                      ? 'bg-white border-black/10 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs'
                      : 'bg-white/[0.06] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.12] shadow-xs'
                  }`}
                >
                  {isLight ? (
                    <Moon className="w-3.5 h-3.5 text-zinc-800" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Chart Card ── */}
          <div
            className={`mt-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
              isLight
                ? 'bg-white border-[#E2DFD8] shadow-xs'
                : 'bg-[#111215] border-white/10 shadow-xl'
            }`}
          >
            {/* Chart Rows Container */}
            <div className="p-4 sm:p-6 md:p-8 space-y-1.5">
              {displayedLanguages.map((lang) => {
                const tfData = lang.activeMetrics;
                const starPercent = Math.max(
                  3,
                  Math.min(100, (tfData.stars / maxStars) * 100)
                );
                const isTop3 = lang.rank <= 3;
                const isHovered = hoveredLanguage === lang.name;

                return (
                  <div
                    key={lang.name}
                    onClick={() => setSelectedLanguage(lang)}
                    onMouseEnter={() => setHoveredLanguage(lang.name)}
                    onMouseLeave={() => setHoveredLanguage(null)}
                    className={`group relative flex items-center gap-3 sm:gap-4 py-2.5 px-3 sm:px-4 rounded-xl transition-all duration-150 cursor-pointer ${
                      isHovered
                        ? isLight
                          ? 'bg-[#F4F1EA]'
                          : 'bg-white/[0.06]'
                        : isLight
                        ? 'hover:bg-[#FAF8F5]'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Rank Number */}
                    <div className="w-6 sm:w-8 shrink-0 text-right">
                      <span
                        className={`font-mono text-xs sm:text-sm ${
                          isTop3
                            ? isLight
                              ? 'font-extrabold text-zinc-950'
                              : 'font-bold text-white'
                            : isLight
                            ? 'font-bold text-zinc-700'
                            : 'font-medium text-zinc-400'
                        }`}
                      >
                        {lang.rank}
                      </span>
                    </div>

                    {/* Language Dot & Name */}
                    <div className="w-24 sm:w-32 md:w-36 shrink-0 flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span
                        className={`text-xs sm:text-sm truncate transition-colors ${
                          isTop3
                            ? isLight
                              ? 'font-bold text-zinc-950'
                              : 'font-bold text-white'
                            : isLight
                            ? 'font-semibold text-zinc-900'
                            : 'font-medium text-zinc-200'
                        } group-hover:text-[#F97316] dark:group-hover:text-emerald-400`}
                      >
                        {lang.name}
                      </span>
                    </div>

                    {/* Clean Solid Proportional Bar - NO GLOW IN DARK */}
                    <div className="flex-1 h-5 sm:h-6 flex items-center relative overflow-hidden">
                      <div
                        className="h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out relative group-hover:h-3"
                        style={{
                          width: `${starPercent}%`,
                          backgroundColor: lang.color,
                          boxShadow: 'none', // Strictly clean solid bar without any neon blur or glow
                        }}
                      />
                    </div>

                    {/* Star Count Number */}
                    <div className="w-16 sm:w-20 text-right shrink-0">
                      <span
                        className={`font-mono text-xs sm:text-sm font-bold ${
                          isLight ? 'text-zinc-950' : 'text-white'
                        }`}
                      >
                        {tfData.formattedStars}
                      </span>
                    </div>

                    {/* Repos Count */}
                    <div className="w-20 sm:w-24 text-right shrink-0 hidden sm:block">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isLight ? 'text-zinc-700' : 'text-zinc-400'
                        }`}
                      >
                        {tfData.repos}
                      </span>
                    </div>

                    {/* Quick view indicator on hover */}
                    <div
                      className={`hidden md:block w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isLight ? 'text-zinc-700' : 'text-zinc-300'
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Footer Note inside card */}
            <div
              className={`px-6 py-4 border-t text-[11px] sm:text-xs font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#E2DFD8] text-zinc-700 font-medium'
                  : 'bg-black/30 border-white/10 text-zinc-400'
              }`}
            >
              <p>
                Stars are summed across repositories whose GitHub-detected primary language matches. Click any row to view velocity breakdown and top projects.
              </p>
              <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className={isLight ? 'text-zinc-700' : 'text-zinc-300'}>
                  {liveData ? 'Live GitHub Sync' : 'Static Baseline'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Quick Search & Deep-Dive Trigger ── */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  isLight ? 'text-zinc-600' : 'text-zinc-500'
                }`}
              />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by language name..."
                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-sans font-medium outline-none transition-all ${
                  isLight
                    ? 'bg-white border border-[#D5D2CA] text-zinc-950 placeholder-zinc-500 focus:border-zinc-600'
                    : 'bg-[#111215] border border-white/10 text-white placeholder-zinc-500 focus:border-white/30'
                }`}
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${
                    isLight
                      ? 'text-zinc-600 hover:text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <Link
              to="/dashboard"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isLight
                  ? 'bg-zinc-950 hover:bg-black text-white shadow-xs'
                  : 'bg-white hover:bg-zinc-200 text-black shadow-sm'
              }`}
            >
              <span>Explore All Repositories on Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* ── Language Full Chart Detail Modal ── */}
      {selectedLanguage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`relative w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all ${
              isLight
                ? 'bg-white border-[#E2DFD8] text-[#111827]'
                : 'bg-[#111215] border-white/15 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`flex items-start justify-between gap-4 pb-4 border-b ${
                isLight ? 'border-zinc-200' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: selectedLanguage.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className={`text-xl sm:text-2xl font-extrabold font-heading ${
                        isLight ? 'text-zinc-950' : 'text-white'
                      }`}
                    >
                      {selectedLanguage.name}
                    </h2>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isLight
                          ? 'bg-zinc-100 text-zinc-800'
                          : 'bg-white/10 text-zinc-300'
                      }`}
                    >
                      Rank #{selectedLanguage.rank}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-semibold mt-0.5 ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    {selectedLanguage.primaryStack}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLanguage(null)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight
                    ? 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-5">
              <p
                className={`text-xs sm:text-sm leading-relaxed font-sans ${
                  isLight ? 'text-zinc-800 font-medium' : 'text-zinc-300'
                }`}
              >
                {selectedLanguage.description}
              </p>

              {/* Topical Tags */}
              {selectedLanguage.tags && selectedLanguage.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {selectedLanguage.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                        isLight
                          ? 'bg-[#F2EFE9] text-zinc-950 border-[#D5D2CA]'
                          : 'bg-white/[0.06] text-zinc-300 border-white/10'
                      }`}
                    >
                      ◇ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Timeframe Star Stats Strip */}
              <div
                className={`grid grid-cols-3 gap-3 p-3.5 rounded-xl border ${
                  isLight
                    ? 'bg-[#F9F8F6] border-zinc-200'
                    : 'bg-white/[0.03] border-white/[0.08]'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold block ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    Stars Today
                  </span>
                  <span
                    className={`text-sm font-mono font-extrabold mt-0.5 block ${
                      isLight ? 'text-zinc-950' : 'text-white'
                    }`}
                  >
                    {selectedLanguage.timeframes.today.formattedStars}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    {selectedLanguage.timeframes.today.repos}
                  </span>
                </div>

                <div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold block ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    Past 30 Days
                  </span>
                  <span
                    className={`text-sm font-mono font-extrabold mt-0.5 block ${
                      isLight ? 'text-zinc-950' : 'text-white'
                    }`}
                  >
                    {selectedLanguage.timeframes['30d'].formattedStars}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {selectedLanguage.timeframes['30d'].growth} YoY
                  </span>
                </div>

                <div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold block ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    Past 365 Days
                  </span>
                  <span
                    className={`text-sm font-mono font-extrabold mt-0.5 block ${
                      isLight ? 'text-zinc-950' : 'text-white'
                    }`}
                  >
                    {selectedLanguage.timeframes['365d'].formattedStars}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    {selectedLanguage.timeframes['365d'].repos}
                  </span>
                </div>
              </div>

              {/* Top Repositories in this Language */}
              <div className="space-y-2">
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider block ${
                    isLight ? 'text-zinc-700' : 'text-zinc-400'
                  }`}
                >
                  Top Signal Open Source Repositories
                </span>
                <div className="space-y-2">
                  {(selectedLanguage.activeTopRepos || selectedLanguage.topRepos).map(
                    (repo) => (
                      <Link
                        key={repo.fullName}
                        to={repo.link}
                        className={`block p-3 rounded-xl border transition-all ${
                          isLight
                            ? 'bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-mono text-xs font-bold hover:underline ${
                              isLight ? 'text-zinc-950' : 'text-white'
                            }`}
                          >
                            {repo.fullName}
                          </span>
                          <span
                            className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                              isLight ? 'text-zinc-700' : 'text-zinc-400'
                            }`}
                          >
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {repo.stars}
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-1 line-clamp-1 font-sans ${
                            isLight ? 'text-zinc-600 font-medium' : 'text-zinc-400'
                          }`}
                        >
                          {repo.desc}
                        </p>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`pt-4 border-t flex items-center justify-between ${
                isLight ? 'border-zinc-200' : 'border-white/10'
              }`}
            >
              <Link
                to={`/dashboard?query=language:${encodeURIComponent(
                  selectedLanguage.name.toLowerCase()
                )}`}
                className={`inline-flex items-center gap-1.5 text-xs font-bold font-mono transition-colors ${
                  isLight
                    ? 'text-zinc-950 hover:text-[#F97316]'
                    : 'text-white hover:text-emerald-400'
                }`}
              >
                <span>Filter all {selectedLanguage.name} repositories</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedLanguage(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                  isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-black/10'
                    : 'bg-transparent hover:bg-white/[0.08] text-white/90 hover:text-white border-white/15 hover:border-white/30'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BackToTop />
      <SubFooter theme={chartTheme} />
    </div>
  );
};

export default TrendingLanguages;
