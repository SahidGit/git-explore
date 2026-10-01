import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Key, X, ArrowLeft, AlertTriangle, AlertCircle, HelpCircle, ExternalLink,
    Check, Trash2, Loader2, ShieldCheck, User, ChevronDown, ChevronUp, CheckCircle2
} from 'lucide-react';
import AnnouncementBar from '../ui/AnnouncementBar';
import { useAuth } from '../../context/AuthContext';

const Header = ({ activeTab, showBackButton, theme = 'dark' }) => {
    const {
        token,
        user,
        isConnected,
        rateLimit,
        isVerifying,
        tokenError,
        connectToken,
        disconnectToken,
        refreshRateLimit
    } = useAuth();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [inputToken, setInputToken] = useState('');
    const [localError, setLocalError] = useState('');
    const [localSuccess, setLocalSuccess] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const isLight = theme === 'light';

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleOpenModal = () => {
        setLocalError('');
        setLocalSuccess(false);
        setInputToken('');
        refreshRateLimit();
        setShowTokenModal(true);
    };

    const handleConnectSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setLocalSuccess(false);

        const cleaned = inputToken.trim();
        if (!cleaned) {
            setLocalError('Please enter a GitHub Personal Access Token.');
            return;
        }

        const result = await connectToken(cleaned);
        if (result.success) {
            setLocalSuccess(true);
            setInputToken('');
            setTimeout(() => {
                setLocalSuccess(false);
                setShowTokenModal(false);
            }, 1600);
        } else {
            setLocalError(result.error || 'Invalid or Expired Token');
        }
    };

    const handleDisconnect = () => {
        disconnectToken();
        setLocalSuccess(false);
        setLocalError('');
        setShowTokenModal(false);
    };

    const navLinks = [
        { label: 'Dashboard', to: '/dashboard', tab: 'dashboard' },
        { label: 'Languages', to: '/languages', tab: 'languages' },
        { label: 'Bookmarks', to: '/bookmarks', tab: 'bookmarks' },
        { label: 'Git Cheat Sheet', to: '/cheatsheet', tab: 'cheatsheet' },
        { label: 'AI Newsroom', to: '/ai-news', tab: 'ai-news' },
    ];

    // Scroll lock when mobile menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Sticky / Fixed Top Navbar with Glassmorphism on Scroll */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
                    isScrolled
                        ? isLight
                            ? 'bg-[rgba(255,255,255,0.6)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.3)] shadow-xs'
                            : 'bg-[rgba(17,17,17,0.5)] backdrop-blur-[12px] border-b border-white/10 shadow-sm'
                        : 'bg-transparent backdrop-blur-none border-b border-transparent'
                } ${
                    isLight ? 'text-zinc-950' : 'text-white'
                }`}
            >
                <AnnouncementBar />
                <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between">

                    {/* Left Slot: Logo and Website Name */}
                    <div className="flex items-center gap-3 min-w-[180px]">
                        <Link 
                            to="/" 
                            className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-95" 
                            aria-label="ExploreGit home"
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105 shrink-0">
                                <picture className="w-full h-full flex items-center justify-center">
                                    <source srcSet="/favicon.avif" type="image/avif" />
                                    <source srcSet="/favicon.webp" type="image/webp" />
                                    <img
                                        src="/favicon.png"
                                        alt="ExploreGit Logo"
                                        className="w-full h-full object-contain rounded-[10px]"
                                        width={40}
                                        height={40}
                                        loading="eager"
                                    />
                                </picture>
                            </div>
                            <span
                                className={`font-bold text-base sm:text-lg tracking-tight font-sans transition-colors ${
                                    isLight
                                        ? 'text-zinc-950 group-hover:text-black'
                                        : 'text-white group-hover:text-zinc-100'
                                }`}
                            >
                                ExploreGit
                            </span>
                        </Link>

                        {showBackButton && (
                            <Link
                                to="/"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sans bg-white text-black hover:bg-zinc-200 transition-all duration-200 ease-out active:scale-95 shadow-xs border border-white"
                                aria-label="Back"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 text-black" />
                                <span className="font-sans font-semibold tracking-tight">Back</span>
                            </Link>
                        )}
                    </div>

                    {/* Middle Slot: Apple UI Pill Navigation Container */}
                    <nav
                        className={`hidden md:flex items-center justify-center p-1 rounded-full border transition-colors ${
                            isLight
                                ? 'bg-black/[0.03] border-black/[0.05]'
                                : 'bg-white/[0.03] border-white/[0.06]'
                        }`}
                        aria-label="Primary navigation"
                    >
                        {navLinks.map(({ label, to, tab }) => {
                            const isActive = activeTab === tab;
                            return (
                                <Link
                                    key={tab}
                                    to={to}
                                    className={`relative px-3.5 py-1 rounded-full text-[13px] font-medium transition-all duration-200 ease-out select-none active:scale-95 ${
                                        isActive
                                            ? isLight
                                                ? 'bg-white text-zinc-950 font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-black/[0.04]'
                                                : 'bg-white/[0.12] text-white font-semibold shadow-[0_1px_6px_rgba(0,0,0,0.3)] border border-white/15'
                                            : isLight
                                                ? 'text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04]'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Slot: Apple UI Connect Token Button */}
                    <div className="hidden md:flex items-center justify-end gap-3 min-w-[180px]">
                        {isConnected && user ? (
                            <button
                                id="connect-token-btn"
                                onClick={handleOpenModal}
                                aria-label="Manage GitHub Token"
                                className={`text-xs h-[34px] px-3.5 gap-2 rounded-full font-medium border flex items-center transition-all duration-200 ease-out cursor-pointer active:scale-95 ${
                                    isLight
                                        ? 'bg-white hover:bg-zinc-50 border-black/10 hover:border-black/20 text-zinc-900 shadow-xs'
                                        : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 hover:border-white/25 text-white shadow-xs'
                                }`}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        className="w-4 h-4 rounded-full border border-black/10 dark:border-white/20"
                                    />
                                ) : (
                                    <User className="w-3.5 h-3.5 text-emerald-500" />
                                )}
                                <span className="font-semibold text-xs font-mono">@{user.login}</span>
                            </button>
                        ) : (
                            <button
                                id="connect-token-btn"
                                onClick={handleOpenModal}
                                aria-label="Connect GitHub Token"
                                className={`text-xs h-[34px] px-3.5 gap-2 rounded-full font-medium border flex items-center transition-all duration-200 ease-out cursor-pointer active:scale-95 ${
                                    isLight
                                        ? 'bg-zinc-950 text-white hover:bg-zinc-800 border-zinc-900 shadow-xs hover:shadow-sm'
                                        : 'bg-white text-zinc-950 hover:bg-zinc-100 border-white shadow-xs hover:shadow-sm font-semibold'
                                }`}
                            >
                                <Key className="w-3.5 h-3.5" />
                                <span className="font-sans text-xs">Connect Token</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Hamburger Trigger */}
                    <button
                        id="mobile-menu-btn"
                        className={`md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 ease-out cursor-pointer active:scale-90 ${
                            isLight
                                ? 'bg-black/[0.04] border-black/10 text-zinc-950 hover:bg-black/[0.08]'
                                : 'bg-white/[0.06] border-white/15 text-white hover:bg-white/[0.12]'
                        }`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <div className="flex flex-col gap-1 w-4 items-center">
                                <span className={`w-4 h-0.5 rounded-full transition-colors ${isLight ? 'bg-zinc-950' : 'bg-white'}`} />
                                <span className={`w-3 h-0.5 rounded-full transition-colors ${isLight ? 'bg-zinc-800' : 'bg-white/80'}`} />
                                <span className={`w-4 h-0.5 rounded-full transition-colors ${isLight ? 'bg-zinc-950' : 'bg-white'}`} />
                            </div>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Hamburger Navigation Overlay */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu-overlay"
                    className="fixed inset-0 z-50 bg-[#0A0A0C]/95 backdrop-blur-2xl md:hidden flex flex-col w-screen h-screen overflow-hidden animate-fadeIn font-sans"
                >
                    {/* Header & Action Bar Architecture */}
                    <div className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-white/[0.08] bg-transparent shrink-0">
                        
                        {/* Left Slot: Branding */}
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 active:scale-95 transition-transform"
                            aria-label="ExploreGit mobile home link"
                        >
                            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center overflow-hidden shrink-0">
                                <picture className="w-full h-full flex items-center justify-center">
                                    <source srcSet="/favicon.avif" type="image/avif" />
                                    <source srcSet="/favicon.webp" type="image/webp" />
                                    <img
                                        src="/favicon.png"
                                        alt="ExploreGit Logo"
                                        className="w-full h-full object-contain rounded-[10px]"
                                        width={36}
                                        height={36}
                                    />
                                </picture>
                            </div>
                            <span className="text-lg font-bold text-white font-sans tracking-tight">
                                ExploreGit
                            </span>
                        </Link>

                        {/* Right Slot: Mini-CTA Button & Close Trigger */}
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleOpenModal();
                                }}
                                className="text-xs h-[34px] px-3.5 gap-1.5 rounded-full font-medium bg-white text-zinc-950 hover:bg-zinc-100 border border-white active:scale-95 transition-all duration-200 flex items-center cursor-pointer shadow-xs"
                            >
                                <Key className="w-3.5 h-3.5 text-zinc-900" />
                                <span>{isConnected ? `@${user?.login || 'user'}` : 'Connect Token'}</span>
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close mobile menu"
                                className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-white hover:bg-white/[0.12] active:scale-90 transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links Vertical Stack */}
                    <nav className="flex-1 overflow-y-auto pt-6 px-6 flex flex-col justify-between pb-8 space-y-6 font-sans">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map(({ label, to, tab }) => {
                                const isActive = activeTab === tab;
                                return (
                                    <Link
                                        key={tab}
                                        to={to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-base font-medium transition-all duration-200 flex items-center justify-between px-4 py-3 rounded-xl active:scale-[0.98] ${
                                            isActive
                                                ? 'bg-white/[0.12] text-white font-semibold border border-white/10 shadow-xs'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <span>{label}</span>
                                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Featured Report an Issue Pill & Bottom Metadata in Drawer */}
                        <div className="pt-6 border-t border-white/[0.08] font-sans text-xs space-y-4">
                            <Link
                                to="/report"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 active:scale-[0.98] transition-all font-sans"
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span className="font-semibold text-xs font-sans">Report an Issue / Feedback</span>
                                </div>
                                <span className="text-[11px] font-bold text-amber-400/80 font-sans">↗</span>
                            </Link>

                            <div className="space-y-1.5 text-zinc-500 font-sans px-1">
                                <div className="flex items-center justify-between">
                                    <span>ExploreGit Intelligence Layer</span>
                                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Live
                                    </span>
                                </div>
                                <div className="text-[11px] text-zinc-600">
                                    100% Local-First &bull; Zero Cloud Telemetry
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            )}

            {/* Token Configuration Modal & Step-by-Step Generation Guide */}
            {showTokenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xl p-4 animate-fadeIn font-sans">
                    <div className="w-full max-w-lg bg-[#121215]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl font-sans text-xs max-h-[90vh] overflow-y-auto">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white tracking-tight">GitHub Token Configuration</h3>
                            </div>
                            <button
                                onClick={() => setShowTokenModal(false)}
                                className="w-7 h-7 rounded-full bg-white/[0.06] text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Status Quota Card */}
                        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2 font-sans">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400 font-sans">Connection Status:</span>
                                {isConnected && user ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-1.5 text-[11px] font-mono">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        Connected as @{user.login}
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[11px] font-sans">
                                        Anonymous Mode (60 req/hr)
                                    </span>
                                )}
                            </div>

                            {rateLimit && (
                                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/5 font-sans">
                                    <span className="text-zinc-400 font-sans">API Quota Limit:</span>
                                    <span className="text-white font-semibold font-mono">
                                        {rateLimit.remaining} / {rateLimit.limit} req/hr
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                            Connecting a GitHub Personal Access Token (PAT) upgrades API rate limits from 60 to <strong className="text-white font-semibold">5,000 requests/hour</strong>. Tokens are held in-memory during your session (never written to disk or storage) and are never transmitted to third-party servers.
                        </p>

                        {/* Success Banner */}
                        {localSuccess && (
                            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-2 text-xs font-sans animate-fadeIn">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Connected Successfully! Token active for this session.</span>
                            </div>
                        )}

                        {/* Error / Failure Banner */}
                        {(localError || tokenError) && !localSuccess && (
                            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 space-y-1.5 text-xs font-sans animate-fadeIn">
                                <div className="flex items-center gap-2 font-semibold font-sans">
                                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span>{localError || tokenError}</span>
                                </div>
                                <p className="text-[11px] font-sans text-rose-200">
                                    Please verify your token credentials or check the guide below to generate a read-only token (no scopes required).
                                </p>
                            </div>
                        )}

                        {/* Token Input Form */}
                        <form onSubmit={handleConnectSubmit} className="space-y-4 font-sans">
                            <div>
                                <label htmlFor="pat-input" className="block text-[11px] font-sans font-medium text-zinc-400 mb-1.5">
                                    Personal Access Token (classic or fine-grained)
                                </label>
                                <input
                                    id="pat-input"
                                    type="password"
                                    value={inputToken}
                                    onChange={(e) => setInputToken(e.target.value)}
                                    placeholder={isConnected ? "••••••••••••••••••••••••••••" : "ghp_your_personal_access_token..."}
                                    className="w-full bg-[#0B0C0E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all font-mono"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-1 font-sans">
                                <button
                                    type="button"
                                    onClick={() => setShowGuide(!showGuide)}
                                    className="text-xs font-sans font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                                >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>How to generate a token?</span>
                                    {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                <div className="flex items-center gap-2.5">
                                    {isConnected && (
                                        <button
                                            type="button"
                                            onClick={handleDisconnect}
                                            className="text-xs h-[36px] px-3.5 gap-1.5 rounded-full font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:scale-95 transition-all duration-200 cursor-pointer flex items-center"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Disconnect</span>
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isVerifying}
                                        className="text-xs h-[36px] px-4 gap-1.5 rounded-full font-medium bg-white text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all duration-200 cursor-pointer flex items-center shadow-xs disabled:opacity-50"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Verifying...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                <span>{isConnected ? 'Update Token' : 'Verify & Connect'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Step-by-Step PAT Generation Guide Accordion */}
                        {showGuide && (
                            <div className="p-4 rounded-xl border border-white/10 bg-[#0B0C0E] space-y-3 font-sans text-xs animate-fadeIn">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <span className="font-semibold text-white font-sans flex items-center gap-1.5 text-[11px]">
                                        <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                                        Step-by-Step GitHub PAT Setup Guide
                                    </span>
                                    <a
                                        href="https://github.com/settings/tokens/new?description=ExploreGit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:underline flex items-center gap-1 font-sans text-[11px]"
                                    >
                                        <span>Open GitHub Setup ↗</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                <ol className="space-y-2 list-decimal list-inside text-zinc-300 leading-relaxed font-sans">
                                    <li>
                                        Navigate to{' '}
                                        <a
                                            href="https://github.com/settings/tokens/new?description=ExploreGit"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white underline font-sans"
                                        >
                                            GitHub Settings → Personal access tokens → Tokens (classic)
                                        </a>.
                                    </li>
                                    <li>Set Note to <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-white">ExploreGit</code>.</li>
                                    <li>
                                        Select token permissions:
                                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1 font-sans text-[11px] text-zinc-400">
                                            <li><strong className="text-white font-medium">No scopes needed</strong> — Leave all checkboxes blank. A classic token with zero scopes grants 5,000 req/hr rate limits for all public open-source exploration safely.</li>
                                            <li><strong className="text-white font-medium">Fine-grained token (optional)</strong> — Choose "Public Repositories (read-only)" with zero extra permissions.</li>
                                        </ul>
                                    </li>
                                    <li>Scroll to the bottom and click <strong className="text-white font-medium">Generate token</strong>.</li>
                                    <li>Copy your token (<code className="bg-white/10 px-1 py-0.5 rounded font-mono text-white">ghp_...</code>) and paste it into the field above.</li>
                                </ol>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
};

export default Header;

