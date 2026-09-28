import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import footerBg from '../../../assets/footer-bg.png';

const RepoCTA = () => {
    return (
        <section
            className="border-b border-white/10 overflow-hidden relative"
            aria-label="ExploreGit Call to Action"
        >
            {/* ── Background Image Layer ── */}
            <div
                className="absolute inset-0 z-0"
                aria-hidden="true"
            >
                <img
                    src={footerBg}
                    alt=""
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                />
                {/* Multi-stop gradient overlay — heavy dark center-bottom, light top */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: [
                            'linear-gradient(to bottom,',
                            '  rgba(10, 10, 12, 0.72) 0%,',
                            '  rgba(10, 10, 12, 0.55) 30%,',
                            '  rgba(10, 10, 12, 0.70) 60%,',
                            '  rgba(10, 10, 12, 0.92) 85%,',
                            '  rgba(10, 10, 12, 1.00) 100%',
                            ')',
                        ].join(' '),
                    }}
                />
                {/* Subtle vignette on left/right edges */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(10,10,12,0.55) 100%)',
                    }}
                />
            </div>

            {/* ── Content ── */}
            <div className="mx-auto w-full max-w-[1280px] relative z-10 grid place-items-center py-24 sm:py-32 px-6 text-center">
                <div className="relative w-full max-w-2xl space-y-5">
                    {/* Eyebrow */}
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 text-[11px] font-sans font-semibold text-zinc-300 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Open Source · MIT Licensed
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                        Explore the open-source ecosystem with clarity.
                    </h2>

                    <p className="text-sm sm:text-base font-sans text-zinc-300 leading-relaxed font-normal max-w-lg mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        Inspect repository velocity, evaluate maintainer activity, and organize your stack research with zero telemetry and zero cloud lock-in.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                        <Link
                            to="/dashboard"
                            className="btn-saas-primary w-full sm:w-auto"
                        >
                            <span>Open Workspace</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            to="/docs"
                            className="btn-saas-secondary w-full sm:w-auto"
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
