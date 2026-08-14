import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, ArrowRight, TrendingUp, Star } from 'lucide-react';

import heroMid from '../../assets/hero-mid.avif';
import heroBot from '../../assets/hero-bot.png';

// ─── Ecosystem Pills Data ─────────────────────────────
const ECOSYSTEM_LANGS = [
    { name: 'TypeScript', count: '48k repos', color: '#3178c6' },
    { name: 'Rust', count: '14k repos', color: '#dea584' },
    { name: 'Python', count: '62k repos', color: '#3572a5' },
    { name: 'Go', count: '29k repos', color: '#00add8' },
    { name: 'Zig', count: '3.2k repos', color: '#ec915c' },
    { name: 'JavaScript', count: '95k repos', color: '#f7df1e' },
    { name: 'C++', count: '22k repos', color: '#f34b7d' },
];

// ─── Live signal repos for dashboard preview ──────────
const MOCK_REPOS = [
    {
        name: 'astral-sh/uv',
        desc: 'An extremely fast Python package and project manager written in Rust',
        stars: '45.2k',
        lang: 'Rust',
        langColor: '#dea584',
        delta: '+4.2k this week',
    },
    {
        name: 'vercel/next.js',
        desc: 'The React Framework for the Web',
        stars: '124.8k',
        lang: 'TypeScript',
        langColor: '#3178c6',
        delta: '+2.8k this week',
    },
    {
        name: 'ollama/ollama',
        desc: 'Get up and running with Llama 3.3, DeepSeek, and other LLMs locally',
        stars: '106.1k',
        lang: 'Go',
        langColor: '#00add8',
        delta: '+3.1k this week',
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

    const handleLanguageClick = (lang) => {
        navigate(`/dashboard?language=${encodeURIComponent(lang)}`);
    };

    return (
        <section
            className="relative w-full flex flex-col items-center justify-start pt-32 pb-0 px-4 overflow-hidden bg-[#0A0A0C]"
            aria-label="Hero Introduction"
        >
            {/* ── 1. The Parallax Background Layers (Refined Opacity & Crisp Depth) ─────────────────── */}
            {/* Primary Mid Landscape Art (Scrolls at 35% speed) */}
            <div
                className="absolute inset-0 w-full h-[125%] bg-cover bg-center sm:bg-top opacity-30 pointer-events-none transition-transform duration-75 ease-out will-change-transform"
                style={{
                    backgroundImage: `url(${heroMid})`,
                    transform: `translate3d(0, ${scrollY * 0.35}px, 0)`,
                }}
                aria-hidden="true"
            />

            {/* Subtle Horizon Detail Layer (Scrolls at 20% speed for multi-plane depth) */}
            <div
                className="absolute inset-0 w-full h-[120%] bg-cover bg-bottom opacity-20 pointer-events-none transition-transform duration-75 ease-out will-change-transform mix-blend-screen"
                style={{
                    backgroundImage: `url(${heroBot})`,
                    transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
                }}
                aria-hidden="true"
            />

            {/* ── 2. Cinematic Gradient Overlay (Seamlessly Fades to #0A0A0C) ── */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C]/30 via-[#0A0A0C]/70 to-[#0A0A0C] pointer-events-none z-0"
                aria-hidden="true"
            />

            {/* Subtle radial glow to maintain crisp text contrast */}
            <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] rounded-full pointer-events-none mix-blend-screen"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            {/* ── 3. Foreground Content ─────────────────────────────── */}
            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">

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
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-[15px] font-semibold hover:bg-[#E4E4E7] active:scale-[0.98] transition-all duration-200 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]"
                    >
                        Explore Repositories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>

                    <a
                        id="hero-github-btn"
                        href="https://github.com/SahidGit/git-explorer"
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
                                <span className="text-[11px] font-mono text-[#71717A]">git-explorer.app/explore?sort=weekly_velocity</span>
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
            <div className="w-full border-t border-white/[0.08] bg-[#0E0E10]/95 backdrop-blur-md py-4 px-4 relative z-20">
                <div className="max-w-6xl mx-auto flex items-center justify-center sm:justify-between gap-4 flex-wrap text-xs font-mono">
                    <span className="text-zinc-500 text-[11px] tracking-wider uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        Explore By Ecosystem:
                    </span>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {ECOSYSTEM_LANGS.map((lang) => (
                            <button
                                key={lang.name}
                                onClick={() => handleLanguageClick(lang.name)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all duration-200"
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
