import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import SEO from '../components/ui/SEO';
import { ArrowLeft, Home, Terminal, Search } from 'lucide-react';

const NotFound = () => {
    React.useEffect(() => {
        try {
            window.scrollTo(0, 0);
        } catch {
            // ignore
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white flex flex-col justify-between overflow-hidden">
            <SEO
                title="404 — Signal Not Found | GitExplorer"
                description="The requested repository route or resource does not exist."
                canonical="https://git-explore-one.vercel.app/404"
            />
            <Header showBackButton={true} activeTab="" />

            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-xl w-full text-center space-y-8">
                    {/* Terminal window */}
                    <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E10] overflow-hidden text-left shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#121215] border-b border-white/[0.06]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">~ /errors/404</span>
                        </div>
                        <div className="p-5 font-mono text-xs space-y-2 leading-relaxed">
                            <p className="text-zinc-500">
                                <span className="text-emerald-400/80">❯</span> git checkout branch/requested-route
                            </p>
                            <p className="text-red-400/90">
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
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                            Lost in the open-source graph.
                        </h1>
                        <p className="text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                            The route you requested does not exist or has been refactored. Let&apos;s get you back to signal.
                        </p>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all"
                        >
                            <Home className="w-4 h-4" />
                            Return Home
                        </Link>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-zinc-300 text-xs font-medium hover:border-white/20 hover:text-white transition-all"
                        >
                            <Search className="w-4 h-4" />
                            Explore Repositories
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NotFound;
