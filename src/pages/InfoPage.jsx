import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import SEO from '../components/ui/SEO';
import { PAGES_CONTENT } from '../data/content';
import { storageService } from '../services/storageService';
import { Home, ArrowLeft } from 'lucide-react';

const InfoPage = ({ contentKey }) => {
// const navigate = useNavigate();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [contentKey]);

    const pageData = PAGES_CONTENT[contentKey];

    if (!pageData) {
        return (
            <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
                <SEO
                    title="404 - Page Not Found | GitExplorer"
                    description="The page you're looking for doesn't exist."
                    canonical={`https://git-explore-one.vercel.app/${contentKey}`}
                />
                <Header showBackButton={true} activeTab="" />

                <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 mb-6">
                                <span className="text-4xl">⚠️</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#58A6FF] to-[#BC8CFF]">
                            Page Not Found
                        </h1>
                        <p className="text-xl text-slate-400 font-light mb-8 max-w-2xl mx-auto">
                            The page "{contentKey}" doesn't exist or has been removed.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/"
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </Link>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium rounded-xl transition-colors border border-white/10"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const { title, subtitle, content } = pageData;

    return (
        <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
            <SEO
                title={`${title} | GitExplorer`}
                description={subtitle}
                canonical={`https://git-explore-one.vercel.app/${contentKey}`}
            />
            <Header showBackButton={true} activeTab="" />

            {/* Content */}
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <article className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#58A6FF] to-[#BC8CFF]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xl text-slate-400 font-light">
                            {subtitle}
                        </p>
                    )}
                </article>

                <div
                    className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-blue-300 prose-code:bg-blue-900/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-ul:text-slate-400 prose-li:marker:text-slate-600 mb-12"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {title === 'API Integration' && (
                    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <h3 className="text-lg font-semibold text-white mb-4">Enter Access Token</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="password"
                                placeholder="ghp_..."
                                className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all"
                                onChange={(e) => {
                                    if (e.target.value.startsWith('ghp_') || e.target.value.startsWith('github_pat_')) {
                                        storageService.saveToken(e.target.value);
                                        // Visual feedback could be added here
                                    }
                                }}
                            />
                            <div className="text-xs text-slate-500 mt-2 sm:mt-0 sm:self-center">
                                *Token is autosaved to your browser's local storage.
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InfoPage;
