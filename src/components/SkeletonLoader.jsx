import React from 'react';
// import { motion } from 'framer-motion';

const SkeletonBase = ({ className }) => (
    <div
        // initial={{ opacity: 0.5 }}
        // animate={{ opacity: [0.5, 1, 0.5] }}
        // transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`bg-slate-800/50 rounded-lg ${className}`}
    />
);

export const SkeletonCard = () => (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
            <SkeletonBase className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <SkeletonBase className="h-4 w-24 mb-2" />
                <SkeletonBase className="h-3 w-16" />
            </div>
        </div>
        <SkeletonBase className="h-4 w-full mb-2" />
        <SkeletonBase className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-700/50">
            <SkeletonBase className="h-4 w-12" />
            <SkeletonBase className="h-4 w-12" />
            <SkeletonBase className="h-4 w-16 ml-auto" />
        </div>
    </div>
);

export const SkeletonProfile = () => (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#0D1117] border border-slate-800 rounded-xl p-6 mb-6">
        <SkeletonBase className="w-24 h-24 rounded-full" />
        <div className="flex-1 w-full">
            <SkeletonBase className="h-8 w-48 mb-2" />
            <SkeletonBase className="h-5 w-32 mb-4" />
            <div className="flex gap-4 mb-4">
                <SkeletonBase className="h-4 w-24" />
                <SkeletonBase className="h-4 w-24" />
                <SkeletonBase className="h-4 w-24" />
            </div>
            <SkeletonBase className="h-16 w-full max-w-2xl" />
        </div>
    </div>
);

export const SkeletonHeatmap = () => (
    <div className="p-6 bg-[#0D1117] rounded-xl border border-slate-800 shadow-xl">
        <SkeletonBase className="h-6 w-48 mb-6" />
        <div className="flex gap-1 overflow-hidden">
            {[...Array(53)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                    {[...Array(7)].map((_, j) => (
                        <SkeletonBase key={j} className="w-[10px] h-[10px] rounded-[2px]" />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export default SkeletonBase;
