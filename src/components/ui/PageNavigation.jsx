import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PAGE_NAVIGATION_SEQUENCE = [
  { key: 'features', label: 'Features Overview', path: '/features', desc: 'Discover GitExplorer core capabilities' },
  { key: 'ai-news', label: 'AI Newsroom', path: '/ai-news', desc: 'Frontier AI models, benchmark economics & editorial dispatches' },
  { key: 'docs', label: 'Documentation', path: '/docs', desc: 'Guides for search & repository intelligence' },
  { key: 'api', label: 'API Reference', path: '/api', desc: 'Unlock 5,000 req/hr with GitHub PAT' },
  { key: 'cheatsheet', label: 'Git Cheat Sheet', path: '/cheatsheet', desc: 'Master essential Git CLI commands' },
  { key: 'changelog', label: 'Changelog', path: '/changelog', desc: 'Recent feature releases & improvements' },
  { key: 'roadmap', label: 'Product Roadmap', path: '/roadmap', desc: 'Upcoming features & community ideas' },
  { key: 'resources', label: 'Resources & Credits', path: '/resources', desc: 'Tooling, libraries & creator info' },
  { key: 'about', label: 'About GitExplorer', path: '/about', desc: 'Independent architecture & privacy' },
  { key: 'disclaimer', label: 'Disclaimer', path: '/disclaimer', desc: 'Third-party trademark & API notice' },
  { key: 'terms', label: 'Terms of Use', path: '/terms', desc: 'Platform usage & credential safety' },
  { key: 'report', label: 'Report an Issue', path: '/report', desc: 'Submit feedback or report a bug' },
  { key: 'explore', label: 'Explore Dashboard', path: '/dashboard', desc: 'Search 100M+ open-source repos' },
];

const PageNavigation = ({ currentKey }) => {
  const currentIndex = PAGE_NAVIGATION_SEQUENCE.findIndex(
    (item) => item.key === currentKey || item.path === currentKey
  );

  if (currentIndex === -1) return null;

  const prevPage =
    currentIndex > 0
      ? PAGE_NAVIGATION_SEQUENCE[currentIndex - 1]
      : PAGE_NAVIGATION_SEQUENCE[PAGE_NAVIGATION_SEQUENCE.length - 1];

  const nextPage =
    currentIndex < PAGE_NAVIGATION_SEQUENCE.length - 1
      ? PAGE_NAVIGATION_SEQUENCE[currentIndex + 1]
      : PAGE_NAVIGATION_SEQUENCE[0];

  return (
    <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Previous Page Card */}
      <Link
        to={prevPage.path}
        className="group flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#121216] border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 shadow-lg"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-colors flex-shrink-0 mt-0.5">
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
        </div>
        <div className="space-y-1 overflow-hidden">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
            ← Previous Topic
          </span>
          <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors truncate">
            {prevPage.label}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1">
            {prevPage.desc}
          </p>
        </div>
      </Link>

      {/* Next Page Card */}
      <Link
        to={nextPage.path}
        className="group flex items-start justify-end text-right gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#121216] border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 shadow-lg"
      >
        <div className="space-y-1 overflow-hidden order-1 sm:order-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block">
            Next Topic →
          </span>
          <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors truncate">
            {nextPage.label}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1">
            {nextPage.desc}
          </p>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-colors flex-shrink-0 mt-0.5 order-2 sm:order-2">
          <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </div>
  );
};

export default PageNavigation;
