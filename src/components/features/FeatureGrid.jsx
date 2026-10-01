import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, ShieldCheck, Bookmark, Terminal,
    ArrowRight, Check, Zap, Copy, ExternalLink,
    FileText, Sparkles, Activity, Shield, Wifi, WifiOff,
    Edit3, MessageSquare, Globe2, Layers, Cpu
} from 'lucide-react';

const TerminalVisual = () => {
    const [copied, setCopied] = useState(false);
    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText('git rebase -i HEAD~3');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center space-y-2 p-3 rounded-2xl bg-black/40 border border-white/[0.06] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#3178C6]/15 to-transparent pointer-events-none" />

            {/* Language Tags */}
            <div className="relative z-10 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-400">
                <span className="text-[#3572A5]">Python</span>
                <span>•</span>
                <span className="text-[#DEA584]">Rust</span>
                <span>•</span>
                <span className="text-[#3178C6]">TS</span>
                <span>•</span>
                <span className="text-[#00ADD8]">Go</span>
            </div>

            {/* Terminal Command Simulation */}
            <div className="relative z-10 bg-black/60 border border-white/10 rounded-xl p-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[9px] text-zinc-400 border-b border-white/10 pb-1 mb-1">
                    <span className="text-[#93C5FD] font-semibold">COMMAND</span>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="text-[#93C5FD] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-bold"
                    >
                        {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>{copied ? 'COPIED' : 'COPY'}</span>
                    </button>
                </div>
                <div className="text-white font-medium flex items-center gap-1.5 truncate">
                    <span className="text-[#93C5FD] font-bold">$</span>
                    <span className="truncate">git rebase -i HEAD~3</span>
                </div>
            </div>
        </div>
    );
};

