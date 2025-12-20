import React from 'react';
import { FaSync, FaLock, FaLayerGroup, FaCompass, FaChartLine, FaFilter, FaGithub } from 'react-icons/fa';

import iconSShape from '../../assets/icon-s-shape.png';
import iconGrid from '../../assets/icon-grid.png';
import iconLayers from '../../assets/icon-layers.png';
import iconCompass from '../../assets/icon-compass.png';
import iconDiamonds from '../../assets/icon-diamonds.png';
import iconSync from '../../assets/icon-sync.png';

const GithubSyncSection = () => {
    const features = [
        {
            icon: <img src={iconSShape} alt="Trending Discovery" className="w-8 h-8 object-contain" />,
            title: "Trending Discovery",
            description: "Stay ahead of the curve with real-time access to GitHub's trending repositories."
        },
        {
            icon: <img src={iconGrid} alt="Developer Insights" className="w-8 h-8 object-contain" />,
            title: "Developer Insights",
            description: "Deep dive into the contribution history of open source pioneers and rising stars."
        },
        {
            icon: <img src={iconLayers} alt="Technology Stacks" className="w-8 h-8 object-contain" />,
            title: "Technology Stacks",
            description: "Visual breakdown of languages and frameworks powering every project."
        },
        {
            icon: <img src={iconCompass} alt="Smart Bookmarking" className="w-8 h-8 object-contain" />,
            title: "Smart Bookmarking",
            description: "Save and organize your favorite repositories for quick access anytime."
        },
        {
            icon: <img src={iconDiamonds} alt="Visual Analytics" className="w-8 h-8 object-contain" />,
            title: "Visual Analytics",
            description: "Beautiful charts and heatmaps to understand code contributions instantly."
        },
        {
            icon: <img src={iconSync} alt="Seamless Navigation" className="w-8 h-8 object-contain" />,
            title: "Seamless Navigation",
            description: "Direct access to repository details and code without leaving the interface."
        }
    ];

    return (
        <section className="bg-[#0D1117] py-24 relative overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Explore Open Source. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Uncover Hidden Gems.</span>
                    </h2>
                    <p className="text-lg text-[#8B949E] leading-relaxed">
                        Experience a unified workflow. GitExplorer acts as a high-performance interface for GitHub data, ensuring you discover, analyze, and bookmark projects seamlessly.
                    </p>
                </div>

                {/* Visual Demonstration */}
                <div className="mb-24 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {/* Huly Flowing Glow Container */}
                    <div className="huly-glow rounded-xl">
                        <div className="relative bg-[#161B22] rounded-xl overflow-hidden shadow-2xl">
                            {/* Mock Browser Header */}
                            <div className="bg-[#0D1117] border-b border-[#30363D] p-4 flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                                </div>
                                <div className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-1 text-xs text-[#8B949E] flex items-center justify-between">
                                    <span>acme-project / database-api</span>
                                    <FaGithub />
                                </div>
                            </div>

                            {/* Mock Content */}
                            <div className="p-6 space-y-4">
                                {[
                                    { title: "Feature Request: Document analysis", tag: "bug", tagColor: "bg-red-900/30 text-red-400 border-red-900", time: "opened 1 minute ago by sonnikov" },
                                    { title: "Store markup as ProseMirror JSON instead of HTML", tag: "enhancement", tagColor: "bg-blue-900/30 text-blue-400 border-blue-900", time: "opened 2 hours ago by sonnikov" },
                                    { title: "Improve inbox grouping", tag: "enhancement", tagColor: "bg-blue-900/30 text-blue-400 border-blue-900", time: "opened 2 hours ago by sonnikov" },
                                    { title: "Storage adapter configuration", tag: "enhancement", tagColor: "bg-blue-900/30 text-blue-400 border-blue-900", time: "opened 13 hours ago by helodo" },
                                    { title: "Enforce translation rules for asset plugins", tag: "enhancement", tagColor: "bg-blue-900/30 text-blue-400 border-blue-900", time: "opened 12 hours ago by helodo" },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-3 hover:bg-[#21262D] rounded-lg transition-colors group cursor-default border border-transparent hover:border-[#30363D]">
                                        <div className="mt-1">
                                            <div className="w-4 h-4 rounded border border-[#30363D] group-hover:border-[#58A6FF] transition-colors"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[#F0F6FC] font-medium text-sm">{item.title}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                                                    {item.tag}
                                                </span>
                                            </div>
                                            <div className="text-xs text-[#8B949E]">{item.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        {features.map((feature, index) => (
                            <div key={index} className="group">
                                <div className="mb-4 inline-block p-3 rounded-lg bg-[#161B22] border border-[#30363D] group-hover:border-[#58A6FF]/50 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#F0F6FC] mb-2 group-hover:text-[#58A6FF] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-[#8B949E] text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GithubSyncSection;
