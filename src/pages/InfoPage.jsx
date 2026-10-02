import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Check,
  CheckCircle2,
  Key,
  Loader2,
  Play,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import Header from '../components/layouts/Header';
import { SubFooter } from '../components/layouts/Footer';
import SEO from '../components/ui/SEO';
import FeatureProjectGrid from '../components/features/FeatureProjectGrid';
import visionBg from '../assets/company/vision-mission-bg.avif';
import { docsContent } from '../data/content/docs';
import { termsContent } from '../data/content/terms';
import { apiContent } from '../data/content/api';
import { privacyContent } from '../data/content/privacy';
import { disclaimerContent } from '../data/content/disclaimer';
import { changelogContent } from '../data/content/changelog';
import { useAuth } from '../context/AuthContext';

const InfoPage = ({ contentKey: propContentKey }) => {
  const { contentKey: routeContentKey } = useParams();
  const contentKey = propContentKey || routeContentKey || 'docs';
  const {
    isConnected,
    user,
    rateLimit,
    tokenError,
    connectToken,
    disconnectToken,
  } = useAuth();

  const [isVerifying, setIsVerifying] = useState(false);
  const [inputToken, setInputToken] = useState('');
  const [localSuccess, setLocalSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  const [testConsoleOutput, setTestConsoleOutput] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const contentMap = {
    docs: docsContent,
    terms: termsContent,
    api: apiContent,
    privacy: privacyContent,
    disclaimer: disclaimerContent,
    changelog: changelogContent,
  };

  const pageData = contentMap[contentKey] || contentMap.docs;
  const hasCards = Array.isArray(pageData?.cards) && pageData.cards.length > 0;
  const sanitizedContent = pageData?.content ? DOMPurify.sanitize(pageData.content) : '';

  const handleSaveToken = async (e) => {
    e.preventDefault();
    setLocalSuccess(false);
    setLocalError('');
    setIsVerifying(true);

    const cleanedToken = inputToken.trim();
    if (!cleanedToken) {
      setLocalError('Please enter a GitHub Personal Access Token.');
      setIsVerifying(false);
      return;
    }

    const result = await connectToken(cleanedToken);

    if (result.success) {
      setLocalSuccess(true);
      setInputToken('');
    } else {
      setLocalError(result.error || 'Invalid or expired token. Please verify your Personal Access Token.');
    }

    setIsVerifying(false);
  };

  const handleRunLiveTest = async () => {
    setIsTestingApi(true);
    setTestConsoleOutput(null);

    try {
      const activeToken = inputToken.trim();
      const headers = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (activeToken) {
        const prefix = activeToken.startsWith('token ') || activeToken.startsWith('Bearer ') ? '' : 'Bearer ';
        headers.Authorization = `${prefix}${activeToken}`;
      }

      const response = await fetch('https://api.github.com/user', { headers });
      const rawBody = await response.json().catch(() => ({ message: 'No JSON body returned' }));

      setTestConsoleOutput({
        status: response.status,
        ok: response.ok,
        limit: response.headers.get('x-ratelimit-limit'),
        remaining: response.headers.get('x-ratelimit-remaining'),
        body: rawBody,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setTestConsoleOutput({
        status: 500,
        ok: false,
        error: err?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO
        title={`${pageData?.title || 'Platform Documentation'} · ExploreGit`}
        description={pageData?.subtitle || 'Explore ExploreGit guides, API reference, and technical documentation.'}
        canonical={`https://exploregit.vercel.app/${contentKey}`}
      />

      <Header showBackButton activeTab="" />

      <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32 border-b border-white/10">
        <section className="border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={visionBg}
              alt=""
              width={2796}
              height={1572}
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-center grayscale contrast-125 opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C]/90 via-[#0A0A0C]/65 to-[#0A0A0C]" />
          </div>

          <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20 relative z-10">
            <div className="mx-auto flex w-full max-w-[800px] flex-col gap-3 font-sans text-center items-center">
              <p className="text-xs uppercase tracking-wider text-emerald-400 font-mono font-semibold">
                &lt;MODULE_{contentKey.toUpperCase()} /&gt;
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
                {pageData?.title || 'Documentation'}
              </h1>
              {pageData?.subtitle && (
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal max-w-2xl">
                  {pageData.subtitle}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20">
            {!pageData && (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-10 h-10 rounded-lg border border-white/15 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2 font-heading">Module Not Found</h1>
                <p className="text-xs text-zinc-400 mb-6 font-sans">
                  The documentation module <code className="font-mono text-zinc-300">{contentKey}</code> could not be loaded.
                </p>
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#121215] text-xs font-sans font-semibold hover:bg-neutral-100 active:bg-neutral-200 transition-all shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_-1px_rgb(0_0_0/0.06),0_2px_4px_rgb(0_0_0/0.04)] cursor-pointer"
                >
                  Go to Documentation
                </Link>
              </div>
            )}

            {pageData && (
              <div className="mx-auto max-w-[1100px] space-y-12">
                {hasCards && (
                  <section aria-label="Documentation Modules">
                    <div className="mb-6 flex flex-col gap-1">
                      <p className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                        Platform Architecture
                      </p>
                      <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
                        Core Documentation Modules
                      </h2>
                    </div>
                    <FeatureProjectGrid cards={pageData.cards} />
                  </section>
                )}

                {sanitizedContent && (
                  <div className="rounded-2xl border border-white/10 bg-[#121215] p-5 sm:p-7 md:p-8 shadow-sm">
                    <div
                      className={
                        contentKey === 'docs'
                          ? 'text-zinc-300 leading-relaxed font-sans'
                          : 'prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-white prose-a:underline hover:prose-a:text-zinc-300 prose-code:text-zinc-200 prose-code:font-mono prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-blockquote:border-l-2 prose-blockquote:border-white/40 prose-blockquote:pl-4 prose-blockquote:text-zinc-300 prose-blockquote:bg-white/[0.02] prose-blockquote:py-1'
                      }
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                  </div>
                )}

                {contentKey === 'api' && (
                  <div className="mt-8 p-6 sm:p-8 rounded-lg bg-[#12141A] border border-white/15 shadow-sm space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white">
                          <Key className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Live Token Connection &amp; API Tester</h3>
                          <p className="text-xs text-zinc-400">
                            Verify your GitHub Personal Access Token and inspect real-time rate limit quota.
                          </p>
                        </div>
                      </div>

                      {isConnected && user && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          @{user.login}
                        </span>
                      )}
                    </div>

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

                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 transition-all duration-300"
                          style={{
                            width: rateLimit
                              ? `${Math.min(100, (rateLimit.remaining / rateLimit.limit) * 100)}%`
                              : '100%',
                          }}
                        />
                      </div>
                    </div>

                    {(localError || tokenError) && !localSuccess && (
                      <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{localError || tokenError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveToken} className="space-y-3 font-mono text-xs">
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="password"
                          value={inputToken}
                          onChange={(e) => setInputToken(e.target.value)}
                          placeholder={isConnected ? '••••••••••••••••••••••••••••' : 'Paste ghp_your_token_here...'}
                          className="flex-1 bg-[#0B0C0E] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-mono"
                        />
                        <button
                          type="submit"
                          disabled={isVerifying}
                          className="btn-saas-primary text-xs h-[42px] px-6 gap-2 disabled:opacity-50"
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
                            className="btn-saas-destructive text-xs h-[34px] px-3 gap-1.5"
                          >
                            Disconnect Token
                          </button>
                        </div>
                      )}
                    </form>

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
                          className="btn-saas-secondary text-xs h-[36px] px-4 gap-2"
                        >
                          {isTestingApi ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
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
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <SubFooter />
    </div>
  );
};

export default InfoPage;

