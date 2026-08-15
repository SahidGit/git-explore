import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import {
    Github, Linkedin, ExternalLink, Code2, Terminal,
    ShieldCheck, Cpu, GitBranch, Zap, ArrowUpRight
} from 'lucide-react';
import sahidPhoto from '../assets/team-sahid.png';
import valueAutonomy from '../assets/value-autonomy.png';
import valueInclusion from '../assets/value-inclusion.png';
import valueProfessionalism from '../assets/value-professionalism.png';
import { storageService } from '../services/storageService';
import BlogFeedList from '../components/features/BlogFeedList';

// ─── Operating Values (Flush 3-Pane Landscape Section) ───
const VALUES = [
    {
        title: 'Autonomy',
        description: 'We believe in local-first software, zero telemetry, and empowering developers to maintain absolute ownership over their environment, credentials, and workflow without centralized surveillance.',
        image: valueAutonomy,
    },
    {
        title: 'Inclusion',
        description: 'Modeled off the ideals of the open source community, we are building a culture of inclusion and belonging, where all people and ideas are respected.',
        image: valueInclusion,
    },
    {
        title: 'Professionalism',
        description: 'Grounded in honesty and integrity, our culture values transparent feedback, colleagues who support and help one another, where no questions are invalid and go without an answer.',
        image: valueProfessionalism,
    },
];

// ─── How We Operate (Numbered Grid) ───
const OPERATING_PRINCIPLES = [
    {
        title: 'Zero Telemetry & Local-First',
        desc: 'No analytics scripts, no cross-site trackers, no behavioral logging. Credentials and bookmarks stay encrypted in your browser.',
    },
    {
        title: 'Real-Time GitHub Signal',
        desc: 'Every repository query and contribution graph is fetched live directly from public GitHub APIs. Zero stale indices.',
    },
    {
        title: 'Small squads, clear ownership',
        desc: 'Built with tight execution, high-frequency updates, and clean modular code structures.',
    },
    {
        title: 'One product, one roadmap',
        desc: 'We align on a clear developer-first vision and make decisions with judgment, user feedback, and care for craft.',
    },
    {
        title: 'Short specs, high tempo',
        desc: 'Specs focus on intent. We ship with high tempo, testing features early and iterating rapidly.',
    },
    {
        title: 'Protect quality',
        desc: 'We maintain zero-CLS visual loaders, exponential back-off API retries, and clean responsive layouts.',
    },
    {
        title: 'Stay close to developers',
        desc: 'We build what developers need. We balance community feedback with long-term platform capability.',
    },
    {
        title: 'Open source transparency',
        desc: 'The entire codebase is MIT-licensed, publicly auditable, and open to community pull requests.',
    },
];

// ─── Team Members Grid ───
const TEAM = [
    {
        name: 'Sahid Sarfaraz',
        role: 'Creator & Lead Engineer',
        location: 'Kolkata, India',
        avatar: sahidPhoto,
        github: 'https://github.com/SahidGit',
        linkedin: 'https://linkedin.com/in/sahid-sarfaraz',
    },
];

const Company = () => {
    const handleTokenSave = (token) => storageService.saveToken(token);

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
            <SEO
                title="Company · GitExplorer"
                description="A globally distributed, developer-first platform building where humans and agents collaborate, learn, and ship together."
                canonical="https://git-explore-one.vercel.app/company"
            />
            <Header activeTab="company" onTokenSave={handleTokenSave} showBackButton />

            <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32">

                {/* ── Section 1: About Hero ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20 md:py-16">
                        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
                            <h1 className="text-3xl sm:text-4xl font-extrabold font-space text-white tracking-tight">About</h1>
                            <p className="text-sm md:text-base font-sans text-zinc-300 leading-relaxed">
                                GitExplorer is a globally distributed, remote-first developer intelligence layer with one clear mission: to build the world&apos;s next open-source discovery platform where engineers and AI agents collaborate, learn, and ship together. We operate just as we believe the future of the interconnected developer community will work—bringing clarity to repository momentum, contributor health, and code velocity faster than was ever possible before.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Section 2: Values Intro ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-10 md:px-20">
                        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
                            <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-tight">Values</h2>
                            <p className="text-sm md:text-base font-sans text-zinc-400 leading-relaxed">
                                We are a company built by developers, for developers. Our culture is grounded in autonomy, inclusion, professionalism, transparent feedback, and deep care for craft.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Section 3: Operating Values 3-Column Panels (Contiguous Border Grid) ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x grid md:grid-cols-3">
                        {VALUES.map((val) => (
                            <article
                                key={val.title}
                                className="relative flex min-h-[480px] sm:min-h-[520px] overflow-hidden border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 p-8 group"
                            >
                                <picture className="pointer-events-none absolute inset-0 size-full">
                                    <img
                                        src={val.image}
                                        alt={val.title}
                                        className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        loading="lazy"
                                    />
                                </picture>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/75 group-hover:from-black/10 group-hover:to-black/65 transition-all duration-500" />
                                <div className="relative flex w-full flex-col justify-between gap-16 z-10">
                                    <h2 className="text-4xl sm:text-5xl font-extrabold font-space text-white tracking-tight">{val.title}</h2>
                                    <p className="text-sm sm:text-base font-sans text-white leading-relaxed max-w-[360px]">{val.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── Section 4: How We Operate (Numbered Grid) ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20">
                        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-tight">How we operate</h2>
                                <p className="text-sm text-zinc-400 font-sans">Architectural constraints and core operational principles baked into GitExplorer.</p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2">
                                {OPERATING_PRINCIPLES.map((op, idx) => (
                                    <article key={op.title} className="flex flex-col gap-4">
                                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-sm font-semibold">
                                            {idx + 1}
                                        </div>
                                        <div className="flex flex-col gap-1.5 font-sans">
                                            <h3 className="font-bold text-white text-base font-space">{op.title}</h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed">{op.desc}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Section 5: Team Grid ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20">
                        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8">
                            <div className="flex flex-col gap-3">
                                <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-tight">Team</h2>
                                <p className="text-sm md:text-base font-sans text-zinc-400 leading-relaxed">
                                    What unifies every engineer on GitExplorer is our passion for building developer tools. We have years of experience building applications, contributing to open-source repositories, and crafting developer workflows.
                                </p>
                            </div>
                            <div className="grid gap-4 max-w-xs">
                                {TEAM.map((member) => (
                                    <article key={member.name} className="flex flex-col gap-3 group">
                                        <div className="relative aspect-[245/306] overflow-hidden rounded-lg bg-white/5 border border-white/10">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="leading-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-white font-space text-sm">{member.name}</h3>
                                                {member.github && (
                                                    <a
                                                        href={member.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-zinc-500 hover:text-white transition-colors"
                                                    >
                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-400">{member.role}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Section 6: Engineering Dispatches Feed ── */}
                <BlogFeedList
                    title="Engineering & Research Dispatches"
                    subtitle="Technical deep-dives, architectural notes, and open-weights reasoning benchmarks."
                />

            </main>

            <BackToTop />
            <Footer />
        </div>
    );
};

export default Company;
