import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle2, Terminal, Loader2 } from 'lucide-react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import SEO from '../components/ui/SEO';
import visionBg from '../assets/vision-bg.png';
import { docsContent } from '../data/content/docs';
import { termsContent } from '../data/content/terms';
import { apiContent } from '../data/content/api';
import { privacyContent } from '../data/content/privacy';

const InfoPage = () => {
    const { contentKey = 'docs' } = useParams();
    const [isVerifying, setIsVerifying] = useState(false);
    const [inputToken, setInputToken] = useState('');
    const [localSuccess, setLocalSuccess] = useState(false);
    const [localError, setLocalError] = useState('');
    const [showGuide, setShowGuide] = useState(false);
    const [testConsoleOutput, setTestConsoleOutput] = useState(null);
    const [isTestingApi, setIsTestingApi] = useState(false);

    const contentMap = {
        docs: docsContent,
        terms: termsContent,
        api: apiContent,
        privacy: privacyContent,
        disclaimer: { title: 'Disclaimer', subtitle: 'Important information about GitExplorer usage and limitations' },
    };

    const pageData = contentMap[contentKey] || contentMap['docs'];

    const handleSaveToken = (e) => {
        e.preventDefault();
        setLocalSuccess(false);
        setLocalError('');
        setIsVerifying(true);

        const cleanedToken = inputToken.trim();
        const authPrefix = cleanedToken.startsWith('token ') || cleanedToken.startsWith('Bearer ') ? '' : 'Bearer ';

        fetch('https://api.github.com/user', {
            headers: {
                Accept: 'application/vnd.github.v3+json',
                Authorization: `${authPrefix}${cleanedToken}`,
            },
        })
            .then(res => {
                if (res.ok) {
                    setLocalSuccess(true);
                    localStorage.setItem('gitexplorer_token', cleanedToken);
                    setInputToken('');
                } else {
                    setLocalError('Invalid or expired token. Please verify your Personal Access Token.');
                }
            })
            .catch(() => setLocalError('Failed to verify token with GitHub API.'))
            .finally(() => setIsVerifying(false));
    };

    const handleRunLiveTest = () => {
        setIsTestingApi(true);
        setTestConsoleOutput(null);

        try {
            const activeToken = inputToken.trim();
            const headers = {
                Accept: 'application/vnd.github.v3+json',
            };
            if (activeToken) {
                const prefix = activeToken.startsWith('token ') || activeToken.startsWith('Bearer ') ? '' : 'Bearer ';
                headers['Authorization'] = `${prefix}${activeToken}`;
            }

            const res = fetch('https://api.github.com/user', { headers });
            const status = res.status;
            const limit = res.headers.get('x-ratelimit-limit');
            const remaining = res.headers.get('x-ratelimit-remaining');

            let body;
            try {
                body = res.json();
            } catch {
                body = { message: 'No JSON body returned' };
            }

            setTestConsoleOutput({
                status,
                ok: res.ok,
                limit,
                remaining,
                body,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            setTestConsoleOutput({
                status: 500,
                ok: false,
                error: err.message,
                timestamp: new Date().toISOString(),
            });
        } finally {
            setIsTestingApi(false);
        }
    };

    const isGridLayout = pageData?.layout === 'grid' && Array.isArray(pageData?.cards);
    const getAvailableContentKeys = () => Object.keys(contentMap);
    const availableKeys = getAvailableContentKeys();

    const getCanonicalUrl = () => {
        switch (contentKey) {
            case 'disclaimer':
                return 'https://exploregit.vercel.app/disclaimer';
            default:
                return `https://exploregit.vercel.app/${contentKey}`;
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
            <SEO
                title={`${pageData?.title || 'Platform Documentation'} · GitExplorer`}
                description={pageData?.subtitle || 'Explore GitExplorer guides, API reference, and technical documentation.'}
                canonical={getCanonicalUrl()}
            />

            <Header showBackButton={true} activeTab="" />

            <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32 border-b border-white/10">

                {/* ── Section 1: Hero Banner (Entire.io Frame Style) ── */}
                <section className="border-b border-white/10 relative overflow-hidden">
                    {/* Vision BG Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src={visionBg}
                            alt=""
                            className="size-full object-cover object-center grayscale contrast-125 opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C]/90 via-[#0A0A0C]/65 to-[#0A0A0C]" />
                    </div>

                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20 relative z-10">
                        {/* Nav & Module Switcher */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-200"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back to Home</span>
                            </Link>

                            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-hide max-w-full">
                                {availableKeys.map((key) => (
                                    <Link
                                        key={key}
                                        to={`/${key}`}
                                        className={`px-3.5 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all ${
                                            contentKey === key
                                                ? 'bg-white/15 text-white border border-white/30'
                                                : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
                                        }`}
                                    >
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Hero Copy */}
                        <div className="max-w-3xl space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-extrabold font-space text-white tracking-tight leading-tight">
                                {pageData?.title || 'Documentation'}
                            </h1>
                            <p className="text-base sm:text-lg font-sans text-zinc-300 leading-relaxed">
                                {pageData?.subtitle || 'Learn how to use GitExplorer effectively.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Section 2: Content Area ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-16 md:px-20">
                        {isGridLayout ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.cards.map((card) => (
                                    <div key={card.id} className="rounded-2xl border border-white/10 bg-[#121215] p-8 hover:border-white/20 transition-all">
                                        <div className="space-y-4">
                                            {card.badge && (
                                                <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                                                    {card.badge}
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold text-white font-space">{card.title}</h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed">{card.description}</p>
                                            {card.links && card.links.length > 0 && (
                                                <div className="flex flex-col gap-2 pt-2">
                                                    {card.links.map((link, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={link.href}
                                                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
                                                        >
                                                            → {link.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-3xl prose prose-invert">
                                {pageData?.content && (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: pageData.content }}
                                        className="space-y-6 text-zinc-300"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default InfoPage;
