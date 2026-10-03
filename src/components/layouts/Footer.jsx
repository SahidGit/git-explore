import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ReportIssueIcon } from '../ui/Icons';

const LEARN_MORE_LINKS = [
    { label: 'Company & Vision', to: '/company' },
    { label: 'Hidden Gems & Tools', to: '/gems' },
    { label: 'Documentation', to: '/docs' },
    { label: 'API Reference', to: '/api' },
    { label: 'Changelog', to: '/changelog' },
];

const RESOURCE_LINKS = [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Disclaimer', to: '/disclaimer' },
];

export const SubFooter = ({
    theme = 'dark',
    hideReportButton = false,
    standalone = true,
    className = '',
}) => {
    const isLight = theme === 'light';

    const content = (
        <div className={`w-full max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
            standalone
                ? 'px-5 sm:px-8 md:px-10 py-4 sm:py-5'
                : `pt-6 border-t ${isLight ? 'border-black/[0.06]' : 'border-white/[0.06]'}`
        }`}>
            <Link
                to="/"
                className="inline-flex items-center gap-2.5 font-semibold text-base sm:text-lg tracking-tight transition-transform active:scale-95 shrink-0"
                aria-label="ExploreGit Home"
            >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[9px] overflow-hidden shrink-0">
                    <picture className="w-full h-full flex items-center justify-center">
                        <source srcSet="/favicon.avif" type="image/avif" />
                        <source srcSet="/favicon.webp" type="image/webp" />
                        <img
                            src="/favicon.png"
                            alt="ExploreGit Logo"
                            className="w-full h-full object-contain rounded-[9px]"
                            width={32}
                            height={32}
                            loading="lazy"
                        />
                    </picture>
                </div>
                <span className={`font-bold ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                    ExploreGit
                </span>
            </Link>

            <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-widest font-semibold px-3 py-1 rounded-full border ${
                isLight ? 'border-black/10 text-zinc-600' : 'border-white/10 text-zinc-400'
            }`}>
                FREE AND OPEN SOURCE (MIT)
            </span>

            {!hideReportButton ? (
                <Link
                    to="/report"
                    id="footer-report-issue-btn"
                    className={`group px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs ${
                        isLight
                            ? 'bg-white hover:bg-zinc-50 border-black/10 hover:border-black/20 text-zinc-900'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 hover:border-white/25 text-white'
                    }`}
                >
                    <ReportIssueIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" size={16} />
                    <span>Report an Issue</span>
                </Link>
            ) : <div className="shrink-0" />}
        </div>
    );

    if (!standalone) return content;

    return (
        <footer
            className={`border-t transition-colors duration-300 ${
                isLight ? 'border-black/[0.06] bg-[#F4F1EA] text-zinc-900' : 'border-white/[0.08] bg-[#0A0A0C] text-white'
            } ${className}`}
            aria-label="Site sub footer"
        >
            {content}
        </footer>
    );
};

export const MainFooter = ({ theme = 'dark' }) => {
    const isLight = theme === 'light';

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
            <div className="md:col-span-5 space-y-3">
                <h4 className={`font-gilroy text-sm sm:text-base font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                    About ExploreGit
                </h4>
                <p className={`text-xs leading-relaxed max-w-md ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    At ExploreGit, we believe evaluating <a href="https://opensource.guide" target="_blank" rel="noopener noreferrer" className="text-[#4397E0] hover:underline underline-offset-2">open source</a> should be transparent and based on real maintainer vitality rather than vanity stars. We help developers discover thriving repositories, inspect commit velocity, and master <a href="https://docs.github.com/en/get-started/using-github/github-flow" target="_blank" rel="noopener noreferrer" className="text-[#4397E0] hover:underline underline-offset-2">Git workflows</a>—powered directly by the official <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer" className="text-[#4397E0] hover:underline underline-offset-2">GitHub REST API</a> with zero data tracking.
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 pt-1">
                    <span className="w-2 h-2 rounded-full bg-[#4397E0] animate-pulse" />
                    <span>Live GitHub REST API v3 Integration</span>
                </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-8 sm:gap-12">
                {/* Learn More Column */}
                <div className="space-y-3">
                    <h4 className={`font-gilroy text-sm sm:text-base font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                        Learn More
                    </h4>
                    <nav className="flex flex-col space-y-2 text-xs sm:text-[13px] font-medium" aria-label="Learn more navigation">
                        {LEARN_MORE_LINKS.map(({ label, to }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`transition-colors duration-150 flex items-center gap-1 group py-0.5 w-fit ${
                                    isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <span>{label}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Resources Column */}
                <div className="space-y-3">
                    <h4 className={`font-gilroy text-sm sm:text-base font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                        Resources
                    </h4>
                    <nav className="flex flex-col space-y-2 text-xs sm:text-[13px] font-medium" aria-label="Resources legal navigation">
                        {RESOURCE_LINKS.map(({ label, to }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`transition-colors duration-150 flex items-center gap-1 group py-0.5 w-fit ${
                                    isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <span>{label}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

const Footer = ({ theme = 'dark', hideReportButton = false }) => {
    const isLight = theme === 'light';

    return (
        <footer
            className={`border-t transition-colors duration-300 ${
                isLight ? 'border-black/[0.06] bg-[#F4F1EA] text-zinc-900' : 'border-white/[0.08] bg-[#0A0A0C] text-white'
            }`}
            aria-label="Site footer"
        >
            <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 md:px-10 py-10 sm:py-14 md:py-16 flex flex-col gap-10">
                <MainFooter theme={theme} />
                <SubFooter theme={theme} hideReportButton={hideReportButton} standalone={false} />
            </div>
        </footer>
    );
};

export default Footer;
