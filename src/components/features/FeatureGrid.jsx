import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import {
    SearchRepoIcon,
    PrivacyBadgeIcon,
    LanguageOverviewIcon,
    AiNewsIntelIcon,
    ReportIssueIcon,
    GemsNavIcon
} from '../ui/Icons';

const CHIP_FEATURES = [
    {
        id: 'search',
        name: 'Search Repositories',
        description: 'Search and filter open-source repositories by star velocity, language, and topics. Inspect contributor momentum and repository health metrics in real time.',
        icon: SearchRepoIcon,
        buttons: [
            {
                label: 'Explore Repositories',
                to: '/dashboard',
                style: { backgroundColor: '#4397E0', color: '#FFFFFF' },
            }
        ]
    },
    {
        id: 'gems',
        name: 'Hidden Gems & Tools',
        description: 'Discover under-the-radar open-source repositories with high momentum (<2.5k stars) alongside timeless legendary developer software, utilities, and direct store links.',
        icon: GemsNavIcon,
        buttons: [
            {
                label: 'Explore Software Gems',
                to: '/gems',
                style: { backgroundColor: '#FA6423', color: '#FFFFFF' },
            }
        ]
    },
    {
        id: 'bookmarks',
        name: 'Saved Bookmarks',
        description: 'Free, private architecture research notes and project bookmarks stored 100% locally on your device with zero cloud telemetry or data tracking.',
        icon: PrivacyBadgeIcon,
        buttons: [
            {
                label: 'Open Saved Bookmarks',
                to: '/bookmarks',
                style: { backgroundColor: '#9F6EB8', color: '#FFFFFF' },
            }
        ]
    },
    {
        id: 'languages',
        name: 'Language Overview',
        description: 'Track language ecosystem market share, star growth velocity, and commit cadence across Python, Rust, Go, TypeScript, and more.',
        icon: LanguageOverviewIcon,
        buttons: [
            {
                label: 'View Language Radar',
                to: '/languages',
                style: { backgroundColor: '#FFC95C', color: '#3B1E03' },
            }
        ]
    },
    {
        id: 'ainews',
        name: 'AI News & Git Intel',
        description: 'Automated daily AI ecosystem intelligence covering frontier model updates alongside 40+ interactive, one-click Git terminal commands.',
        icon: AiNewsIntelIcon,
        buttons: [
            {
                label: 'Explore AI News',
                to: '/ai-news',
                style: { backgroundColor: '#75B6EB', color: '#072642' },
            },
            {
                label: 'Git Cheatsheet',
                to: '/cheatsheet',
                style: { backgroundColor: '#EADAFD', color: '#3B134E' },
            }
        ]
    },
    {
        id: 'report',
        name: 'Report & Feedback',
        description: 'Submit telemetry feedback, report data discrepancies, or request new model features directly to the open-source maintenance ledger.',
        icon: ReportIssueIcon,
        buttons: [
            {
                label: 'Report an Issue',
                to: '/report',
                style: { backgroundColor: '#FFC95C', color: '#3B1E03' },
            }
        ]
    }
];

const FeatureGrid = () => {
    const [selectedId, setSelectedId] = useState(null);
    const activeFeature = CHIP_FEATURES.find((item) => item.id === selectedId);

    const handleToggle = (id) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="border-b border-white/10 bg-[#0A0A0C] py-14 sm:py-20 relative font-gilroy" aria-label="ExploreGit Features">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                
                {/* Section Title & Subheading */}
                <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-10 space-y-2 font-gilroy">
                    <p className="font-mono text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                        Core Capabilities
                    </p>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-gilroy">
                        Discover more from ExploreGit.
                    </h2>
                </div>

                {/* DuckDuckGo Pill Chips Container */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-6 font-gilroy">
                    {CHIP_FEATURES.map((chip) => {
                        const Icon = chip.icon;
                        const isSelected = chip.id === selectedId;

                        return (
                            <button
                                key={chip.id}
                                type="button"
                                onClick={() => handleToggle(chip.id)}
                                aria-expanded={isSelected}
                                className={`group flex items-center gap-3 px-4 py-2.5 rounded-full transition-all cursor-pointer border text-left font-gilroy ${
                                    isSelected
                                        ? 'bg-[#18191E] border-white/35 text-white shadow-lg'
                                        : 'bg-[#101114] border-white/10 hover:border-white/20 text-zinc-300 hover:text-white'
                                }`}
                            >
                                <Icon className="w-6 h-6 shrink-0" />
                                <span className="font-gilroy text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">
                                    {chip.name}
                                </span>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs transition-colors ${
                                    isSelected ? 'bg-white text-black font-bold' : 'bg-white/10 text-zinc-400 group-hover:bg-white/15 group-hover:text-white'
                                }`}>
                                    {isSelected ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* DuckDuckGo Popover Card (Only open when a chip is clicked) */}
                {activeFeature && (
                    <div 
                        key={activeFeature.id}
                        className="w-full max-w-xl mx-auto mt-4 rounded-3xl bg-[#131418] border border-white/15 p-6 sm:p-7 text-left shadow-2xl animate-popInFast font-gilroy"
                    >
                        <div className="flex items-center gap-2.5 mb-2 font-gilroy">
                            {React.createElement(activeFeature.icon, { className: "w-6 h-6 shrink-0" })}
                            <h5 className="text-lg sm:text-xl font-bold text-white font-gilroy tracking-tight">
                                {activeFeature.name}
                            </h5>
                        </div>

                        <p className="text-xs sm:text-sm text-zinc-300 font-gilroy leading-relaxed mb-5">
                            {activeFeature.description}
                        </p>

                        {/* Color Coded Tablet Pill Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            {activeFeature.buttons.map((btn, idx) => (
                                <Link
                                    key={idx}
                                    to={btn.to}
                                    style={btn.style}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-gilroy font-bold text-xs sm:text-sm hover:opacity-95 transition-all active:scale-95 shadow-sm cursor-pointer"
                                >
                                    <span>{btn.label}</span>
                                    <span className="shrink-0" aria-hidden="true">
                                        <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="14" height="14" color="currentColor">
                                            <path fill="currentColor" d="M3.191 12.809c.244.244.64.244.884 0l7.675-7.675v6.233c0 .345.28.625.625.625s.625-.28.625-.625V4.75C13 3.784 12.216 3 11.25 3H4.633c-.345 0-.625.28-.625.625s.28.625.625.625h6.233l-7.675 7.675c-.244.244-.244.64 0 .884" />
                                        </svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default FeatureGrid;

