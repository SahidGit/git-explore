import React, { useState, useEffect } from 'react';
import { Github, Search, Bookmark, Settings, X, Menu, ArrowLeft, ChevronDown } from 'lucide-react';

const Header = ({ activeTab, onTabChange, onTokenSave, onNavigate, showBackButton }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTokenSubmit = (e) => {
        e.preventDefault();
        onTokenSave(token);
        setShowTokenInput(false);
        setToken('');
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className={`mx-auto rounded-2xl transition-all duration-300 ${isScrolled
                            ? 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg px-6 py-3'
                            : 'bg-transparent px-0 py-2'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            {/* Left Section: Logo & Back Button */}
                            <div className="flex items-center gap-6">
                                {/* Logo */}
                                <div
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => onNavigate && onNavigate('landing')}
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                                            <Github className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <span className="text-lg font-semibold text-white tracking-tight">
                                        Git<span className="text-indigo-400">Explorer</span>
                                    </span>
                                </div>

                                {/* Back Button (Desktop) */}
                                {showBackButton && onNavigate && (
                                    <button
                                        onClick={() => onNavigate('landing')}
                                        className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-all px-3 lg:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 backdrop-blur-sm group/back"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                                        <span className="hidden lg:inline">Back to Home</span>
                                    </button>
                                )}
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm absolute left-1/2 -translate-x-1/2">
                                <button
                                    onClick={() => onTabChange('explore')}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all ${activeTab === 'explore'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Search className="w-4 h-4" />
                                    Explore
                                </button>
                                <button
                                    onClick={() => onTabChange('bookmarks')}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all ${activeTab === 'bookmarks'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Bookmark className="w-4 h-4" />
                                    Bookmarks
                                </button>
                                <button
                                    onClick={() => onTabChange('profile')}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all ${activeTab === 'profile'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {/* <User className="w-4 h-4" /> */}
                                    Profile
                                </button>
                            </nav>

                            {/* Actions */}
                            <div className="hidden md:flex items-center gap-4">
                                <button
                                    onClick={() => setShowTokenInput(!showTokenInput)}
                                    className="p-2 text-slate-400 hover:text-white transition-colors relative group"
                                    title="API Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                </button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden flex items-center justify-center w-9 h-9 p-0 text-white hover:bg-transparent transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <svg className="pointer-events-none w-[18px] h-[18px] fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <rect className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] -translate-y-[5px] translate-x-[7px]" y="7" width="9" height="2" rx="1"></rect>
                                        <rect className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] rotate-0 opacity-100" y="7" width="16" height="2" rx="1"></rect>
                                        <rect className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] translate-y-[5px]" y="7" width="9" height="2" rx="1"></rect>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-[#0D1117]/98 backdrop-blur-2xl md:hidden flex flex-col animate-in fade-in duration-300">
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
                        <span className="text-xl font-semibold text-white tracking-tight">
                            Git<span className="text-indigo-400">Explorer</span>
                        </span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10 group"
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto relative z-10">
                        {/* Main Navigation Cards */}
                        <div className="space-y-3 mb-8">
                            <button
                                onClick={() => {
                                    onTabChange('explore');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden border ${activeTab === 'explore'
                                    ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${activeTab === 'explore' ? 'opacity-100' : ''}`} />
                                <div className="relative flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${activeTab === 'explore' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'} transition-colors`}>
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-base">Explore</div>
                                        <div className="text-xs opacity-60 font-normal mt-0.5">Discover trending repos</div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 ml-auto -rotate-90 opacity-50" />
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    onTabChange('bookmarks');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden border ${activeTab === 'bookmarks'
                                    ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${activeTab === 'bookmarks' ? 'opacity-100' : ''}`} />
                                <div className="relative flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${activeTab === 'bookmarks' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'} transition-colors`}>
                                        <Bookmark className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-base">Bookmarks</div>
                                        <div className="text-xs opacity-60 font-normal mt-0.5">Your saved collections</div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 ml-auto -rotate-90 opacity-50" />
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    onTabChange('profile');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden border ${activeTab === 'profile'
                                    ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${activeTab === 'profile' ? 'opacity-100' : ''}`} />
                                <div className="relative flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${activeTab === 'profile' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'} transition-colors`}>
                                        {/* <User className="w-5 h-5" /> */}
                                        <div className="w-5 h-5 rounded-full border-2 border-current opacity-80" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-base">Profile</div>
                                        <div className="text-xs opacity-60 font-normal mt-0.5">View your stats</div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 ml-auto -rotate-90 opacity-50" />
                                </div>
                            </button>
                        </div>

                        {/* Secondary Navigation Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { label: 'Features', action: 'features' },
                                { label: 'Trending', action: 'dashboard' }
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => { onNavigate && onNavigate(item.action); setIsMobileMenuOpen(false); }}
                                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm font-normal border border-white/5 hover:border-white/10 text-center"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-auto space-y-3">
                            <button
                                onClick={() => {
                                    setShowTokenInput(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full py-3 px-6 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-normal transition-colors border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                API Settings
                            </button>

                            {onNavigate && (
                                <button
                                    onClick={() => {
                                        onNavigate('landing');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-normal transition-colors border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Home
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Token Input Modal */}
            {showTokenInput && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">GitHub API Token</h3>
                            <button onClick={() => setShowTokenInput(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">
                            Add a personal access token to increase API rate limits (5000 requests/hour).
                        </p>
                        <form onSubmit={handleTokenSubmit}>
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="ghp_..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-4 transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                Save Token
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
