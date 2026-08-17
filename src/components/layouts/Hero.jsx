import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Github, ArrowRight, TrendingUp, Star, Search, X, Sparkles, Filter, Code2
} from 'lucide-react';

import heroMid from '../../assets/hero-mid.png';
import heroBot from '../../assets/hero-bot.png';

// ─── Ecosystem Categories Data ─────────────────────────
const ECOSYSTEM_CATEGORIES = [
    {
        id: 'deepseek',
        name: 'DeepSeek AI',
        badge: 'Trending',
        color: '#6366F1',
        query: 'deepseek',
    },
    {
        id: 'ai-skills',
        name: 'AI Skills & Agents',
        badge: 'Agentic',
        color: '#A855F7',
        query: 'topic:ai',
    },
    {
        id: 'open-models',
        name: 'Open Models',
        badge: 'LLM',
        color: '#10B981',
        query: 'topic:open-source-llm',
    },
    {
        id: 'chatbots',
        name: 'AI Chatbots',
        badge: 'Chat',
        color: '#EC4899',
        query: 'topic:chatbot',
    },
    {
        id: 'vector-rag',
        name: 'Vector DBs & RAG',
        badge: 'RAG',
        color: '#3B82F6',
        query: 'topic:vector-database',
    },
    {
        id: 'ollama',
        name: 'Ollama Local',
        badge: 'Offline AI',
        color: '#F59E0B',
        query: 'ollama',
    },
];

// ─── Quick Filter Chips Data ───────────────────────────
const QUICK_FILTER_CHIPS = [
    { id: 'ai', label: 'AI', type: 'topic', query: 'topic:ai' },
    { id: 'python', label: 'Python', type: 'lang', query: 'language:python' },
    { id: 'rust', label: 'Rust', type: 'lang', query: 'language:rust' },
    { id: 'typescript', label: 'TypeScript', type: 'lang', query: 'language:typescript' },
    { id: 'go', label: 'Go', type: 'lang', query: 'language:go' },
    { id: 'today', label: 'Today', type: 'timeframe', query: 'created:>2026-08-16' },
    { id: 'this-week', label: 'This Week', type: 'timeframe', query: 'created:>2026-08-10' },
    { id: 'this-month', label: 'This Month', type: 'timeframe', query: 'created:>2026-07-17' },
];

// ─── Comprehensive Mock Repos for Discovery ─────────────
const DISCOVERY_REPOS = [
    {
        name: 'deepseek-ai/DeepSeek-V3',
        desc: 'Official repository for DeepSeek-V3 open source model and architecture specs',
        stars: '62.4k',
        lang: 'Python',
        langColor: '#3572a5',
        delta: '+12.5k this week',
        timeframe: 'This Week',
        tags: ['ai', 'python', 'deepseek', 'llm'],
    },
    {
        name: 'astral-sh/uv',
        desc: 'An extremely fast Python package and project manager written in Rust',
        stars: '45.2k',
        lang: 'Rust',
        langColor: '#dea584',
        delta: '+4.2k this week',
        timeframe: 'This Week',
        tags: ['rust', 'python', 'cli'],
    },
    {
        name: 'ollama/ollama',
        desc: 'Get up and running with Llama 3.3, DeepSeek, and other LLMs locally',
        stars: '106.1k',
        lang: 'Go',
        langColor: '#00add8',
        delta: '+5.8k today',
        timeframe: 'Today',
        tags: ['ai', 'go', 'today', 'ollama'],
    },
    {
        name: 'shadcn-ui/ui',
        desc: 'Beautifully designed components that you can copy and paste into your apps',
        stars: '74.8k',
        lang: 'TypeScript',
        langColor: '#3178c6',
        delta: '+3.1k this month',
        timeframe: 'This Month',
        tags: ['typescript', 'ui', 'this month'],
    },
    {
        name: 'vllm-project/vllm',
        desc: 'High-throughput and memory-efficient LLM serving engine',
        stars: '31.5k',
        lang: 'Python',
        langColor: '#3572a5',
        delta: '+2.9k today',
        timeframe: 'Today',
        tags: ['ai', 'python', 'today'],
    },
    {
        name: 'ghostty-org/ghostty',
        desc: 'Fast, feature-rich, cross-platform terminal emulator',
        stars: '28.9k',
        lang: 'Zig',
        langColor: '#ec915c',
        delta: '+8.4k this month',
        timeframe: 'This Month',
        tags: ['rust', 'terminal', 'this month'],
    },
];

