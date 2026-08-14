import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Github, Search, Bookmark, X, ArrowLeft, ChevronDown, Key,
    AlertTriangle, HelpCircle, ExternalLink, Check, Trash2, Loader2, Terminal
} from 'lucide-react';
import { getRateLimit, setGithubToken } from '../../services/githubService';

const Header = ({ activeTab, onTokenSave, showBackButton }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [token, setToken] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [tokenSaved, setTokenSaved] = useState(false);
    const [tokenError, setTokenError] = useState('');
    const [showHelp, setShowHelp] = useState(false);
    const [activeQuota, setActiveQuota] = useState(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // On open token modal, check existing rate limit status
    useEffect(() => {
        if (showTokenInput) {
            getRateLimit()
                .then((data) => setActiveQuota(data.rate))
                .catch(() => setActiveQuota(null));
        }
    }, [showTokenInput]);

    const handleTokenSubmit = async (e) => {
        e.preventDefault();
        setTokenError('');

        const cleanedToken = token.trim();
        if (!cleanedToken) {
            setTokenError('Please enter a GitHub Personal Access Token.');
            return;
        }

        // Basic format check
        if (!cleanedToken.startsWith('ghp_') && !cleanedToken.startsWith('github_pat_') && cleanedToken.length < 20) {
            setTokenError('Invalid token format. GitHub tokens usually start with ghp_ or github_pat_.');
            setShowHelp(true);
            return;
        }

        setIsVerifying(true);

        try {
            // Test key live against GitHub API
            setGithubToken(cleanedToken);
            const rateData = await getRateLimit();

            if (onTokenSave) {
                onTokenSave(cleanedToken);
            }

            setActiveQuota(rateData.rate);
            setTokenSaved(true);
            setIsVerifying(false);
            setToken('');

            setTimeout(() => {
                setTokenSaved(false);
                setShowTokenInput(false);
            }, 1800);
        } catch (err) {
            setIsVerifying(false);
            setTokenError(
                err.helpMessage ||
                'Failed to verify key. Check for typos or generate a new key on GitHub.'
            );
            setShowHelp(true);
        }
    };

    const handleClearToken = () => {
        setGithubToken(null);
        if (onTokenSave) onTokenSave('');
        localStorage.removeItem('gitexplorer_github_token');
        setToken('');
        setTokenError('');
        setTokenSaved(false);
        setActiveQuota(null);
        alert('GitHub token cleared. Reverted to public unauthenticated requests.');
    };

    const navLinks = [
        { label: 'Explore', to: '/dashboard', tab: 'explore', icon: Search },
        { label: 'Cheat Sheet', to: '/cheatsheet', tab: 'cheatsheet', icon: Terminal },
        { label: 'Bookmarks', to: '/bookmarks', tab: 'bookmarks', icon: Bookmark },
        { label: 'Report', to: '/report', tab: 'report', icon: AlertTriangle },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-[#0A0A0C]/80 backdrop-blur-md border-b border-white/[0.08]'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Left: Logo + optional back button */}
                        <div className="flex items-center gap-5">
                            <Link to="/" className="flex items-center gap-2.5 group" aria-label="GitExplorer home">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 group-hover:border-white/20 transition-colors duration-300">
                                    <Github className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[15px] font-semibold text-white tracking-[-0.02em]">
                                    GitExplorer
                                </span>
                            </Link>

                            {showBackButton && (
                                <Link
                                    to="/"
                                    className="hidden md:flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200 group/back"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 group-hover/back:-translate-x-0.5 transition-transform duration-200" />
                                    <span>Home</span>
                                </Link>
                            )}
                        </div>

                        {/* Center: Desktop nav */}
                        <nav
                            className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
                            aria-label="Primary navigation"
                        >
                            {navLinks.map(({ label, to, tab }) => (
                                <Link
                                    key={tab}
                                    to={to}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                        activeTab === tab
                                            ? 'text-white bg-white/[0.08]'
                                            : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                            <Link
                                to="/profile"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'profile'
                                        ? 'text-white bg-white/[0.08]'
                                        : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                Profile
                            </Link>
                        </nav>

                        {/* Right: Connect Token CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                id="connect-token-btn"
                                onClick={() => setShowTokenInput(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#E4E4E7] active:scale-[0.98] transition-all duration-200"
                            >
                                <Key className="w-3.5 h-3.5" />
                                Connect Token
                            </button>
                        </div>

                        {/* Modern Floating Hamburger Button */}
                        <button
                            id="mobile-menu-btn"
                            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:border-white/25 active:scale-95 transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-white" />
                            ) : (
                                <div className="flex flex-col gap-1.5 w-4 items-end">
                                    <span className="w-4 h-0.5 rounded-full bg-white transition-all" />
                                    <span className="w-2.5 h-0.5 rounded-full bg-white/70 transition-all" />
                                    <span className="w-4 h-0.5 rounded-full bg-white transition-all" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu"
                    className="fixed inset-0 z-50 bg-[#0A0A0C]/98 backdrop-blur-xl md:hidden flex flex-col"
                    style={{ animation: 'fadeInUp 0.2s ease-out forwards' }}
                >
                    <div className="flex justify-between items-center px-6 h-16 border-b border-white/[0.08]">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2.5"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10">
                                <Github className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[15px] font-semibold text-white tracking-[-0.02em]">GitExplorer</span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-[#A1A1AA] hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.06]"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col p-6 gap-2">
                        {navLinks.map(({ label, to, tab, icon: Icon }) => (
                            <Link
                                key={tab}
                                to={to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-[15px] font-medium transition-colors duration-200 border ${
                                    activeTab === tab
                                        ? 'text-white bg-white/[0.06] border-white/10'
                                        : 'text-[#A1A1AA] border-transparent hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                <ChevronDown className="w-3.5 h-3.5 ml-auto -rotate-90 opacity-40" />
                            </Link>
                        ))}
                        <Link
                            to="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-[15px] font-medium transition-colors duration-200 border ${
                                activeTab === 'profile'
                                    ? 'text-white bg-white/[0.06] border-white/10'
                                    : 'text-[#A1A1AA] border-transparent hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <div className="w-4 h-4 rounded-full border-2 border-current opacity-70" />
                            Profile
                            <ChevronDown className="w-3.5 h-3.5 ml-auto -rotate-90 opacity-40" />
                        </Link>

                        <div className="my-2 h-px bg-white/[0.06]" />

                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setShowTokenInput(true);
                            }}
                            className="flex items-center gap-3 px-4 py-4 rounded-xl text-[15px] font-semibold text-black bg-white hover:bg-[#E4E4E7] transition-colors duration-200 justify-center"
                        >
                            <Key className="w-4 h-4" />
                            Connect Token
                        </button>
                    </div>
                </div>
            )}

            {/* Token modal with Verification & Help / Troubleshooting Options */}
            {showTokenInput && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowTokenInput(false); }}
                >
                    <div
                        className="w-full max-w-md bg-[#121215] border border-white/[0.08] rounded-2xl shadow-2xl p-6 sm:p-7 my-8 relative"
                        style={{ animation: 'fadeInUp 0.2s ease-out forwards' }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-1">
                                    &lt;POWER_USER_MODE /&gt;
                                </span>
                                <h3 className="text-lg font-bold text-white tracking-tight">Connect GitHub Token</h3>
                            </div>
                            <button
                                onClick={() => setShowTokenInput(false)}
                                className="p-1.5 text-[#71717A] hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.06] -mt-1"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Current Quota Status */}
                        {activeQuota && (
                            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                                <span className="text-zinc-400">Current API Quota:</span>
                                <span className="text-emerald-400 font-bold">
                                    {activeQuota.remaining} / {activeQuota.limit} req/hr
                                </span>
                            </div>
                        )}

                        <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-5">
                            Add a personal access token to unlock <span className="text-white font-medium">5,000 req/hr</span>. Your token is stored in your browser&apos;s localStorage and never transmitted to any server.
                        </p>

                        {/* Error Alert Box in case of failure or wrong key */}
                        {tokenError && (
                            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono space-y-2">
                                <div className="flex items-start gap-2 font-bold text-rose-400">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>Token Verification Failed</span>
                                </div>
                                <p className="leading-relaxed">{tokenError}</p>
                            </div>
                        )}

                        {tokenSaved ? (
                            <div className="flex items-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-mono">
                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>Token verified &amp; saved! Quota set to 5,000 req/hr.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleTokenSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="token-input" className="block text-[11px] font-mono text-zinc-400">
                                        Personal Access Token (classic or fine-grained)
                                    </label>
                                    <input
                                        id="token-input"
                                        type="password"
                                        value={token}
                                        onChange={(e) => {
                                            setToken(e.target.value);
                                            if (tokenError) setTokenError('');
                                        }}
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        autoFocus
                                        className="w-full bg-[#0A0A0C] border border-white/[0.10] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-[#52525B] font-mono focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        id="save-token-btn"
                                        type="submit"
                                        disabled={isVerifying}
                                        className="flex-1 bg-white hover:bg-[#E4E4E7] text-black font-semibold py-3 rounded-xl transition-all duration-200 text-xs sm:text-sm active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-black" />
                                                <span>Verifying key…</span>
                                            </>
                                        ) : (
                                            <>
                                                <Key className="w-4 h-4" />
                                                <span>Verify &amp; Save Token</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClearToken}
                                        title="Clear existing token"
                                        className="px-3 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Collapsible Help & Troubleshooting Section */}
                        <div className="mt-5 pt-4 border-t border-white/[0.08]">
                            <button
                                type="button"
                                onClick={() => setShowHelp(!showHelp)}
                                className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white transition-colors focus:outline-none"
                            >
                                <span className="flex items-center gap-1.5">
                                    <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                                    Need Help or Key Troubleshooting?
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showHelp ? 'rotate-180 text-white' : ''}`} />
                            </button>

                            {showHelp && (
                                <div className="mt-3 space-y-3 text-xs font-mono text-zinc-400 bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl leading-relaxed">
                                    <div className="space-y-1">
                                        <div className="text-white font-semibold flex items-center gap-1">
                                            1. How to create a free GitHub Token:
                                        </div>
                                        <p className="text-[11px] text-zinc-400">
                                            Go to GitHub &rarr; Settings &rarr; Developer Settings &rarr; Personal Access Tokens. Select &ldquo;Generate new token (classic)&rdquo; and check <span className="text-white">public_repo</span>.
                                        </p>
                                        <a
                                            href="https://github.com/settings/tokens"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sky-400 hover:underline text-[11px] pt-1"
                                        >
                                            <span>Open GitHub Token Settings</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>

                                    <div className="space-y-1 border-t border-white/[0.06] pt-2">
                                        <div className="text-white font-semibold">
                                            2. Troubleshooting Key Failures:
                                        </div>
                                        <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-400">
                                            <li>Ensure the key starts with <span className="text-white">ghp_</span> or <span className="text-white">github_pat_</span>.</li>
                                            <li>Verify the key has not expired on GitHub.</li>
                                            <li>If you hit rate limits, connecting any valid key immediately grants 5,000 req/hr.</li>
                                        </ul>
                                    </div>

                                    <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between">
                                        <span className="text-[11px] text-zinc-500">Still having trouble?</span>
                                        <Link
                                            to="/report"
                                            onClick={() => setShowTokenInput(false)}
                                            className="text-amber-400 hover:underline text-[11px] inline-flex items-center gap-1"
                                        >
                                            <span>Report an Issue</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
