import React, { useState, useEffect, useRef } from 'react';
import {
    X, Copy, Check, Share2, Code2, Link2, ExternalLink,
    Twitter, Linkedin, MessageCircle, Send, Globe, Facebook, Star
} from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';

const DEFAULT_AVATAR = 'https://github.com/github.png';

const SOCIAL_PLATFORMS = [
    {
        id: 'x',
        name: 'X',
        label: 'Post on X',
        icon: Twitter,
        getUrl: (title, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        hoverColor: 'hover:bg-white/10 hover:text-white hover:border-white/30',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        label: 'Share on LinkedIn',
        icon: Linkedin,
        getUrl: (_, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        hoverColor: 'hover:bg-[#0A66C2]/20 hover:text-[#70B5F9] hover:border-[#0A66C2]/40',
    },
    {
        id: 'reddit',
        name: 'Reddit',
        label: 'Share on Reddit',
        icon: Globe,
        getUrl: (title, url) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        hoverColor: 'hover:bg-[#FF4500]/20 hover:text-[#FF7A45] hover:border-[#FF4500]/40',
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        label: 'Send via WhatsApp',
        icon: MessageCircle,
        getUrl: (title, url) => `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
        hoverColor: 'hover:bg-[#25D366]/20 hover:text-[#4AE385] hover:border-[#25D366]/40',
    },
    {
        id: 'telegram',
        name: 'Telegram',
        label: 'Send via Telegram',
        icon: Send,
        getUrl: (title, url) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        hoverColor: 'hover:bg-[#229ED9]/20 hover:text-[#5BC4F5] hover:border-[#229ED9]/40',
    },
];

const ShareRepoModal = ({ repo, onClose }) => {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);
    const [embedType, setEmbedType] = useState('markdown'); // 'markdown' | 'badge'
    const modalRef = useRef(null);

    // Escape listener & outside click handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!repo) return null;

    const shareUrl = repo.html_url || `https://github.com/${repo.full_name}`;
    const shareTitle = `Explore ${repo.full_name} (${formatNumber(repo.stargazers_count)} stars) on GitHub via ExploreGit`;
    const markdownSnippet = `[![${repo.full_name}](https://img.shields.io/github/stars/${repo.full_name}?style=for-the-badge&logo=github&color=0A0A0C)](${shareUrl})`;
    const htmlSnippet = `<a href="${shareUrl}"><img src="https://img.shields.io/github/stars/${repo.full_name}?style=for-the-badge&logo=github&color=0A0A0C" alt="${repo.full_name} stars" /></a>`;

    const activeSnippet = embedType === 'markdown' ? markdownSnippet : htmlSnippet;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyEmbed = () => {
        navigator.clipboard.writeText(activeSnippet);
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all duration-200 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-repo-title"
        >
            <div 
                ref={modalRef}
                className="w-full max-w-md bg-[#101114]/95 border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden font-sans relative backdrop-blur-xl transition-all duration-200 scale-100"
            >
                {/* Ambient top glow */}
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 pointer-events-none mix-blend-screen opacity-30"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.2) 0%, rgba(59, 130, 246, 0.1) 60%, transparent 80%)'
                    }}
                    aria-hidden="true"
                />

                {/* Header Row */}
                <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between relative z-10 bg-white/[0.02]">
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src={repo.owner?.avatar_url || DEFAULT_AVATAR}
                            alt={repo.owner?.login || 'repo owner'}
                            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                            className="w-9 h-9 rounded-xl border border-white/10 bg-[#0A0A0C] shrink-0 object-cover shadow-sm"
                            loading="lazy"
                        />
                        <div className="min-w-0">
                            <h3 id="share-repo-title" className="text-sm font-bold font-mono text-white truncate flex items-center gap-2">
                                <span>{repo.name}</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-mono font-semibold shrink-0">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    <span>{formatNumber(repo.stargazers_count)}</span>
                                </span>
                            </h3>
                            <p className="text-[11px] font-mono text-zinc-400 truncate">
                                {repo.full_name}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-zinc-400 hover:text-white border border-white/[0.08] transition-all cursor-pointer group"
                        title="Close (Esc)"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-5 relative z-10">
                    
                    {/* Primary Action: Direct URL Copy Box */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-zinc-400 font-medium uppercase tracking-wider block">
                            Repository Link
                        </label>
                        <div className="flex items-center gap-2 bg-[#090A0D] border border-white/[0.12] rounded-xl p-1.5 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all shadow-inner">
                            <div className="pl-2.5 text-zinc-500">
                                <Link2 className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-transparent text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none truncate selection:bg-white/20"
                            />
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shrink-0 cursor-pointer active:scale-95 ${
                                    copiedLink
                                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                                        : 'bg-white text-black hover:bg-zinc-200 shadow-sm'
                                }`}
                            >
                                {copiedLink ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Share Platforms Row */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono text-zinc-400 font-medium uppercase tracking-wider block">
                            Quick Share
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {SOCIAL_PLATFORMS.map((platform) => {
                                const Icon = platform.icon;
                                const url = platform.getUrl(shareTitle, shareUrl);
                                return (
                                    <a
                                        key={platform.id}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={platform.label}
                                        title={platform.label}
                                        className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-[#090A0D] border border-white/[0.08] text-zinc-300 transition-all duration-200 active:scale-95 group ${platform.hoverColor}`}
                                    >
                                        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                                        <span className="text-[10px] font-sans font-medium text-zinc-400 group-hover:text-inherit">
                                            {platform.name}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Developer Embed Snippet */}
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-mono text-zinc-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Embed Star Badge</span>
                            </label>

                            {/* Embed format toggle pills */}
                            <div className="flex items-center gap-1 bg-[#090A0D] p-0.5 rounded-lg border border-white/[0.08] text-[10px] font-mono">
                                <button
                                    type="button"
                                    onClick={() => setEmbedType('markdown')}
                                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                        embedType === 'markdown'
                                            ? 'bg-white/20 text-white font-bold'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    Markdown
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEmbedType('html')}
                                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                        embedType === 'html'
                                            ? 'bg-white/20 text-white font-bold'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    HTML
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-[#090A0D] border border-white/[0.08] rounded-xl p-2 font-mono text-xs text-zinc-400">
                            <span className="truncate pr-2 text-zinc-400 text-[11px] select-all">
                                {activeSnippet}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyEmbed}
                                className="px-2.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-zinc-200 hover:text-white font-sans text-xs font-medium flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95"
                            >
                                {copiedEmbed ? (
                                    <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400 font-semibold">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy Code</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer status bar */}
                <div className="px-5 py-2.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="truncate">ExploreGit Share Protocol</span>
                    <span className="text-zinc-600 font-sans">Press [Esc] to dismiss</span>
                </div>
            </div>
        </div>
    );
};

export default ShareRepoModal;
