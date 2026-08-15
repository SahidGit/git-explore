import React from 'react';
import { ShieldCheck, Activity, CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';
import { calculateRepoHealth } from '../../../services/healthService';

const RepoHealthScorecard = ({ repo, details, activity, issueStats }) => {
    const health = calculateRepoHealth(repo, details, activity, issueStats);

    const pillars = [
        { name: 'License & Security', score: health.licenseScore, max: 25, color: '#10B981' },
        { name: 'Commit Rhythm', score: health.commitScore, max: 25, color: '#6366F1' },
        { name: 'Issue Resolution', score: health.issueScore, max: 25, color: '#EC4899' },
        { name: 'Community Signal', score: health.communityScore, max: 25, color: '#F59E0B' },
    ];

    return (
        <div className="rounded-xl border border-white/10 bg-[#0A0A0C] p-4 sm:p-5 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white">
                        Open Source Health &amp; Security Scorecard
                    </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded">
                    AUTOMATED AUDIT
                </span>
            </div>

            {/* Main Score Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Left: Grade Circle */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-1">
                    <div
                        className="w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-lg relative"
                        style={{ borderColor: health.color, backgroundColor: `${health.color}15` }}
                    >
                        <span className="text-2xl font-extrabold font-space" style={{ color: health.color }}>
                            {health.grade}
                        </span>
                    </div>
                    <div className="pt-2">
                        <span className="text-xl font-bold font-mono text-white">{health.totalScore}</span>
                        <span className="text-xs font-mono text-zinc-500"> / 100</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                        Overall Health Index
                    </span>
                </div>

                {/* Right: 4 Pillar Sub-Scores */}
                <div className="sm:col-span-8 space-y-2.5">
                    {pillars.map((p) => (
                        <div key={p.name} className="space-y-1 font-mono text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-zinc-300">{p.name}</span>
                                <span className="text-white font-bold">{p.score} / {p.max}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(p.score / p.max) * 100}%`,
                                        backgroundColor: p.color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Audit Findings Checklist */}
            <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-semibold">
                    AUDIT FINDINGS &amp; TRANSPARENCY
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {health.findings.map((finding, idx) => (
                        <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300"
                        >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{finding}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RepoHealthScorecard;
