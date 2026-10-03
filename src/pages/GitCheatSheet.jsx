import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layouts/Header';
import { SubFooter } from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import PageNavigation from '../components/ui/PageNavigation';
import { GitCheatSheetNavIcon } from '../components/ui/Icons';
import { GIT_CHEATSHEET_CATEGORIES, GIT_COMMANDS } from '../data/gitCheatSheetData';
import {
    Terminal,
    Copy,
    Check,
    Search,
    Zap,
    GitBranch,
    GitCommit,
    GitPullRequest,
    RotateCcw,
    FolderGit2,
    Archive,
    Tag,
    Layers,
    Sparkles,
    Flame,
    ArrowRight,
    CornerDownRight,
    CheckCircle2,
    ExternalLink,
    Cpu,
    Boxes,
    Code2,
    Share2
} from 'lucide-react';

// Map Category IDs to Lucide Icons
const CATEGORY_ICONS = {
    'all': Layers,
    'start-init': FolderGit2,
    'daily-flow': GitCommit,
    'branch-merge': GitBranch,
    'remote-sync': GitPullRequest,
    'undo-recover': RotateCcw,
    'stash-switch': Archive,
    'history-inspect': Search,
    'tags-release': Tag,
};

// GitHub Style Quick Setup Commands for Newly Created Repositories
const NEW_REPO_SETUP_STEPS = {
    new: [
        {
            cmd: 'echo "# my-new-project" >> README.md',
            desc: 'Creates a project README markdown file with the initial title heading',
        },
        {
            cmd: 'git init',
            desc: 'Initializes a new empty Git repository inside the current project folder',
        },
        {
            cmd: 'git add README.md',
            desc: 'Stages the new README.md file so it is included in the first commit',
        },
        {
            cmd: 'git commit -m "first commit"',
            desc: 'Saves your first permanent snapshot commit to repository history',
        },
        {
            cmd: 'git branch -M main',
            desc: 'Renames the initial default branch to "main" matching modern GitHub standards',
        },
        {
            cmd: 'git remote add origin https://github.com/username/my-new-project.git',
            desc: 'Connects your local project folder to your remote GitHub repository URL',
        },
        {
            cmd: 'git push -u origin main',
            desc: 'Uploads local commits to GitHub and sets upstream tracking for future pushes',
        },
    ],
    existing: [
        {
            cmd: 'git remote add origin https://github.com/username/my-new-project.git',
            desc: 'Links your existing local repository to the target GitHub repository remote',
        },
        {
            cmd: 'git branch -M main',
            desc: 'Designates the primary working branch as "main"',
        },
        {
            cmd: 'git push -u origin main',
            desc: 'Pushes all existing commits to GitHub and binds default tracking',
        },
    ],
};

// Common Essential Workflows for instant developer execution
const ESSENTIAL_WORKFLOWS = [
    {
        title: 'Daily Commit & Push',
        badge: 'Top Workflow',
        commands: ['git add .', 'git commit -m "feat: your message"', 'git push'],
        description: 'Standard 3-step loop to save and push your daily changes.',
    },
    {
        title: 'Create & Publish New Branch',
        badge: 'Feature Flow',
        commands: ['git switch -c feature/new-flow', 'git push -u origin feature/new-flow'],
        description: 'Isolate feature work and set upstream tracking on GitHub.',
    },
    {
        title: 'Discard Unwanted File Edits',
        badge: 'Emergency Fix',
        commands: ['git restore <file>', 'git clean -fd'],
        description: 'Wipe unstaged changes and untracked artifacts completely.',
    },
    {
        title: 'Stash, Pull & Restore',
        badge: 'Sync Flow',
        commands: ['git stash', 'git pull --rebase', 'git stash pop'],
        description: 'Cleanly update your branch without conflicts or messy merges.',
    },
];

