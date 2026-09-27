import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const RepoCTA = () => {
    return (
        <section className="border-b border-white/10 bg-[#0A0A0C] overflow-hidden" aria-label="ExploreGit Call to Action">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 relative grid place-items-center py-20 px-6 text-center">
                <div className="relative z-10 w-full max-w-xl space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
                        Explore the open-source ecosystem with clarity.
                    </h2>

                    <p className="text-sm sm:text-base font-sans text-[#94A3B8] leading-relaxed font-normal max-w-lg mx-auto">
                        Inspect repository velocity, evaluate maintainer activity, and organize your stack research with zero telemetry and zero cloud lock-in.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                        <Link
                            to="/dashboard"
                            className="flex items-center justify-center rounded-xl bg-white text-black font-mono font-bold text-xs sm:text-sm px-7 py-3.5 hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-none gap-2 cursor-pointer w-full sm:w-auto"
                        >
                            <span>Open Workspace</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            to="/docs"
                            className="flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.04] text-white font-mono font-bold text-xs sm:text-sm px-7 py-3.5 hover:bg-white/[0.08] hover:border-white/30 active:scale-[0.98] transition-all shadow-none w-full sm:w-auto cursor-pointer"
                        >
                            Read Documentation
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RepoCTA;