const FEATURE_CARDS = [
    {
        id: 'discovery',
        langName: 'Python',
        langColor: '#3572A5',
        category: 'DISCOVERY ENGINE',
        title: 'Velocity discovery',
        desc: 'Calculates daily star velocity, fork growth, and issue churn before projects hit mainstream feeds.',
        punchline: 'Algorithmic momentum indexing',
        link: '/dashboard',
        linkText: 'Explore Filters',
        icon: Zap,
        theme: {
            cardBg: 'bg-[#0E0F12]',
            accentColor: '#3572A5',
            borderColor: 'border-white/[0.08] hover:border-[#3572A5]/50',
            badgeBg: 'bg-[#3572A5]/15 text-[#60A5FA] border-[#3572A5]/30',
            titleColor: 'text-white group-hover:text-[#60A5FA]',
            iconColor: 'text-[#60A5FA]',
            glowColor: 'from-[#3572A5]/10',
        },
        renderVisual: () => (
            <div className="w-full h-full flex flex-col justify-center items-center p-3 rounded-2xl bg-black/40 border border-white/[0.06] relative overflow-hidden">
                {/* Subtle top glow */}
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#3572A5]/15 to-transparent pointer-events-none" />
                
                {/* Minimal Toggle Pill Mockup */}
                <div className="relative z-10 w-full max-w-[200px] py-2 px-3.5 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-between">
                    <span className="text-white font-medium text-xs font-sans tracking-tight">Signal Feed</span>
                    <div className="w-8 h-4.5 rounded-full bg-[#3572A5]/40 p-0.5 flex items-center justify-end border border-[#3572A5]/50">
                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-1.5 mt-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3572A5]/20 text-[#60A5FA] font-semibold border border-[#3572A5]/30">
                        +14.2k★ / wk
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                        Zero Auth
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: 'health',
        langName: 'Go',
        langColor: '#00ADD8',
        category: 'REPO INSPECTOR',
        title: 'Health & cadence',
        desc: 'Evaluates license compliance, commit rhythm, maintainer responsiveness, and CI health scores.',
        punchline: 'Automated 4-pillar audits',
        link: '/dashboard',
        linkText: 'View Scorecard',
        icon: Edit3,
        theme: {
            cardBg: 'bg-[#0E0F12]',
            accentColor: '#00ADD8',
            borderColor: 'border-white/[0.08] hover:border-[#00ADD8]/50',
            badgeBg: 'bg-[#00ADD8]/15 text-[#38BDF8] border-[#00ADD8]/30',
            titleColor: 'text-white group-hover:text-[#38BDF8]',
            iconColor: 'text-[#38BDF8]',
            glowColor: 'from-[#00ADD8]/10',
        },
        renderVisual: () => (
            <div className="w-full h-full flex flex-col justify-center space-y-2 p-3 rounded-2xl bg-black/40 border border-white/[0.06] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#00ADD8]/15 to-transparent pointer-events-none" />

                {/* Input Simulation Bar */}
                <div className="relative z-10 flex items-center justify-between gap-1.5 bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5">
                    <span className="text-zinc-400 text-[10px] font-mono truncate">Inspect repository...</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[#00ADD8]/20 text-[#38BDF8] font-bold border border-[#00ADD8]/40 shrink-0">
                        Audit ⌘+K
                    </span>
                </div>

                {/* Score Strip */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-1 text-zinc-300 px-1">
                    <span className="truncate">Grade A+ (98%)</span>
                    <span className="text-[#38BDF8] font-bold">1,420 commits/yr</span>
                </div>

                {/* Mini Activity Row */}
                <div className="relative z-10 flex items-center justify-between gap-1 overflow-hidden px-1">
                    {[...Array(12)].map((_, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-1">
                            {[...Array(2)].map((_, rowIdx) => {
                                const intensity = (colIdx * 3 + rowIdx * 5) % 4;
                                const opacities = ['bg-white/5', 'bg-[#00ADD8]/20', 'bg-[#00ADD8]/50', 'bg-[#00ADD8]'];
                                return (
                                    <span key={rowIdx} className={`w-2 h-2 rounded-[2px] ${opacities[intensity]}`} />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: 'bookmarks',
        langName: 'Rust',
        langColor: '#DEA584',
        category: 'LOCAL WORKSPACE',
        title: 'Private workspace',
        desc: 'Save project bookmarks and write architecture research notes stored 100% locally in your browser.',
        punchline: 'Zero telemetry, device-only',
        link: '/bookmarks',
        linkText: 'Open Bookmarks',
        icon: Bookmark,
        theme: {
            cardBg: 'bg-[#0E0F12]',
            accentColor: '#DEA584',
            borderColor: 'border-white/[0.08] hover:border-[#DEA584]/50',
            badgeBg: 'bg-[#DEA584]/15 text-[#DEA584] border-[#DEA584]/30',
            titleColor: 'text-white group-hover:text-[#DEA584]',
            iconColor: 'text-[#DEA584]',
            glowColor: 'from-[#DEA584]/10',
        },
        renderVisual: () => (
            <div className="w-full h-full flex flex-col justify-center space-y-2.5 p-3 rounded-2xl bg-black/40 border border-white/[0.06] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#DEA584]/15 to-transparent pointer-events-none" />

                {/* Mode Selector Dock */}
                <div className="relative z-10 py-1.5 px-3 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-around">
                    <div className="flex flex-col items-center gap-1 opacity-60">
                        <Activity className="w-3.5 h-3.5 text-white" />
                        <span className="text-[9px] font-sans text-zinc-300">Explore</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DEA584] text-zinc-950 shadow-xs">
                        <Bookmark className="w-3.5 h-3.5 fill-zinc-950" />
                        <span className="text-[9px] font-sans font-bold">Saved</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-60">
                        <FileText className="w-3.5 h-3.5 text-white" />
                        <span className="text-[9px] font-sans text-zinc-300">Notes</span>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
                    <span className="truncate">astral-sh/uv</span>
                    <span className="text-[#DEA584] font-semibold">★ 41.2k</span>
                </div>
            </div>
        ),
    },
    {
        id: 'cheatsheet',
        langName: 'TypeScript',
        langColor: '#3178C6',
        category: 'DEVELOPER INTEL',
        title: 'Git workflows & AI radar',
        desc: 'Interactive Git commands with 1-click execution alongside real-time frontier AI model context & pricing.',
        punchline: '40+ Commands, daily model specs',
        link: '/cheatsheet',
        linkText: 'Open Cheatsheet',
        icon: Terminal,
        theme: {
            cardBg: 'bg-[#0E0F12]',
            accentColor: '#3178C6',
            borderColor: 'border-white/[0.08] hover:border-[#3178C6]/50',
            badgeBg: 'bg-[#3178C6]/15 text-[#93C5FD] border-[#3178C6]/30',
            titleColor: 'text-white group-hover:text-[#93C5FD]',
            iconColor: 'text-[#93C5FD]',
            glowColor: 'from-[#3178C6]/10',
        },
        renderVisual: TerminalVisual,
    },
];

const FeatureGrid = () => {
    return (
        <section className="border-b border-white/10 bg-[#0A0A0C] py-16 sm:py-24 relative overflow-hidden" aria-label="ExploreGit Capabilities & Features">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 relative z-10">
                
                {/* Section Title & Header */}
                <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14 space-y-2.5">
                    <p className="font-mono text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                        What's inside
                    </p>

                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight">
                        Structured signal from raw GitHub data.
                    </h2>
                    
                    <p className="text-xs sm:text-base font-sans text-zinc-400 leading-relaxed max-w-xl mx-auto pt-1">
                        High-density tooling designed for developer velocity, embedded in a local-first interface.
                    </p>
                </div>

                {/* ── 4-Card Minimal Showcase Grid with Trending Language Color Accents ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                    {FEATURE_CARDS.map((card) => {
                        const CardIcon = card.icon;
                        const VisualComponent = card.renderVisual;
                        const theme = card.theme;

                        return (
                            <div
                                key={card.id}
                                className={`group relative flex flex-col justify-between rounded-2xl ${theme.cardBg} border ${theme.borderColor} p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden`}
                            >
                                {/* Top Glow Accent from Language Palette */}
                                <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${theme.glowColor} to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

                                {/* Top Visual Showcase Container */}
                                <div className="h-32 sm:h-36 w-full mb-4 relative z-10">
                                    <VisualComponent />
                                </div>

                                {/* Content Details */}
                                <div className="flex-1 flex flex-col justify-between space-y-3 relative z-10">
                                    <div>
                                        {/* Language Pill & Icon Header */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-lg ${theme.badgeBg} border flex items-center justify-center shrink-0`}>
                                                    <CardIcon className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                                                </div>
                                                <h3 className={`font-sans text-sm sm:text-base font-bold ${theme.titleColor} tracking-tight transition-colors`}>
                                                    {card.title}
                                                </h3>
                                            </div>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400">
                                                {card.langName}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                                            {card.desc}
                                        </p>
                                    </div>

                                    {/* Footer Info & Action */}
                                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 mt-auto">
                                        <span className="font-sans text-[11px] text-zinc-300 font-medium truncate">
                                            {card.punchline}
                                        </span>

                                        <Link
                                            to={card.link}
                                            aria-label={card.linkText}
                                            className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-zinc-300 hover:text-white transition-colors shrink-0 group-hover:translate-x-0.5"
                                        >
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FeatureGrid;

