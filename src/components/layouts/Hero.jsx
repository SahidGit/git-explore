import React, { useEffect, useState, useMemo } from "react";
import {
  useNavigate } from "react-router-dom";
import {
  Github,
  ArrowRight,
  TrendingUp,
  Star,
  Heart,
  Search,
  X,
  Sparkles,
  Filter,
  Code2,
  Clock,
  Activity,
  Info,
  ExternalLink,
} from "lucide-react";

import { getMonthlyTopRepositories } from "../../services/githubService";
import heroMidImg from "../../assets/images/hero-mid.png";
import heroBotImg from "../../assets/images/hero-bot.png";

// ─── Ecosystem Categories Data ─────────────────────────
const ECOSYSTEM_CATEGORIES = [
  {
    id: "deepseek",
    name: "DeepSeek AI",
    badge: "Trending",
    color: "#6366F1",
    query: "deepseek",
  },
  {
    id: "ai-skills",
    name: "AI Skills & Agents",
    badge: "Agentic",
    color: "#A1A1AA",
    query: "topic:ai",
  },
  {
    id: "open-models",
    name: "Open Models",
    badge: "LLM",
    color: "#C19EDB",
    query: "topic:open-source-llm",
  },
  {
    id: "chatbots",
    name: "AI Chatbots",
    badge: "Chat",
    color: "#71717A",
    query: "topic:chatbot",
  },
  {
    id: "vector-rag",
    name: "Vector DBs & RAG",
    badge: "RAG",
    color: "#3B82F6",
    query: "topic:vector-database",
  },
  {
    id: "ollama",
    name: "Ollama Local",
    badge: "Offline AI",
    color: "#F59E0B",
    query: "ollama",
  },
];

// ─── Quick Filter Chips Data ───────────────────────────
const QUICK_FILTER_CHIPS = [
  { id: "ai", label: "AI", type: "topic", query: "topic:ai", color: "#C19EDB" },
  { id: "python", label: "Python", type: "lang", query: "language:python", color: "#3572A5" },
  { id: "rust", label: "Rust", type: "lang", query: "language:rust", color: "#DEA584" },
  {
    id: "typescript",
    label: "TypeScript",
    type: "lang",
    query: "language:typescript",
    color: "#3178C6",
  },
  { id: "go", label: "Go", type: "lang", query: "language:go", color: "#00ADD8" },
  {
    id: "today",
    label: "Today",
    type: "timeframe",
    query: "created:>2026-08-16",
    color: "#F05138",
  },
  {
    id: "this-week",
    label: "This Week",
    type: "timeframe",
    query: "created:>2026-08-10",
    color: "#4397E0",
  },
  {
    id: "this-month",
    label: "This Month",
    type: "timeframe",
    query: "created:>2026-07-17",
    color: "#198CE7",
  },
];

// ─── Local Snapshot Tracking for Authentic Growth Signals ───────────
const SNAPSHOT_STORAGE_KEY = "exploregit_repo_snapshots_v1";

