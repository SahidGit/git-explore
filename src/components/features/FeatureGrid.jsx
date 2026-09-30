import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, SlidersHorizontal, ShieldCheck, Activity,
    Bookmark, FileText, Download, Terminal, Sparkles,
    ArrowRight, CheckCircle2, Star, GitFork, GitBranch,
    Copy, Layers, Cpu, Flame, ExternalLink, Zap,
    ChevronLeft, ChevronRight, Check
} from 'lucide-react';

const BENTO_STEPS = [
    {
        id: 'step-filter-search',
        stepNumber: '01',
        category: 'DISCOVERY ENGINE',
        tabLabel: 'Filter & Search',
        title: 'Multi-Dimensional Filters & Velocity Search',
        headline: 'Find high-momentum repositories before they go mainstream.',
        desc: 'Filter raw GitHub projects across daily/weekly star velocity, commit cadence, active programming languages, and topic tags. Discover breaking open-source codebases with zero authentication required.',
        primaryLink: '/dashboard',
        primaryText: 'Explore Velocity Filters',
        theme: {
            name: 'blue',
            accentColor: 'text-sky-400',
            borderColor: 'border-sky-500/30 hover:border-sky-400/60',
            activeBorder: 'border-sky-400/80 ring-2 ring-sky-400/20',
            bgGlow: 'before:bg-gradient-to-r before:from-sky-500/0 before:via-sky-400/80 before:to-sky-500/0',
            badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
            iconBg: 'bg-sky-500/15 border-sky-400/30 text-sky-300 shadow-sky-500/20',
            activeTab: 'bg-sky-500/20 text-sky-200 border-sky-400/50 shadow-lg shadow-sky-500/10',
            glowRadial: 'rgba(56, 189, 248, 0.15)',
        },
        icon: Search,
        stats: [
            { label: 'VELOCITY SIGNAL', value: '+12.5k★ / wk', highlight: true },
            { label: 'UPDATE WINDOW', value: 'Real-time Sync' },
            { label: 'SEARCH COVERAGE', value: '100M+ Repos' },
        ],
        renderVisual: () => (
            <div className="w-full space-y-3.5 font-sans text-xs">
                {/* Search Bar Input Simulation */}
                <div className="flex items-center justify-between bg-black/70 border border-sky-500/35 rounded-xl px-3.5 py-2.5 shadow-inner">
                    <div className="flex items-center gap-2.5 text-zinc-200 min-w-0">
                        <Search className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
                        <span className="font-mono text-xs text-white truncate">topic:ai language:python stars:&gt;5000</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 shrink-0">
                        48 MATCHES
                    </span>
                </div>

                {/* Filter Tag Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-200 border border-sky-400/40 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Zap className="w-3.5 h-3.5 text-sky-400" />
                        +12.5k★ / wk
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-zinc-200 font-mono text-xs">
                        This Week
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-zinc-200 font-mono text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" /> Python
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-zinc-200 font-mono text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400" /> Rust
                    </span>
                </div>

                {/* Quick Result Row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-white font-semibold truncate">deepseek-ai / DeepSeek-V3</span>
                    </div>
                    <span className="text-sky-400 font-bold shrink-0">98% Velocity Match</span>
                </div>
            </div>
        ),
    },
    {
        id: 'step-profile-health',
        stepNumber: '02',
        category: 'DEEP DIVE INSPECTOR',
        tabLabel: 'Repo Health & Activity',
        title: 'Profile, Repo Health & Activity Rhythm',
        headline: 'Automated 4-pillar audits and contributor commit heatmaps.',
        desc: 'Inspect automated code quality, license compliance, security posture, and issue resolution velocity. Visualize 53-week contributor commit heatmaps to verify active maintainer rhythms.',
        primaryLink: '/dashboard',
        primaryText: 'Inspect Health Scorecard',
        theme: {
            name: 'red',
            accentColor: 'text-red-400',
            borderColor: 'border-red-500/30 hover:border-red-400/60',
            activeBorder: 'border-red-400/80 ring-2 ring-red-400/20',
            bgGlow: 'before:bg-gradient-to-r before:from-red-500/0 before:via-red-400/80 before:to-red-500/0',
            badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
            iconBg: 'bg-red-500/15 border-red-400/30 text-red-300 shadow-red-500/20',
            activeTab: 'bg-red-500/20 text-red-200 border-red-400/50 shadow-lg shadow-red-500/10',
            glowRadial: 'rgba(239, 68, 68, 0.18)',
        },
        icon: ShieldCheck,
        stats: [
            { label: 'HEALTH INDEX', value: 'Grade A+ (98%)', highlight: true },
            { label: 'LICENSE VERIFIED', value: 'MIT Permissive' },
            { label: 'RESOLUTION RATE', value: '94% Issues Closed' },
        ],
        renderVisual: () => (
            <div className="w-full space-y-3 font-sans text-xs">
                {/* Health Score Pill Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-white font-mono font-bold text-xs truncate">Automated Security &amp; Health Index</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-mono font-extrabold text-xs shadow-sm">
                        GRADE A+ 98%
                    </span>
                </div>

                {/* Simulated 53-Week Mini Heatmap Grid */}
                <div className="space-y-1.5 p-3 rounded-xl bg-black/60 border border-red-500/20">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Contributor Rhythm</span>
                        <span className="text-red-400 font-semibold">1,420 commits / yr</span>
                    </div>
                    <div className="flex gap-1 overflow-hidden py-1">
                        {[...Array(18)].map((_, colIdx) => (
                            <div key={colIdx} className="flex flex-col gap-1">
                                {[...Array(4)].map((_, rowIdx) => {
                                    const intensity = (colIdx * 3 + rowIdx * 7) % 5;
                                    const colors = [
                                        'bg-white/[0.04]',
                                        'bg-red-950/60',
                                        'bg-red-800/80',
                                        'bg-red-600',
                                        'bg-red-400'
                                    ];
                                    return (
                                        <span
                                            key={rowIdx}
                                            className={`w-2.5 h-2.5 rounded-[2px] ${colors[intensity]} transition-colors`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Metric Summary Strip */}
                <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/[0.08] pt-2 text-center font-mono text-[11px]">
                    <div>
                        <span className="text-zinc-500 block text-[10px]">License</span>
                        <span className="text-red-300 font-bold">MIT Verified</span>
                    </div>
                    <div>
                        <span className="text-zinc-500 block text-[10px]">Issues</span>
                        <span className="text-red-300 font-bold">94% Closed</span>
                    </div>
                    <div>
                        <span className="text-zinc-500 block text-[10px]">Cadence</span>
                        <span className="text-red-300 font-bold">Daily Push</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'step-bookmarks-notes',
        stepNumber: '03',
        category: 'LOCAL-FIRST WORKSPACE',
        tabLabel: 'Bookmarks & Notes',
        title: 'Bookmarks, Local Notes & CSV/JSON Export',
        headline: 'Save stacks privately with zero cloud vendor lock-in.',
        desc: 'Save project bookmarks directly in browser storage, write private architecture notes for your team or workflow, and export clean research logs to JSON or CSV with 1 click.',
        primaryLink: '/bookmarks',
        primaryText: 'Manage Saved Bookmarks',
        theme: {
            name: 'yellow',
            accentColor: 'text-amber-400',
            borderColor: 'border-amber-500/30 hover:border-amber-400/60',
            activeBorder: 'border-amber-400/80 ring-2 ring-amber-400/20',
            bgGlow: 'before:bg-gradient-to-r before:from-amber-500/0 before:via-amber-400/80 before:to-amber-500/0',
            badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            iconBg: 'bg-amber-500/15 border-amber-400/30 text-amber-300 shadow-amber-500/20',
            activeTab: 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-lg shadow-amber-500/10',
            glowRadial: 'rgba(245, 158, 11, 0.15)',
        },
        icon: Bookmark,
        stats: [
            { label: 'STORAGE MODE', value: '100% Local-First', highlight: true },
            { label: 'TELEMETRY', value: 'Zero Tracking' },
            { label: 'EXPORT FORMATS', value: 'JSON & CSV' },
        ],
        renderVisual: () => (
            <div className="w-full space-y-3 font-sans text-xs">
                {/* Bookmarked Item Row */}
                <div className="flex items-center justify-between bg-black/70 border border-amber-500/30 rounded-xl p-3 shadow-inner">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                            <Bookmark className="w-4 h-4 fill-amber-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-mono text-xs font-bold text-white truncate">vllm-project / vllm</p>
                            <p className="font-mono text-[10px] text-zinc-400 truncate">★ 34.2k • Python / C++</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/35 font-bold shrink-0">
                        BOOKMARKED
                    </span>
                </div>

                {/* Local Private Note Box */}
                <div className="bg-[#090A0D] border border-white/[0.08] rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                            <FileText className="w-3.5 h-3.5" /> Local Developer Note
                        </span>
                        <span className="text-[10px] text-zinc-500">Device Stored</span>
                    </div>
                    <p className="text-xs font-mono text-zinc-300 italic truncate">
                        "Evaluating PagedAttention kernel for production inference throughput."
                    </p>
                </div>

                {/* Export Options Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.08] text-xs font-mono">
                    <span className="text-zinc-400">Export Research:</span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-bold hover:underline cursor-pointer">
                        <Download className="w-3.5 h-3.5" />
                        Download JSON / CSV
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: 'step-cheatsheet-newsroom',
        stepNumber: '04',
        category: 'DEVELOPER INTELLIGENCE',
        tabLabel: 'Git Cheat Sheet & AI News',
        title: 'Git Cheat Sheet & Frontier AI Newsroom',
        headline: 'Interactive Git recipes and real-time open AI model telemetry.',
        desc: 'Master complex Git branch workflows, rebasing, and emergency undo commands with 1-click copy. Stay informed on frontier open-weight AI models, pricing per million tokens, and arXiv paper links.',
        primaryLink: '/cheatsheet',
        secondaryLink: '/ai-news',
        primaryText: 'Interactive Git Cheatsheet',
        secondaryText: 'AI Newsroom',
        theme: {
            name: 'pink',
            accentColor: 'text-pink-400',
            borderColor: 'border-pink-500/30 hover:border-pink-400/60',
            activeBorder: 'border-pink-400/80 ring-2 ring-pink-400/20',
            bgGlow: 'before:bg-gradient-to-r before:from-pink-500/0 before:via-pink-400/80 before:to-pink-500/0',
            badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
            iconBg: 'bg-pink-500/15 border-pink-400/30 text-pink-300 shadow-pink-500/20',
            activeTab: 'bg-pink-500/20 text-pink-200 border-pink-400/50 shadow-lg shadow-pink-500/10',
            glowRadial: 'rgba(236, 72, 153, 0.15)',
        },
        icon: Terminal,
        stats: [
            { label: 'GIT RECIPES', value: '40+ Commands', highlight: true },
            { label: 'AI NEWSROOM', value: 'Live Model Radar' },
            { label: 'INTELLIGENCE', value: 'arXiv & Benchmark Specs' },
        ],
        renderVisual: () => (
            <div className="w-full space-y-3 font-sans text-xs">
                {/* Terminal Git Command Simulation */}
                <div className="bg-black/70 border border-pink-500/30 rounded-xl p-3 font-mono text-xs space-y-2 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-white/10 pb-1.5">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                            <Terminal className="w-3.5 h-3.5 text-pink-400" />
                            <span>GIT COMMAND RECIPE</span>
                        </span>
                        <span className="text-pink-400 font-bold flex items-center gap-1">
                            <Copy className="w-3 h-3" /> 1-Click Copy
                        </span>
                    </div>
                    <div className="text-zinc-200 flex items-center gap-2 truncate">
                        <span className="text-pink-400 font-bold">$</span>
                        <span className="text-white font-bold">git rebase -i HEAD~3</span>
                    </div>
                </div>

                {/* AI Newsroom Headline Strip */}
                <div className="bg-[#090A0D] border border-white/[0.08] rounded-xl p-2.5 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="p-1 rounded-lg bg-pink-500/20 text-pink-400 shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-zinc-200 truncate font-semibold">DeepSeek-V3 Specs &amp; Token Pricing</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold shrink-0 text-[11px] border border-pink-500/30">
                        $0.14 / M
                    </span>
                </div>

                {/* Quick Link Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.08] text-xs font-mono">
                    <span className="text-zinc-400">Editorial Intel:</span>
                    <span className="text-pink-400 font-bold flex items-center gap-1">
                        <span>Live Paper Links</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        ),
    },
];

const FeatureGrid = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeStep = BENTO_STEPS[activeIndex];
    const ActiveIcon = activeStep.icon;
    const activeTheme = activeStep.theme;

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? BENTO_STEPS.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === BENTO_STEPS.length - 1 ? 0 : prev + 1));
    };

    return (
        <section className="border-b border-white/10 bg-[#08090C] overflow-hidden py-16 sm:py-24 relative" aria-label="ExploreGit Capabilities & Bento Feature Showcase">
            {/* Dynamic Ambient Background Glow based on active card */}
            <div 
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-80 pointer-events-none mix-blend-screen opacity-40 transition-all duration-700 blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${activeTheme.glowRadial} 0%, rgba(15, 23, 42, 0.05) 70%, transparent 100%)`
                }}
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 relative z-10">
                
                {/* Section Title & Header */}
                <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12 space-y-3.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-wider shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Interactive Feature Radar</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                        Structured signal from raw GitHub data.
                    </h2>
                    
                    <p className="text-xs sm:text-base font-sans text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
                        Explore core capabilities in 4 easy steps. Switch through the interactive bento carousel below to discover each tool.
                    </p>
                </div>

                {/* ── Carousel Step Tabs & Navigation Controls ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    {/* Step selector pills */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto p-1 rounded-2xl bg-[#0F1015] border border-white/[0.08]">
                        {BENTO_STEPS.map((step, idx) => {
                            const isCurrent = activeIndex === idx;
                            const StepIcon = step.icon;
                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    onClick={() => setActiveIndex(idx)}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                                        isCurrent
                                            ? `${step.theme.activeTab} font-bold scale-[1.02]`
                                            : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.05] border-transparent font-medium'
                                    }`}
                                >
                                    <span className="opacity-70 font-semibold">{step.stepNumber}</span>
                                    <StepIcon className="w-3.5 h-3.5" />
                                    <span>{step.tabLabel}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Left / Right Carousel Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="p-2.5 rounded-xl bg-[#0F1015] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.1] transition-all cursor-pointer active:scale-95 shadow-sm"
                            aria-label="Previous step"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono text-zinc-400 px-2">
                            {activeIndex + 1} / {BENTO_STEPS.length}
                        </span>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="p-2.5 rounded-xl bg-[#0F1015] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.1] transition-all cursor-pointer active:scale-95 shadow-sm"
                            aria-label="Next step"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Main Featured Bento Stage ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
                    
                    {/* Left: Main Spotlight Bento Card */}
                    <div className={`lg:col-span-8 flex flex-col justify-between rounded-2xl border ${activeTheme.borderColor} bg-[#101116]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-[2px] ${activeTheme.bgGlow}`}>
                        
                        <div>
                            {/* Card Top Pill Badge */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${activeTheme.iconBg} border flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110`}>
                                        <ActiveIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className={`text-xs font-mono font-bold tracking-wider ${activeTheme.accentColor}`}>
                                            {activeStep.category}
                                        </span>
                                        <h3 className="text-lg sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                                            {activeStep.title}
                                        </h3>
                                    </div>
                                </div>

                                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300">
                                    STEP {activeStep.stepNumber}
                                </span>
                            </div>

                            {/* Headline & Description */}
                            <p className="text-sm sm:text-base text-zinc-200 font-medium leading-relaxed mb-3">
                                {activeStep.headline}
                            </p>
                            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-normal mb-6 max-w-2xl">
                                {activeStep.desc}
                            </p>

                            {/* Interactive Visual Stage */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/[0.08] shadow-inner mb-6">
                                {activeStep.renderVisual()}
                            </div>
                        </div>

                        {/* Action Footer Bar */}
                        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
                                <Link
                                    to={activeStep.primaryLink}
                                    aria-label={activeStep.primaryText}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold font-sans hover:bg-zinc-200 active:scale-95 transition-all shadow-md`}
                                >
                                    <span>{activeStep.primaryText}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                {activeStep.secondaryLink && (
                                    <Link
                                        to={activeStep.secondaryLink}
                                        aria-label={activeStep.secondaryText}
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/10 font-semibold text-xs transition-all"
                                    >
                                        <span>{activeStep.secondaryText}</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>

                            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                                Step {activeStep.stepNumber} of 04
                            </span>
                        </div>
                    </div>

                    {/* Right: Companion Bento KPI & Quick Peek Stack */}
                    <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                        
                        {/* KPI Highlights Box */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#101116]/90 border border-white/[0.08] shadow-xl space-y-4">
                            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold border-b border-white/[0.06] pb-3">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span>Capability Highlights</span>
                            </div>

                            <div className="space-y-3">
                                {activeStep.stats.map((stat, sIdx) => (
                                    <div key={sIdx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] font-mono text-xs">
                                        <span className="text-zinc-400 text-[11px]">{stat.label}</span>
                                        <span className={`font-bold ${stat.highlight ? activeTheme.accentColor : 'text-white'}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bento Step Deck (Clickable miniature previews) */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0C0D11] border border-white/[0.08] shadow-xl space-y-2.5">
                            <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">
                                Quick Step Switcher
                            </span>

                            <div className="grid grid-cols-2 gap-2">
                                {BENTO_STEPS.map((step, idx) => {
                                    const isSelected = activeIndex === idx;
                                    const SIcon = step.icon;
                                    return (
                                        <button
                                            key={step.id}
                                            type="button"
                                            onClick={() => setActiveIndex(idx)}
                                            className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${
                                                isSelected
                                                    ? `${step.theme.activeBorder} bg-white/[0.06] shadow-md`
                                                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <SIcon className={`w-3.5 h-3.5 ${step.theme.accentColor}`} />
                                                <span className="text-[10px] font-mono text-zinc-500 font-bold">
                                                    {step.stepNumber}
                                                </span>
                                            </div>
                                            <p className={`text-xs font-sans font-semibold truncate ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                                {step.tabLabel}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default FeatureGrid;
