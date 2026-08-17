import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Github, Key, X, ArrowLeft, AlertTriangle, AlertCircle, HelpCircle, ExternalLink,
    Check, Trash2, Loader2, ShieldCheck, User, ChevronDown, ChevronUp, CheckCircle2
} from 'lucide-react';
import AnnouncementBar from '../ui/AnnouncementBar';
import { useAuth } from '../../context/AuthContext';

const Header = ({ activeTab, showBackButton }) => {
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

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
        { label: 'AI Newsroom', to: '/ai-news', tab: 'ai-news' },
        { label: 'Git Cheat Sheet', to: '/cheatsheet', tab: 'cheatsheet' },
        { label: 'Bookmarks', to: '/bookmarks', tab: 'bookmarks' },
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
            {/* Top Announcement Bar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <AnnouncementBar />
            </div>

            {/* Floating Dock Header */}
            <header className="fixed top-9 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl transition-all duration-300">
                <div
                    className={`rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 ${
                        isScrolled
                            ? 'bg-[#0B0C0E]/90 backdrop-blur-2xl border border-white/15 shadow-2xl'
                            : 'bg-[#12141A]/80 backdrop-blur-xl border border-white/10 shadow-lg'
                    }`}
                >
                    <div className="flex items-center justify-between">

                        {/* Brand Capsule */}
                        <div className="flex items-center gap-3">
                            <Link to="/" className="flex items-center gap-2.5 group" aria-label="GitExplorer home">
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/15 group-hover:border-white/30 transition-all duration-200">
                                    <Github className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm font-bold text-white tracking-tight font-space">
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

                        {/* Desktop Navigation Links */}
                        <nav
                            className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.06] font-mono text-xs"
                            aria-label="Primary navigation"
                        >
                            {navLinks.map(({ label, to, tab }) => {
                                const isActive = activeTab === tab;
                                return (
                                    <Link
                                        key={tab}
                                        to={to}
                                        className={`px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-white text-black font-extrabold shadow-sm'
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
                                        ? 'bg-white text-black font-extrabold shadow-sm'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                Profile
                            </Link>
                        </nav>

                        {/* Desktop Right Action CTA Button (Connected vs Disconnected) */}
                        <div className="hidden md:flex items-center gap-2 font-mono text-xs">
                            {isConnected && user ? (
                                <button
                                    id="connect-token-btn"
                                    onClick={handleOpenModal}
                                    aria-label="Manage GitHub Token"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-white hover:bg-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                    </span>
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.login}
                                            className="w-4 h-4 rounded-full border border-white/20"
                                        />
                                    ) : (
                                        <User className="w-3.5 h-3.5 text-emerald-400" />
                                    )}
                                    <span className="font-bold text-xs">@{user.login}</span>
                                </button>
                            ) : (
                                <button
                                    id="connect-token-btn"
                                    onClick={handleOpenModal}
                                    aria-label="Connect GitHub Token"
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black font-extrabold hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <Key className="w-3.5 h-3.5 text-black" />
                                    <span>Connect Token</span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Hamburger Trigger */}
                        <button
                            id="mobile-menu-btn"
                            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.05] border border-white/15 text-white hover:border-white/30 active:scale-95 transition-all cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle mobile menu"
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

            {/* Mobile Hamburger Navigation Overlay (Full-screen Drawer) */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu-overlay"
                    className="fixed inset-0 z-50 bg-[#0D0E11] md:hidden flex flex-col w-screen h-screen overflow-hidden animate-fadeIn"
                >
                    {/* Header & Action Bar Architecture */}
                    <div className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-white/[0.08] bg-[#0D0E11] shrink-0">
                        
                        {/* Left Slot: Branding */}
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2.5"
                            aria-label="GitExplorer mobile home link"
                        >
                            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                                <Github className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-base font-bold text-white font-space tracking-tight">
                                GitExplorer
                            </span>
                        </Link>

                        {/* Right Slot: Mini-CTA Button & Close Trigger */}
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleOpenModal();
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold text-xs transition-colors hover:bg-[#E4E4E7] cursor-pointer flex items-center gap-1.5"
                            >
                                <Key className="w-3 h-3 text-black" />
                                <span>{isConnected ? `@${user?.login || 'user'}` : 'Connect Token'}</span>
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close mobile menu"
                                className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/15 flex items-center justify-center text-white hover:border-white/30 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links Vertical Stack */}
                    <nav className="flex-1 overflow-y-auto pt-8 px-6 flex flex-col justify-between pb-10 space-y-8">
                        <div className="flex flex-col space-y-6">
                            {navLinks.map(({ label, to, tab }) => {
                                const isActive = activeTab === tab;
                                return (
                                    <Link
                                        key={tab}
                                        to={to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-xl font-semibold transition-colors duration-150 flex items-center justify-between border-b border-white/[0.04] pb-4 ${
                                            isActive
                                                ? 'text-white font-extrabold text-2xl'
                                                : 'text-white hover:text-zinc-300'
                                        }`}
                                    >
                                        <span>{label}</span>
                                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                                    </Link>
                                );
                            })}
                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-xl font-semibold transition-colors duration-150 flex items-center justify-between border-b border-white/[0.04] pb-4 ${
                                    activeTab === 'profile'
                                        ? 'text-white font-extrabold text-2xl'
                                        : 'text-white hover:text-zinc-300'
                                }`}
                            >
                                <span>Developer Profile</span>
                                {activeTab === 'profile' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                            </Link>
                        </div>

                        {/* Featured Report an Issue Pill & Bottom Metadata in Drawer */}
                        <div className="pt-6 border-t border-white/[0.08] font-mono text-xs space-y-4">
                            <Link
                                to="/report"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span className="font-bold text-xs">Report an Issue / Feedback</span>
                                </div>
                                <span className="text-[11px] font-bold text-amber-400/80">↗</span>
                            </Link>

                            <div className="space-y-1.5 text-zinc-500">
                                <div className="flex items-center justify-between">
                                    <span>GitExplorer Intelligence Layer</span>
                                    <span className="text-emerald-400 font-bold">&bull; Live</span>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="w-full max-w-lg bg-[#12141A] border border-white/15 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-indigo-400" />
                                <h3 className="text-sm font-bold text-white font-space">GitHub Token Configuration</h3>
                            </div>
                            <button
                                onClick={() => setShowTokenModal(false)}
                                className="p-1 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Status Quota Card */}
                        <div className="p-4 rounded-xl border border-white/10 bg-[#0B0C0E] space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400 font-sans">Connection Status:</span>
                                {isConnected && user ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5 text-[11px]">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        Connected as @{user.login}
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px]">
                                        Anonymous Mode (60 req/hr)
                                    </span>
                                )}
                            </div>

                            {rateLimit && (
                                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                                    <span className="text-zinc-400 font-sans">API Quota Limit:</span>
                                    <span className="text-white font-bold">
                                        {rateLimit.remaining} / {rateLimit.limit} req/hr
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                            Connecting a GitHub Personal Access Token (PAT) upgrades API rate limits from 60 to <strong className="text-white">5,000 requests/hour</strong>. Tokens are stored 100% locally in your browser and are never transmitted to third-party servers.
                        </p>

                        {/* Success Banner */}
                        {localSuccess && (
                            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-2 text-xs font-mono">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Connected Successfully! Token saved locally.</span>
                            </div>
                        )}

                        {/* Error / Failure Banner */}
                        {(localError || tokenError) && !localSuccess && (
                            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 space-y-1.5 text-xs font-mono">
                                <div className="flex items-center gap-2 font-bold">
                                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span>{localError || tokenError}</span>
                                </div>
                                <p className="text-[11px] font-sans text-rose-200">
                                    Please verify your token credentials or check the generation guide below to create a classic PAT with <code className="bg-black/30 px-1 py-0.5 rounded">public_repo</code> scopes.
                                </p>
                            </div>
                        )}

                        {/* Token Input Form */}
                        <form onSubmit={handleConnectSubmit} className="space-y-3">
                            <div>
                                <label htmlFor="pat-input" className="block text-[11px] font-mono text-zinc-400 mb-1.5">
                                    Personal Access Token (classic or fine-grained)
                                </label>
                                <input
                                    id="pat-input"
                                    type="password"
                                    value={inputToken}
                                    onChange={(e) => setInputToken(e.target.value)}
                                    placeholder={isConnected ? "••••••••••••••••••••••••••••" : "ghp_your_personal_access_token..."}
                                    className="w-full bg-[#0B0C0E] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowGuide(!showGuide)}
                                    className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                                >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>How to generate a token?</span>
                                    {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                <div className="flex items-center gap-2">
                                    {isConnected && (
                                        <button
                                            type="button"
                                            onClick={handleDisconnect}
                                            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-rose-400 transition-colors font-mono"
                                        >
                                            Disconnect
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isVerifying}
                                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Verifying...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
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
                                    <span className="font-bold text-white font-mono flex items-center gap-1.5 text-[11px]">
                                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                                        Step-by-Step GitHub PAT Setup Guide
                                    </span>
                                    <a
                                        href="https://github.com/settings/tokens/new?scopes=public_repo,read:user&description=GitExplorer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                    >
                                        <span>Open GitHub Setup ↗</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                <ol className="space-y-2 list-decimal list-inside text-zinc-300 leading-relaxed">
                                    <li>
                                        Navigate to{' '}
                                        <a
                                            href="https://github.com/settings/tokens/new?scopes=public_repo,read:user&description=GitExplorer"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-300 underline font-mono"
                                        >
                                            GitHub Settings → Personal access tokens → Tokens (classic)
                                        </a>.
                                    </li>
                                    <li>Set Note to <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-white">GitExplorer</code>.</li>
                                    <li>
                                        Select recommended scopes:
                                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1 font-mono text-[11px] text-zinc-400">
                                            <li><strong className="text-white">public_repo</strong> — Access public repositories and momentum signals</li>
                                            <li><strong className="text-white">read:user</strong> — Read user profile status &amp; verify credentials</li>
                                        </ul>
                                    </li>
                                    <li>Scroll to the bottom and click <strong className="text-white">Generate token</strong>.</li>
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

