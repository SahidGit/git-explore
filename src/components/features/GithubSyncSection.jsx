import React from 'react';
import { GitBranch, Bookmark, BarChart2, Filter, Zap, ExternalLink } from 'lucide-react';

// ─── Feature data ────────────────────────────────────
const FEATURES = [
    {
        id: 'trend',
        tag: '<TREND_ANALYSIS />',
        title: 'Signal, not noise.',
        description:
            'Surface repositories with real momentum before they appear on any trending list. Filter by language, date range, and star velocity.',
        icon: Zap,
        delay: 0,
    },
    {
        id: 'contributor',
        tag: '<CONTRIBUTOR_GRAPH />',
        title: 'Deep profile reads.',
        description:
            'Visualize contribution heatmaps, activity rhythms, and commit cadence for any developer in the ecosystem.',
        icon: BarChart2,
        delay: 100,
    },
    {
        id: 'stack',
        tag: '<STACK_FINGERPRINT />',
        title: 'Language intelligence.',
        description:
            'Understand the technology DNA of every project at a glance — language breakdown, framework hints, and dependency depth.',
        icon: Filter,
        delay: 200,
    },
    {
        id: 'bookmarks',
        tag: '<LOCAL_BOOKMARKS />',
        title: 'Zero-auth saves.',
        description:
            'Bookmark repositories directly to local storage. No account. No cloud. Your research stays on your machine.',
        icon: Bookmark,
        delay: 300,
    },
    {
        id: 'metrics',
        tag: '<COMMIT_METRICS />',
        title: 'Chart the arc.',
        description:
            'Beautiful commit frequency charts that reveal project velocity — identify whether momentum is accelerating or stalling.',
        icon: GitBranch,
        delay: 400,
    },
    {
        id: 'access',
        tag: '<DIRECT_ACCESS />',
        title: 'No context-switch.',
        description:
            'Jump directly to files, issues, or pull requests without ever leaving the GitExplorer interface.',
        icon: ExternalLink,
        delay: 500,
    },
];

// ─── Component ────────────────────────────────────────
const GithubSyncSection = () => {
    return (
        <section
            id="features"
            className="relative bg-[#0A0A0C] py-28 overflow-hidden"
            aria-label="Features"
        >
            {/* Subtle background glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none mix-blend-screen"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section header */}
                <div className="mb-16 max-w-2xl">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">02</span>
                        <span className="w-6 h-px bg-white/20" />
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">Features</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Built for developers
                        <br />
                        <span className="text-[#A1A1AA] font-normal">who read the source.</span>
                    </h2>

                    <p className="text-base text-[#71717A] leading-relaxed max-w-lg">
                        Every feature is a deliberate choice. No dashboards for the sake of dashboards.
                        Pure utility, relentless signal.
                    </p>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {FEATURES.map((feature) => (
                        <BentoCard key={feature.id} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const BentoCard = ({ feature }) => {
    const Icon = feature.icon;

    return (
        <article
            className="bento-card p-6 flex flex-col gap-4"
            style={{
                opacity: 0,
                animation: `fadeInUp 0.6s ease-out ${feature.delay}ms forwards`,
            }}
        >
            {/* Icon + tag row */}
            <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <Icon className="w-5 h-5 text-white/80" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-[#71717A] tracking-wider mt-0.5 select-none">
                    {feature.tag}
                </span>
            </div>

            {/* Text content */}
            <div>
                <h3 className="text-[17px] font-bold text-white mb-2 tracking-[-0.01em]">
                    {feature.title}
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </article>
    );
};

export default GithubSyncSection;