const GitCheatSheet = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [setupTab, setSetupTab] = useState('new'); // 'new' | 'existing'

    useEffect(() => {
        try {
            window.scrollTo(0, 0);
        } catch {
            // ignore
        }
    }, []);

    const handleCopy = (text, id) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1800);
        }
    };

    const currentSetupSteps = NEW_REPO_SETUP_STEPS[setupTab];
    const fullSetupScript = currentSetupSteps.map((s) => s.cmd).join('\n');

    // Filter commands by search & category
    const filteredCommands = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return GIT_COMMANDS.filter((cmd) => {
            const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
            const matchesQuery =
                !q ||
                cmd.usecase.toLowerCase().includes(q) ||
                cmd.scenario.toLowerCase().includes(q) ||
                cmd.command.toLowerCase().includes(q) ||
                cmd.explanation.toLowerCase().includes(q) ||
                cmd.categoryName.toLowerCase().includes(q) ||
                (cmd.badge && cmd.badge.toLowerCase().includes(q));
            return matchesCategory && matchesQuery;
        });
    }, [selectedCategory, searchQuery]);

    // Group commands by category
    const groupedCommands = useMemo(() => {
        return GIT_CHEATSHEET_CATEGORIES.reduce((acc, cat) => {
            if (cat.id === 'all') return acc;
            const items = filteredCommands.filter((c) => c.category === cat.id);
            if (items.length > 0) {
                acc[cat.id] = {
                    name: cat.name,
                    icon: CATEGORY_ICONS[cat.id] || Terminal,
                    items,
                };
            }
            return acc;
        }, {});
    }, [filteredCommands]);

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
            <SEO
                title="Git Cheat Sheet · Interactive Usecase-Driven Commands & Repo Setup"
                description="Compact, scenario-based Git command reference. Setup brand new repos, push existing projects, emergency undo solutions, and explore Entire.io."
            />
            <Header activeTab="cheatsheet" showBackButton={true} />

            <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32">

                {/* ── Section 1: Hero Banner ── */}
                <section aria-label="Git Cheat Sheet Header" className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-4 sm:px-6 py-10 md:px-16 md:py-14">
                        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-4 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 w-fit mx-auto sm:mx-0">
                                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                                <span>Developer Command Hub &bull; Scenario &amp; Usecase Driven</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight flex items-center gap-3 justify-center sm:justify-start">
                                <GitCheatSheetNavIcon className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" size={36} />
                                <span>Git Cheat Sheet</span>
                            </h1>

                            <p className="text-xs sm:text-sm md:text-base font-sans text-[#94A3B8] leading-relaxed font-normal">
                                Compact, scenario-focused Git commands crafted for real-world development. Find the exact command you need by goal, problem, or workflow and copy with one click.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Section 2: Featured Spotlight: Entire.io ── */}
                <section className="border-b border-white/10 bg-gradient-to-b from-blue-500/[0.03] to-transparent">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-4 sm:px-6 py-8 md:px-16">
                        <div className="mx-auto max-w-[960px] rounded-2xl border border-blue-500/20 bg-[#10131B] p-5 sm:p-6 relative overflow-hidden group shadow-2xl">
                            {/* Decorative background glow */}
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="space-y-2.5 max-w-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono font-bold text-[#589D88] flex items-center gap-1.5 uppercase tracking-wider">
                                            <Sparkles className="w-3.5 h-3.5 text-[#FFC95C]" />
                                            FEATURED DEVELOPER TOOL
                                        </span>
                                        <span className="text-xs font-mono text-zinc-500">By Thomas Dohmke (ex-GitHub CEO)</span>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
                                        <span>Entire.io</span>
                                        <span className="text-xs font-mono text-[#4397E0] font-normal">
                                            AI Git Observability
                                        </span>
                                    </h2>

                                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                                        Git-native audit &amp; observability layer for AI coding agents (Claude Code, Cursor, Copilot). Saves full AI prompt sessions, reasoning, and tool calls into hidden Git checkpoint branches without cluttering main branch history.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-zinc-400">
                                        <div className="flex items-center gap-1.5">
                                            <Code2 className="w-3.5 h-3.5 text-[#4397E0]" />
                                            <span>Open-Source CLI</span>
                                        </div>
                                        <span>&bull;</span>
                                        <div className="flex items-center gap-1.5">
                                            <Boxes className="w-3.5 h-3.5 text-[#589D88]" />
                                            <span>Fast Distributed Network</span>
                                        </div>
                                        <span>&bull;</span>
                                        <div className="flex items-center gap-1.5">
                                            <RotateCcw className="w-3.5 h-3.5 text-[#9F6EB8]" />
                                            <span>Time-Travel Session Rewind</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                                    <a
                                        href="https://entire.io"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-saas-primary text-xs flex items-center justify-center gap-2 py-2.5 px-4 shadow-lg shadow-blue-500/20"
                                    >
                                        <span>Explore Entire.io</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>

                                    <button
                                        onClick={() => handleCopy('brew install entire/tap/entire && entire init', 'entire-install')}
                                        className="py-2.5 px-4 rounded-xl bg-[#0A0A0C] border border-white/15 hover:border-white/30 text-xs font-mono text-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        {copiedId === 'entire-install' ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-blue-300 font-semibold">Install Command Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                                <span>Copy CLI Setup</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Section 3: Quick Repo Setup on Top (After user builds a new repo) ── */}
                <section className="border-b border-white/10 bg-[#0C0D10]">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-4 sm:px-6 py-8 md:px-16">
                        <div className="mx-auto max-w-[960px] space-y-4">
                            
                            {/* Header Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        <h2 className="text-base sm:text-lg font-bold font-heading text-white tracking-tight">
                                            Quick Repository Setup
                                        </h2>
                                    </div>
                                    <p className="text-xs text-zinc-400 font-sans mt-0.5">
                                        Commands shown after creating a new repository on GitHub — with line-by-line explanations.
                                    </p>
                                </div>

                                {/* Tab Selector */}
                                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141418] border border-white/10 w-fit">
                                    <button
                                        onClick={() => setSetupTab('new')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                            setupTab === 'new'
                                                ? 'bg-white text-black font-bold shadow-sm'
                                                : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        Create New Repo
                                    </button>
                                    <button
                                        onClick={() => setSetupTab('existing')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                            setupTab === 'existing'
                                                ? 'bg-white text-black font-bold shadow-sm'
                                                : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        Push Existing Repo
                                    </button>
                                </div>
                            </div>

                            {/* Line-by-Line Code Box */}
                            <div className="rounded-2xl border border-white/10 bg-[#08080A] overflow-hidden shadow-2xl">
                                
                                {/* Box Top Bar */}
                                <div className="px-4 py-2.5 bg-[#121215] border-b border-white/[0.08] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                                        </div>
                                        <span className="text-[11px] font-mono text-zinc-400 ml-2">
                                            {setupTab === 'new' ? '…or create a new repository on the command line' : '…or push an existing repository from the command line'}
                                        </span>
                                    </div>

                                    {/* Copy All Script Button */}
                                    <button
                                        onClick={() => handleCopy(fullSetupScript, 'setup-full-script')}
                                        className={`px-3 py-1 rounded-lg border text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                                            copiedId === 'setup-full-script'
                                                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 font-bold'
                                                : 'bg-white/[0.06] border-white/15 text-zinc-200 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {copiedId === 'setup-full-script' ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-blue-400" />
                                                <span>All Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                                <span>Copy All Steps</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Step List with One-Liner Descriptions */}
                                <div className="divide-y divide-white/[0.06] p-2">
                                    {currentSetupSteps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 hover:bg-white/[0.02] rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                        >
                                            <div className="space-y-1 min-w-0 pr-4">
                                                {/* Clean Command - No span tags */}
                                                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-100 font-medium select-all">
                                                    <span className="text-blue-400/80 font-bold select-none">$</span>
                                                    <code>{step.cmd}</code>
                                                </div>
                                                {/* One Liner Explanation */}
                                                <p className="text-[11px] sm:text-xs text-zinc-400 font-sans pl-4">
                                                    {step.desc}
                                                </p>
                                            </div>

                                            {/* Line Copy Button */}
                                            <button
                                                onClick={() => handleCopy(step.cmd, `step-${setupTab}-${idx}`)}
                                                className={`self-start sm:self-center px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                                                    copiedId === `step-${setupTab}-${idx}`
                                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-bold'
                                                        : 'bg-transparent border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-white/[0.06]'
                                                }`}
                                            >
                                                {copiedId === `step-${setupTab}-${idx}` ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-blue-400" />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Section 4: Essential Daily Workflows ── */}
                <section className="border-b border-white/10 bg-[#0A0A0C]">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-4 sm:px-6 py-8 md:px-16">
                        <div className="mx-auto max-w-[960px] space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                                    Essential Daily Workflows
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {ESSENTIAL_WORKFLOWS.map((flow, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-white/[0.08] bg-[#121215]/80 p-3 flex flex-col justify-between gap-2 hover:border-white/20 transition-colors"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                <span className="text-xs font-bold text-white font-heading truncate">
                                                    {flow.title}
                                                </span>
                                                <span className="text-[11px] font-mono font-semibold text-[#4397E0] shrink-0">
                                                    {flow.badge}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-zinc-400 leading-tight">
                                                {flow.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleCopy(flow.commands.join(' && '), `flow-${idx}`)}
                                            className="w-full mt-1.5 py-1.5 px-2.5 rounded-lg bg-[#0A0A0C] border border-white/10 hover:border-white/25 hover:bg-white/[0.04] text-[11px] font-mono text-zinc-300 flex items-center justify-between transition-all cursor-pointer group"
                                        >
                                            <span className="truncate text-zinc-400 group-hover:text-zinc-200">
                                                {flow.commands[0]}...
                                            </span>
                                            {copiedId === `flow-${idx}` ? (
                                                <span className="text-[#4397E0] flex items-center gap-1 font-bold shrink-0">
                                                    <Check className="w-3 h-3" /> Copied!
                                                </span>
                                            ) : (
                                                <span className="text-zinc-500 group-hover:text-white flex items-center gap-1 shrink-0">
                                                    <Copy className="w-3 h-3" /> Copy
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Sticky Navigation & Filter Bar ── */}
                <div className="sticky top-16 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-b border-white/10 py-3 px-4 sm:px-6 shadow-2xl">
                    <div className="mx-auto w-full max-w-[1280px] px-2 sm:px-4 md:px-16 flex flex-col md:flex-row items-center gap-3 justify-between">
                        
                        {/* Live Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by usecase, goal, or command..."
                                className="w-full bg-[#121215] border border-white/10 rounded-xl pl-10 pr-14 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 font-mono focus:outline-none focus:border-white/30 transition-all duration-200"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-mono cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Category Navigation Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono">
                            {GIT_CHEATSHEET_CATEGORIES.map((cat) => {
                                const Icon = CATEGORY_ICONS[cat.id] || Layers;
                                const isSelected = selectedCategory === cat.id;
                                const count = cat.id === 'all' 
                                    ? GIT_COMMANDS.length 
                                    : GIT_COMMANDS.filter(c => c.category === cat.id).length;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-[0.98] font-mono flex items-center gap-1.5 ${
                                            isSelected
                                                ? 'bg-white text-black font-bold shadow-sm'
                                                : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:text-white hover:bg-white/[0.08] font-medium'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span>{cat.name}</span>
                                        <span className={`text-[10px] font-mono ${
                                            isSelected ? 'text-black font-bold' : 'text-zinc-500'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Section 5: Compact Usecase Grid ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-4 sm:px-6 py-8 md:px-16 md:py-12">
                        <div className="mx-auto max-w-[960px] space-y-10">
                
                            {filteredCommands.length === 0 ? (
                                <div className="py-20 text-center space-y-3 font-mono">
                                    <Terminal className="w-8 h-8 text-zinc-600 mx-auto" />
                                    <p className="text-base text-zinc-300 font-semibold">No commands found matching &ldquo;{searchQuery}&rdquo;</p>
                                    <p className="text-xs text-zinc-500 font-mono">Try keywords like &lsquo;undo&rsquo;, &lsquo;stash&rsquo;, &lsquo;merge&rsquo;, &lsquo;push&rsquo;, or reset filters.</p>
                                    <button
                                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                        className="btn-saas-primary mt-2 text-xs"
                                    >
                                        Reset Search &amp; Filters
                                    </button>
                                </div>
                            ) : (
                                Object.entries(groupedCommands).map(([catId, group]) => {
                                    const GroupIcon = group.icon;
                                    return (
                                        <section key={catId} id={catId} className="space-y-4">
                                            
                                            {/* Section Header */}
                                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                        <GroupIcon className="w-4 h-4" />
                                                    </div>
                                                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
                                                        {group.name}
                                                    </h2>
                                                </div>
                                                <span className="text-xs font-mono text-zinc-500">
                                                    {group.items.length} {group.items.length === 1 ? 'usecase' : 'usecases'}
                                                </span>
                                            </div>

                                            {/* High-Density Compact Cards */}
                                            <div className="grid grid-cols-1 gap-3">
                                                {group.items.map((item) => (
                                                    <CompactUsecaseCard
                                                        key={item.id}
                                                        item={item}
                                                        isCopied={copiedId === item.id}
                                                        onCopy={() => handleCopy(item.command, item.id)}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })
                            )}

                            {/* Page Navigation Redirection */}
                            <PageNavigation currentKey="cheatsheet" />
                        </div>
                    </div>
                </section>
            </main>

            <BackToTop />
            <SubFooter />
        </div>
    );
};

// ─── Subcomponent: Compact Usecase Card ─────────────
const CompactUsecaseCard = ({ item, isCopied, onCopy }) => {
    // Determine badge color using authentic SVG Palette
    const getBadgeStyle = (badge) => {
        switch (badge?.toLowerCase()) {
            case 'emergency':
            case 'danger':
                return 'text-[#EF4444]';
            case 'essential':
                return 'text-[#4397E0]';
            case 'pro tip':
            case 'speed':
                return 'text-[#9F6EB8]';
            case 'quick fix':
            case 'safe fix':
                return 'text-[#589D88]';
            case 'setup':
            case 'release':
                return 'text-[#FFC95C]';
            default:
                return 'text-zinc-400';
        }
    };

    return (
        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-3.5 sm:p-4 hover:border-white/20 transition-all duration-200 group flex flex-col gap-2.5">
            
            {/* Top Row: Scenario / Goal + Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4397E0] shrink-0" />
                    <h3 className="text-xs sm:text-sm font-bold font-heading text-white tracking-tight group-hover:text-blue-300 transition-colors truncate">
                        {item.usecase}
                    </h3>
                </div>

                {item.badge && (
                    <span className={`text-[11px] font-mono font-semibold tracking-wide uppercase shrink-0 ${getBadgeStyle(item.badge)}`}>
                        {item.badge}
                    </span>
                )}
            </div>

            {/* Context Scenario */}
            <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-normal">
                <span className="text-zinc-500 font-mono">When to use: </span>
                {item.scenario}
            </p>

            {/* High-Density Command Box with Click-to-Copy - ZERO SPAN TAGS INSIDE CODE */}
            <div className="relative rounded-lg bg-[#0A0A0C] border border-white/[0.10] p-2.5 sm:p-3 flex items-center justify-between font-mono text-xs sm:text-sm overflow-x-auto group/code">
                <div className="flex items-center gap-2.5 min-w-0 pr-20">
                    <span className="text-blue-400/80 font-bold select-none text-xs">$</span>
                    <code className="text-zinc-100 font-medium select-all whitespace-pre tracking-wide text-xs sm:text-[13px]">
                        {item.command}
                    </code>
                </div>

                {/* One-Click Copy Button */}
                <button
                    onClick={onCopy}
                    aria-label={`Copy command ${item.command}`}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md border text-[11px] font-mono font-medium transition-all duration-150 flex items-center gap-1.5 active:scale-[0.97] cursor-pointer ${
                        isCopied
                            ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 font-bold'
                            : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08] hover:border-white/25'
                    }`}
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3 h-3 text-blue-400" />
                            <span>Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3 text-zinc-400" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Pro Tip Mini-Bar */}
            {item.tip && (
                <div className="flex items-start gap-1.5 text-[11px] text-zinc-400 font-mono bg-white/[0.02] border border-white/[0.04] px-2.5 py-1.5 rounded-md leading-tight">
                    <CornerDownRight className="w-3 h-3 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-zinc-300 font-semibold">Tip: </span>
                        {item.tip}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GitCheatSheet;
