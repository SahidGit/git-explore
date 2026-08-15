import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Github, ArrowRight, TrendingUp, Star, Sparkles, Bot, Cpu,
    MessageSquare, Terminal, Globe, Code
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
        id: 'ollama',
        name: 'Ollama Local',
        badge: 'Offline AI',
        color: '#F59E0B',
        query: 'ollama',
    },
];

// ─── Mock Repos for Live Signal Preview ───────────────
const MOCK_REPOS = [
    {
        name: 'deepseek-ai/DeepSeek-V3',
        desc: 'Official repository for DeepSeek-V3 open source model and architecture specs',
        stars: '62.4k',
        lang: 'Python',
        langColor: '#3572a5',
        delta: '+12.5k this week',
    },
    {
        name: 'astral-sh/uv',
        desc: 'An extremely fast Python package and project manager written in Rust',
        stars: '45.2k',
        lang: 'Rust',
        langColor: '#dea584',
        delta: '+4.2k this week',
    },
    {
        name: 'ollama/ollama',
        desc: 'Get up and running with Llama 3.3, DeepSeek, and other LLMs locally',
        stars: '106.1k',
        lang: 'Go',
        langColor: '#00add8',
        delta: '+5.8k this week',
    },
];

const Hero = ({ onExplore }) => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

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
                <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-5 sm:gap-6 text-center">

                    {/* Main Headline */}
                    <div className="space-y-3 sm:space-y-4 py-1 sm:py-2">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] font-space drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                            Every repository signal
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-300">
                                structured into intelligence.
                            </span>
                        </h1>

                        <p className="text-xs sm:text-base font-sans text-zinc-200 leading-relaxed font-medium max-w-2xl mx-auto px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                            GitExplorer tracks active repositories, contributor velocity, and open-source momentum before it hits the front page. Zero telemetry, raw GitHub graph signal.
                        </p>
                    </div>

                    {/* Primary CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto pt-2 px-4 sm:px-0 font-mono text-xs">
                        <button
                            onClick={onExplore}
                            className="flex items-center justify-center rounded-xl bg-white text-black font-extrabold px-6 py-3 sm:py-3 hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-2xl gap-2 cursor-pointer w-full sm:w-auto"
                        >
                            <span>Explore Repositories</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <a
                            href="https://github.com/SahidGit/git-explore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-xl border border-white/20 bg-[#121215]/90 backdrop-blur-xl text-white font-mono font-bold px-6 py-3 sm:py-3 hover:bg-[#18181D] hover:border-white/40 active:scale-[0.98] transition-all gap-2 w-full sm:w-auto shadow-2xl"
                        >
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>Star on GitHub</span>
                        </a>
                    </div>

                    {/* Sub metadata label */}
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-zinc-300">
                        <span className="bg-[#121215]/90 border border-white/15 px-3 py-1.5 rounded-xl text-zinc-300">
                            Open source &bull; MIT licensed
                        </span>
                        <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
                        <a
                            href="https://github.com/SahidGit/git-explore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white bg-[#121215]/90 border border-white/15 px-3 py-1.5 rounded-xl hover:border-white/35 hover:bg-[#18181D] active:scale-[0.98] transition-all"
                        >
                            <Github className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Repository on GitHub</span>
                        </a>
                    </div>

                </div>

                {/* ── Live Dashboard Mockup Card ── */}
                <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 relative">
                    <div className="rounded-2xl border border-white/15 bg-[#121215]/95 backdrop-blur-2xl overflow-hidden shadow-2xl min-h-[260px]">
                        {/* Chrome bar */}
                        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#0E0E10]">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-rose-500" />
                                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-500" />
                                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500" />
                            </div>
                            <div className="bg-[#0A0A0C] border border-white/10 rounded-md px-2.5 py-1 text-[10px] sm:text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 sm:gap-2 truncate max-w-[220px] sm:max-w-none">
                                <span className="truncate">git-explore-one.vercel.app/dashboard</span>
                                <span className="text-emerald-400 font-bold hidden sm:inline">&bull; LIVE GRAPH</span>
                            </div>
                            <div className="w-8 sm:w-12" />
                        </div>

                        {/* Body rows */}
                        <div className="p-3 sm:p-6 space-y-2.5 sm:space-y-3">
                            <div className="grid grid-cols-12 gap-3 px-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                <span className="col-span-12 sm:col-span-6">REPOSITORY</span>
                                <span className="col-span-2 hidden sm:block">STARS</span>
                                <span className="col-span-2 hidden sm:block">LANGUAGE</span>
                                <span className="col-span-2 hidden sm:block">MOMENTUM</span>
                            </div>

                            {MOCK_REPOS.map((repo) => (
                                <div
                                    key={repo.name}
                                    className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl border border-white/10 bg-[#0A0A0C]/80 hover:border-white/25 hover:bg-[#0A0A0C] transition-all cursor-pointer"
                                    onClick={onExplore}
                                >
                                    <div className="col-span-12 sm:col-span-6 text-left">
                                        <p className="text-xs sm:text-sm font-mono text-white font-semibold truncate">{repo.name}</p>
                                        <p className="text-[11px] text-zinc-400 truncate">{repo.desc}</p>
                                    </div>
                                    <div className="col-span-2 hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                        {repo.stars}
                                    </div>
                                    <div className="col-span-2 hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.langColor }} />
                                        {repo.lang}
                                    </div>
                                    <div className="col-span-2 hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        {repo.delta}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Multi-cell Ecosystem Categories Strip ── */}
            <div className="border-t border-white/10 bg-[#0E0E10]/95 backdrop-blur-xl relative z-10">
                <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                    {ECOSYSTEM_CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat)}
                            className="flex items-center justify-center gap-2 border-b sm:border-b-0 border-r border-white/10 py-3 sm:py-3.5 px-3 sm:px-4 cursor-pointer hover:bg-white/[0.06] active:scale-[0.98] transition-all select-none group"
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
