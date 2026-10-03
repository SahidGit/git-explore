import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowRight, X } from 'lucide-react';

const AnnouncementBar = () => {
    const [visible, setVisible] = useState(true);
    const [formattedDate, setFormattedDate] = useState('Saturday, 3 October 2026');

    useEffect(() => {
        const dismissed = sessionStorage.getItem('ai_newsroom_banner_dismissed');
        if (dismissed === 'true') {
            setVisible(false);
        }

        try {
            const today = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            setFormattedDate(today.toLocaleDateString('en-US', options));
        } catch {
            // fallback stays
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
        <div className="masthead-bar">
            <div className="mx-auto w-full max-w-[1280px] flex items-center justify-between gap-4">
                <Link
                    to="/ai-news"
                    className="flex items-center gap-2 hover:text-[#C19EDB] transition-colors group truncate text-[11px] sm:text-xs"
                >
                    <span className="live-tag">
                        <Radio className="w-3 h-3 text-[#C19EDB] animate-pulse" />
                        Coming Soon
                    </span>
                    <span className="truncate text-zinc-200 group-hover:text-white transition-colors font-medium">
                        Ai NewsRoom — Get Every AI News Updated &nbsp;|&nbsp; Super Intelligence 2026
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#C19EDB] group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:inline-block" />
                </Link>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="masthead-date-lang hidden md:block">
                        <span id="today-date">{formattedDate}</span>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                        title="Dismiss announcement"
                        aria-label="Dismiss announcement"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBar;
