import React, { useState } from 'react';
import { ArrowUpRight, Search, Tag, Calendar, User } from 'lucide-react';

const DEFAULT_ARTICLES = [
  {
    id: 'post-scale-inference-2026',
    date: 'FEBRUARY 14, 2026',
    author: 'RESEARCH DESK',
    title: 'The Post-Scale Paradigm: Reasoning Models & Open Weights Alter Global AI Equilibrium',
    summary: 'As inference-time compute supersedes raw parameter scaling, architectural breakthroughs from global labs demonstrate that open-weights reasoning can match frontier closed models at a fraction of energy cost.',
    category: 'Frontier Intelligence',
    link: 'https://arxiv.org/abs/2501.12948',
  },
  {
    id: 'deepseek-r1-architecture',
    date: 'JANUARY 28, 2026',
    author: 'SAHID SARFARAZ',
    title: 'DeepSeek R1 Architecture: Multi-Head Latent Attention & Pure RL Optimization',
    summary: 'By combining reinforcement learning without prior supervised fine-tuning with multi-head latent attention (MLA), DeepSeek-R1 reaches 90.8% on MATH-500 under an open MIT license.',
    category: 'Open Weights',
    link: 'https://github.com/deepseek-ai/DeepSeek-R1',
  },
  {
    id: 'local-first-browser-db',
    date: 'JANUARY 15, 2026',
    author: 'ENGINEERING TEAM',
    title: 'Zero-Telemetry Engineering: Client-Side Token Caching & Browser Isolation',
    summary: 'How GitExplorer leverages browser sessionStorage encryption and direct REST dispatches to guarantee zero data retention or backend tracking on developer credentials.',
    category: 'Architecture',
    link: '/company',
  },
  {
    id: 'sakana-evolutionary-merge',
    date: 'DECEMBER 19, 2025',
    author: 'SAKANA LABS',
    title: 'Evolutionary Model Merging: Cross-Breeding Foundation Neural Networks',
    summary: 'Leveraging bio-inspired evolutionary algorithms to automatically discover optimal cross-breed model combinations without expensive GPU re-training cycles.',
    category: 'Neural Merging',
    link: 'https://sakana.ai/evolutionary-model-merge/',
  },
  {
    id: 'indic-sovereign-llm',
    date: 'NOVEMBER 04, 2025',
    author: 'SARVAM RESEARCH',
    title: 'Vernacular Tokenization Across 22 Languages: Lessons from 4 Trillion Tokens',
    summary: 'Targeting multilingual populations with custom tokenizers designed for high-accuracy reasoning across non-Latin scripts and low-resource regional dialects.',
    category: 'Multilingual AI',
    link: 'https://www.sarvam.ai/blogs/sarvam-2b',
  },
];

const BlogFeedList = ({ articles = DEFAULT_ARTICLES, title, subtitle }) => {
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [query, setQuery] = useState('');

  // Extract unique categories for optional pill filter
  const categories = ['ALL', ...Array.from(new Set(articles.map((a) => a.category.toUpperCase())))];

  const filteredArticles = articles.filter((art) => {
    const matchesTag = selectedTag === 'ALL' || art.category.toUpperCase() === selectedTag;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.author.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  return (
    <section className="w-full bg-[#0B0D0E] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-white/[0.08]">
      <div className="max-w-3xl mx-auto">
        
        {/* Optional Section Header */}
        {(title || subtitle) && (
          <div className="mb-10 text-left pb-8 border-b border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">
              &lt;DISPATCH_FEED /&gt;
            </span>
            {title && (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-space mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-xl">
                {subtitle}
              </p>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/[0.06]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedTag(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all duration-200 cursor-pointer ${
                    selectedTag === cat
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-[#18181B] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Article Feed Vertical Stack */}
        <div className="divide-y divide-zinc-800/60">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => {
              const isExternal = /^https?:\/\//i.test(article.link || '');
              const LinkTag = isExternal ? 'a' : 'a';
              const linkProps = isExternal
                ? { href: article.link, target: '_blank', rel: 'noopener noreferrer' }
                : { href: article.link || '#' };

              return (
                <article
                  key={article.id || article.title}
                  className="group py-10 sm:py-12 transition-colors duration-300 relative"
                >
                  <LinkTag {...linkProps} className="block group/link">
                    {/* Meta Header */}
                    <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-400 uppercase">
                      <span>{article.date}</span>
                      <span className="text-zinc-600 font-bold">•</span>
                      <span>{article.author}</span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-2xl font-bold text-white tracking-tight mt-3 font-space group-hover/link:text-zinc-300 transition-colors duration-200 flex items-start justify-between gap-4">
                      <span>{article.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200 shrink-0 mt-1" />
                    </h3>

                    {/* Excerpt / Summary */}
                    <p className="text-sm text-zinc-400 leading-relaxed mt-2.5 max-w-2xl font-sans font-normal">
                      {article.summary}
                    </p>

                    {/* Tag / Category Badge */}
                    <div className="mt-4 inline-block">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-[#18181B] px-2.5 py-1 rounded-md border border-zinc-800/80 group-hover/link:border-zinc-700/80 transition-colors">
                        <Tag className="w-3 h-3 text-zinc-500" />
                        <span>{article.category}</span>
                      </span>
                    </div>
                  </LinkTag>
                </article>
              );
            })
          ) : (
            <div className="py-16 text-center text-xs font-mono text-zinc-500">
              No entries found matching criteria.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default BlogFeedList;
