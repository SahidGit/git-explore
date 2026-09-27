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

      const res = await fetch('https://api.github.com/user', { headers });
      const status = res.status;
      const limit = res.headers.get('x-ratelimit-limit');
      const remaining = res.headers.get('x-ratelimit-remaining');

      let body;
      try {
        body = await res.json();
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
  const availableKeys = getAvailableContentKeys();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO
        title={`${pageData?.title || 'Platform Documentation'} · ExploreGit`}
        description={pageData?.subtitle || 'Explore ExploreGit guides, API reference, and technical documentation.'}
        canonical={`https://exploregit.vercel.app/${contentKey}`}
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

            <Header showBackButton={true} activeTab="" />

            <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32 border-b border-white/10">

            {/* Title Column */}
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3 font-sans">
              <span className="text-xs uppercase tracking-wider text-accent font-semibold">
                &lt;MODULE_{contentKey.toUpperCase()} /&gt;
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-heading">
                {pageData?.title || 'Documentation'}
              </h1>
              {pageData?.subtitle && (
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
                  {pageData.subtitle}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Section 2: Main Content Body (Entire.io Frame Style) ── */}
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20">
            {isLoading && (
              <div className="py-24 text-center">
                <div className="inline-block w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <p className="mt-4 text-xs font-sans text-zinc-500">Loading module / {contentKey}...</p>
              </div>
            )}

            {!isLoading && (error || !pageData) && (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2 font-heading">Module Not Found</h1>
                <p className="text-xs text-zinc-400 mb-6 font-sans">
                  The documentation module <code className="font-mono text-zinc-300">{contentKey}</code> could not be loaded.
                </p>
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-xs font-extrabold hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
                >
                  Go to Documentation
                </Link>
              </div>
            )}

            {!isLoading && pageData && (
              <div className="mx-auto max-w-[900px]">
                {isGridLayout ? (
                  <FeatureProjectGrid cards={pageData.cards} />
                ) : (
                  <div className="rounded-lg border border-white/10 bg-[#121215] p-6 sm:p-10 shadow-sm mb-8">
                    <div
                      className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-accent prose-a:underline hover:prose-a:opacity-80 prose-code:text-accent prose-code:font-mono prose-code:bg-[#0A0A0C] prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:text-zinc-300 prose-blockquote:bg-white/[0.02] prose-blockquote:py-1"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                  </div>
                )}

                {/* ── Interactive Token Connection & Live API Tester (API Page Only) ── */}
                {contentKey === 'api' && (
                  <div className="mt-8 p-6 sm:p-8 rounded-lg bg-[#12141A] border border-white/15 shadow-sm space-y-6 font-sans">
                    
                    {/* Header Bar */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Live Token Connection &amp; API Tester</h3>
                          <p className="text-xs text-zinc-400">Verify your GitHub Personal Access Token and inspect real-time rate limit quota.</p>
                        </div>
                      </div>

                      {isConnected && user && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          @{user.login}
                        </span>
                      )}
                    </div>

                    {/* Live Quota Indicator Bar */}
                    <div className="p-4 rounded-xl border border-white/10 bg-[#0B0C0E] space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          API Rate Limit Quota
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {rateLimit ? `${rateLimit.remaining} / ${rateLimit.limit} req/hr` : '60 / 60 req/hr (Anonymous)'}
                        </span>
                      </div>
                      
                      {/* Quota bar graph */}
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 transition-all duration-300"
                          style={{
                            width: rateLimit ? `${Math.min(100, (rateLimit.remaining / rateLimit.limit) * 100)}%` : '100%'
                          }}
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

                    {(localError || tokenError) && !localSuccess && (
                      <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{localError || tokenError}</span>
                      </div>
                    )}

                    {/* Token Input Form */}
                    <form onSubmit={handleSaveToken} className="space-y-3 font-mono text-xs">
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="password"
                          value={inputToken}
                          onChange={(e) => setInputToken(e.target.value)}
                          placeholder={isConnected ? "••••••••••••••••••••••••••••" : "Paste ghp_your_token_here..."}
                          className="flex-1 bg-[#0B0C0E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                        />
                        <button
                          type="submit"
                          disabled={isVerifying}
                          className="px-6 py-3 rounded-xl bg-white text-black font-mono font-bold text-xs hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-none disabled:opacity-50"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>{isConnected ? 'Update Token' : 'Verify & Connect'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {isConnected && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => disconnectToken()}
                            className="text-xs text-zinc-400 hover:text-rose-400 transition-colors font-mono underline"
                          >
                            Disconnect Token
                          </button>
                        </div>

                    {/* Live Test Execution Console */}
                    <div className="pt-2 border-t border-white/10 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300 font-bold flex items-center gap-2 font-mono">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          Live API Test Console
                        </span>
                        <button
                          type="button"
                          onClick={handleRunLiveTest}
                          disabled={isTestingApi}
                          className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono font-bold transition-all flex items-center gap-2 cursor-pointer text-xs active:scale-95 shadow-none"
                        >
                          {isTestingApi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                          <span>Execute GET /user</span>
                        </button>
                      </div>

                      {testConsoleOutput && (
                        <div className="p-4 rounded-xl border border-white/10 bg-[#0B0C0E] space-y-2 overflow-x-auto text-[11px] leading-relaxed">
                          <div className="flex items-center justify-between text-zinc-400 border-b border-white/10 pb-2">
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${testConsoleOutput.ok ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                              HTTP STATUS: {testConsoleOutput.status}
                            </span>
                            <span>{testConsoleOutput.timestamp}</span>
                          </div>
                          <pre className="text-zinc-300 whitespace-pre-wrap font-mono">
                            {JSON.stringify(testConsoleOutput.body, null, 2)}
                          </pre>
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
