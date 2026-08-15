import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Star, GitBranch, User, Sparkles, Code, FileText } from 'lucide-react';

const FEATURES = [
    {
        id: 'trending-repos',
        category: 'EXPLORE / FILTER',
        title: 'Trending Repositories & Velocity Signals',
        desc: 'Filter open-source projects by language (Python, Rust, TypeScript, Go) and timeframes (Today, This Week, This Month) to spot rising code momentum early.',
        link: '/dashboard',
        renderVisual: () => (
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0A0A0C] p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                        <Search className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Filter: topic:ai</span>
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">&bull; 1.2K MATCHES</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-bold text-[10px]">Today</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 text-[10px]">This Week</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#3572a5]/20 text-[#3572a5] border border-[#3572a5]/30 text-[10px]">Python</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#dea584]/20 text-[#dea584] border border-[#dea584]/30 text-[10px]">Rust</span>
                </div>
            </div>
        ),
    },
    {
        id: 'repo-inspector',
        category: 'INSPECTOR / METRICS',
        title: 'Deep Repository Inspector & Specs',
        desc: 'Click any project to open a deep inspection pane detailing repository health, open issues, license compliance, and maintainer commit rhythms.',
        link: '/dashboard',
        renderVisual: () => (
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0A0A0C] p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white font-bold text-xs truncate">deepseek-ai/DeepSeek-V3</span>
                    <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        62.4k
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-white/[0.04] border border-white/10 p-1.5 rounded">
                        <span className="text-zinc-500 block">Forks</span>
                        <span className="text-white font-bold">12.5k</span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 p-1.5 rounded">
                        <span className="text-zinc-500 block">License</span>
                        <span className="text-emerald-400 font-bold">MIT</span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 p-1.5 rounded">
                        <span className="text-zinc-500 block">Issues</span>
                        <span className="text-zinc-300 font-bold">294</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'developer-profile',
        category: 'PROFILE / HEATMAP',
        title: 'Developer Profile & Activity Heatmaps',
        desc: 'Search any GitHub handle to render 365-day contribution heatmaps, annual commit velocity, and primary programming language breakdowns.',
        link: '/profile',
        renderVisual: () => (
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0A0A0C] p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>@SahidGit</span>
                    </span>
                    <span className="text-indigo-400 text-[10px] font-bold">1,420 COMMITS</span>
                </div>
                {/* Mini Heatmap Grid Visual */}
                <div className="flex gap-1 justify-between pt-1">
                    {[...Array(14)].map((_, i) => (
                        <div key={i} className="space-y-1">
                            <div className={`w-2.5 h-2.5 rounded-sm ${i % 3 === 0 ? 'bg-emerald-500' : i % 2 === 0 ? 'bg-emerald-700' : 'bg-white/10'}`} />
                            <div className={`w-2.5 h-2.5 rounded-sm ${i % 4 === 0 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                            <div className={`w-2.5 h-2.5 rounded-sm ${i % 5 === 0 ? 'bg-emerald-600' : 'bg-white/10'}`} />
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: 'ai-newsroom',
        category: 'AI NEWSROOM / INTEL',
        title: 'AI Newsroom & Frontier Model Specs',
        desc: 'Real-time editorial magazine & live benchmark table tracking open-weight model releases, pricing per M tokens, and arXiv paper links.',
        link: '/ai-news',
        renderVisual: () => (
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0A0A0C] p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white font-bold flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Frontier AI Model Race</span>
                    </span>
                    <span className="text-amber-400 text-[10px] font-bold bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                        BETA
                    </span>
                </div>
                <div className="flex items-center justify-between text-[11px] bg-white/[0.04] p-2 rounded border border-white/10">
                    <span className="text-zinc-300">DeepSeek-V3</span>
                    <span className="text-emerald-400 font-bold">$0.14 / M tokens</span>
                    <span className="text-zinc-500 text-[10px]">arXiv:2412.19437</span>
                </div>
            </div>
        ),
    },
];

const FeatureGrid = () => {
    return (
        <section className="border-b border-white/10 bg-[#0A0A0C] overflow-hidden" aria-label="GitExplorer Features Showcase">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 grid grid-cols-1 md:grid-cols-2">
                {FEATURES.map((feature, index) => (
                    <article
                        key={feature.id}
                        className={`flex flex-col border-b border-white/10 ${
                            index % 2 === 0 ? 'md:border-r border-white/10' : ''
                        }`}
                    >
                        {/* Visual Preview Box */}
                        <div className="relative py-8 px-4 sm:p-6 bg-[#0E0E10] border-b border-white/10 flex items-center justify-center overflow-hidden min-h-[200px] sm:h-60">
                            {feature.renderVisual()}
                        </div>

                        {/* Description Box */}
                        <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-semibold">
                                    {feature.category}
                                </span>
                                <h3 className="text-base sm:text-lg font-extrabold font-space text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-xs sm:text-sm font-sans text-zinc-400 leading-relaxed max-w-md mx-auto">
                                    {feature.desc}
                                </p>
                            </div>

                            <div>
                                <Link
                                    to={feature.link}
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-white hover:text-emerald-400 transition-colors"
                                >
                                    <span>Explore Feature</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default FeatureGrid;
