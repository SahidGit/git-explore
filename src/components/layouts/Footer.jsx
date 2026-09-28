import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-b border-white/10 bg-[#0A0A0B]" aria-label="Site footer">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
                {/* Website Minimal Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity"
                    aria-label="ExploreGit Home"
                >
                    <Github className="w-3.5 h-3.5 text-white" />
                    <span>ExploreGit</span>
                </Link>

                {/* Footer links */}
                <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-zinc-400" aria-label="Footer navigation">
                    <Link to="/company" className="hover:text-white transition-colors">
                        Company &amp; Vision
                    </Link>
                    <Link to="/docs" className="hover:text-white transition-colors">
                        Documentation
                    </Link>
                    <Link to="/terms" className="hover:text-white transition-colors">
                        Terms of Service
                    </Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/disclaimer" className="hover:text-white transition-colors">
                        Disclaimer
                    </Link>
                    <Link
                        to="/report"
                        className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Report an Issue
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
