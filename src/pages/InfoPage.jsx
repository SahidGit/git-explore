import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import FeatureProjectGrid from '../components/features/FeatureProjectGrid';
import PageNavigation from '../components/ui/PageNavigation';
import { getContentByKey, getAvailableContentKeys } from '../data/contentLoader';
import { storageService } from '../services/storageService';
import { ArrowLeft, Key, Check, Terminal, ExternalLink } from 'lucide-react';
import visionBg from '../assets/vision-mission-bg.avif';

const TAB_LABELS = {
  docs: 'Documentation',
  api: 'API Reference',
  changelog: 'Changelog',
  roadmap: 'Roadmap',
  disclaimer: 'Disclaimer',
  terms: 'Terms of Use',
};

const InfoPage = ({ contentKey }) => {
  const location = useLocation();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenInput, setTokenInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
  }, [contentKey]);

  const content = pageData?.content || '';
  const sanitizedContent = useMemo(() => DOMPurify.sanitize(content), [content]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getContentByKey(contentKey)
      .then((data) => {
        setPageData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading content:', err);
        setError(err);
        setIsLoading(false);
      });
  }, [contentKey]);

  const handleSaveToken = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    storageService.saveToken(tokenInput.trim());
    setSavedSuccess(true);
    setTokenInput('');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const isGridLayout = pageData?.layout === 'grid' && Array.isArray(pageData?.cards);
  const availableKeys = getAvailableContentKeys();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO
        title={`${pageData?.title || 'Platform Documentation'} · GitExplorer`}
        description={pageData?.subtitle || 'Explore GitExplorer guides, APIs, and roadmap.'}
        canonical={`https://git-explore-one.vercel.app/${contentKey}`}
      />

      <Header showBackButton={true} activeTab="" />

      <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32">

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
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      contentKey === key
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] bg-white/[0.02] border border-white/[0.08]'
                    }`}
                  >
                    {TAB_LABELS[key] || key}
                  </Link>
                ))}
              </div>
            </div>

            {/* Title Column */}
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                &lt;MODULE_{contentKey.toUpperCase()} /&gt;
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-space text-white tracking-tight leading-tight">
                {pageData?.title || 'Documentation'}
              </h1>
              {pageData?.subtitle && (
                <p className="text-sm md:text-base font-sans text-zinc-300 leading-relaxed font-normal">
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
                <p className="mt-4 text-xs font-mono text-zinc-500">Loading module / {contentKey}...</p>
              </div>
            )}

            {!isLoading && (error || !pageData) && (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2 font-space">Module Not Found</h1>
                <p className="text-xs text-zinc-400 mb-6 font-mono">
                  The documentation module <code className="font-mono text-zinc-300">{contentKey}</code> could not be loaded.
                </p>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
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
                  <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 sm:p-10 shadow-2xl mb-12">
                    <div
                      className="prose prose-invert max-w-none prose-headings:font-space prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-indigo-400 prose-a:underline hover:prose-a:text-indigo-300 prose-code:text-indigo-300 prose-code:font-mono prose-code:bg-[#0A0A0C] prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-blockquote:border-l-2 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:text-zinc-300 prose-blockquote:bg-white/[0.02] prose-blockquote:py-1"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                  </div>
                )}

                {/* Token Tester Widget on API Page */}
                {contentKey === 'api' && (
                  <div className="mt-8 p-8 rounded-2xl bg-[#121215] border border-white/10 shadow-2xl space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Key className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-base font-bold font-space text-white">Interactive Token Connect</h3>
                    </div>
                    <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                      Test and save your Personal Access Token directly to this browser session to unlock 5,000 req/hr.
                    </p>

                    {savedSuccess ? (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Token successfully cached in sessionStorage.
                      </div>
                    ) : (
                      <form onSubmit={handleSaveToken} className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="password"
                          value={tokenInput}
                          onChange={(e) => setTokenInput(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="flex-1 bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
                        />
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Save Token
                        </button>
                      </form>
                    )}
                  </div>
                )}

                <PageNavigation currentKey={contentKey} />
              </div>
            )}
          </div>
        </section>

      </main>

      <BackToTop />
      <Footer />
    </div>
  );
};

export default InfoPage;
