import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, Terminal, Sparkles, BookOpen, Filter, ArrowRight, CornerDownRight, Zap } from 'lucide-react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import PageNavigation from '../components/ui/PageNavigation';
import { GIT_CHEATSHEET_CATEGORIES, GIT_COMMANDS } from '../data/gitCheatSheetData';

const GitCheatSheet = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [copiedId, setCopiedId] = useState(null);

    // Filter commands by active category and search query
    const filteredCommands = useMemo(() => {
        return GIT_COMMANDS.filter((cmd) => {
            const matchesCategory =
                selectedCategory === 'all' || cmd.category === selectedCategory;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                cmd.title.toLowerCase().includes(q) ||
                cmd.command.toLowerCase().includes(q) ||
                cmd.explanation.toLowerCase().includes(q) ||
                cmd.categoryName.toLowerCase().includes(q);

            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    // Group commands by category
    const groupedCommands = useMemo(() => {
        const groups = {};
        filteredCommands.forEach((cmd) => {
            if (!groups[cmd.category]) {
                groups[cmd.category] = {
                    name: cmd.categoryName,
                    items: [],
                };
            }
            groups[cmd.category].items.push(cmd);
        });
        return groups;
    }, [filteredCommands]);

    // Handle One-Click Clipboard Copy with visual feedback
    const handleCopy = (cmd) => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(cmd.command);
        setCopiedId(cmd.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col selection:bg-white/20 selection:text-white">
            <SEO
                title="Git Cheat Sheet & Command Guide | GitExplorer"
                description="One-click copyable Git commands for beginners and developers. Step-by-step setup, staging, branching, remotes, and undoing changes."
            />
            <Header activeTab="cheatsheet" onSearchClick={() => {}} />

            {/* ── Hero Banner ── */}
            <section aria-label="Git Cheat Sheet Header" className="relative pt-32 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] overflow-hidden">
                {/* Background glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none mix-blend-screen opacity-40"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Step-by-Step Command Guide &bull; One-Click Copy</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Git Cheat Sheet
                    </h1>

                    <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Line-by-line step-by-step Git command reference. Copy commands in one click, follow clear execution steps, and master terminal workflows.
                    </p>
                </div>
            </section>

            {/* ── Sticky Navigation & Filter Bar ── */}
            <div className="sticky top-16 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-b border-white/[0.08] py-3.5 px-4 sm:px-6 shadow-2xl">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3.5 justify-between">
                    
                    {/* Live Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by keyword (e.g. commit, push, reset)..."
                            className="w-full bg-[#121215] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 font-mono focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-mono"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Category Navigation Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono">
                        {GIT_CHEATSHEET_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
                                    selectedCategory === cat.id
                                        ? 'bg-white text-black font-semibold shadow-md'
                                        : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.08]'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Line-by-Line Step-by-Step Content ── */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-14">
                
                {filteredCommands.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                        <Terminal className="w-8 h-8 text-zinc-600 mx-auto" />
                        <p className="text-base text-zinc-300 font-medium">No commands found for &ldquo;{searchQuery}&rdquo;</p>
                        <p className="text-xs text-zinc-500 font-mono">Try searching for keywords like &lsquo;commit&rsquo;, &lsquo;branch&rsquo;, &lsquo;checkout&rsquo;, or reset your filter.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                        >
                            Reset Search &amp; Filters
                        </button>
                    </div>
                ) : (
                    Object.entries(groupedCommands).map(([catId, group]) => (
                        <section key={catId} id={catId} className="space-y-6">
                            
                            {/* Section Header */}
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5" />
                                        SEQUENCE
                                    </span>
                                    <span className="w-4 h-px bg-white/20" />
                                    <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                                        {group.name}
                                    </h2>
                                </div>
                                <span className="text-xs font-mono text-zinc-500">
                                    {group.items.length} {group.items.length === 1 ? 'step' : 'steps'}
                                </span>
                            </div>

                            {/* Full-width Line-by-Line Step Cards */}
                            <div className="space-y-4">
                                {group.items.map((item, index) => (
                                    <StepRowCard
                                        key={item.id}
                                        stepIndex={index + 1}
                                        item={item}
                                        isCopied={copiedId === item.id}
                                        onCopy={() => handleCopy(item)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))
                )}

                {/* Page Navigation Redirection */}
                <PageNavigation currentKey="cheatsheet" />
            </main>

            <BackToTop />
            <Footer />
        </div>
    );
};

// ── Line-by-Line Step Row Sub-component ────────────────────────
const StepRowCard = ({ stepIndex, item, isCopied, onCopy }) => {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-5 sm:p-6 hover:border-white/20 transition-all duration-300 shadow-xl space-y-3.5 group">
            
            {/* Top Step Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[11px] font-mono font-bold text-zinc-300">
                        STEP {stepIndex < 10 ? `0${stepIndex}` : stepIndex}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-white transition-colors">
                        {item.title}
                    </h3>
                </div>
            </div>

            {/* Explanation Note */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {item.explanation}
            </p>

            {/* Line-by-Line Code Box with Prompt & One-Click Copy */}
            <div className="relative rounded-xl bg-[#0A0A0C] border border-white/[0.10] p-4 flex items-center justify-between font-mono text-xs sm:text-sm overflow-x-auto group/code">
                <div className="flex items-center gap-3 min-w-0 pr-24">
                    <span className="text-emerald-400/80 font-bold select-none">$</span>
                    <code className="text-emerald-300 font-medium select-all whitespace-pre tracking-wide">
                        {item.command}
                    </code>
                </div>

                {/* One-Click Copy Button */}
                <button
                    onClick={onCopy}
                    aria-label={`Copy command ${item.command}`}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 flex items-center gap-1.5 shadow-md ${
                        isCopied
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/[0.08] border-white/15 text-zinc-300 hover:text-white hover:bg-white/[0.16]'
                    }`}
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Pro Tip Footer Row */}
            {item.tip && (
                <div className="flex items-start gap-2 text-xs text-zinc-400 font-mono bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg leading-relaxed">
                    <CornerDownRight className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <strong className="text-zinc-300 font-semibold">Pro Tip:</strong> {item.tip}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GitCheatSheet;
