import React from 'react';
import { Link } from 'react-router-dom';
import { HERO_STORY } from '../../data/aiNewsData';
import { ExternalLink, Radio, Clock, User, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const HeroEditorial = () => {
  return (
    <section id="hero" className="bg-[#F8F3EA] text-[#101010] py-12 md:py-16 border-b-2 border-black font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Editorial Accountability & Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-black font-mono text-xs text-[#101010]/80">
          <div className="flex items-center gap-3">
            <span className="bg-black text-[#F8F3EA] px-2.5 py-0.5 font-bold uppercase tracking-wider text-[11px]">
              {HERO_STORY.category}
            </span>
            <span className="bg-[#FF5A1F] text-black px-2 py-0.5 font-extrabold uppercase tracking-wider text-[10px]">
              BETA
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 border border-emerald-300 text-[10px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {HERO_STORY.liveStatus}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-[#101010]/50" />
              {HERO_STORY.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#101010]/50" />
              {HERO_STORY.date} ({HERO_STORY.readTime})
            </span>
          </div>
        </div>

        {/* Hero Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Editorial Headline & Deck (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 pr-0 lg:pr-6">
            <div className="space-y-6">
              <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-[#101010] tracking-tight">
                {HERO_STORY.headline}
              </h1>
              
              <p className="text-lg sm:text-xl text-[#101010]/85 font-normal leading-relaxed font-space border-l-4 border-[#FF5A1F] pl-4">
                {HERO_STORY.deck}
              </p>
            </div>

            {/* Primary Source & Paper CTA Strip */}
            <div className="pt-6 border-t-2 border-black flex flex-wrap items-center justify-between gap-4">
              <a
                href={HERO_STORY.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF5A1F] text-black font-mono text-xs font-black uppercase tracking-wider hover:bg-black hover:text-[#F8F3EA] transition-all duration-200 border-2 border-black shadow-[4px_4px_0px_#101010]"
              >
                <FileText className="w-4 h-4" />
                <span>{HERO_STORY.sourceLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <span className="font-mono text-[11px] text-[#101010]/70 font-bold uppercase tracking-widest">
                VERIFIED ARXIV PRE-PRINT ↗
              </span>
            </div>
          </div>

          {/* Hero Visual Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative border-2 border-black bg-[#101010] p-2 flex-1 shadow-[8px_8px_0px_#101010]">
              <img
                src={HERO_STORY.image}
                alt="Frontier AI Model Topology Visual"
                className="w-full h-full object-cover min-h-[300px] lg:min-h-[420px] filter grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-black text-[#FF5A1F] font-mono text-[10px] font-bold uppercase px-2.5 py-1 border border-[#FF5A1F]">
                FIGURE 01.1 — NEURAL REASONING GRAPH
              </div>
            </div>
            <p className="font-mono text-[11px] text-[#101010]/70 mt-3 leading-tight border-l-2 border-black pl-2">
              {HERO_STORY.imageCaption}
            </p>
          </div>

        </div>

        {/* Public Accountability Box (Inspired by tracker.wbupdates.com) */}
        <div className="bg-[#101010] text-[#F8F3EA] border-2 border-black p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[4px_4px_0px_#FF5A1F]">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#FF5A1F] uppercase tracking-wider block">
              PUBLIC LEDGER &amp; VERIFICATION POLICY
            </span>
            <p className="text-xs font-space text-zinc-300 max-w-3xl leading-relaxed">
              This intelligence index is maintained in public good faith. All model specifications, benchmark scores, and API pricing are sourced directly from published papers, lab releases, and public endpoints. If you find an error or outdated link, submit a correction below.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5A1F] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors border border-black whitespace-nowrap"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Submit Correction</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HeroEditorial;
