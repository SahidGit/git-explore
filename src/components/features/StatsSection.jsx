import React from 'react';

const STATS = [
    {
        step: '01',
        title: 'API Throughput',
        stat: '5,000',
        unit: 'req/h',
        desc: 'Power User Mode allows optional client-side Personal Access Tokens (PAT) stored safely in localStorage to bypass standard rate limits.',
    },
    {
        step: '02',
        title: 'Graph Velocity',
        stat: '100K+',
        unit: 'repos/day',
        desc: 'Continuous real-time GraphQL & REST queries tracking star velocity, commit frequency, and contributor momentum across GitHub.',
    },
    {
        step: '03',
        title: 'Zero Telemetry',
        stat: '100%',
        unit: 'local-first',
        desc: 'All bookmarks, notes, search filters, and API tokens are stored strictly in your browser. Zero third-party trackers or external databases.',
    },
];

const StatsSection = () => {
    return (
        <section className="border-b border-white/10 bg-[#0A0A0C]" aria-label="Performance Metrics">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 grid grid-cols-1 md:grid-cols-3">
                {STATS.map((item, index) => (
                    <article
                        key={item.step}
                        className={`p-8 sm:p-10 border-b border-white/10 md:border-b-0 ${
                            index < STATS.length - 1 ? 'md:border-r border-white/10' : ''
                        }`}
                    >
                        <p className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-widest">
                            {item.step} &bull; {item.title}
                        </p>
                        <div className="mt-4 flex items-baseline gap-2">
                            <strong className="text-4xl sm:text-5xl font-extrabold font-space text-white tracking-tight">
                                {item.stat}
                            </strong>
                            <span className="text-sm font-mono text-zinc-400">
                                {item.unit}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm font-sans text-zinc-400 leading-relaxed mt-4">
                            {item.desc}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default StatsSection;
