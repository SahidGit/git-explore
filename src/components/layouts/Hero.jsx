import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Github, ArrowRight, TrendingUp, Star, Sparkles, Bot, Cpu,
    MessageSquare, Terminal, Globe, Code
} from 'lucide-react';

import heroMid from '../../assets/hero-mid.png';
import heroBot from '../../assets/hero-bot.png';

// ─── Ecosystem Pills Data ─────────────────────────────
const ECOSYSTEM_CATEGORIES = [
    {
        id: 'deepseek',
        name: 'DeepSeek AI',
        query: 'deepseek',
        badge: 'NEW',
        color: '#6366F1',
        icon: Sparkles,
    },
    {
        id: 'ai-skills',
        name: 'AI Skills & Agents',
        query: 'topic:ai',
        color: '#A855F7',
        icon: Bot,
    },
    {
        id: 'open-models',
        name: 'Open Source Models',
        query: 'topic:open-source-llm',
        color: '#10B981',
        icon: Cpu,
    },
    {
        id: 'chatbots',
        name: 'AI Chatbots',
        query: 'topic:chatbot',
        color: '#EC4899',
        icon: MessageSquare,
    },
    {
        id: 'ollama',
        name: 'Ollama & Local AI',
        query: 'ollama',
        color: '#F59E0B',
        icon: Terminal,
    },
    {
        id: 'python',
        name: 'Python AI',
        language: 'Python',
        color: '#3572a5',
        icon: Code,
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        language: 'TypeScript',
        color: '#3178c6',
        icon: Code,
    },
    {
        id: 'rust',
        name: 'Rust',
        language: 'Rust',
        color: '#dea584',
        icon: Code,
    },
    {
        id: 'web-dev',
        name: 'Web Dev',
        query: 'topic:web',
        color: '#00add8',
        icon: Globe,
    },
];

// ─── Live signal repos for dashboard preview ──────────
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

