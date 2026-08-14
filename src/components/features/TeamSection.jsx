import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code2, Terminal, Sparkles } from 'lucide-react';
import sahidPhoto from '../../assets/team-sahid.png';

const TeamSection = () => {
    return (
        <section
            id="team"
            className="relative bg-[#0A0A0C] py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/[0.08]"
            aria-label="Core Engineering & Leadership"
        >
            {/* Background subtle radial glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none mix-blend-screen"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <div className="mb-16 max-w-2xl">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">04</span>
                        <span className="w-6 h-px bg-white/20" />
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">Engineering & Team</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Built by engineers,
                        <br />
                        <span className="text-[#A1A1AA] font-normal">for the global open-source community.</span>
                    </h2>

                    <p className="text-base text-[#71717A] leading-relaxed max-w-lg">
                        GitExplorer is architected and maintained with a relentless focus on performance,
                        privacy, and developer ergonomics.
                    </p>
                </div>

                {/* Team member grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                    {/* Primary Member Card */}
                    <div className="md:col-span-6 lg:col-span-5 flex">
                        <div className="w-full bg-[#121215] border border-white/[0.08] rounded-2xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                {/* Portrait Container */}
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-[#0A0A0C] border border-white/10">
                                    <img
                                        src={sahidPhoto}
                                        alt="Sahid Sarfaraz - Engineering"
                                        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-[1.02]"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-60" />
                                    
                                    {/* Monospace Badge Overlay */}
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Creator & Lead
                                        </span>
                                        <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                            @SahidGit
                                        </span>
                                    </div>
                                </div>

                                {/* Identity Block */}
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
                                        SAHID SARFARAZ
                                    </h3>
                                    <p className="text-sm font-mono text-[#A1A1AA]">
                                        Engineering & Platform Architecture
                                    </p>
                                </div>

                                <p className="text-[13px] text-zinc-400 leading-relaxed mt-4">
                                    Specializing in high-performance frontend architectures, real-time data visualization,
                                    and AI-native developer tooling. Passionate about empowering engineers to navigate the open-source ecosystem with speed and precision.
                                </p>
                            </div>

                            {/* Social & Contact Strip */}
                            <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <a
                                        href="https://github.com/SahidGit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200"
                                        aria-label="Sahid Sarfaraz GitHub"
                                    >
                                        <Github className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/sahid-sarfaraz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200"
                                        aria-label="Sahid Sarfaraz LinkedIn"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="https://github.com/SahidGit/git-explorer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200"
                                        aria-label="Repository Source"
                                    >
                                        <Code2 className="w-4 h-4" />
                                    </a>
                                </div>

                                <a
                                    href="https://github.com/SahidGit"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-200"
                                >
                                    <span>Profile</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Engineering Principles & Manifesto Box */}
                    <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between gap-4">
                        {/* Principle 1 */}
                        <div className="bento-card p-6 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-zinc-400" />
                                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                                        &lt;CULTURE_CODE /&gt;
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                    ACTIVE SPRINT
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-white tracking-tight">
                                Zero Telemetry. Pure Signal.
                            </h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Every line of GitExplorer is designed with privacy as a foundational requirement.
                                No cross-site trackers, no session recording, and no server-side token retention.
                                The application queries GitHub&apos;s REST API directly from your client.
                            </p>
                        </div>

                        {/* Principle 2 */}
                        <div className="bento-card p-6 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-zinc-400" />
                                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                                        &lt;STACK_FOUNDATION /&gt;
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono text-zinc-400">
                                    v2.1 STABLE
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-white tracking-tight">
                                Modern Technical Stack
                            </h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Built with React 18, Vite, Tailwind CSS, Lucide icons, and Chart.js.
                                Engineered for sub-100ms client interactions, seamless mobile responsiveness, and high accessibility standards.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {['React 18', 'Vite', 'Tailwind CSS', 'GitHub REST API', 'Local-First Storage', 'DOMPurify'].map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[11px] text-zinc-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Principle 3 - Collaboration */}
                        <div className="bento-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="text-base font-bold text-white mb-1">
                                    Interested in collaborating?
                                </h4>
                                <p className="text-xs text-zinc-400">
                                    GitExplorer is open source. PRs, issue reports, and feature proposals are welcome.
                                </p>
                            </div>
                            <a
                                href="https://github.com/SahidGit/git-explorer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors whitespace-nowrap"
                            >
                                <Github className="w-3.5 h-3.5" />
                                Contribute on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
