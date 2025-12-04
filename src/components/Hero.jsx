import React from 'react';
import { MdArrowForward, MdStar, MdTrendingUp, MdDescription, MdSync, MdExplore, MdSpaceDashboard } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import iconDiamonds from '../assets/icon-diamonds.png';
import iconCompass from '../assets/icon-compass.png';
import iconGrid from '../assets/icon-grid.png';
import iconLayers from '../assets/icon-layers.png';
import iconSync from '../assets/icon-sync.png';
import iconSShape from '../assets/icon-s-shape.png';

const Hero = ({ onExplore }) => {
    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#0D1117]">
            {/* Video Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute inset-0 bg-[#0D1117]/60 z-10" /> {/* Darker overlay for better text contrast */}

                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => console.error("Video load error:", e)}
                >
                    <source src="/hero-background.webm" type="video/webm" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-5xl mx-auto space-y-8 mt-10">
                {/* Animated Badge */}
                <div className="relative inline-flex group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative inline-flex p-[1px] overflow-hidden rounded-full">
                        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0D1117_0%,#0D1117_50%,#FF8800_100%)]" />
                        <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D1117] text-sm font-medium text-slate-300 backdrop-blur-3xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            The Modern Way to Explore GitHub
                        </div>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#F0F6FC] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-xl font-sans">
                    Git<span className="text-[#58A6FF] relative inline-block">
                        Explorer
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#58A6FF] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </span> v2.0
                </h1>

                <p className="text-xl md:text-2xl text-[#8B949E] max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light">
                    Uncover <span className="text-[#F0F6FC] font-medium">trending repositories</span> and gain <span className="text-[#F0F6FC] font-medium">deep insights</span> into the open-source ecosystem.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <button
                        onClick={onExplore}
                        className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#238636] to-[#2ea043] text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(46,160,67,0.4)] border border-[#3fb950] flex items-center gap-2"
                    >
                        <MdSpaceDashboard className="w-5 h-5" />
                        Start Exploring
                    </button>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-full bg-[#161B22] text-[#F0F6FC] border border-[#30363D] hover:bg-[#1C2128] transition-all hover:border-[#8B949E] font-medium text-lg flex items-center gap-2"
                    >
                        <FaGithub className="w-5 h-5" />
                        Star on GitHub
                    </a>
                </div>
            </div>

            {/* Seamless Marquee */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden py-8 bg-[#0D1117]/90 backdrop-blur-md border-t border-white/5 z-30 group/marquee">
                <div className="flex w-full">
                    <div className="flex animate-marquee min-w-full shrink-0 justify-around items-center gap-12 px-6 group-hover/marquee:[animation-play-state:paused]">
                        <MarqueeContent />
                    </div>
                    <div className="flex animate-marquee min-w-full shrink-0 justify-around items-center gap-12 px-6 group-hover/marquee:[animation-play-state:paused]" aria-hidden="true">
                        <MarqueeContent />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
            `}</style>
        </div>
    );
};

const MarqueeContent = () => (
    <>
        <div className="flex items-center gap-4 group/item cursor-default transition-opacity hover:opacity-100 opacity-70">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover/item:border-amber-500/40 transition-colors">
                <img src={iconDiamonds} alt="Discover" className="w-6 h-6 object-contain opacity-80 group-hover/item:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold text-slate-300 tracking-tight group-hover/item:text-white transition-colors">
                Trend Analysis
            </span>
        </div>

        <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-8" />

        <div className="flex items-center gap-4 group/item cursor-default transition-opacity hover:opacity-100 opacity-70">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover/item:border-blue-500/40 transition-colors">
                <img src={iconGrid} alt="Analyze" className="w-6 h-6 object-contain opacity-80 group-hover/item:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold text-slate-300 tracking-tight group-hover/item:text-white transition-colors">
                Growth Metrics
            </span>
        </div>

        <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-8" />

        <div className="flex items-center gap-4 group/item cursor-default transition-opacity hover:opacity-100 opacity-70">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover/item:border-purple-500/40 transition-colors">
                <img src={iconLayers} alt="Explore" className="w-6 h-6 object-contain opacity-80 group-hover/item:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold text-slate-300 tracking-tight group-hover/item:text-white transition-colors">
                Ecosystem Mapping
            </span>
        </div>

        <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-8" />

        <div className="flex items-center gap-4 group/item cursor-default transition-opacity hover:opacity-100 opacity-70">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover/item:border-emerald-500/40 transition-colors">
                <img src={iconSync} alt="Sync" className="w-6 h-6 object-contain opacity-80 group-hover/item:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold text-slate-300 tracking-tight group-hover/item:text-white transition-colors">
                Real-time Sync
            </span>
        </div>

        <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-8" />

        <div className="flex items-center gap-4 group/item cursor-default transition-opacity hover:opacity-100 opacity-70">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 group-hover/item:border-pink-500/40 transition-colors">
                <img src={iconSShape} alt="Docs" className="w-6 h-6 object-contain opacity-80 group-hover/item:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold text-slate-300 tracking-tight group-hover/item:text-white transition-colors">
                Technical Guides
            </span>
        </div>
    </>
);

export default Hero;
