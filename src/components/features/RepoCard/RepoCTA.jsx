import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';

const RepoCTA = () => {
    return (
        <div className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
            <div className="relative rounded-2xl border border-white/10 bg-[#121215] p-8 md:p-12 overflow-hidden text-center shadow-2xl">
                {/* Subtle radial glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none mix-blend-screen"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono uppercase tracking-widest text-[#71717A]">
                        <Sparkles className="w-3 h-3 text-zinc-400" />
                        Zero Config • Local-First • 100% Free
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Ready to uncover the open-source signal?
                    </h2>

                    <p className="text-base text-[#A1A1AA] leading-relaxed">
                        Start exploring trending repositories, inspecting maintainer activity rhythms,
                        and curating private bookmarks on your local machine.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            to="/dashboard"
                            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200"
                        >
                            Launch Dashboard
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </Link>

                        <Link
                            to="/docs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-[#A1A1AA] text-sm font-medium hover:border-white/20 hover:text-white transition-all duration-200"
                        >
                            Read Documentation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepoCTA;
