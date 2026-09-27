import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, X } from 'lucide-react';

const AnnouncementBar = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const dismissed = sessionStorage.getItem('ai_newsroom_banner_dismissed');
        if (dismissed === 'true') {
            setVisible(false);
        }
    }, []);

    const handleDismiss = (e) => {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.setItem('ai_newsroom_banner_dismissed', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="bg-[#0E0E10] border-b border-white/10 text-white text-[11px] sm:text-xs font-sans py-1.5 px-4 relative z-50 select-none shadow-sm">
            <div className="mx-auto w-full max-w-[1280px] flex items-center justify-between">
                
                {/* Center Content Link */}
                <Link
                    to="/ai-news"
                    className="mx-auto flex items-center gap-2 hover:text-emerald-300 transition-colors group truncate max-w-[90%] sm:max-w-none"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                        AI Newsroom: Open model specifications, benchmarks, and research papers
                    </span>
                    <span className="hidden sm:inline text-zinc-400 font-normal">&bull; Updated daily</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>

                {/* Dismiss Button */}
                <button
                    onClick={handleDismiss}
                    className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors shrink-0 ml-2 cursor-pointer"
                    title="Dismiss announcement"
                    aria-label="Dismiss announcement"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default AnnouncementBar;
