import React from 'react';
import iconGrid from '../../../assets/icon-grid.png';

const RepoCTA = ({ onNavigate }) => {
    return (
        <div className="w-full flex justify-center py-8 z-10 relative">
            <button
                onClick={() => onNavigate('dashboard')}
                className="group flex items-center justify-center gap-2 rounded-full
                    bg-gradient-to-r from-[#238636] to-[#2ea043] text-white font-bold 
                    px-8 py-3 text-lg
                    shadow-[0_4px_12px_rgba(46,160,67,0.3)] 
                    border border-[#3fb950]/50
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-[0_8px_20px_rgba(46,160,67,0.4)] hover:-translate-y-0.5
                    active:scale-98
                    focus:outline-none focus:ring-2 focus:ring-[#3fb950] focus:ring-offset-2 focus:ring-offset-[#0D1117]
                    overflow-hidden"
                aria-label="Explore Trending Repositories"
            >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                {/* Icon & Text */}
                <div className="relative z-20 flex items-center gap-3">
                    <img
                        src={iconGrid}
                        alt=""
                        className="w-5 h-5 object-contain opacity-90 group-hover:opacity-100"
                    />
                    <span className="leading-none tracking-wide text-shadow-sm">Explore Repo</span>
                </div>
            </button>
        </div>
    );
};

export default RepoCTA;
