import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Github, Search, Bookmark, X, ArrowLeft, ChevronDown, Key,
    AlertTriangle, HelpCircle, ExternalLink, Check, Trash2, Loader2, Terminal, Sparkles
} from 'lucide-react';
import { getRateLimit, setGithubToken } from '../../services/githubService';
import AnnouncementBar from '../ui/AnnouncementBar';

const Header = ({ activeTab, onTokenSave, showBackButton }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [token, setToken] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [tokenSaved, setTokenSaved] = useState(false);
    const [tokenCleared, setTokenCleared] = useState(false);
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
            setTokenError('Please enter a valid GitHub token.');
            return;
        }

        setIsVerifying(true);
        try {
            setGithubToken(cleanedToken);
            const rateData = await getRateLimit();

            if (rateData && rateData.rate) {
                setActiveQuota(rateData.rate);
                setTokenSaved(true);
                setToken('');

                if (onTokenSave) onTokenSave(cleanedToken);

                setTimeout(() => {
                    setTokenSaved(false);
                    setShowTokenInput(false);
                }, 1800);
            }
        } catch (err) {
            console.error('Token verification failed:', err);
            setTokenError('Invalid GitHub token. Please check your token scopes and try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClearToken = () => {
        setGithubToken('');
        setActiveQuota(null);
        setTokenCleared(true);
        if (onTokenSave) onTokenSave('');
        setTimeout(() => {
            setTokenCleared(false);
            setShowTokenInput(false);
        }, 1500);
    };

    const navLinks = [
        { label: 'Dashboard', to: '/dashboard', tab: 'dashboard' },
        { label: 'AI Newsroom', to: '/ai-news', tab: 'ai-news' },
        { label: 'Git Cheat Sheet', to: '/cheatsheet', tab: 'cheatsheet' },
        { label: 'Bookmarks', to: '/bookmarks', tab: 'bookmarks' },
    ];

    return (
        <>
            {/* ── Global Top Announcement Info Thin Strip ── */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <AnnouncementBar />
            </div>

            {/* ── Floating Dock Header ── */}
            <header className="fixed top-9 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl transition-all duration-300">
                <div
                    className={`rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 ${
                        isScrolled
                            ? 'bg-[#0A0A0C]/90 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.8)] shadow-black/80'
                            : 'bg-[#0E0E12]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                    }`}
                >
                    <div className="flex items-center justify-between">

                        {/* Left: Brand Capsule */}
                        <div className="flex items-center gap-3">
                            <Link to="/" className="flex items-center gap-2.5 group" aria-label="GitExplorer home">
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/15 group-hover:border-white/30 group-hover:bg-white/15 transition-all duration-300 shadow-inner">
                                    <Github className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors font-space">
                                    GitExplorer
                                </span>
                            </Link>

                            {showBackButton && (
                                <Link
                                    to="/"
                                    className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 font-mono"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    <span>Home</span>
                                </Link>
                            )}
                        </div>

                        {/* Center: Desktop Floating Dock Items */}
                        <nav
                            className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.06] font-mono text-xs"
                            aria-label="Primary dock navigation"
                        >
                            {navLinks.map(({ label, to, tab }) => {
                                const isActive = activeTab === tab;
                                return (
                                    <Link
                                        key={tab}
                                        to={to}
                                        className={`px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-white text-black font-extrabold shadow-md shadow-white/10'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                            <Link
                                to="/profile"
                                className={`px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ${
                                    activeTab === 'profile'
                                        ? 'bg-white text-black font-extrabold shadow-md shadow-white/10'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                Profile
                            </Link>
                        </nav>

                        {/* Right: Action CTA Dock Button */}
                        <div className="hidden md:flex items-center gap-2 font-mono text-xs">
                            <button
                                id="connect-token-btn"
                                onClick={() => setShowTokenInput(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black font-extrabold hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 shadow-md shadow-white/10 cursor-pointer"
                            >
                                <Key className="w-3.5 h-3.5 text-black" />
                                <span>Connect Token</span>
                            </button>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            id="mobile-menu-btn"
                            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-white hover:border-white/25 active:scale-95 transition-all"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-4 h-4 text-white" />
                            ) : (
                                <div className="flex flex-col gap-1 w-3.5 items-end">
                                    <span className="w-3.5 h-0.5 rounded-full bg-white" />
                                    <span className="w-2 h-0.5 rounded-full bg-white/70" />
                                    <span className="w-3.5 h-0.5 rounded-full bg-white" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Dock Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu"
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl md:hidden flex flex-col justify-center items-center p-4 font-mono text-xs"
                    style={{ animation: 'fadeInUp 0.2s ease-out forwards' }}
                >
                    <div className="w-full max-w-sm bg-[#121215] border border-white/10 rounded-2xl p-6 space-y-4 text-center relative shadow-2xl">
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute right-4 top-4 p-2 rounded-full bg-white/[0.06] text-zinc-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex justify-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <Github className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <h3 className="text-base font-bold text-white font-space">GitExplorer Navigation</h3>

                        <div className="flex flex-col gap-2 pt-2">
                            {navLinks.map(({ label, to, tab }) => (
                                <Link
                                    key={tab}
                                    to={to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                                        activeTab === tab
                                            ? 'bg-white text-black font-extrabold'
                                            : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === 'profile'
                                        ? 'bg-white text-black font-extrabold'
                                        : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                                }`}
                            >
                                Developer Profile
                            </Link>
                            <Link
                                to="/report"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="py-3 px-4 rounded-xl text-sm font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                <span>Report an Issue / Suggestion</span>
                            </Link>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setShowTokenInput(true);
                                }}
                                className="w-full py-3 px-4 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2"
                            >
                                <Key className="w-4 h-4 text-black" />
                                <span>Connect GitHub Token</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Token Config Modal */}
            {showTokenInput && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-bold text-white font-space">GitHub PAT Configuration</h3>
                            </div>
                            <button
                                onClick={() => setShowTokenInput(false)}
                                className="p-1 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                            Save a personal access token in your browser to upgrade rate limits from 60 to <strong className="text-white">5,000 requests/hour</strong>. Stored strictly in your local browser storage.
                        </p>

                        {activeQuota && (
                            <div className="bg-[#0A0A0C] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                                <span className="text-zinc-400">Current Quota Limit:</span>
                                <span className="text-emerald-400 font-bold">{activeQuota.remaining} / {activeQuota.limit} req/hr</span>
                            </div>
                        )}

                        <form onSubmit={handleTokenSubmit} className="space-y-3">
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="ghp_your_personal_access_token..."
                                className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
                            />

                            {tokenError && <p className="text-rose-400 text-xs">{tokenError}</p>}
                            {tokenSaved && <p className="text-emerald-400 text-xs">Token saved successfully!</p>}
                            {tokenCleared && <p className="text-amber-400 text-xs">Token cleared. Reverted to anonymous limit.</p>}

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClearToken}
                                    className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-rose-400 transition-colors"
                                >
                                    Clear Token
                                </button>
                                <button
                                    type="submit"
                                    disabled={isVerifying}
                                    className="px-4 py-2 rounded-xl bg-white text-black font-extrabold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                    <span>{isVerifying ? 'Verifying...' : 'Save Token'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
