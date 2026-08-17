import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowUpRight } from 'lucide-react';

const AI_PROMPT_LINKS = [
    {
        name: 'ChatGPT',
        url: 'https://chatgpt.com/?q=What%20is%20GitExplorer%20(git-explore-one.vercel.app)%3F%20Tell%20me%20about%20their%20open%20source%20repository%20intelligence%20platform.',
    },
    {
        name: 'Claude',
        url: 'https://claude.ai/new?q=What%20is%20GitExplorer%20(git-explore-one.vercel.app)%3F%20Tell%20me%20about%20their%20open%20source%20repository%20intelligence%20platform.',
    },
    {
        name: 'Perplexity',
        url: 'https://www.perplexity.ai/search?q=What%20is%20GitExplorer%20(git-explore-one.vercel.app)%3F%20Tell%20me%20about%20their%20open%20source%20repository%20intelligence%20platform.',
    },
    {
        name: 'Google AI',
        url: 'https://www.google.com/search?udm=50&q=What%20is%20GitExplorer%20(git-explore-one.vercel.app)%3F%20Tell%20me%20about%20their%20open%20source%20repository%20intelligence%20platform.',
    },
    {
        name: 'Grok',
        url: 'https://grok.com/?q=What%20is%20GitExplorer%20(git-explore-one.vercel.app)%3F%20Tell%20me%20about%20their%20open%20source%20repository%20intelligence%20platform.',
    },
];

const Footer = () => {
    return (
        <footer className="border-b border-white/10 bg-[#0A0A0B]" aria-label="Site footer">
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 px-4 sm:px-8 py-12 sm:py-16 flex flex-col gap-8 sm:gap-10">

                {/* Grid Links Columns */}
                <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 text-xs font-sans">
                    <div>
                        <h3 className="eyebrow-tracker text-[#71717A] mb-3 sm:mb-4">Product</h3>
                        <ul className="space-y-2 text-[#94A3B8] font-mono">
                            <li><Link to="/dashboard" className="hover:text-white transition-colors">Explorer Dashboard</Link></li>
                            <li><Link to="/cheatsheet" className="hover:text-white transition-colors">Git Cheat Sheet</Link></li>
                            <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link to="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white font-mono uppercase tracking-wider mb-3 sm:mb-4">Features</h3>
                        <ul className="space-y-2 text-zinc-400 font-mono">
                            <li><Link to="/ai-news" className="hover:text-white transition-colors">AI Newsroom</Link></li>
                            <li><Link to="/bookmarks" className="hover:text-white transition-colors">Bookmarks</Link></li>
                            <li><Link to="/profile" className="hover:text-white transition-colors">Developer Profile</Link></li>
                            <li><Link to="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white font-mono uppercase tracking-wider mb-3 sm:mb-4">Company</h3>
                        <ul className="space-y-2 text-zinc-400 font-mono">
                            <li><Link to="/company" className="hover:text-white transition-colors">Company &amp; Vision</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                            <li><Link to="/report" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Report an Issue</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white font-mono uppercase tracking-wider mb-3 sm:mb-4">Connect</h3>
                        <ul className="space-y-2 text-zinc-400 font-mono">
                            <li>
                                <a href="https://github.com/SahidGit/git-explore" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                                    <span>GitHub Repo</span>
                                    <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                                    <span>Twitter / X</span>
                                    <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Logo SVG side column */}
                    <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex lg:flex-col justify-between items-start lg:items-end text-zinc-600 border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
                        <Link to="/" className="flex items-center gap-2 text-white font-bold font-space text-sm sm:text-base">
                            <Github className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                            <span>GitExplorer</span>
                        </Link>
                        <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500">v2.0 &bull; Open Source</span>
                    </div>
                </div>

                {/* AI Prompt Links & Copyright Bar */}
                <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 text-xs font-mono text-zinc-400">
                    {/* Ask AI Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                        <span className="text-white font-semibold text-[11px] sm:text-xs">Ask about GitExplorer on:</span>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {AI_PROMPT_LINKS.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Ask about GitExplorer on ${link.name}`}
                                    className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-[11px] sm:text-xs text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Copyright & Zero Telemetry */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] text-zinc-500 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 w-full md:w-auto">
                        <span>© {new Date().getFullYear()} GitExplorer Inc.</span>
                        <span>&bull;</span>
                        <span className="text-zinc-400">Zero Telemetry &bull; Local-First</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
