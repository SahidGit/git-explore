import React, { useState, useEffect } from 'react';
import {
    X, Share2, Copy, Check, Twitter, Linkedin, MessageCircle,
    Send, Facebook, Globe, Code, Sparkles, ExternalLink
} from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';

const DEFAULT_AVATAR = 'https://github.com/github.png';

const ShareRepoModal = ({ repo, onClose }) => {
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedBadge, setCopiedBadge] = useState(false);

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!repo) return null;

    const shareUrl = repo.html_url || `https://github.com/${repo.full_name}`;
    const shareTitle = `Check out ${repo.full_name} on GitHub — ${repo.stargazers_count ? formatNumber(repo.stargazers_count) + ' stars' : 'Trending Repo'}`;

    // Social share links
    const shareLinks = [
        {
            name: '𝕏 / Twitter',
            icon: Twitter,
            color: 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/30',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
        },
        {
            name: 'Reddit',
            icon: Globe,
            color: 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border-orange-500/30',
            url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
        },
        {
            name: 'Telegram',
            icon: Send,
            color: 'bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border-sky-500/30',
            url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
    ];

    const markdownBadge = `[![${repo.full_name}](https://img.shields.io/github/stars/${repo.full_name}?style=for-the-badge&logo=github&color=0A0A0C)](${shareUrl})`;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    const handleCopyBadge = () => {
        navigator.clipboard.writeText(markdownBadge);
        setCopiedBadge(true);
        setTimeout(() => setCopiedBadge(false), 2000);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-repo-title"
        >
            <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
                
                {/* Header */}
                <div className="bg-[#0E0E10] border-b border-white/[0.08] px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-emerald-400" />
                        <h3 id="share-repo-title" className="text-sm font-mono font-bold text-white">
                            Share Repository Card
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                        title="Close modal (Esc)"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 space-y-5">
                    
                    {/* ── Generated Mini Card Preview ── */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                            CARD PREVIEW
                        </span>
                        
                        <div className="rounded-xl border border-white/15 bg-[#0A0A0C] p-4 space-y-3 shadow-xl relative overflow-hidden">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                        src={repo.owner?.avatar_url || DEFAULT_AVATAR}
                                        alt={repo.owner?.login || 'owner'}
                                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                                        className="w-8 h-8 rounded-lg border border-white/10 shrink-0 bg-[#121215]"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-mono font-bold text-white truncate">
                                            {repo.full_name}
                                        </h4>
                                        <p className="text-[10px] font-mono text-zinc-500 truncate">
                                            @{repo.owner?.login}
                                        </p>
                                    </div>
                                </div>

                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold shrink-0">
                                    ★ {formatNumber(repo.stargazers_count)}
                                </span>
                            </div>

                            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                                {repo.description || 'No description available for this repository.'}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-400">
                                <span className="text-zinc-500">{repo.language || 'Code'}</span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Shared via GitExplorer
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Popular Apps Grid ── */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                            SHARE TO APPS
                        </span>
                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                            {shareLinks.map((app) => {
                                const Icon = app.icon;
                                return (
                                    <a
                                        key={app.name}
                                        href={app.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all active:scale-[0.98] ${app.color}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-3.5 h-3.5 shrink-0" />
                                            <span className="font-semibold">{app.name}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 opacity-60" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Direct URL Copy ── */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                            DIRECT LINK
                        </span>
                        <div className="flex items-center justify-between bg-[#0A0A0C] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-zinc-300">
                            <span className="truncate pr-2 text-zinc-400">{shareUrl}</span>
                            <button
                                onClick={handleCopyUrl}
                                className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-[11px] flex items-center gap-1.5 hover:bg-zinc-200 transition-colors shrink-0 cursor-pointer active:scale-[0.98]"
                            >
                                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Markdown Badge Code ── */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                            MARKDOWN BADGE CODE
                        </span>
                        <div className="flex items-center justify-between bg-[#0A0A0C] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-zinc-300">
                            <span className="truncate pr-2 text-zinc-500 font-mono text-[11px]">{markdownBadge}</span>
                            <button
                                onClick={handleCopyBadge}
                                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer active:scale-[0.98]"
                            >
                                {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                                <span>{copiedBadge ? 'Copied' : 'Badge'}</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShareRepoModal;
