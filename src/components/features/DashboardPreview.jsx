import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Star, ShieldCheck, Database, FileText, ArrowRight,
    TrendingUp, GitBranch, Cpu, Code2, Terminal, CheckCircle2, Bookmark
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

const CHART_DATA = [
    { day: 'Day 1', date: 'Aug 11', stars: 48200, gain: 1250, x: 50, y: 140 },
    { day: 'Day 2', date: 'Aug 12', stars: 49850, gain: 1650, x: 150, y: 120 },
    { day: 'Day 3', date: 'Aug 13', stars: 51900, gain: 2050, x: 250, y: 95 },
    { day: 'Day 4', date: 'Aug 14', stars: 53600, gain: 1700, x: 350, y: 105 },
    { day: 'Day 5', date: 'Aug 15', stars: 56100, gain: 2500, x: 450, y: 70 },
    { day: 'Day 6', date: 'Aug 16', stars: 59300, gain: 3200, x: 550, y: 40 },
    { day: 'Day 7', date: 'Aug 17', stars: 62400, gain: 3100, x: 650, y: 20 },
];

const SevenDayStarGrowthChart = () => {
    const [hoveredIdx, setHoveredIdx] = useState(6); // Default active on Day 7

    const areaPath = "M 50 140 C 100 130, 120 123, 150 120 C 180 117, 220 102, 250 95 C 280 88, 320 107, 350 105 C 380 103, 420 78, 450 70 C 480 62, 520 46, 550 40 C 580 34, 620 23, 650 20 L 650 160 L 50 160 Z";
    const linePath = "M 50 140 C 100 130, 120 123, 150 120 C 180 117, 220 102, 250 95 C 280 88, 320 107, 350 105 C 380 103, 420 78, 450 70 C 480 62, 520 46, 550 40 C 580 34, 620 23, 650 20";

    const activePt = CHART_DATA[hoveredIdx] || CHART_DATA[6];

    return (
        <div className="relative w-full select-none">
            {/* SVG Chart Container */}
            <div className="relative w-full h-48 sm:h-52 bg-[#0A0A0C] border border-white/10 rounded-xl p-3 pt-6 overflow-hidden">
                <svg
                    viewBox="0 0 700 180"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    <defs>
                        {/* Transparent Linear Gradient Fill */}
                        <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="60%" stopColor="#10b981" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Subtle Dashed Gridlines */}
                    <line x1="40" y1="40" x2="660" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="40" y1="90" x2="660" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="40" y1="140" x2="660" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                    {/* Gradient Area Fill */}
                    <path d={areaPath} fill="url(#tealGrad)" />

                    {/* Glowing Teal Stroke Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.7))' }}
                    />

                    {/* Active Vertical Guideline */}
                    {activePt && (
                        <line
                            x1={activePt.x}
                            y1="15"
                            x2={activePt.x}
                            y2="160"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            opacity="0.8"
                        />
                    )}

                    {/* Interactive Data Markers */}
                    {CHART_DATA.map((pt, idx) => {
                        const isHovered = hoveredIdx === idx;
                        return (
                            <g
                                key={pt.day}
                                onClick={() => setHoveredIdx(idx)}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                className="cursor-pointer group"
                            >
                                {/* Invisible touch/hover expander */}
                                <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                                {/* Glowing Marker Ring */}
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHovered ? "6" : "4"}
                                    fill={isHovered ? "#10b981" : "#0E0E10"}
                                    stroke="#10b981"
                                    strokeWidth={isHovered ? "3" : "2"}
                                    className="transition-all duration-200"
                                    style={{
                                        filter: isHovered ? 'drop-shadow(0px 0px 10px rgba(16, 185, 129, 1))' : 'none'
                                    }}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* X-Axis Day Markers & Interactive Tooltip Container */}
            <div className="flex items-center justify-between px-4 pt-2 font-mono text-[10px] sm:text-xs">
                {CHART_DATA.map((pt, idx) => {
                    const isSelected = hoveredIdx === idx;
                    return (
                        <button
                            key={pt.day}
                            type="button"
                            onClick={() => setHoveredIdx(idx)}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            aria-label={`View ${pt.day} details`}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                                isSelected
                                    ? 'text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-500/40'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            {pt.day}
                        </button>
                    );
                })}
            </div>

            {/* Interactive Hover Tooltip Box */}
            {activePt && (
                <div className="mt-3 p-3 rounded-xl border border-emerald-500/30 bg-[#0E0E10]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xl animate-fadeIn">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-zinc-300 font-bold">{activePt.day} &bull; {activePt.date}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-amber-300 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{formatNumber(activePt.stars)} stars</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>+{formatNumber(activePt.gain)} today</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DashboardPreview = () => {
    const [activeTab, setActiveTab] = useState('signal');

    return (
        <section className="border-b border-white/10 bg-[#0A0A0B] py-16 sm:py-24 overflow-hidden" aria-label="Interactive Product Preview">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-12 space-y-3">
                    <div className="eyebrow-tracker text-emerald-400 inline-flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <span>INTERACTIVE DASHBOARD PREVIEW</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold font-space text-white tracking-tight">
                        Open-source intelligence at your fingertips.
                    </h2>

                    <p className="text-xs sm:text-base font-sans text-[#94A3B8] leading-relaxed">
                        Explore repository velocity, inspect project health, and track developer momentum in a local-first interface.
                    </p>
                </div>

                {/* Terminal / Dashboard Product Card */}
                <div className="max-w-5xl mx-auto rounded-2xl border border-white/[0.08] bg-[#121316] shadow-2xl overflow-hidden">
                    
                    {/* Top Bar */}
                    <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0D0E11] gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-mono text-zinc-400 ml-2 hidden sm:inline">
                                ~ /git-explorer/intelligence-workspace
                            </span>
                        </div>

                        {/* Interactive Mode Switches */}
                        <div className="flex items-center gap-1.5 bg-[#0A0A0C] border border-white/10 p-1 rounded-xl font-mono text-xs">
                            <button
                                type="button"
                                onClick={() => setActiveTab('signal')}
                                aria-label="Show Momentum Signal view"
                                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                                    activeTab === 'signal'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                Momentum Signal
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('inspector')}
                                aria-label="Show Health Inspector view"
                                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                                    activeTab === 'inspector'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                Health Inspector
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('workflow')}
                                aria-label="Show Workflow & Storage view"
                                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                                    activeTab === 'workflow'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                Workflow &amp; Sync
                            </button>
                        </div>
                    </div>

                    {/* Preview Workspace Area */}
                    <div className="p-5 sm:p-8 bg-[#0A0A0C] min-h-[340px] flex flex-col justify-between space-y-6">
                        
                        {activeTab === 'signal' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl border border-white/10 bg-[#0E0E10] space-y-2">
                                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                                            <span>STAR VELOCITY</span>
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <p className="text-2xl font-extrabold font-space text-white">+14.2k / wk</p>
                                        <p className="text-[11px] font-sans text-emerald-400 flex items-center gap-1">
                                            <span>&bull; Peak breakout score</span>
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10 bg-[#0E0E10] space-y-2">
                                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                                            <span>ACTIVE CONTRIBUTORS</span>
                                            <GitBranch className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <p className="text-2xl font-extrabold font-space text-white">482 authors</p>
                                        <p className="text-[11px] font-sans text-zinc-400">
                                            High commit frequency this month
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10 bg-[#0E0E10] space-y-2">
                                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                                            <span>API GRAPH THROUGHPUT</span>
                                            <Cpu className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <p className="text-2xl font-extrabold font-space text-white">5,000 req/h</p>
                                        <p className="text-[11px] font-sans text-zinc-400">
                                            Direct GraphQL &amp; REST telemetry
                                        </p>
                                    </div>
                                </div>

                                {/* Responsive 7-Day Star Growth Curved Area Chart */}
                                <div className="p-5 rounded-xl border border-white/10 bg-[#0E0E10] space-y-4 font-mono">
                                    <div className="flex items-center justify-between text-xs text-zinc-300">
                                        <span className="font-bold flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-emerald-400" />
                                            Repository Star Growth (7-Day Trajectory)
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                                            LIVE REPO GRAPH
                                        </span>
                                    </div>

                                    <SevenDayStarGrowthChart />
                                </div>
                            </div>
                        )}

                        {activeTab === 'inspector' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="p-5 rounded-xl border border-white/10 bg-[#0E0E10] space-y-4 font-mono">
                                    <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                                        <div>
                                            <h3 className="text-sm sm:text-base text-white font-bold">deepseek-ai/DeepSeek-V3</h3>
                                            <p className="text-xs text-zinc-400 font-sans mt-0.5">Open source model architecture &amp; weight specs</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            HEALTH SCORE: 98/100
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                        <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/10">
                                            <span className="text-zinc-400 block text-[10px]">LICENSE</span>
                                            <span className="text-emerald-400 font-bold">MIT Compliant</span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/10">
                                            <span className="text-zinc-400 block text-[10px]">OPEN ISSUES</span>
                                            <span className="text-white font-bold">294 (84% closed)</span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/10">
                                            <span className="text-zinc-400 block text-[10px]">MAIN LANGUAGE</span>
                                            <span className="text-sky-300 font-bold">Python (94%)</span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/10">
                                            <span className="text-zinc-400 block text-[10px]">COMMIT RHYTHM</span>
                                            <span className="text-amber-300 font-bold">Daily push</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'workflow' && (
                            <div className="space-y-6 animate-fadeIn font-mono text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-xl border border-white/10 bg-[#0E0E10] space-y-3">
                                        <div className="flex items-center gap-2 text-indigo-400 font-bold">
                                            <Bookmark className="w-4 h-4" />
                                            <span>Local Bookmarks &amp; Notes</span>
                                        </div>
                                        <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                                            Save repositories directly to IndexedDB. Attach custom developer notes and organize your tech stack research without third-party accounts.
                                        </p>
                                        <span className="inline-block px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px]">
                                            100% Client-Side Storage
                                        </span>
                                    </div>

                                    <div className="p-5 rounded-xl border border-white/10 bg-[#0E0E10] space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                            <Database className="w-4 h-4" />
                                            <span>1-Click Data Export</span>
                                        </div>
                                        <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                                            Export all saved repositories, star velocity metrics, and custom notes to JSON or CSV formats instantly.
                                        </p>
                                        <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                                            JSON &amp; CSV Export Ready
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Link Banner inside Preview */}
                        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                            <span className="text-zinc-400 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Zero third-party trackers &bull; Raw GitHub graph intelligence</span>
                            </span>

                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors group"
                            >
                                <span>Launch Full Workspace</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default DashboardPreview;
