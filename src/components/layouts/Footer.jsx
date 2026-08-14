import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-[#0A0A0C] border-t border-white/[0.08]" aria-label="Site footer">
            {/* Top gradient hairline */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

            <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Left: Brand + Creator credit */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 group" aria-label="GitExplorer home">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:border-white/20">
                                <Github className="h-4 w-4 text-white" aria-hidden="true" />
                            </div>
                            <span className="font-bold text-base tracking-tight text-white">GitExplorer</span>
                        </Link>
                        <span className="hidden sm:inline-block text-zinc-600 font-mono">•</span>
                        <p className="text-xs text-[#71717A]">
                            Curated open-source intelligence built by{' '}
                            <Link to="/resources" className="text-zinc-300 hover:text-white transition-colors underline decoration-white/20 underline-offset-2">
                                Sahid Sarfaraz
                            </Link>
                            .
                        </p>
                    </div>

                    {/* Right: Essential Clean Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-mono">
                        <Link
                            to="/dashboard"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            Explore
                        </Link>
                        <Link
                            to="/cheatsheet"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            Cheat Sheet
                        </Link>
                        <Link
                            to="/bookmarks"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            Bookmarks
                        </Link>
                        <Link
                            to="/report"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            Report
                        </Link>
                        <Link
                            to="/docs"
                            className="text-zinc-400 hover:text-white transition-colors duration-200"
                        >
                            Documentation
                        </Link>
                        <a
                            href="https://github.com/SahidGit/git-explorer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors duration-200 group"
                        >
                            <span>Source on GitHub</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Bottom status & copyright bar */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#52525B]">
                    <p>© {new Date().getFullYear()} GitExplorer • Zero Telemetry • Local-First</p>

                    {/* Pulsing Status indicator */}
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]"
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
