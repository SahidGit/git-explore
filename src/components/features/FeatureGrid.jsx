import React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp, ShieldCheck, Bookmark, Terminal, Search,
    Star, GitBranch, Sparkles, Download, ArrowRight, CheckCircle2, FileText
} from 'lucide-react';

const VALUE_PILLARS = [
    {
        id: 'discover-momentum',
        pillarNumber: 'PILLAR 01',
        category: 'DISCOVER MOMENTUM',
        title: 'Trending repositories and velocity signals',
        desc: 'Filter open-source codebases by star velocity, commit frequency, programming language, and timeframe to surface breakout projects early.',
        primaryLink: '/dashboard',
        primaryText: 'Explore Trending Repos',
        renderVisual: () => (
            <div className="w-full max-w-sm space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-zinc-200 flex items-center gap-1.5 text-xs">
                        <Search className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-mono">Filter: topic:ai</span>
                    </span>
                    <span className="text-zinc-300 text-xs font-bold">&bull; VELOCITY SIGNAL</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/10 text-white border border-white/20 font-bold text-xs">
                        +12.5k / wk
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.06] text-zinc-200 text-xs">Today</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.06] text-zinc-300 border border-white/10 text-xs">Python</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.06] text-zinc-300 border border-white/10 text-xs">Rust</span>
                </div>
            </div>
        ),
    },
    {
        id: 'inspect-projects',
        pillarNumber: 'PILLAR 02',
        category: 'INSPECT PROJECTS',
        title: 'Repository health, issues, licensing, & contributor activity',
        desc: 'Deep-dive into repository health metrics, issue resolution velocity, open-source license compliance, and annual contributor commit heatmaps.',
        primaryLink: '/dashboard',
        primaryText: 'Inspect Repositories & Profiles',
        renderVisual: () => (
            <div className="w-full max-w-sm space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-white font-bold text-xs truncate">deepseek-ai/DeepSeek-V3</span>
                    <span className="text-zinc-200 flex items-center gap-1 text-xs font-bold bg-white/10 border border-white/20 px-2 py-0.5 rounded">
                        HEALTH 98%
                    </span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-2 text-center text-xs">
                    <div className="px-2">
                        <span className="text-zinc-400 block font-medium text-xs">License</span>
                        <span className="text-zinc-200 font-bold text-xs">MIT</span>
                    </div>
                    <div className="px-2">
                        <span className="text-zinc-400 block font-medium text-xs">Open Issues</span>
                        <span className="text-zinc-200 font-bold text-xs">294</span>
                    </div>
                    <div className="px-2">
                        <span className="text-zinc-400 block font-medium text-xs">Forks</span>
                        <span className="text-white font-bold text-xs">12.5k</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'track-workflow',
        pillarNumber: 'PILLAR 03',
        category: 'TRACK WORKFLOW',
        title: 'Bookmarks, custom notes, & 1-click export',
        desc: 'Bookmark repositories directly in browser storage, attach private developer notes, and export your curated stack research to JSON or CSV.',
        primaryLink: '/bookmarks',
        primaryText: 'Open Saved Bookmarks',
        renderVisual: () => (
            <div className="w-full max-w-sm space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-zinc-200 flex items-center gap-1.5 text-xs">
                        <Bookmark className="w-3.5 h-3.5 text-zinc-300" />
                        <span>IndexedDB / LocalStorage</span>
                    </span>
                    <span className="text-zinc-300 text-xs font-bold">100% PRIVATE</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                    <span className="text-zinc-300">Saved Repos &amp; Notes</span>
                    <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold">
                        <Download className="w-3.5 h-3.5" />
                        JSON / CSV
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: 'learn-research',
        pillarNumber: 'PILLAR 04',
        category: 'LEARN & RESEARCH',
        title: 'Git cheat sheet & AI Newsroom',
        desc: 'Master complex Git workflows with interactive command tutorials and stay ahead with real-time editorial updates on frontier open-weight AI models.',
        primaryLink: '/cheatsheet',
        secondaryLink: '/ai-news',
        primaryText: 'View Git Cheat Sheet',
        secondaryText: 'AI Newsroom',
        renderVisual: () => (
            <div className="w-full max-w-sm space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-zinc-200 flex items-center gap-1.5 text-xs">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono">git rebase -i HEAD~3</span>
                    </span>
                    <span className="text-amber-400 flex items-center gap-1 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        AI NEWS
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2.5">
                    <span className="text-zinc-300">DeepSeek-V3 Specs</span>
                    <span className="text-emerald-400 font-bold">$0.14 / M tok</span>
                </div>
            </div>
        ),
    },
];

const FeatureGrid = () => {
    return (
        <section className="border-b border-white/10 bg-[#0A0A0B] overflow-hidden py-16 sm:py-24" aria-label="ExploreGit Value Pillars">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                
                {/* Section Title */}
                <div className="mx-auto max-w-2xl text-center mb-16 space-y-3">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                        Structured signal from raw GitHub data.
                    </h2>
                    <p className="text-xs sm:text-base font-sans text-[#94A3B8] leading-relaxed">
                        Velocity metrics, health audits, local bookmarks, and ecosystem intelligence built for developers.
                    </p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {VALUE_PILLARS.map((pillar) => (
                        <article
                            key={pillar.id}
                            className="flex flex-col rounded-lg border border-white/[0.08] bg-[#121316] overflow-hidden hover:border-white/20 transition-all shadow-sm group"
                        >
                            {/* Visual Header - Direct layout with zero nested cards */}
                            <div className="relative py-8 px-6 bg-[#0D0E11] border-b border-white/[0.08] flex items-center justify-center min-h-[180px]">
                                {pillar.renderVisual()}
                            </div>

                            {/* Body Content */}
                            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 font-sans">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-emerald-400 tracking-wider">
                                            {pillar.category}
                                        </span>
                                        <span className="text-xs font-sans font-medium text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                                            {pillar.pillarNumber}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-heading">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-normal">
                                        {pillar.desc}
                                    </p>
                                </div>

                                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-sans">
                                    <Link
                                        to={pillar.primaryLink}
                                        aria-label={pillar.primaryText}
                                        className="inline-flex items-center gap-1.5 font-bold text-white hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors"
                                    >
                                        <span>{pillar.primaryText}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    {pillar.secondaryLink && (
                                        <Link
                                            to={pillar.secondaryLink}
                                            aria-label={pillar.secondaryText}
                                            className="inline-flex items-center gap-1 text-[#94A3B8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors font-medium"
                                        >
                                            <span>&bull; {pillar.secondaryText}</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeatureGrid;
