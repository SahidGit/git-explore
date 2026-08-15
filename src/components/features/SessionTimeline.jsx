import React, { useState } from 'react';
import { Search, GitBranch, ChevronDown, CheckCircle2, User, Clock, Terminal } from 'lucide-react';

const SESSIONS_DATA = [
    {
        date: 'Tuesday 7 Jul',
        count: '2 sessions',
        items: [
            {
                id: 'sess-1',
                title: 'Create a simple path to enable reference storage for existing repos',
                author: 'Soph',
                avatar: 'https://github.com/Soph.png',
                agent: 'Claude Code',
                agentClass: 'bg-[#D97757]/20 text-[#D97757] border-[#D97757]/30',
                model: 'Fable 5',
                checkpoints: '2 checkpoints',
                isPublic: true,
            },
            {
                id: 'sess-2',
                title: 'Document repository routing used by the CLI',
                author: 'pjbgf',
                avatar: 'https://github.com/pjbgf.png',
                agent: 'Claude Code',
                agentClass: 'bg-[#D97757]/20 text-[#D97757] border-[#D97757]/30',
                model: 'Opus 4.8',
                checkpoints: '1 checkpoint',
                isPublic: true,
            },
        ],
    },
    {
        date: 'Monday 6 Jul',
        count: '2 sessions',
        items: [
            {
                id: 'sess-3',
                title: 'Pass --yes when Homebrew auto-update runs after confirmation',
                author: 'khaong',
                avatar: 'https://github.com/khaong.png',
                agent: 'Codex',
                agentClass: 'bg-[#B1A7FF]/20 text-[#B1A7FF] border-[#B1A7FF]/30',
                model: 'GPT-5.5',
                checkpoints: '1 checkpoint',
                isPublic: false,
            },
            {
                id: 'sess-4',
                title: 'Clean up the one-agent import prompt',
                author: 'computermode',
                avatar: 'https://github.com/computermode.png',
                agent: 'Claude Code',
                agentClass: 'bg-[#D97757]/20 text-[#D97757] border-[#D97757]/30',
                model: 'Opus 4.8',
                checkpoints: '2 checkpoints',
                isPublic: true,
            },
        ],
    },
];

const SessionTimeline = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <section className="border-b border-white/10 bg-[#0A0A0C] overflow-hidden" aria-label="Agent Session History">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 px-6 py-16 md:py-20">
                {/* Section Header */}
                <div className="mx-auto max-w-xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>SESSIONS &bull; AUDIT TRAIL</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold font-space text-white tracking-tight mb-3">
                        Full visibility into every agent run
                    </h2>

                    <p className="text-sm md:text-base font-sans text-zinc-400 leading-relaxed font-normal">
                        Trace any change back to the session that produced it, and give your team and agents full context.
                    </p>
                </div>

                {/* Main Card Container (Entire.io Sessions Frame) */}
                <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#0E0E10] overflow-hidden shadow-2xl">
                    {/* Top Control Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10 bg-[#121215]">
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                            <span className="text-zinc-500">cli</span>
                            <span>/</span>
                            <span className="text-white font-bold">Sessions</span>
                        </div>

                        <div className="flex items-center gap-3 flex-1 max-w-xs ml-auto">
                            {/* Search bar */}
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search sessions..."
                                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 font-mono focus:outline-none focus:border-white/30"
                                />
                            </div>

                            {/* Branch Picker */}
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0A0A0C] text-xs font-mono text-zinc-300 hover:text-white transition-colors">
                                <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
                                <span>main</span>
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                            </button>
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className="p-4 space-y-6">
                        {SESSIONS_DATA.map((group) => {
                            const filteredItems = group.items.filter((item) =>
                                !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase())
                            );

                            if (filteredItems.length === 0) return null;

                            return (
                                <div key={group.date} className="space-y-3">
                                    {/* Date Group Header */}
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs font-mono">
                                        <span className="font-semibold text-white">{group.date}</span>
                                        <span className="text-zinc-500">{group.count}</span>
                                    </div>

                                    {/* List Items */}
                                    <div className="space-y-2">
                                        {filteredItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.04] bg-[#0A0A0C]/50 hover:bg-white/[0.03] hover:border-white/15 transition-all duration-200"
                                            >
                                                {/* Left side: Avatar + Title + Public Badge */}
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <img
                                                        src={item.avatar}
                                                        alt={item.author}
                                                        className="w-6 h-6 rounded-full border border-white/10 shrink-0"
                                                    />
                                                    <span className="text-xs sm:text-sm font-medium text-white truncate">
                                                        {item.title}
                                                    </span>
                                                    {item.isPublic && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-zinc-300 border border-white/10 shrink-0">
                                                            Public
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Right side: Agent badge, Model, Checkpoints */}
                                                <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                                                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${item.agentClass}`}>
                                                        {item.agent}
                                                    </span>
                                                    <span className="text-zinc-400 hidden sm:inline">{item.model}</span>
                                                    <span className="text-zinc-500">{item.checkpoints}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SessionTimeline;
