import React from 'react';
import { Star, GitFork, GitCommit, ShieldCheck, Cpu, Flame, Layers, Lock, Zap } from 'lucide-react';

const SessionTimeline = () => {
    return (
        <section
            id="repo-velocity"
            className="bg-[#0A0A0C] py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]"
            aria-label="Repository Velocity and Stack Fingerprint"
        >
            <div className="max-w-5xl mx-auto space-y-10">

                {/* ── Section Title ──────────────────────── */}
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">01 VELOCITY &amp; DNA</span>
                        <span className="w-6 h-px bg-white/20" />
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">&lt;REPO_SIGNAL /&gt;</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Inspect real velocity, not just total stars.
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1.5 leading-relaxed">
                        A repository created in 2014 with 50k stars might be dead. GitExplorer isolates recent contributor velocity and language fingerprinting.
                    </p>
                </div>

                {/* ── Split Bento Card (astral-sh/uv velocity vs tech DNA) ── */}
                <div className="rounded-2xl border border-white/10 bg-[#121215] overflow-hidden shadow-2xl">

                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#0E0E10]">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-md bg-[#DEA584]/15 border border-[#DEA584]/30 flex items-center justify-center text-[#DEA584] font-mono text-xs font-bold">
                                uv
                            </div>
                            <span className="text-sm font-mono font-bold text-white tracking-tight">
                                astral-sh / uv
                            </span>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                                <Flame className="w-3 h-3" />
                                +4,200 stars this week
                            </span>
                        </div>

                        <div className="font-mono text-xs text-zinc-500 flex items-center gap-3">
                            <span className="text-zinc-400">v0.5.12</span>
                            <span className="hidden sm:inline">MIT License</span>
                        </div>
                    </div>

                    {/* Middle Grid: Left Velocity vs Right Tech DNA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">

                        {/* ── Left Pane: Repo Velocity & Release Health ── */}
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                                    Release &amp; Star Velocity
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400">Top 0.1% Momentum</span>
                            </div>

                            {/* Stat Boxes */}
                            <div className="grid grid-cols-3 gap-2.5 text-center">
                                <div className="p-3 rounded-xl bg-[#0A0A0C] border border-white/[0.06]">
                                    <div className="text-[10px] font-mono text-zinc-500 mb-1">TOTAL STARS</div>
                                    <div className="text-base font-bold font-mono text-white">45.2k</div>
                                    <div className="text-[9px] font-mono text-emerald-400 mt-0.5">+4.2k (7d)</div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#0A0A0C] border border-white/[0.06]">
                                    <div className="text-[10px] font-mono text-zinc-500 mb-1">WEEKLY FORKS</div>
                                    <div className="text-base font-bold font-mono text-white">1.8k</div>
                                    <div className="text-[9px] font-mono text-zinc-400 mt-0.5">Active forks</div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#0A0A0C] border border-white/[0.06]">
                                    <div className="text-[10px] font-mono text-zinc-500 mb-1">CADENCE</div>
                                    <div className="text-base font-bold font-mono text-emerald-400">Daily</div>
                                    <div className="text-[9px] font-mono text-zinc-400 mt-0.5">18 commits/wk</div>
                                </div>
                            </div>

                            {/* Velocity Bar Simulation */}
                            <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.06] p-4 space-y-2 font-mono text-xs">
                                <div className="flex justify-between text-zinc-400 text-[11px]">
                                    <span>Maintainer Turnaround (Issues)</span>
                                    <span className="text-white font-bold">&lt; 4 Hours</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 rounded-full w-[92%]" />
                                </div>
                                <div className="flex justify-between text-zinc-600 text-[10px] pt-1">
                                    <span>94% Closed in 7 Days</span>
                                    <span>Top Contributor: @charliermarsh</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Right Pane: Tech DNA / Stack Breakdown ── */}
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-sky-400" />
                                    Language &amp; Architecture Fingerprint
                                </span>
                                <span className="text-[10px] font-mono text-zinc-400">Zero Runtime Overhead</span>
                            </div>

                            {/* Stack Segment Bar */}
                            <div className="space-y-2 font-mono text-xs">
                                <div className="h-2.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                                    <div className="bg-[#DEA584] h-full w-[88.4%]" title="Rust 88.4%" />
                                    <div className="bg-[#3572A5] h-full w-[11.6%]" title="Python 11.6%" />
                                </div>
                                <div className="flex items-center justify-between text-xs pt-1">
                                    <span className="flex items-center gap-1.5 text-zinc-300">
                                        <span className="w-2 h-2 rounded-full bg-[#DEA584]" />
                                        Rust (88.4%)
                                    </span>
                                    <span className="flex items-center gap-1.5 text-zinc-400">
                                        <span className="w-2 h-2 rounded-full bg-[#3572A5]" />
                                        Python (11.6%)
                                    </span>
                                </div>
                            </div>

                            {/* Architectural Traits */}
                            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                                <div className="p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.06] flex items-center gap-2 text-zinc-300">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                    <span>Zero dependencies</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.06] flex items-center gap-2 text-zinc-300">
                                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                    <span>10-100x vs pip</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.06] flex items-center gap-2 text-zinc-300">
                                    <Layers className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                                    <span>Standalone binary</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.06] flex items-center gap-2 text-zinc-300">
                                    <GitCommit className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                    <span>Cargo workspace</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Features Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] border-t border-white/[0.08]">
                        <div className="p-5 sm:p-6 text-center sm:text-left space-y-1">
                            <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                                <Flame className="w-4 h-4 text-amber-400" />
                                Velocity over Vanity
                            </h3>
                            <p className="text-xs text-[#A1A1AA] leading-relaxed">
                                Filter past all-time star counts to see what engineers are actually cloning, starring, and shipping this week.
                            </p>
                        </div>

                        <div className="p-5 sm:p-6 text-center sm:text-left space-y-1">
                            <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                                <Lock className="w-4 h-4 text-emerald-400" />
                                Zero Cloud, Zero Auth
                            </h3>
                            <p className="text-xs text-[#A1A1AA] leading-relaxed">
                                Your collections, filters, and private notes live exclusively in your browser&apos;s local storage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SessionTimeline;