const formatElapsed = (ms) => {
  const mins = Math.floor(ms / (60 * 1000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / (60 * 60 * 1000));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / (24 * 60 * 60 * 1000));
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const getOrUpdateSnapshot = (repoName, currentStars) => {
  if (!currentStars || typeof window === "undefined") {
    return {
      status: "none",
      delta: null,
      label: "Growth data not available yet",
      explanation: "No star baseline recorded yet for this repository.",
    };
  }

  try {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const existing = store[repoName];
    const now = Date.now();

    if (!existing) {
      store[repoName] = {
        firstStars: currentStars,
        firstSeen: now,
        lastChecked: now,
      };
      localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(store));
      return {
        status: "baseline",
        delta: null,
        baselineStars: currentStars,
        currentStars,
        firstSeen: now,
        lastChecked: now,
        elapsedLabel: "First visit",
        label: "Tracking started",
        explanation: `Baseline established on this device (${currentStars.toLocaleString()} stars). Growth data not available yet—revisit later to view measured change.`,
      };
    }

    const elapsedMs = Math.max(0, now - (existing.firstSeen || now));
    const delta = currentStars - (existing.firstStars ?? currentStars);
    store[repoName].lastChecked = now;
    localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(store));

    const elapsedLabel = formatElapsed(elapsedMs);
    const sign = delta > 0 ? "+" : "";

    return {
      status: delta > 0 ? "gain" : delta < 0 ? "loss" : "neutral",
      delta,
      baselineStars: existing.firstStars,
      currentStars,
      firstSeen: existing.firstSeen,
      lastChecked: now,
      elapsedLabel,
      label: delta === 0 ? `±0 (${elapsedLabel})` : `${sign}${delta.toLocaleString()} (${elapsedLabel})`,
      explanation: `${sign}${delta.toLocaleString()} stars measured since your first visit (${elapsedLabel}); checked just now.`,
    };
  } catch {
    return {
      status: "none",
      delta: null,
      label: "Growth data not available yet",
      explanation: "Browser storage is disabled or unavailable.",
    };
  }
};

// ─── High-Signal Developer Repositories for Discovery ─────────────
const DISCOVERY_REPOS = [
  {
    name: "vllm-project/vllm",
    desc: "High-throughput LLM serving engine with PagedAttention and CUDA/ROCm kernel optimization.",
    stars: "38.6k",
    rawStars: 38600,
    lang: "Python",
    langColor: "#3572a5",
    delta: null,
    source: "static",
    timeframe: "This Month",
    tags: ["ai", "python", "today", "llm-serving"],
  },
  {
    name: "astral-sh/uv",
    desc: "Fast Python package installer and resolver in Rust with global disk-space deduplication.",
    stars: "41.2k",
    rawStars: 41200,
    lang: "Rust",
    langColor: "#dea584",
    delta: null,
    source: "static",
    timeframe: "This Month",
    tags: ["rust", "python", "package-manager", "cli"],
  },
  {
    name: "ollama/ollama",
    desc: "Local runtime for quantised GGUF model execution with an OpenAI-compatible HTTP API.",
    stars: "112.5k",
    rawStars: 112500,
    lang: "Go",
    langColor: "#00add8",
    delta: null,
    source: "static",
    timeframe: "This Month",
    tags: ["ai", "go", "today", "ollama"],
  },
  {
    name: "biomejs/biome",
    desc: "Unified toolchain for JS/TS formatting and linting with sub-millisecond AST parser.",
    stars: "16.8k",
    rawStars: 16800,
    lang: "Rust",
    langColor: "#dea584",
    delta: null,
    source: "static",
    timeframe: "This Month",
    tags: ["typescript", "rust", "linter", "formatter"],
  },
  {
    name: "paradedb/paradedb",
    desc: "PostgreSQL search engine extension embedding Tantivy BM25 indexing into Postgres WAL.",
    stars: "9.4k",
    rawStars: 9400,
    lang: "Rust",
    langColor: "#dea584",
    delta: null,
    source: "static",
    timeframe: "This Month",
    tags: ["rust", "postgres", "search", "this month"],
  },
  {
    name: "tauri-apps/tauri",
    desc: "Cross-platform application runtime using native webview renderers and a Rust core.",
    stars: "84.1k",
    rawStars: 84100,
    lang: "Rust",
    langColor: "#dea584",
    delta: null,
    source: "static",
    timeframe: "This Month",
    tags: ["rust", "typescript", "desktop", "this month"],
  },
];

const getLangColor = (lang) => {
  const map = {
    Python: "#3572a5",
    Rust: "#dea584",
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Go: "#00add8",
    C: "#555555",
    "C++": "#f34b7d",
    Java: "#b07219",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
  };
  return map[lang] || "#A1A1AA";
};

