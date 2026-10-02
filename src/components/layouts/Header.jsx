import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Key, X, ArrowLeft, Home, AlertTriangle, AlertCircle, HelpCircle, ExternalLink,
    Check, Trash2, Loader2, ShieldCheck, User, ChevronDown, ChevronUp, CheckCircle2,
    Compass, BarChart2, Bookmark, Terminal, Sparkles, UserCheck
} from 'lucide-react';
import AnnouncementBar from '../ui/AnnouncementBar';
import { useAuth } from '../../context/AuthContext';

const Header = ({ activeTab, showBackButton, theme = 'dark' }) => {
    const location = useLocation();
    const {
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
    const isHomePage = location.pathname === '/';
    const shouldShowBackButton = showBackButton !== undefined ? showBackButton : !isHomePage;

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

    // Primary desktop navigation tabs
    const navLinks = [
        { label: 'Dashboard', to: '/dashboard', tab: 'dashboard' },
        { label: 'Languages', to: '/languages', tab: 'languages' },
        { label: 'Bookmarks', to: '/bookmarks', tab: 'bookmarks' },
        { label: 'Profile', to: '/profile', tab: 'profile' },
        { label: 'Git Cheat Sheet', to: '/cheatsheet', tab: 'cheatsheet' },
        { label: 'AI Newsroom', to: '/ai-news', tab: 'ai-news' },
    ];

    // Structured mobile navigation categorized by developer use-cases
    const mobileNavSections = [
        {
            sectionTitle: 'Core Discovery',
            items: [
                {
                    label: 'Explore Repositories',
                    to: '/dashboard',
                    tab: 'dashboard',
                    tag: 'Live Feed',
                    tagStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    icon: Compass,
                },
                {
                    label: 'Trending Languages',
                    to: '/languages',
                    tab: 'languages',
                    tag: 'Analytics',
                    tagStyle: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                    icon: BarChart2,
                },
                {
                    label: 'Saved Bookmarks',
                    to: '/bookmarks',
                    tab: 'bookmarks',
                    tag: 'Saved',
                    tagStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    icon: Bookmark,
                },
            ],
        },
        {
            sectionTitle: 'Developer Intelligence & Tools',
            items: [
                {
                    label: 'Developer Profile',
                    to: '/profile',
                    tab: 'profile',
                    tag: isConnected && user ? `@${user.login}` : 'Heatmap & Stats',
                    tagStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                    icon: isConnected && user ? UserCheck : User,
                },
                {
                    label: 'AI Newsroom',
                    to: '/ai-news',
                    tab: 'ai-news',
                    tag: 'Frontier AI',
                    tagStyle: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                    icon: Sparkles,
                },
                {
                    label: 'Git Cheat Sheet',
                    to: '/cheatsheet',
                    tab: 'cheatsheet',
                    tag: 'Reference',
                    tagStyle: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25',
                    icon: Terminal,
                },
            ],
        },
    ];

    const isCurrentTab = (targetTab) => {
        if (targetTab === 'dashboard' && (activeTab === 'dashboard' || activeTab === 'explore')) return true;
        return activeTab === targetTab;
    };

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
                            ? 'bg-white/80 backdrop-blur-md border-b border-black/[0.08] shadow-xs'
                            : 'bg-[#0A0A0C]/85 backdrop-blur-md border-b border-white/[0.08] shadow-sm'
                        : 'bg-transparent backdrop-blur-none border-b border-transparent'
                }`}
            >
                <AnnouncementBar />
                <div
                    className={`w-full flex h-16 items-center justify-between px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] mx-auto max-w-[1280px] bg-transparent ${
                        isLight
                            ? 'text-zinc-950 [text-shadow:none] [&_:focus-visible]:outline-zinc-950/90'
                            : 'text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.35)] [&_:focus-visible]:outline-white/90'
                    }`}
                >

                    {/* Left Slot: Branding + Back Button */}
                    <div className="flex items-center justify-self-start gap-3 min-w-0">
                        <Link 
                            to="/" 
                            className="w-fit shrink-0 rounded-sm hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus flex items-center gap-2.5 transition-opacity" 
                            aria-label="ExploreGit home"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105 shrink-0">
                                <picture className="w-full h-full flex items-center justify-center">
                                    <source srcSet="/favicon.avif" type="image/avif" />
                                    <source srcSet="/favicon.webp" type="image/webp" />
                                    <img
                                        src="/favicon.png"
                                        alt="ExploreGit Logo"
                                        className="w-full h-full object-contain rounded-lg"
                                        width={36}
                                        height={36}
                                        loading="eager"
                                    />
                                </picture>
                            </div>
                            <span
                                className={`font-bold text-base sm:text-lg tracking-tight font-sans transition-colors ${
                                    isLight
                                        ? 'text-zinc-950'
                                        : 'text-white'
                                }`}
                            >
                                ExploreGit
                            </span>
                        </Link>

                        {shouldShowBackButton && (
                            <Link
                                to="/"
                                className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-normal font-sans bg-white/80 hover:bg-white active:bg-white/90 text-[#121215] border border-white/10 hover:border-white/20 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_-1px_rgb(0_0_0/0.06)] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08)] transition-all focus:outline-2 focus:-outline-offset-2 focus-visible:outline-focus [text-shadow:none] cursor-pointer"
                                aria-label="Back to Home"
                                title="Back to Home"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 text-[#121215] shrink-0" />
                                <span className="font-sans font-normal text-xs text-[#121215]">Home</span>
                            </Link>
                        )}
                    </div>

                    {/* Middle Slot: Entire.io Style Desktop Navigation */}
                    <nav
                        className="hidden md:flex items-center gap-1.5 lg:gap-2 justify-center"
                        aria-label="Primary navigation"
                    >
                        {navLinks.map(({ label, to, tab }) => {
                            const isActive = isCurrentTab(tab);
                            return (
                                <Link
                                    key={tab}
                                    to={to}
                                    className={`flex h-8 items-center rounded-lg px-2.5 py-1 text-sm font-sans transition-colors focus:outline-2 focus:-outline-offset-2 focus:outline-transparent focus:transition-none focus-visible:outline-focus ${
                                        isActive
                                            ? isLight
                                                ? 'bg-black/10 text-zinc-950 font-semibold shadow-xs'
                                                : 'bg-white/15 text-white font-medium [text-shadow:none]'
                                            : isLight
                                                ? 'text-zinc-600 hover:bg-black/5 hover:text-zinc-950'
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Slot: Entire.io Style Action Buttons & Mobile Trigger */}
                    <div className="flex items-center justify-end gap-2 justify-self-end">
                        {isConnected && user ? (
                            <button
                                id="connect-token-btn"
                                onClick={handleOpenModal}
                                aria-label="Manage GitHub Token"
                                className={`hidden sm:flex items-center justify-center rounded-lg font-medium transition-colors duration-150 cursor-pointer h-8 text-sm px-3 gap-2 border focus:outline-2 focus:-outline-offset-2 focus-visible:outline-focus [text-shadow:none] ${
                                    isLight
                                        ? 'bg-white hover:bg-neutral-50 border-black/10 text-zinc-900 shadow-xs'
                                        : 'bg-transparent hover:bg-white/[0.08] border-white/15 hover:border-white/30 text-white shadow-xs'
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
                                    <User className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                                <span className="font-semibold text-xs font-mono">@{user.login}</span>
                            </button>
                        ) : (
                            <button
                                id="connect-token-btn"
                                onClick={handleOpenModal}
                                aria-label="Connect GitHub Token"
                                className="hidden sm:flex items-center justify-center rounded-lg font-medium transition-colors duration-150 cursor-pointer h-8 text-sm px-3 bg-white text-[#121215] hover:bg-neutral-100 active:bg-neutral-200 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_-1px_rgb(0_0_0/0.06),0_2px_4px_rgb(0_0_0/0.04)] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_1px_2px_-1px_rgb(0_0_0/0.4),0_2px_4px_rgb(0_0_0/0.3)] gap-1.5 focus:outline-2 focus:-outline-offset-2 focus-visible:outline-focus [text-shadow:none]"
                            >
                                <Key className="w-3.5 h-3.5 text-[#121215]" />
                                <span className="font-sans text-xs">Connect Token</span>
                            </button>
                        )}

                        {/* Mobile Hamburger Trigger styled like Entire.io menu button */}
                        <button
                            id="mobile-menu-btn"
                            type="button"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu-overlay"
                            className="shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_-1px_rgb(0_0_0/0.06),0_2px_4px_rgb(0_0_0/0.04)] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_1px_2px_-1px_rgb(0_0_0/0.4),0_2px_4px_rgb(0_0_0/0.3)] bg-white text-[#121215] [text-shadow:none] hover:bg-neutral-100 active:bg-neutral-200 flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors focus:outline-2 focus:-outline-offset-2 focus:outline-transparent focus:transition-none focus-visible:outline-focus md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-4 h-4 text-[#121215]" />
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#121215]" aria-hidden="true">
                                    <path d="M1.75 4H18.2452M1.75 16H10.25M1.75239 10H18.2476" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Hamburger Navigation Overlay — Entire.io Exact Style */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu-overlay"
                    className="fixed inset-0 z-50 bg-[#101012] md:hidden flex flex-col w-screen h-screen overflow-hidden animate-fadeIn font-sans selection:bg-white/20 selection:text-white"
                >
                    {/* Top Header Bar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-white/[0.08] shrink-0">
                        
                        {/* Left Slot: Logo + Brand */}
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 active:scale-95 transition-opacity hover:opacity-85"
                            aria-label="ExploreGit home"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                <picture className="w-full h-full flex items-center justify-center">
                                    <source srcSet="/favicon.avif" type="image/avif" />
                                    <source srcSet="/favicon.webp" type="image/webp" />
                                    <img
                                        src="/favicon.png"
                                        alt="ExploreGit Logo"
                                        className="w-full h-full object-contain rounded-lg"
                                        width={32}
                                        height={32}
                                    />
                                </picture>
                            </div>
                            <span className="text-lg font-bold text-white font-sans tracking-tight">
                                ExploreGit
                            </span>
                        </Link>

                        {/* Right Slot: Connect Button + Close X Button */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleOpenModal();
                                }}
                                aria-label="Connect GitHub Token"
                                className="flex items-center gap-1.5 justify-center rounded-lg bg-white px-3 h-8 text-sm font-semibold text-[#121215] hover:bg-neutral-100 active:bg-neutral-200 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_-1px_rgb(0_0_0/0.06),0_2px_4px_rgb(0_0_0/0.04)] cursor-pointer transition-colors"
                            >
                                <Key className="w-3.5 h-3.5 text-[#121215] shrink-0" />
                                <span>{isConnected && user ? `@${user.login}` : 'Connect'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close menu"
                                className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-[#121215] hover:bg-neutral-100 active:bg-neutral-200 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_-1px_rgb(0_0_0/0.06),0_2px_4px_rgb(0_0_0/0.04)] transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#121215]" aria-hidden="true">
                                    <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Clean Left-Aligned Links List (Entire.io Design) */}
                    <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
                        {[
                            { label: 'Dashboard', to: '/dashboard', tab: 'dashboard' },
                            { label: 'Languages', to: '/languages', tab: 'languages' },
                            { label: 'Bookmarks', to: '/bookmarks', tab: 'bookmarks' },
                            { label: 'Profile', to: '/profile', tab: 'profile' },
                            { label: 'Git Cheat Sheet', to: '/cheatsheet', tab: 'cheatsheet' },
                            { label: 'AI Newsroom', to: '/ai-news', tab: 'ai-news' },
                            { label: 'Report Issue', to: '/report', tab: 'report' },
                        ].map(({ label, to, tab }) => {
                            const isActive = isCurrentTab(tab);
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-[17px] sm:text-lg font-bold font-sans transition-colors focus:outline-none ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-white/90 hover:text-white/60'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
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