// ─── Component ────────────────────────────────────────
const Hero = ({ onExplore }) => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    // Track scroll position with 60fps requestAnimationFrame
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

    const handleItemClick = (item) => {
        if (item.query) {
            navigate(`/dashboard?query=${encodeURIComponent(item.query)}`);
        } else if (item.language) {
            navigate(`/dashboard?language=${encodeURIComponent(item.language)}`);
        }
    };

    return (
        <section
            className="relative w-full flex flex-col items-center justify-start pt-32 pb-0 px-4 overflow-hidden bg-[#0A0A0C]"
            aria-label="Hero Introduction"
        >
            {/* ── 1. The Parallax Background Layers (Crystal Clear Landscape Art & Seamless Motion) ─────────────────── */}
            {/* Primary Mid Landscape Art (Full Opacity, 100% Crisp Visibility, Smooth Parallax Depth) */}
            <div
                className="absolute inset-0 w-full h-[130%] -top-8 bg-cover bg-center sm:bg-top opacity-100 pointer-events-none transition-transform duration-75 ease-out will-change-transform"
                style={{
                    backgroundImage: `url(${heroMid})`,
                    transform: `translate3d(0, ${Math.min(scrollY * 0.25, 220)}px, 0)`,
                }}
                aria-hidden="true"
            />

            {/* Subtle Horizon Detail Layer (Now full‑screen with smoother parallax) */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-bottom pointer-events-none transition-transform duration-75 ease-out will-change-transform"
                style={{
                    backgroundImage: `url(${heroBot})`,
                    opacity: 1,
                    transform: `translate3d(0, ${Math.min(scrollY * 0.08, 80)}px, 0)`,
                }}
                aria-hidden="true"
            />

            {/* ── 2. Subtle Bottom Fade Gradient Overlay (Preserves Full Image Visibility & Seamlessly Merges with Page) ── */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#0A0A0C] pointer-events-none z-0"
                aria-hidden="true"
            />

            {/* ── 3. Foreground Content ─────────────────────────────── */}
            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">

                {/* Announcement Thinbar: AI Newsroom (Beta) */}
                <div className="animate-fadeInUp">
                    <Link
                        to="/ai-news"
                        className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#121216]/90 border border-[#FF5A1F]/30 hover:border-[#FF5A1F] hover:bg-[#18181D] transition-all duration-300 text-xs font-mono shadow-[0_0_25px_-5px_rgba(255,90,31,0.25)] hover:shadow-[0_0_30px_-3px_rgba(255,90,31,0.4)]"
                    >
                        <span className="bg-[#FF5A1F] text-black font-extrabold text-[9px] uppercase px-1.5 py-0.5 tracking-wider">
                            BETA
                        </span>
                        <span className="text-zinc-300 group-hover:text-white transition-colors">
                            AI Newsroom: Frontier Model Race, Benchmarks &amp; Sourced Intel
                        </span>
                        <span className="text-[#FF5A1F] group-hover:translate-x-0.5 transition-transform font-bold">→</span>
                    </Link>
                </div>

                {/* Grounded Top Badge */}
                <div className="animate-fadeInUp">
                    <span
                        id="hero-badge"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-zinc-300"
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        Open Source Registry • Zero Tracking
                    </span>
                </div>

                {/* Grounded, Confident Headline */}
                <div className="animate-fadeInUp-d1 space-y-4">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-[-0.04em] leading-[1.05]">
                        Spot open-source momentum
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                            before it hits the front page.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto font-light">
                        Filter past all-time star counts to find active repositories with real release velocity,
                        healthy maintainer habits, and zero bloated telemetry.
                    </p>
                </div>

                {/* CTA Row */}
                <div className="animate-fadeInUp-d2 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                        id="hero-explore-btn"
                        onClick={onExplore}
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-[15px] font-semibold hover:bg-[#E4E4E7] active:scale-[0.98] transition-all duration-200 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] cursor-pointer"
                    >
                        Explore Repositories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>

                    <a
                        id="hero-github-btn"
                        href="https://github.com/SahidGit/git-explore"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-[15px] font-medium hover:border-white/20 hover:text-white transition-all duration-300"
                    >
                        <Github className="w-4 h-4" />
                        Star on GitHub
                        <span className="text-[#71717A] group-hover:text-[#A1A1AA] transition-colors duration-200">↗</span>
                    </a>
                </div>

                {/* ── 4. Dashboard Mockup ─────────────────────────────── */}
                <div className="animate-fadeInUp-d3 w-full max-w-3xl mt-12 mb-16 relative">
                    {/* Ambient glow behind mockup */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none mix-blend-screen"
                        style={{
                            background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)',
                        }}
                        aria-hidden="true"
                    />

                    {/* Mockup card */}
                    <div className="relative rounded-2xl border border-white/[0.08] bg-[#121215]/95 backdrop-blur-xl overflow-hidden shadow-2xl">
                        {/* Mockup browser chrome */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#0E0E10]">
                            <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            </div>
                            <div className="flex-1 bg-[#0A0A0C] border border-white/[0.06] rounded-md px-3 py-1.5 flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#71717A]">git-explore.app/explore?query=deepseek</span>
                                <span className="text-[10px] font-mono text-emerald-500/70 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                    live query
                                </span>
                            </div>
                        </div>

                        {/* Mockup body */}
                        <div className="p-5 space-y-2.5">
                            {/* Column headers */}
                            <div className="grid grid-cols-12 gap-3 px-3 pb-1">
                                <span className="col-span-6 text-[10px] font-mono uppercase tracking-widest text-[#71717A]">Repository</span>
                                <span className="col-span-2 text-[10px] font-mono uppercase tracking-widest text-[#71717A] hidden sm:block">Stars</span>
                                <span className="col-span-2 text-[10px] font-mono uppercase tracking-widest text-[#71717A] hidden sm:block">Language</span>
                                <span className="col-span-2 text-[10px] font-mono uppercase tracking-widest text-[#71717A] hidden sm:block">Velocity</span>
                            </div>

                            {MOCK_REPOS.map((repo, i) => (
                                <div
                                    key={repo.name}
                                    className="group grid grid-cols-12 gap-3 items-center px-3 py-3 rounded-xl border border-white/[0.04] hover:border-white/[0.10] hover:bg-white/[0.02] transition-all duration-300 cursor-default"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="col-span-12 sm:col-span-6 text-left">
                                        <p className="text-sm font-mono text-white font-medium truncate">{repo.name}</p>
                                        <p className="text-[11px] text-[#71717A] mt-0.5 truncate">{repo.desc}</p>
                                    </div>
                                    <div className="col-span-2 hidden sm:flex items-center gap-1.5 text-sm text-[#A1A1AA]">
                                        <Star className="w-3 h-3 text-[#71717A]" />
                                        {repo.stars}
                                    </div>
                                    <div className="col-span-2 hidden sm:flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: repo.langColor }} />
                                        <span className="text-[12px] text-[#A1A1AA]">{repo.lang}</span>
                                    </div>
                                    <div className="col-span-2 hidden sm:flex items-center gap-1 text-[11px] text-emerald-400/80 font-mono">
                                        <TrendingUp className="w-3 h-3" />
                                        {repo.delta}
                                    </div>
                                </div>
                            ))}

                            {/* Loading shimmer row */}
                            <div className="px-3 py-3 rounded-xl border border-white/[0.03] overflow-hidden relative">
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_2s_linear_infinite]" />
                                <div className="h-3 bg-white/[0.04] rounded-full w-3/4 mb-2" />
                                <div className="h-2.5 bg-white/[0.03] rounded-full w-1/2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 5. Replaced Marquee with Interactive Filterable Ecosystem Strip ────────────────── */}
            <div className="w-full border-t border-white/[0.08] bg-[#0E0E10]/95 backdrop-blur-md py-5 px-4 relative z-20">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                    <span className="text-zinc-400 text-[11px] tracking-wider uppercase flex items-center gap-2 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        Explore By Ecosystem:
                    </span>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {ECOSYSTEM_CATEGORIES.map((item) => {
                            const IconComp = item.icon;
                            return (
                                <button
                                    key={item.id || item.name}
                                    onClick={() => handleItemClick(item)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer group"
                                >
                                    <IconComp className="w-3.5 h-3.5 transition-transform group-hover:scale-110" style={{ color: item.color }} />
                                    <span>{item.name}</span>
                                    {item.badge && (
                                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

