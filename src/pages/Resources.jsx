import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import {
    ArrowLeft, ArrowUpRight, Github, Linkedin, Twitter,
    Sparkles, Terminal, Code2, Layers, Cpu, Compass
} from 'lucide-react';
import sahidPhoto from '../assets/team-sahid.png';

const CURATED_TOOLS = [
    {
        id: 'entire',
        name: 'Entire',
        tag: 'AI Software Engineering',
        description:
            'Developer platform where agents and humans collaborate. Stores every session, prompt, and tool call alongside git commits with distributed repo mirroring.',
        url: 'https://entire.io/',
        actionLabel: 'Visit entire.io',
        featured: true,
        icon: Sparkles,
    },
    {
        id: 'v0',
        name: 'v0 by Vercel',
        tag: 'Generative UI',
        description:
            'Generative UI system powered by AI to build fast, accessible React and Tailwind CSS components from natural language prompts.',
        url: 'https://v0.dev/',
        actionLabel: 'Visit v0.dev',
        featured: false,
        icon: Code2,
    },
    {
        id: 'claude-code',
        name: 'Claude Code',
        tag: 'CLI Agent',
        description:
            'Agentic coding tool that lives directly in your terminal, understanding your codebase and autonomously executing multi-step engineering workflows.',
        url: 'https://anthropic.com/claude-code',
        actionLabel: 'Explore Claude Code',
        featured: false,
        icon: Terminal,
    },
    {
        id: 'raycast',
        name: 'Raycast',
        tag: 'Productivity',
        description:
            'Blazingly fast, extendable launcher for developer workflows, keyboard navigation, custom scripts, and GitHub extensions.',
        url: 'https://raycast.com/',
        actionLabel: 'Download Raycast',
        featured: false,
        icon: Layers,
    },
    {
        id: 'gh-cli',
        name: 'GitHub CLI',
        tag: 'Version Control',
        description:
            'Command-line tool bringing pull requests, issues, releases, and GitHub Actions workflows directly into your local terminal.',
        url: 'https://cli.github.com/',
        actionLabel: 'Explore GitHub CLI',
        featured: false,
        icon: Cpu,
    },
    {
        id: 'excalidraw',
        name: 'Excalidraw',
        tag: 'System Architecture',
        description:
            'Virtual collaborative whiteboard for sketching software architectures, system designs, ERDs, and code flows with end-to-end encryption.',
        url: 'https://excalidraw.com/',
        actionLabel: 'Launch Excalidraw',
        featured: false,
        icon: Compass,
    },
];

const Resources = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white flex flex-col justify-between">
            <SEO
                title="Developer Resources & Tooling | GitExplorer"
                description="Curated index of essential developer platforms, AI coding agents, and open-source infrastructure."
                canonical="https://git-explore-one.vercel.app/resources"
            />

            <Header showBackButton={true} activeTab="" />

            <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-24">
                {/* ── Breadcrumbs & Back Link ── */}
                <div className="flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-hide">
                        {['features', 'docs', 'api', 'roadmap', 'changelog', 'resources'].map((key) => (
                            <Link
                                key={key}
                                to={`/${key}`}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors duration-200 capitalize ${
                                    key === 'resources'
                                        ? 'bg-white/[0.08] text-white border border-white/10 font-semibold'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                                }`}
                            >
                                {key}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── MODULE 01: Curated Developer Tools Section ── */}
                <section aria-labelledby="tools-heading" className="space-y-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
                                01 TOOLING
                            </span>
                            <span className="w-6 h-px bg-white/20" />
                            <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
                                &lt;ECOSYSTEM_RESOURCES /&gt;
                            </span>
                        </div>

                        <h1 id="tools-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                            Essential Tools for Modern Engineers.
                        </h1>

                        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
                            A curated index of developer platforms, AI coding tools, and open-source infrastructure
                            engineered for developers who value precision, speed, and deep technical signal.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CURATED_TOOLS.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <article
                                    key={tool.id}
                                    className={`group flex flex-col justify-between rounded-xl p-6 transition-all duration-300 ${
                                        tool.featured
                                            ? 'bg-[#121215] border border-white/20 shadow-[0_0_30px_-10px_rgba(255,255,255,0.08)] hover:border-white/35 hover:bg-white/[0.03]'
                                            : 'bg-[#121215] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <div>
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                                <Icon className="w-4 h-4 text-white/90" strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
                                                {tool.tag}
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-white transition-colors">
                                            {tool.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                                            {tool.description}
                                        </p>
                                    </div>

                                    {/* Action Link */}
                                    <div className="pt-4 border-t border-white/[0.06]">
                                        <a
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white transition-colors group/link"
                                        >
                                            <span className="group-hover/link:underline underline-offset-4 decoration-white/30">
                                                {tool.actionLabel}
                                            </span>
                                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* ── MODULE 02: Redesigned Compact Team & Creator Section ── */}
                <section aria-labelledby="creator-heading" className="space-y-8 pt-8 border-t border-white/[0.08]">
                    <div className="max-w-2xl mx-auto text-center space-y-3">
                        <div className="inline-flex items-center gap-3 justify-center mb-1">
                            <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
                                02 ARCHITECTURE &amp; CREATOR
                            </span>
                            <span className="w-6 h-px bg-white/20" />
                            <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
                                &lt;LEADERSHIP /&gt;
                            </span>
                        </div>

                        <h2 id="creator-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Engineered in the Open.
                        </h2>
                        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                            GitExplorer is designed and maintained by independent engineers building next-generation
                            developer intelligence systems.
                        </p>
                    </div>

                    {/* Compact Profile Card */}
                    <div className="max-w-2xl mx-auto bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl hover:border-white/20 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
                            {/* Avatar & Tag Container */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-white/15 bg-[#0A0A0C] shadow-2xl group/photo">
                                    <img
                                        src={sahidPhoto}
                                        alt="Sahid Sarfaraz"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover/photo:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                </div>
                                
                                {/* Proper Tag Below Image */}
                                <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono font-medium text-zinc-300 tracking-wide uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Engineering
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 flex-1 min-w-0">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start mb-1">
                                        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
                                            Sahid Sarfaraz
                                        </h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 text-[10px] font-mono">
                                            Creator &amp; Architect
                                        </span>
                                    </div>
                                    <p className="text-xs font-mono text-zinc-500">
                                        @SahidGit • Lead Developer
                                    </p>
                                </div>

                                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                                    Frontend Architect &amp; AI-Native Tooling Engineer. Building next-generation open-source developer interfaces and telemetry-free graph query tools.
                                </p>

                                {/* Verified Links Row */}
                                <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-zinc-400">
                                    <a
                                        href="https://github.com/SahidGit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs font-mono group"
                                        aria-label="GitHub Profile"
                                    >
                                        <Github className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                                        <span>GitHub</span>
                                    </a>

                                    <a
                                        href="https://www.linkedin.com/in/sahid-sarfaraz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs font-mono group"
                                        aria-label="LinkedIn Profile"
                                    >
                                        <Linkedin className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                                        <span>LinkedIn</span>
                                    </a>

                                    <a
                                        href="https://github.com/SahidGit/git-explorer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs font-mono group"
                                        aria-label="GitExplorer Repository"
                                    >
                                        <Code2 className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                                        <span>Source</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <BackToTop />
            <Footer />
        </div>
    );
};

export default Resources;
