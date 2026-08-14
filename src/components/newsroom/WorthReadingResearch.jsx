import React from 'react';
import { RESEARCH_PAPERS } from '../../data/aiNewsData';
import { BookOpen, ExternalLink, FileText, Bookmark, CheckCircle2 } from 'lucide-react';

const WorthReadingResearch = () => {
  return (
    <section id="research-section" className="bg-[#F8F3EA] text-[#101010] py-16 border-b-2 border-black font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-black pb-6 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              SECTION 07 — ESSENTIAL RESEARCH BRIEFINGS
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#101010] tracking-tight">
              Curated arXiv Papers &amp; Frontier Technical Publications
            </h2>
          </div>
          <span className="font-mono text-xs text-[#101010]/70 uppercase tracking-widest">
            Verified Pre-print Links &amp; Author Citations
          </span>
        </div>

        {/* 5 Research Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_PAPERS.map((paper) => (
            <article
              key={paper.title}
              className="bg-[#F8F3EA] border-2 border-black p-6 flex flex-col justify-between hover:translate-y-[-3px] transition-transform duration-200 shadow-[5px_5px_0px_#101010] group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#101010]/70 border-b-2 border-black/15 pb-2">
                  <span className="font-bold text-[#FF5A1F] uppercase">{paper.lab}</span>
                  <span className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {paper.year}
                  </span>
                </div>

                <h3 className="font-syne text-lg font-bold leading-snug text-[#101010] group-hover:text-[#FF5A1F] transition-colors">
                  {paper.title}
                </h3>

                <p className="font-mono text-xs text-[#101010]/80">
                  Authors: <span className="text-[#101010] font-bold">{paper.authors}</span>
                </p>

                <div className="bg-black/5 p-3 border-l-4 border-[#101010] text-xs text-[#101010]/90 leading-relaxed font-space space-y-1">
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A1F] block">
                    Why It Matters:
                  </span>
                  <p>{paper.whyItMatters}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-black/15 flex items-center justify-between font-mono text-xs">
                <span className="text-[10px] text-[#101010]/60 uppercase font-bold">Direct Access</span>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#101010] hover:text-[#FF5A1F] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paper / Preprint</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WorthReadingResearch;
