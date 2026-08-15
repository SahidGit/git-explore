import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const RepoCTA = () => {
    return (
        <section className="border-b border-white/10 bg-[#0A0A0C] overflow-hidden" aria-label="Join the Rebellion">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 relative grid place-items-center py-20 px-6 text-center">
                <div className="relative z-10 w-full max-w-xl space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-widest text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        Join the rebellion
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-space text-white tracking-tight leading-tight">
                        Never start from zero again.
                    </h2>

                    <p className="text-sm sm:text-base font-sans text-zinc-400 leading-relaxed font-normal">
                        Regular updates from the front lines. Open source intelligence, developer news, curated content, and exclusive tools for developers who got here first.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 font-mono text-xs">
                        <Link
                            to="/dashboard"
                            className="flex items-center justify-center rounded-xl bg-white text-black font-extrabold px-6 py-3 hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-lg gap-2 cursor-pointer w-full sm:w-auto"
                        >
                            <span>Explore Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            to="/docs"
                            className="flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white font-semibold px-6 py-3 hover:bg-white/[0.08] hover:border-white/30 active:scale-[0.98] transition-all w-full sm:w-auto"
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
