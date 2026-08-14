import React, { useState, useEffect, useRef } from 'react';

// ─── Mock terminal lines ──────────────────────────────
const TERMINAL_LINES = [
    { type: 'prompt', text: '~ /git-explorer/query', delay: 0 },
    { type: 'command', text: 'curl -s https://api.github.com/repos/vercel/next.js \\', delay: 600 },
    { type: 'command-cont', text: '  -H "Accept: application/vnd.github.v3+json" | jq .', delay: 900 },
    { type: 'blank', text: '', delay: 1200 },
    { type: 'output', text: '{', delay: 1500 },
    { type: 'output-key', text: '  "name": "next.js",', delay: 1700 },
    { type: 'output-key', text: '  "full_name": "vercel/next.js",', delay: 1850 },
    { type: 'output-val', text: '  "stargazers_count": 122847,', delay: 2000 },
    { type: 'output-val', text: '  "forks_count": 26193,', delay: 2150 },
    { type: 'output-str', text: '  "language": "TypeScript",', delay: 2300 },
    { type: 'output-str', text: '  "description": "The React Framework for the Web",', delay: 2450 },
    { type: 'output-val', text: '  "open_issues_count": 2914,', delay: 2600 },
    { type: 'output-str', text: '  "topics": ["nextjs", "react", "vercel", "ssr"],', delay: 2750 },
    { type: 'output', text: '}', delay: 2900 },
];

const LINE_COLORS = {
    prompt: 'text-[#71717A]',
    command: 'text-white',
    'command-cont': 'text-[#A1A1AA]',
    blank: '',
    output: 'text-[#A1A1AA]',
    'output-key': 'text-[#7DD3FC]',   // sky-300 — JSON keys
    'output-val': 'text-[#86EFAC]',   // green-300 — numbers/booleans
    'output-str': 'text-[#FCA5A5]',   // red-300 — strings
};

// ─── Component ────────────────────────────────────────
const TerminalSection = () => {
    const [visibleLines, setVisibleLines] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const sectionRef = useRef(null);

    // Start animation when section enters viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    // Stagger line reveal
    useEffect(() => {
        if (!hasStarted) return;

        const timers = TERMINAL_LINES.map((line, i) =>
            setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), line.delay)
        );

        return () => timers.forEach(clearTimeout);
    }, [hasStarted]);

    return (
        <section
            id="terminal"
            ref={sectionRef}
            className="relative bg-[#0A0A0C] py-24 overflow-hidden"
            aria-label="Terminal API demo"
        >
            {/* Ambient glow behind terminal */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none mix-blend-screen"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 100%, rgba(134,239,172,0.04) 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section header */}
                <div className="mb-14 max-w-xl">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">01</span>
                        <span className="w-6 h-px bg-white/20" />
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">API Layer</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Query the open-source graph.
                    </h2>

                    <p className="text-base text-[#71717A] leading-relaxed">
                        GitExplorer sits directly on top of the GitHub API.
                        Structured queries, clean output, zero noise.
                    </p>
                </div>

                {/* Terminal window */}
                <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#0E0E10] shadow-2xl">

                    {/* Terminal chrome */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#121215]">
                        {/* Muted dots */}
                        <div className="flex gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
                        </div>

                        {/* Path label */}
                        <span className="text-[11px] font-mono text-[#71717A] tracking-wide">
                            ~ /git-explorer/query
                        </span>

                        {/* Spacer for symmetry */}
                        <div className="w-14" />
                    </div>

                    {/* Terminal body */}
                    <div
                        className="p-6 min-h-[340px] font-mono text-[13px] leading-[1.85] overflow-x-auto"
                        aria-live="polite"
                        aria-label="Terminal output"
                    >
                        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                            <div
                                key={i}
                                className={`${LINE_COLORS[line.type] || 'text-[#A1A1AA]'} whitespace-pre`}
                            >
                                {line.type === 'prompt' ? (
                                    <span>
                                        <span className="text-emerald-400/80">❯</span>
                                        <span className="text-[#71717A]"> {line.text} </span>
                                    </span>
                                ) : line.type === 'command' ? (
                                    <span>
                                        <span className="text-[#71717A]">$ </span>
                                        {line.text}
                                    </span>
                                ) : (
                                    line.text
                                )}
                            </div>
                        ))}

                        {/* Blinking cursor — only when animation is running */}
                        {hasStarted && visibleLines < TERMINAL_LINES.length && (
                            <span
                                className="inline-block w-[7px] h-[14px] bg-white/60 animate-terminalBlink align-middle"
                                aria-hidden="true"
                            />
                        )}

                        {/* Done state prompt */}
                        {visibleLines >= TERMINAL_LINES.length && (
                            <div className="mt-2 text-[#71717A]">
                                <span className="text-emerald-400/80">❯</span>
                                <span className="animate-terminalBlink inline-block w-[7px] h-[14px] bg-white/50 align-middle ml-1.5" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Stat chips below terminal */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    {[
                        { dot: 'bg-emerald-400', text: 'Direct client-side GitHub REST query' },
                        { dot: 'bg-sky-400', text: 'Power User Mode: 5,000 req/hr' },
                        { dot: 'bg-white/40', text: 'Zero proxies • Zero middleware' },
                    ].map(({ dot, text }) => (
                        <span
                            key={text}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[12px] font-mono text-[#A1A1AA]"
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
                            {text}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TerminalSection;
