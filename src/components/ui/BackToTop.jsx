import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            id="back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className={`fixed bottom-6 right-6 z-40 w-10 h-10 rounded-xl bg-[#121215]/90 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300 flex items-center justify-center shadow-2xl focus:outline-none focus:ring-1 focus:ring-white/20 ${
                isVisible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
        >
            <ArrowUp className="w-[18px] h-[18px]" strokeWidth={1.75} />
        </button>
    );
};

export default BackToTop;