const Hero = ({ onExplore }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState(null);
  const [repos, setRepos] = useState(() =>
    DISCOVERY_REPOS.map((repo) => ({
      ...repo,
      snapshot: getOrUpdateSnapshot(repo.name, repo.rawStars),
    }))
  );
  const [sourceMeta, setSourceMeta] = useState({
    source: "static",
    isLive: false,
    fromCache: false,
    lastUpdated: null,
    rankingRule: "Curated static developer repositories · Offline fallback",
  });
  const [activeSignalModal, setActiveSignalModal] = useState(null);

  const inputRef = React.useRef(null);

  useEffect(() => {
    let isMounted = true;
    if (typeof navigator !== "undefined" && navigator.onLine) {
      getMonthlyTopRepositories(6)
        .then((items) => {
          if (!isMounted || !items || !items.length) return;
          const detectedSource = items.source || items[0]?.source || "live";
          const lastUpdated = items.lastUpdated || null;
          const rankingRule =
            items.rankingRule ||
            (detectedSource === "static"
              ? "Curated static developer repositories · Offline fallback"
              : "Ranked by current stars among repositories created this month · GitHub Search API");

          const formatted = items.slice(0, 6).map((item) => {
            const starsNum = item.stargazers_count || 0;
            const starsFormatted =
              starsNum >= 1000 ? `${(starsNum / 1000).toFixed(1)}k` : `${starsNum}`;
            const langName = item.language || "Markdown";
            const topics = Array.isArray(item.topics) ? item.topics : [];
            const tags = [
              langName.toLowerCase(),
              ...topics,
              "this month",
              "monthly",
            ];
            const itemSource = item.source || detectedSource;
            const snapshot = getOrUpdateSnapshot(item.full_name || item.name, starsNum);

            return {
              name: item.full_name || item.name,
              desc: item.description || "High momentum open-source project on GitHub.",
              stars: starsFormatted,
              rawStars: starsNum,
              lang: langName,
              langColor: getLangColor(langName),
              delta: null,
              source: itemSource,
              snapshot,
              timeframe: "This Month",
              tags,
            };
          });

          setRepos(formatted);
          setSourceMeta({
            source: detectedSource,
            isLive: items.isLive ?? (detectedSource !== "static"),
            fromCache: items.fromCache ?? (detectedSource === "cached"),
            lastUpdated,
            rankingRule,
          });
        })
        .catch(() => {
          // Keep DISCOVERY_REPOS fallback safely
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (cat) => {
    if (cat.query) {
      navigate(`/dashboard?query=${encodeURIComponent(cat.query)}`);
    }
  };

  const handleChipClick = (chip) => {
    if (chip.type === "lang") {
      navigate(`/dashboard?language=${encodeURIComponent(chip.id)}&query=${encodeURIComponent(chip.query)}`);
    } else if (chip.query) {
      navigate(`/dashboard?query=${encodeURIComponent(chip.query)}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const rawQuery = searchQuery.trim();
    if (rawQuery) {
      navigate(`/dashboard?query=${encodeURIComponent(rawQuery)}`);
    } else {
      onExplore();
    }
  };

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesText =
        searchQuery === "" ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.lang.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesText) return false;

      if (!activeChip) return true;

      const chipId = activeChip.id;
      if (chipId === "ai") return repo.tags?.some((t) => t.includes("ai") || t.includes("llm") || t.includes("model"));
      if (chipId === "python") return repo.lang?.toLowerCase() === "python";
      if (chipId === "rust") return repo.lang?.toLowerCase() === "rust" || repo.tags?.includes("rust");
      if (chipId === "typescript") return repo.lang?.toLowerCase() === "typescript" || repo.tags?.includes("typescript");
      if (chipId === "go") return repo.lang?.toLowerCase() === "go";
      if (chipId === "today" || chipId === "this-week" || chipId === "this-month") return true;

      return true;
    });
  }, [searchQuery, activeChip, repos]);

  return (
    <section
      className="relative w-full border-b border-white/10 pt-28 sm:pt-32 md:pt-36 pb-0 overflow-hidden bg-[#0A0A0C]"
      aria-label="Hero Introduction"
    >
      {/* ── Background Parallax Layer 1 (hero-mid.png) ── */}
      <div
        className="absolute inset-0 w-full h-[140%] -top-12 bg-cover bg-center sm:bg-top pointer-events-none opacity-100 transition-transform duration-75 ease-out will-change-transform"
        style={{
          backgroundImage: `url(${heroMidImg})`,
          transform: `translate3d(0, ${Math.min(scrollY * 0.35, 300)}px, 0)`,
        }}
        aria-hidden="true"
      />

      {/* ── Background Parallax Layer 2 (hero-bot.png) ── */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-bottom pointer-events-none opacity-100 transition-transform duration-75 ease-out will-change-transform"
        style={{
          backgroundImage: `url(${heroBotImg})`,
          transform: `translate3d(0, ${Math.min(scrollY * 0.15, 150)}px, 0)`,
        }}
        aria-hidden="true"
      />

      {/* Bottom Fade Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,12,0.15) 0%, rgba(10,10,12,0.4) 60%, #0A0A0C 100%)",
        }}
      />

      {/* Main Container Frame - Boundless & Spacious */}
      <div className="mx-auto w-full max-w-[1280px] relative z-10 px-4 sm:px-6 pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="mx-auto flex w-full max-w-[960px] flex-col items-center gap-5 sm:gap-6 text-center">
          {/* Top Overline / Kicker */}
          <div className="pt-2">
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.22em] font-bold text-zinc-300 select-none">
              TRENDING GITHUB REPOSITORIES TODAY
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] sm:leading-[1.06] font-heading drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] max-w-3xl">
            Discover what developers
            <br className="hidden sm:inline" /> are building right now
          </h1>

          {/* Direct Product Description */}
          <p className="text-xs sm:text-[13px] font-mono text-[#a1a6b0] font-normal leading-relaxed max-w-2xl px-2">
            ExploreGit tracks star velocity across GitHub repositories,
            aggregates trending languages daily, and keeps an eye on contributor
            activity. Free and open source.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto pt-2 px-4 sm:px-0">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto h-[42px] px-6 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-95 shadow-xs cursor-pointer select-none"
            >
              <span>Explore Repositories</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            <a
              href="https://github.com/SahidGit/git-explore"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[42px] px-6 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/20 hover:border-white/30 text-white font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-95 shadow-xs cursor-pointer select-none"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 transition-transform duration-150 group-hover:scale-110" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>

        {/* ── Seamless Trending Repos Live Signal Module with ⌘K Search Bar ── */}
        <div className="w-full max-w-3xl mx-auto mt-8 sm:mt-10 relative">
          <div className="rounded-2xl bg-[#0E0F12]/90 backdrop-blur-xl shadow-2xl border border-white/15 overflow-hidden">
            {/* Search Input Bar */}
            <div className="p-3.5 sm:p-4 bg-[#121318]/70 space-y-3.5">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <label htmlFor="hero-repo-search" className="sr-only">
                  Search repositories, topics, tags…
                </label>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <input
                    ref={inputRef}
                    id="hero-repo-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search repositories, topics, tags…"
                    className="w-full pl-11 pr-28 py-3 bg-black/60 border border-white/15 rounded-xl font-sans text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all shadow-inner"
                  />
                  <div className="absolute right-2.5 flex items-center gap-2">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search input"
                        className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono font-semibold text-zinc-400 bg-white/[0.08] border border-white/15 rounded-md shadow-xs select-none">
                      ⌘K
                    </kbd>
                    <button
                      type="submit"
                      className="btn-saas-primary text-xs h-[32px] px-3.5 rounded-lg cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Filter Chips (Clean Borderless Pills) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar flex-wrap sm:flex-nowrap">
                <span className="text-xs font-sans text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1 font-semibold">
                  <Filter className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Quick:</span>
                </span>
                {QUICK_FILTER_CHIPS.map((chip) => {
                  const isSelected = activeChip?.id === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      aria-pressed={isSelected}
                      aria-label={`Filter by ${chip.label}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 shadow-none border ${
                        isSelected
                          ? "bg-white text-black font-semibold border-white"
                          : "bg-white/[0.06] hover:bg-white/[0.12] border-white/10 hover:border-white/20 text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: chip.color }}
                      />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}

                {(searchQuery || activeChip) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveChip(null);
                    }}
                    className="text-xs font-sans text-zinc-400 hover:text-white underline ml-auto shrink-0 transition-colors"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {/* Signal preview header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-2.5 bg-black/50 border-b border-white/[0.06] text-xs font-sans text-zinc-400">
              <div className="flex items-center gap-2 flex-wrap">
                {sourceMeta.source === "live" ? (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    LIVE GITHUB DATA
                  </div>
                ) : sourceMeta.source === "cached" ? (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    CACHED GITHUB DATA (15M TTL)
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    CURATED STATIC DATA
                  </div>
                )}
                <span className="text-zinc-600 hidden sm:inline">•</span>
                <span className="text-[11px] text-zinc-400 font-sans truncate max-w-[320px] sm:max-w-none">
                  {sourceMeta.rankingRule}
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 shrink-0">
                {filteredRepos.length}{" "}
                {filteredRepos.length === 1 ? "repo" : "repos"}{" "}
                matching
              </div>
            </div>

            {/* Filtered Repository List - Seamless & Borderless */}
            <div className="bg-transparent min-h-[220px] p-1.5 space-y-0.5">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.name}
                    onClick={() =>
                      navigate(
                        `/dashboard?query=${encodeURIComponent(repo.name)}`,
                      )
                    }
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${repo.name} details in dashboard`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(
                          `/dashboard?query=${encodeURIComponent(repo.name)}`,
                        );
                      }
                    }}
                    className="grid grid-cols-12 gap-3 items-center px-4 py-3 rounded-xl hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 transition-colors cursor-pointer group"
                  >
                    <div className="col-span-12 sm:col-span-6 text-left">
                      <p className="text-xs sm:text-sm font-sans text-white font-medium group-hover:text-blue-400 transition-colors truncate">
                        {repo.name}
                      </p>
                      <p className="text-xs font-sans text-zinc-400 truncate mt-0.5">
                        {repo.desc}
                      </p>
                    </div>
                    <div className="col-span-4 sm:col-span-2 flex items-center gap-1.5 text-xs text-zinc-300 font-sans font-medium">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      {repo.stars}
                    </div>
                    <div className="col-span-4 sm:col-span-2 flex items-center gap-1.5 text-xs font-sans font-medium text-zinc-300">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: repo.langColor }}
                      />
                      {repo.lang}
                    </div>
                    <div className="col-span-4 sm:col-span-2 flex items-center justify-end sm:justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSignalModal(repo);
                        }}
                        title="Why this repository is trending? Click to inspect telemetry and baseline growth signal."
                        className="group/signal flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border hover:scale-[1.02] active:scale-[0.98] bg-white/[0.03] hover:bg-white/[0.08]"
                        style={{
                          borderColor:
                            repo.snapshot?.status === "gain"
                              ? "rgba(52, 211, 153, 0.3)"
                              : repo.snapshot?.status === "baseline"
                              ? "rgba(99, 102, 241, 0.3)"
                              : "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {repo.snapshot?.status === "gain" ? (
                          <>
                            <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                            <span className="font-bold text-emerald-400 truncate">
                              +{repo.snapshot.delta.toLocaleString()}
                            </span>
                          </>
                        ) : repo.snapshot?.status === "baseline" ? (
                          <>
                            <Clock className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                            <span className="text-indigo-300 truncate">Tracking started</span>
                          </>
                        ) : repo.snapshot?.status === "neutral" ? (
                          <>
                            <Activity className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                            <span className="text-zinc-400 truncate">±0 baseline</span>
                          </>
                        ) : (
                          <>
                            <Info className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                            <span className="text-zinc-500 truncate">Growth N/A</span>
                          </>
                        )}
                        <Info className="w-3 h-3 text-zinc-500 group-hover/signal:text-white transition-colors shrink-0 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                  <p className="text-xs font-sans text-zinc-400">
                    No matching repositories found for your filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveChip(null);
                    }}
                    className="text-xs font-sans text-blue-400 hover:underline"
                  >
                    Clear search query and filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Multi-cell Ecosystem Categories Strip ── */}
      <div className="border-t border-white/10 bg-[#0E0E10]/95 backdrop-blur-xl relative z-10">
        <div className="mx-auto w-full max-w-[1280px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-x divide-white/[0.08]">
          {ECOSYSTEM_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              tabIndex={0}
              role="button"
              aria-label={`Filter by ${cat.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCategoryClick(cat);
                }
              }}
              className="flex items-center justify-center gap-2 border-b sm:border-b-0 border-white/10 py-3.5 sm:py-4 px-4 cursor-pointer hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98] transition-all select-none group"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs font-sans font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                {cat.name}
              </span>
              <span className="text-xs font-sans font-normal text-zinc-400 shrink-0">
                {cat.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* ─── "Why this is trending" Signal Explanation Modal ─── */}
      {activeSignalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveSignalModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#121216] border border-white/10 p-6 shadow-2xl text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Trending Signal Telemetry
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {activeSignalModal.source === "live"
                      ? "Live GitHub API"
                      : activeSignalModal.source === "cached"
                      ? "Cached GitHub API"
                      : "Curated Static"}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-sans text-white mt-1.5 flex items-center gap-2">
                  {activeSignalModal.name}
                  <a
                    href={`https://github.com/${activeSignalModal.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors inline-flex items-center"
                    title="Open repository on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSignalModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close signal analysis"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
              {activeSignalModal.desc}
            </p>

            {/* Metrics telemetry grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Current Stars</span>
                <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  {activeSignalModal.rawStars ? activeSignalModal.rawStars.toLocaleString() : activeSignalModal.stars}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Language</span>
                <span className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSignalModal.langColor }} />
                  {activeSignalModal.lang}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Measured Growth</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5 block truncate">
                  {activeSignalModal.snapshot?.delta !== null && activeSignalModal.snapshot?.delta !== undefined
                    ? (activeSignalModal.snapshot.delta > 0
                        ? `+${activeSignalModal.snapshot.delta.toLocaleString()} stars`
                        : `${activeSignalModal.snapshot.delta.toLocaleString()} stars`)
                    : "Growth data not available yet"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Comparison Window</span>
                <span className="text-xs font-medium text-zinc-300 mt-0.5 block truncate">
                  {activeSignalModal.snapshot?.elapsedLabel === "First visit"
                    ? "Baseline established now"
                    : `Since first visit (${activeSignalModal.snapshot?.elapsedLabel || "recent"})`}
                </span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Why does this appear in the list?</span>
              </div>
              <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                {activeSignalModal.source !== "static"
                  ? "Ranked by current star count among public repositories created within the last 30 days via GitHub REST API."
                  : "Featured in our curated open-source development stack (active fallback baseline)."}
              </p>
              <p className="text-[11px] font-sans text-zinc-400 leading-relaxed pt-1 border-t border-white/5">
                {activeSignalModal.snapshot?.explanation || "Snapshot baseline tracking active."}
              </p>
            </div>

            <div className="text-[10px] font-sans text-zinc-500">
              Transparency note: Growth values are calculated from client-side timestamped snapshots on this device. ExploreGit never fabricates star velocity or uses fork counts as substitute signals.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveSignalModal(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetName = activeSignalModal.name;
                  setActiveSignalModal(null);
                  navigate(`/dashboard?query=${encodeURIComponent(targetName)}`);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
              >
                <span>Explore in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Hero;
