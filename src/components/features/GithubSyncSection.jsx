import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Bookmark, Copy, Check, Download, ShieldCheck } from 'lucide-react';

const GithubSyncSection = () => {
    return (
        <section className="border-b border-white/10 bg-[#0A0A0C] overflow-hidden" aria-label="GitExplorer Utilities">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 grid grid-cols-1 md:grid-cols-2">

                {/* Left Card: Interactive Git Cheat Sheet */}
                <div className="p-8 sm:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between space-y-8">
                    <div className="relative h-48 rounded-xl border border-white/10 bg-[#0E0E10] p-6 flex flex-col justify-between font-mono text-xs overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                <span>git rebase -i HEAD~3</span>
                            </span>
                            <span className="text-emerald-400 font-bold text-[10px]">&bull; 1-CLICK COPY</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white font-semibold font-sans text-sm">Step-by-Step Terminal Reference</p>
                            <p className="text-zinc-400 text-[11px]">Setup, Staging, Branching, Remotes &amp; Undoing Changes</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-zinc-300 text-[11px]">
                            <span>Safety pro-tips included</span>
                            <Link to="/cheatsheet" aria-label="View Git Command Cheat Sheet" className="text-white font-semibold hover:text-emerald-400 transition-colors">
                                View Cheat Sheet &rarr;
                            </Link>
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-semibold">
                            CHEATSHEET / COMMANDS
                        </span>
                        <h3 className="text-xl font-bold text-white font-space">
                            Interactive Git Command Cheat Sheet
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                            Line-by-line step-by-step Git command reference with one-click clipboard copying, explanations, and safety pro-tips for developers.
                        </p>
                    </div>
                </div>

                {/* Right Card: Local Bookmarks & Notes */}
                <div className="p-8 sm:p-12 flex flex-col justify-between space-y-8">
                    <div className="relative h-48 rounded-xl border border-white/10 bg-[#0E0E10] p-6 flex flex-col justify-between font-mono text-xs overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                                <span>IndexedDB / LocalStorage</span>
                            </span>
                            <span className="text-indigo-400 font-bold text-[10px]">100% PRIVATE</span>
                        </div>
                        <div className="bg-[#0A0A0C] border border-white/10 p-3 rounded-lg text-[11px] text-zinc-300 flex items-center justify-between">
                            <span>Saved Repositories &amp; Developer Notes</span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Download className="w-3 h-3 text-emerald-400" />
                                JSON / CSV
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-zinc-300 text-[11px]">
                            <span>Zero telemetry &bull; Local-first</span>
                            <Link to="/bookmarks" aria-label="Open Saved Bookmarks and Developer Notes" className="text-white font-semibold hover:text-indigo-400 transition-colors">
                                Open Bookmarks &rarr;
                            </Link>
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-semibold">
                            BOOKMARKS / EXPORT
                        </span>
                        <h3 className="text-xl font-bold text-white font-space">
                            Local Bookmarks &amp; Custom Notes
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                            Bookmark repositories directly to your browser storage, attach custom developer notes, and export your entire curated library to JSON or CSV anytime.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default GithubSyncSection;
