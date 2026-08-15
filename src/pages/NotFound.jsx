import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import SEO from '../components/ui/SEO';
import { Home, Terminal, Search } from 'lucide-react';

const NotFound = () => {
    React.useEffect(() => {
        try {
            window.scrollTo(0, 0);
        } catch {
            // ignore
        }
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
            <SEO
                title="404 · Signal Not Found · GitExplorer"
                description="The requested repository route or resource does not exist."
                canonical="https://git-explore-one.vercel.app/404"
            />
            <Header showBackButton={true} activeTab="" />

            <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32">
                
                {/* ── Section 1: 404 Container (Entire.io Frame Style) ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-16 md:px-20 md:py-24">
                        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center text-center gap-8">
                            
                            {/* Terminal window */}
                            <div className="w-full rounded-2xl border border-white/10 bg-[#0E0E10] overflow-hidden text-left shadow-2xl">
                                <div className="flex items-center justify-between px-4 py-3 bg-[#121215] border-b border-white/10">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-500">~ /errors/404</span>
                                </div>
                                <div className="p-5 font-mono text-xs space-y-2 leading-relaxed">
                                    <p className="text-zinc-500">
                                        <span className="text-emerald-400 font-bold">❯</span> git checkout branch/requested-route
                                    </p>
                                    <p className="text-rose-400 font-medium">
                                        fatal: pathspec &apos;404&apos; did not match any file(s) known to git.
                                    </p>
                                    <p className="text-zinc-600">
                                        Status: 404 Not Found • Zero active commits in reference tree.
                                    </p>
                                </div>
                            </div>

                            {/* Copy */}
                            <div className="space-y-3">
                                <span className="text-xs font-mono uppercase tracking-widest text-[#71717A] block">
                                    &lt;STATUS_CODE: 404 /&gt;
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-space">
                                    Lost in the open-source graph.
                                </h1>
                                <p className="text-sm md:text-base text-zinc-400 max-w-md mx-auto leading-relaxed font-sans font-normal">
                                    The route you requested does not exist or has been refactored. Let&apos;s get you back to signal.
                                </p>
                            </div>

                            {/* CTA buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-extrabold hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-md"
                                >
                                    <Home className="w-4 h-4" />
                                    <span>Return Home</span>
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-white font-semibold hover:border-white/30 hover:bg-white/[0.08] active:scale-[0.98] transition-all"
                                >
                                    <Search className="w-4 h-4 text-emerald-400" />
                                    <span>Explore Repositories</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default NotFound;
