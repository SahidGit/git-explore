import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code, Cpu } from 'lucide-react';

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
    prompt: 'text-zinc-500',
    command: 'text-white',
    'command-cont': 'text-zinc-400',
    blank: '',
    output: 'text-zinc-400',
    'output-key': 'text-sky-300',
    'output-val': 'text-emerald-300',
    'output-str': 'text-rose-300',
};

const TerminalSection = () => {
    const [visibleLines, setVisibleLines] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const sectionRef = useRef(null);

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
            className="border-b border-white/10 bg-[#0A0A0C] overflow-hidden"
            aria-label="Terminal API demo"
        >
            <div className="mx-auto w-full max-w-[1280px] min-[1280px]:border-x border-white/10 px-6 py-16 md:py-20">
                <div className="mx-auto max-w-xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>API Layer &bull; Zero Telemetry</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold font-space text-white tracking-tight mb-3">
                        Query the open-source graph directly.
                    </h2>

                    <p className="text-sm md:text-base font-sans text-zinc-400 leading-relaxed font-normal">
                        GitExplorer sits directly on top of the GitHub GraphQL &amp; REST APIs. Structured queries, clean outputs, zero noise.
                    </p>
                </div>

                {/* Terminal macOS Frame */}
                <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#0E0E10] overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#121215]">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                        </div>
                        <span className="text-xs font-mono text-zinc-400 tracking-wide">
                            ~ /git-explorer/query
                        </span>
                        <div className="w-12" />
                    </div>

                    {/* Output */}
                    <div className="p-6 min-h-[320px] font-mono text-xs sm:text-sm leading-[1.8] overflow-x-auto bg-[#0A0A0C]">
                        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                            <div
                                key={i}
                                className={`${LINE_COLORS[line.type] || 'text-zinc-400'} whitespace-pre`}
                            >
                                {line.type === 'prompt' ? (
                                    <span>
                                        <span className="text-emerald-400 font-bold">❯</span>
                                        <span className="text-zinc-500"> {line.text} </span>
                                    </span>
                                ) : line.type === 'command' ? (
                                    <span>
                                        <span className="text-zinc-500">$ </span>
                                        {line.text}
                                    </span>
                                ) : (
                                    line.text
                                )}
                            </div>
                        ))}
                        {hasStarted && visibleLines < TERMINAL_LINES.length && (
                            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse align-middle ml-1" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TerminalSection;
