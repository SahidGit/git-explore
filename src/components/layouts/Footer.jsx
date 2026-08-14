import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, ArrowUpRight, ChevronDown, Compass } from 'lucide-react';

const APP_DROPDOWN_PAGES = [
    {
        category: 'Core App Tools',
        items: [
            { label: 'Explore', path: '/dashboard' },
            { label: 'Cheat Sheet', path: '/cheatsheet' },
            { label: 'Bookmarks', path: '/bookmarks' },
            { label: 'Profile', path: '/profile' },
            { label: 'AI News', path: '/ai-news' },
        ]
    },
    {
        category: 'Product & Releases',
        items: [
            { label: 'Features', path: '/features' },
            { label: 'Documentation', path: '/docs' },
            { label: 'API Reference', path: '/api' },
            { label: 'Changelog', path: '/changelog' },
            { label: 'Roadmap', path: '/roadmap' },
            { label: 'Resources', path: '/resources' },
        ]
    },
    {
        category: 'Legal & Info',
        items: [
            { label: 'About', path: '/about' },
            { label: 'Disclaimer', path: '/disclaimer' },
            { label: 'Terms of Use', path: '/terms' },
            { label: 'Report an issue', path: '/report' },
        ]
    }
];

const Footer = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path) => {
        setOpen(false);
        if (path.startsWith('http')) {
            window.open(path, '_blank', 'noopener,noreferrer');
        } else {
            navigate(path);
        }
    };

    return (
        <footer className="relative bg-[#0A0A0C] border-t border-white/[0.08]" aria-label="Site footer">
            {/* Top gradient hairline */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

            <div className="max-w-[1200px] mx-auto px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left: Brand + Creator credit */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 group" aria-label="GitExplorer home">
                            <div className="flex items-center justify-center h-7 w-7 rounded-full border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:border-white/20">
                                <Github className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-white">GitExplorer</span>
                        </Link>
                        <span className="hidden sm:inline-block text-zinc-600 font-mono">•</span>
                        <p className="text-xs text-[#71717A]">
                            Built by{' '}
                            <Link to="/resources#creator-heading" className="text-zinc-300 hover:text-white transition-colors underline decoration-white/20 underline-offset-2">
                                Sahid Sarfaraz
                            </Link>
                        </p>
                    </div>

                    {/* Right: Priority Ordered Featured Direct Tags + App Navigation Dropdown */}
                    <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 text-xs font-mono">

                        {/* Interactive App Tools Dropdown (Explore, Cheat Sheet, Bookmarks, Profile, Roadmap) */}
                        <div ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setOpen((prev) => !prev)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
                                    open
                                        ? 'bg-white/15 border-white/30 text-white'
                                        : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:border-white/20 hover:text-white'
                                }`}
                                aria-label="Explore and App Tools Menu"
                                aria-expanded={open}
                            >
                                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Explore &amp; App ▾</span>
                            </button>

                            {/* Glassmorphic Dropdown Popover */}
                            {open && (
                                <div className="absolute bottom-full left-0 md:left-auto md:right-0 mb-2 w-56 bg-[#121216] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden p-2 text-left space-y-2 backdrop-blur-xl">
                                    {APP_DROPDOWN_PAGES.map((group) => (
                                        <div key={group.category} className="space-y-1">
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-2.5 pt-1 block">
                                                {group.category}
                                            </span>
                                            {group.items.map((item) => (
                                                <button
                                                    key={item.path}
                                                    type="button"
                                                    onClick={() => handleNavigate(item.path)}
                                                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors duration-150 cursor-pointer"
                                                >
                                                    <span>{item.label}</span>
                                                    <span className="text-[10px] text-zinc-600">→</span>
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Priority Ordered Featured Direct Inline Links */}
                        <Link
                            to="/docs"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            Documentation
                        </Link>

                        <Link
                            to="/about"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            About
                        </Link>

                        <Link
                            to="/api"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            API
                        </Link>

                        <Link
                            to="/changelog"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            Changelog
                        </Link>

                        <Link
                            to="/report"
                            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200"
                        >
                            Report an issue
                        </Link>

                        {/* GitHub Source Link */}
                        <a
                            href="https://github.com/SahidGit/git-explore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors duration-200 group"
                        >
                            <span>GitHub</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Bottom status & copyright bar */}
                <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#52525B]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span>© {new Date().getFullYear()} GitExplorer</span>
                        <span className="text-zinc-600">•</span>
                        <a
                            href="https://en.wikipedia.org/wiki/Telemetry_(software)"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group text-zinc-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-2 hover:decoration-white inline-flex items-center gap-0.5"
                            title="AI Summary: Zero Telemetry means GitExplorer collects 0 user activity logs, 0 analytics scripts, and 0 tracking cookies."
                        >
                            <span>Zero Telemetry</span>
                            <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
                        </a>
                        <span className="text-zinc-600">•</span>
                        <a
                            href="https://en.wikipedia.org/wiki/Local-first_software"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group text-zinc-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-2 hover:decoration-white inline-flex items-center gap-0.5"
                            title="AI Summary: Local-First software prioritizes browser-local storage over cloud servers. Tokens and bookmarks never leave your device."
                        >
                            <span>Local-First</span>
                            <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
                        </a>
                    </div>

                    {/* Pulsing Status indicator */}
                    <div
                        className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.02]"
                        aria-label="API status: Operational"
                        role="status"
                    >
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-mono text-[#71717A]">
                            API Status: Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

