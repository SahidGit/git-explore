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

const TAB_LABELS = {
  features: 'Features',
  docs: 'Documentation',
  api: 'API Reference',
  roadmap: 'Roadmap',
  changelog: 'Changelog',
  resources: 'Resources',
  about: 'About',
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
    <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white flex flex-col justify-between">
      <SEO
        title={`${pageData?.title || 'Platform Documentation'} | GitExplorer`}
        description={pageData?.subtitle || 'Explore GitExplorer guides, APIs, and roadmap.'}
        canonical={`https://git-explore-one.vercel.app/${contentKey}`}
      />

      <Header showBackButton={true} activeTab="" />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4 mb-8">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors duration-200 whitespace-nowrap ${
                  contentKey === key
                    ? 'bg-white/[0.08] text-white border border-white/10 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                }`}
              >
                {TAB_LABELS[key] || key}
              </Link>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <p className="mt-4 text-xs font-mono text-zinc-500">Loading module / {contentKey}...</p>
          </div>
        )}

        {/* Error / Not Found */}
        {!isLoading && (error || !pageData) && (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Module Not Found</h1>
            <p className="text-xs text-zinc-400 mb-6">
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

        {/* Loaded Content */}
        {!isLoading && pageData && (
          <div>
            {/* Header Title */}
            <div className="mb-10 max-w-3xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] block mb-2">
                &lt;MODULE_{contentKey.toUpperCase()} /&gt;
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                {pageData.title}
              </h1>
              {pageData.subtitle && (
                <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
                  {pageData.subtitle}
                </p>
              )}
            </div>

            {/* Grid Layout (Docs, Features) or Prose Layout */}
            {isGridLayout ? (
              <FeatureProjectGrid cards={pageData.cards} />
            ) : (
              <div
                className="prose prose-invert max-w-none mb-12 prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-zinc-300 prose-a:underline hover:prose-a:text-white prose-code:text-zinc-200 prose-code:font-mono prose-code:bg-white/[0.06] prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}

            {/* Token Tester Widget on API Page */}
            {contentKey === 'api' && (
              <div className="mt-12 p-6 rounded-2xl bg-[#121215] border border-white/[0.08] max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-sm font-bold text-white">Interactive Token Connect</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Test and save your Personal Access Token directly to this browser session.
                </p>

                {savedSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Token successfully cached in sessionStorage.
                  </div>
                ) : (
                  <form onSubmit={handleSaveToken} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="flex-1 bg-[#0A0A0C] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white/25"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors whitespace-nowrap"
                    >
                      Save Token
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Sequential Next / Previous Page Navigation */}
            <PageNavigation currentKey={contentKey} />
          </div>
        )}
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
};

export default InfoPage;
