import React from 'react';
import { Link } from 'react-router-dom';
import { LEAD_STORIES } from '../../data/aiNewsData';
import { ExternalLink, Layers, Cpu, Globe, Zap, AlertCircle, FileText } from 'lucide-react';

const LeadStoryGrid = () => {
  return (
    <section className="bg-[#F8F3EA] text-[#101010] py-14 border-b-2 border-black font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b-2 border-black gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              SECTION 02 — VERIFIED LAB DISPATCHES
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#101010] tracking-tight">
              Frontier Model Momentum &amp; Infrastructure Ledger
            </h2>
          </div>
          
          <span className="font-mono text-xs text-[#101010]/70 uppercase tracking-wider">
            100% Primary Lab Citations
          </span>
        </div>

        {/* Asymmetrical 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEAD_STORIES.map((story) => (
            <article
              key={story.id}
              className="bg-[#F8F3EA] border-2 border-black p-5 flex flex-col justify-between hover:translate-y-[-3px] transition-transform duration-200 shadow-[5px_5px_0px_#101010] group"
            >
              <div className="space-y-4">
                {/* Image Reference Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#101010] border-2 border-black">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-black text-[#FF5A1F] font-mono text-[9px] uppercase px-2 py-0.5 font-bold border border-[#FF5A1F]">
                    {story.badgeText}
                  </span>
                </div>

                {/* Meta Header */}
                <div className="flex items-center justify-between font-mono text-[10px] text-[#101010]/70 border-b border-black/15 pb-2">
                  <span className="font-bold text-[#101010] uppercase">{story.category}</span>
                  <span>{story.date}</span>
                </div>

                {/* Title & Summary */}
                <h3 className="font-syne text-xl font-bold leading-snug text-[#101010] group-hover:text-[#FF5A1F] transition-colors">
                  {story.title}
                </h3>

                <p className="text-xs text-[#101010]/80 leading-relaxed font-space">
                  {story.summary}
                </p>
              </div>

              {/* Card Footer Source Link */}
              <div className="pt-4 mt-4 border-t-2 border-black flex flex-col gap-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#101010]/60 font-bold">{story.lab}</span>
                  <a
                    href={story.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-black hover:text-[#FF5A1F] transition-colors"
                  >
                    <span>Lab Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {story.arxivUrl && (
                  <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-1 border-t border-black/10">
                    <span className="text-zinc-500">Repository / ArXiv</span>
                    <a
                      href={story.arxivUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5A1F] hover:underline font-bold inline-flex items-center gap-0.5"
                    >
                      <FileText className="w-2.5 h-2.5" />
                      <span>View Citations ↗</span>
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LeadStoryGrid;
