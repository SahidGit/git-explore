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
  Flame,
  Calendar,
  ChevronRight,
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
const getDynamicTimeframeQuery = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `created:>${d.toISOString().split("T")[0]}`;
};

const QUICK_FILTER_CHIPS = [
  {
    id: "ai",
    label: "AI",
    type: "topic",
    group: "tech",
    query: "topic:ai",
    color: "#C084FC",
    icon: Sparkles,
    activeClasses: "bg-purple-500/20 text-purple-200 border-purple-500/60 shadow-[0_0_14px_rgba(168,85,247,0.35)]",
    hoverBorder: "hover:border-purple-500/40",
  },
  {
    id: "python",
    label: "Python",
    type: "lang",
    group: "tech",
    query: "language:python",
    color: "#38BDF8",
    icon: Code2,
    activeClasses: "bg-blue-500/20 text-blue-200 border-blue-500/60 shadow-[0_0_14px_rgba(59,130,246,0.35)]",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    id: "rust",
    label: "Rust",
    type: "lang",
    group: "tech",
    query: "language:rust",
    color: "#FB923C",
    icon: Code2,
    activeClasses: "bg-orange-500/20 text-orange-200 border-orange-500/60 shadow-[0_0_14px_rgba(249,115,22,0.35)]",
    hoverBorder: "hover:border-orange-500/40",
  },
  {
    id: "typescript",
    label: "TypeScript",
    type: "lang",
    group: "tech",
    query: "language:typescript",
    color: "#60A5FA",
    icon: Code2,
    activeClasses: "bg-sky-500/20 text-sky-200 border-sky-500/60 shadow-[0_0_14px_rgba(14,165,233,0.35)]",
    hoverBorder: "hover:border-sky-500/40",
  },
  {
    id: "go",
    label: "Go",
    type: "lang",
    group: "tech",
    query: "language:go",
    color: "#22D3EE",
    icon: Code2,
    activeClasses: "bg-cyan-500/20 text-cyan-200 border-cyan-500/60 shadow-[0_0_14px_rgba(6,182,212,0.35)]",
    hoverBorder: "hover:border-cyan-500/40",
  },
  {
    id: "today",
    label: "Today",
    type: "timeframe",
    group: "time",
    since: "daily",
    query: getDynamicTimeframeQuery(1),
    color: "#FB7185",
    icon: Flame,
    activeClasses: "bg-rose-500/20 text-rose-200 border-rose-500/60 shadow-[0_0_14px_rgba(244,63,94,0.35)]",
    hoverBorder: "hover:border-rose-500/40",
  },
  {
    id: "this-week",
    label: "This Week",
    type: "timeframe",
    group: "time",
    since: "weekly",
    query: getDynamicTimeframeQuery(7),
    color: "#FBBF24",
    icon: Clock,
    activeClasses: "bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-[0_0_14px_rgba(245,158,11,0.35)]",
    hoverBorder: "hover:border-amber-500/40",
  },
  {
    id: "this-month",
    label: "This Month",
    type: "timeframe",
    group: "time",
    since: "monthly",
    query: getDynamicTimeframeQuery(30),
    color: "#818CF8",
    icon: Calendar,
    activeClasses: "bg-indigo-500/20 text-indigo-200 border-indigo-500/60 shadow-[0_0_14px_rgba(99,102,241,0.35)]",
    hoverBorder: "hover:border-indigo-500/40",
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

  const navigateToChip = (chip) => {
    if (!chip) return;
    if (chip.type === "lang") {
      navigate(`/dashboard?language=${encodeURIComponent(chip.id)}&query=${encodeURIComponent(chip.query)}`);
    } else if (chip.type === "timeframe") {
      navigate(`/dashboard?since=${encodeURIComponent(chip.since || "daily")}&query=${encodeURIComponent(chip.query)}`);
    } else if (chip.query) {
      navigate(`/dashboard?query=${encodeURIComponent(chip.query)}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleChipClick = (chip) => {
    if (activeChip?.id === chip.id) {
      // Toggle off if already selected
      setActiveChip(null);
    } else {
      // Select the chip to filter the live preview in the Hero
      setActiveChip(chip);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const rawQuery = searchQuery.trim();
    if (rawQuery) {
      navigate(`/dashboard?query=${encodeURIComponent(rawQuery)}`);
    } else if (activeChip) {
      navigateToChip(activeChip);
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
      if (chipId === "today") return repo.tags?.includes("today") || repo.timeframe?.toLowerCase() === "today";
      if (chipId === "this-week") return repo.tags?.includes("this-week") || repo.tags?.includes("this week") || repo.timeframe?.toLowerCase() === "this week";
      if (chipId === "this-month") return repo.tags?.includes("this-month") || repo.tags?.includes("this month") || repo.timeframe?.toLowerCase() === "this month";

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

              {/* Quick Filter Chips (Modern Single-Line Responsive Pill Strip) */}
              <div className="relative w-full overflow-hidden pt-1 pb-1">
                {/* Edge fade indicators for touch scroll on small devices */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#121318] to-transparent z-10 sm:hidden" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#121318] to-transparent z-10 sm:hidden" />

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap py-1 px-0.5 select-none touch-pan-x">
                  {/* Quick label pill */}
                  <span className="text-[11px] font-sans text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1 font-semibold pr-1">
                    <Filter className="w-3 h-3 text-zinc-400" />
                    <span>Quick:</span>
                  </span>

                  {/* Modern Filter Chips */}
                  {QUICK_FILTER_CHIPS.map((chip, index) => {
                    const isSelected = activeChip?.id === chip.id;
                    const Icon = chip.icon;
                    const isFirstTimeframe = chip.group === "time" && QUICK_FILTER_CHIPS[index - 1]?.group !== "time";

                    return (
                      <React.Fragment key={chip.id}>
                        {isFirstTimeframe && (
                          <div className="h-3.5 w-px bg-white/15 shrink-0 mx-1" aria-hidden="true" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleChipClick(chip)}
                          onDoubleClick={() => navigateToChip(chip)}
                          aria-pressed={isSelected}
                          aria-label={`Filter by ${chip.label}${isSelected ? " (Selected · Click Explore on Dashboard to view full results)" : ""}`}
                          title={isSelected ? "Selected · Click Explore on Dashboard to view full results" : `Filter by ${chip.label}`}
                          className={`group inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-sans font-medium transition-all duration-200 shrink-0 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 border backdrop-blur-md ${
                            isSelected
                              ? chip.activeClasses
                              : `bg-white/[0.04] hover:bg-white/[0.09] border-white/[0.08] ${chip.hoverBorder} text-zinc-300 hover:text-white shadow-xs`
                          }`}
                        >
                          {Icon ? (
                            <Icon
                              className={`w-3 h-3 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                isSelected ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                              }`}
                              style={{ color: chip.color }}
                            />
                          ) : (
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200"
                              style={{
                                backgroundColor: chip.color,
                                boxShadow: isSelected ? `0 0 8px ${chip.color}` : "none",
                              }}
                            />
                          )}
                          <span>{chip.label}</span>
                          {isSelected && (
                            <span className="inline-flex items-center text-[10px] opacity-75 group-hover:opacity-100 ml-0.5">
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                      </React.Fragment>
                    );
                  })}

                  {/* Actions: Direct Explore link & Reset button */}
                  {(searchQuery || activeChip) && (
                    <div className="flex items-center gap-2 ml-auto shrink-0 pl-2">
                      {activeChip && (
                        <button
                          type="button"
                          onClick={() => navigateToChip(activeChip)}
                          className="text-[11px] font-sans font-medium text-blue-400 hover:text-blue-300 flex items-center gap-0.5 shrink-0 transition-colors cursor-pointer"
                        >
                          <span>Explore on Dashboard</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveChip(null);
                        }}
                        className="text-[11px] font-sans text-zinc-400 hover:text-white underline shrink-0 transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
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
                        className="group/signal flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-xs font-mono transition-colors border bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/60 hover:border-zinc-500 text-white"
                      >
                        {repo.snapshot?.status === "gain" ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                            <TrendingUp className="w-3.5 h-3.5 shrink-0 text-white" />
                            <span className="font-semibold text-white tracking-tight">
                              +{repo.snapshot.delta.toLocaleString()}
                            </span>
                          </>
                        ) : repo.snapshot?.status === "baseline" ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                            <Sparkles className="w-3.5 h-3.5 shrink-0 text-zinc-300" />
                            <span className="font-normal text-[11px] text-zinc-300">
                              Tracking started
                            </span>
                          </>
                        ) : repo.snapshot?.status === "neutral" ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                            <Activity className="w-3.5 h-3.5 shrink-0 text-zinc-300" />
                            <span className="font-normal text-[11px] text-zinc-300">±0 stars</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                            <Clock className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                            <span className="text-[11px] text-zinc-400">Baseline pending</span>
                          </>
                        )}
                        <Info className="w-3 h-3 text-zinc-400 group-hover/signal:text-white transition-colors shrink-0 ml-0.5" />
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

            {/* Secondary Meta Badges */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-700/60 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Current Stars</span>
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 mt-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-zinc-300 fill-zinc-300/20" />
                  {activeSignalModal.rawStars ? activeSignalModal.rawStars.toLocaleString() : activeSignalModal.stars}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-700/60 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Language</span>
                <span className="text-sm sm:text-base font-semibold text-white flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSignalModal.langColor }} />
                  {activeSignalModal.lang}
                </span>
              </div>
            </div>

            {/* Featured Measured Growth Telemetry Card - Minimalist Monochrome (Blue Telemetry Accent) */}
            {(() => {
              const status = activeSignalModal.snapshot?.status;
              const delta = activeSignalModal.snapshot?.delta;
              const hasGain = delta !== null && delta !== undefined && delta > 0;
              const hasLoss = delta !== null && delta !== undefined && delta < 0;
              const isBaseline = status === "baseline";
              const isNeutral = status === "neutral" || delta === 0;

              return (
                <div className="p-3.5 sm:p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 text-left space-y-2.5">
                  {/* Header line */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
                        {hasGain ? (
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                        ) : isBaseline ? (
                          <Sparkles className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Activity className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-blue-400 block">
                          Measured Growth
                        </span>
                        <span className="text-[10px] text-zinc-400 font-sans">
                          Device-anchored star delta
                        </span>
                      </div>
                    </div>

                    {/* Status chip */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border border-blue-500/30 bg-blue-950/40 text-blue-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      {hasGain
                        ? "LIVE GAIN"
                        : hasLoss
                        ? "NET LOSS"
                        : isBaseline
                        ? "BASELINE ANCHORED"
                        : isNeutral
                        ? "STEADY"
                        : "STANDBY"}
                    </span>
                  </div>

                  {/* Metric hero number */}
                  <div className="flex items-baseline gap-2.5 pt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-blue-400">
                      {hasGain
                        ? `+${delta.toLocaleString()}`
                        : delta !== null && delta !== undefined
                        ? `${delta.toLocaleString()}`
                        : "Baseline Pending"}
                    </span>
                    <span className="text-xs font-mono text-blue-300/80 font-medium">
                      {hasGain ? "stars gained" : isBaseline ? "initial visit recorded" : "stars delta"}
                    </span>
                  </div>

                  {/* Comparison window footer info */}
                  <div className="pt-2 border-t border-blue-500/20 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="text-zinc-500">Comparison Window:</span>
                    <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                      {activeSignalModal.snapshot?.elapsedLabel === "First visit"
                        ? "Baseline established just now"
                        : `Since first visit (${activeSignalModal.snapshot?.elapsedLabel || "recent"})`}
                    </span>
                  </div>
                </div>
              );
            })()}

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