const Hero = ({ onExplore }) => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChip, setActiveChip] = useState(null);

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
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCategoryClick = (cat) => {
        if (cat.query) {
            navigate(`/dashboard?query=${encodeURIComponent(cat.query)}`);
        }
    };

    const handleChipClick = (chip) => {
        if (activeChip?.id === chip.id) {
            setActiveChip(null);
        } else {
            setActiveChip(chip);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const combinedQuery = [
            searchQuery.trim(),
            activeChip ? activeChip.query : ''
        ].filter(Boolean).join(' ');

        if (combinedQuery) {
            navigate(`/dashboard?query=${encodeURIComponent(combinedQuery)}`);
        } else {
            onExplore();
        }
    };

    const filteredRepos = useMemo(() => {
        return DISCOVERY_REPOS.filter((repo) => {
            const matchesText = searchQuery === '' ||
                repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                repo.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                repo.lang.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesText) return false;

            if (!activeChip) return true;

            const chipId = activeChip.id;
            if (chipId === 'ai') return repo.tags.includes('ai');
            if (chipId === 'python') return repo.lang.toLowerCase() === 'python';
            if (chipId === 'rust') return repo.lang.toLowerCase() === 'rust' || repo.tags.includes('rust');
            if (chipId === 'typescript') return repo.lang.toLowerCase() === 'typescript';
            if (chipId === 'go') return repo.lang.toLowerCase() === 'go';
            if (chipId === 'today') return repo.timeframe === 'Today' || repo.tags.includes('today');
            if (chipId === 'this-week') return repo.timeframe === 'This Week';
            if (chipId === 'this-month') return repo.timeframe === 'This Month' || repo.tags.includes('this month');

            return true;
        });
    }, [searchQuery, activeChip]);

    return (
        <section
            className="relative w-full border-b border-white/10 pt-28 sm:pt-32 md:pt-36 pb-0 overflow-hidden bg-[#0A0A0C]"
            aria-label="Hero Introduction"
        >
            {/* ── Background Parallax Layer 1 (hero-mid.png) ── */}
            <div
                className="absolute inset-0 w-full h-[140%] -top-12 bg-cover bg-center sm:bg-top pointer-events-none opacity-100 transition-transform duration-75 ease-out will-change-transform"
                style={{
                    backgroundImage: `url(${heroMid})`,
                    transform: `translate3d(0, ${Math.min(scrollY * 0.35, 300)}px, 0)`,
                }}
                aria-hidden="true"
            />

            {/* ── Background Parallax Layer 2 (hero-bot.png) ── */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-bottom pointer-events-none opacity-100 transition-transform duration-75 ease-out will-change-transform"
                style={{
                    backgroundImage: `url(${heroBot})`,
                    transform: `translate3d(0, ${Math.min(scrollY * 0.15, 150)}px, 0)`,
                }}
                aria-hidden="true"
            />

            {/* Bottom Fade Overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(10,10,12,0.15) 0%, rgba(10,10,12,0.4) 60%, #0A0A0C 100%)',
                }}
            />

            {/* Main Container Frame */}
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 relative z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-12 sm:pb-16">
                <div className="mx-auto flex w-full max-w-[840px] flex-col items-center gap-5 sm:gap-6 text-center">

                    {/* Main Headline */}
                    <div className="space-y-3 sm:space-y-4 py-1 sm:py-2">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] font-space drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                            Find open-source projects gaining momentum.
                        </h1>

                        <p className="text-sm sm:text-base font-sans text-zinc-300 leading-relaxed font-normal max-w-2xl mx-auto px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                            GitExplorer surfaces trending repositories using star velocity, contributor activity, and repository health signals.
                        </p>
                    </div>

                    {/* Primary CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto pt-2 px-4 sm:px-0 font-mono text-xs">
                        <button
                            onClick={onExplore}
                            className="flex items-center justify-center rounded-full bg-white text-black font-extrabold px-7 py-3.5 hover:bg-[#E4E4E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C] active:scale-[0.98] transition-all duration-200 gap-2 cursor-pointer w-full sm:w-auto shadow-sm"
                        >
                            <span>Explore live GitHub trends</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <a
                            href="https://github.com/SahidGit/git-explore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-xl text-white hover:text-white font-mono font-bold px-7 py-3.5 hover:bg-white/[0.08] hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C] active:scale-[0.98] transition-all duration-200 gap-2 w-full sm:w-auto"
                        >
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                            <span>Star on GitHub</span>
                        </a>
                    </div>

                    {/* Sub metadata label */}
                    <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-[#94A3B8]">
                        <span className="bg-[#121316]/90 border border-white/10 px-3.5 py-1.5 rounded-full text-[#94A3B8]">
                            Open source &bull; MIT licensed
                        </span>
                        <span className="hidden sm:inline-block h-3 w-px bg-white/10" />
                        <a
                            href="https://github.com/SahidGit/git-explore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white bg-[#121316]/90 border border-white/10 px-3.5 py-1.5 rounded-full hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98] transition-all"
                        >
                            <Github className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Repository on GitHub</span>
                        </a>
                    </div>

                </div>

                {/* ── Live Discovery Interaction Module ── */}
                <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-10 relative">
                    <div className="rounded-2xl border border-white/15 bg-[#121215]/95 backdrop-blur-2xl overflow-hidden shadow-2xl">

                        {/* Top Module Bar with Search Input */}
                        <div className="p-3.5 sm:p-5 border-b border-white/10 bg-[#0E0E10]/90 space-y-3.5">
                            <form onSubmit={handleSearchSubmit} className="relative w-full">
                                <label htmlFor="hero-repo-search" className="sr-only">
                                    Search repositories, topics, or languages…
                                </label>
                                <div className="relative flex items-center">
                                    <Search className="absolute left-3.5 w-4 h-4 text-emerald-400 pointer-events-none" />
                                    <input
                                        id="hero-repo-search"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search repositories, topics, or languages…"
                                        className="w-full pl-10 pr-24 py-2.5 sm:py-3 bg-[#0A0A0C] border border-white/15 rounded-xl font-mono text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            aria-label="Clear search input"
                                            className="absolute right-16 p-1 text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="absolute right-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 rounded-lg text-xs font-mono font-bold transition-all"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </form>

                            {/* Quick Filter Chips */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar flex-wrap sm:flex-nowrap">
                                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                                    <Filter className="w-3 h-3 text-emerald-400" />
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
                                            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-medium border transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                                                isSelected
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-bold'
                                                    : 'bg-[#121215] text-zinc-300 border-white/10 hover:border-white/25 hover:bg-[#18181D] hover:text-white'
                                            }`}
                                        >
                                            {chip.label}
                                        </button>
                                    );
                                })}

                                {(searchQuery || activeChip) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setActiveChip(null);
                                        }}
                                        className="text-[11px] font-mono text-zinc-400 hover:text-rose-400 underline ml-auto shrink-0 transition-colors"
                                    >
                                        Reset filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Chrome bar metadata header */}
                        <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-white/10 bg-[#0A0A0C] text-[10px] sm:text-[11px] font-mono text-zinc-400">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>LIVE SIGNAL PREVIEW</span>
                            </div>
                            <div>
                                {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'} matching
                            </div>
                        </div>

                        {/* Filtered Repository List */}
                        <div className="p-3 sm:p-5 space-y-2.5 bg-[#0A0A0C]/90 min-h-[220px]">
                            {filteredRepos.length > 0 ? (
                                filteredRepos.map((repo) => (
                                    <div
                                        key={repo.name}
                                        onClick={() => navigate(`/dashboard?query=${encodeURIComponent(repo.name)}`)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`View ${repo.name} details in dashboard`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                navigate(`/dashboard?query=${encodeURIComponent(repo.name)}`);
                                            }
                                        }}
                                        className="grid grid-cols-12 gap-3 items-center p-3 sm:p-3.5 rounded-xl border border-white/10 bg-[#0E0E10] hover:border-emerald-500/40 hover:bg-[#121215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all cursor-pointer group"
                                    >
                                        <div className="col-span-12 sm:col-span-6 text-left">
                                            <p className="text-xs sm:text-sm font-mono text-white font-semibold group-hover:text-emerald-300 transition-colors truncate">
                                                {repo.name}
                                            </p>
                                            <p className="text-[11px] font-sans text-zinc-400 truncate mt-0.5">{repo.desc}</p>
                                        </div>
                                        <div className="col-span-4 sm:col-span-2 flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                            {repo.stars}
                                        </div>
                                        <div className="col-span-4 sm:col-span-2 flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: repo.langColor }} />
                                            {repo.lang}
                                        </div>
                                        <div className="col-span-4 sm:col-span-2 flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-medium justify-end sm:justify-start">
                                            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{repo.delta}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center space-y-2">
                                    <p className="text-xs font-mono text-zinc-400">No matching repositories found for your filters.</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setActiveChip(null);
                                        }}
                                        className="text-xs font-mono text-emerald-400 hover:underline"
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
                <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                    {ECOSYSTEM_CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Filter by ${cat.name}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleCategoryClick(cat);
                                }
                            }}
                            className="flex items-center justify-center gap-2 border-b sm:border-b-0 border-r border-white/10 py-3 sm:py-3.5 px-3 sm:px-4 cursor-pointer hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.98] transition-all select-none group"
                        >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                            <span className="text-[11px] sm:text-xs font-mono font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                                {cat.name}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 bg-white/[0.06] border border-white/10 px-1.5 py-0.5 rounded-md shrink-0">
                                {cat.badge}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;

