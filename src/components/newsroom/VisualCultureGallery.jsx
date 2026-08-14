import React from 'react';
import { VISUAL_CULTURE_GALLERY } from '../../data/aiNewsData';
import { Image, ExternalLink, Camera, Eye } from 'lucide-react';

const VisualCultureGallery = () => {
  return (
    <section id="visual-section" className="bg-[#101010] text-[#F8F3EA] py-16 border-b-2 border-black font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-white/20 pb-6 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              SECTION 08 — VISUAL CULTURE &amp; BRAND DESIGN LANGUAGE
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#F8F3EA] tracking-tight">
              Frontier Lab Aesthetics &amp; Visual Design Systems
            </h2>
          </div>
          <span className="font-mono text-xs text-[#F8F3EA]/70 uppercase tracking-widest">
            OpenAI, Anthropic &amp; Bio-Inspired Design References
          </span>
        </div>

        {/* 4 Image Reference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VISUAL_CULTURE_GALLERY.map((item) => (
            <div
              key={item.title}
              className="bg-[#101010] border-2 border-white/20 p-4 flex flex-col justify-between hover:border-[#FF5A1F] transition-all duration-300 shadow-[5px_5px_0px_#18181c] group"
            >
              <div className="space-y-3">
                <div className="relative aspect-[4/3] bg-black border-2 border-white/15 overflow-hidden">
                  <img
                    src={item.sampleUrl}
                    alt={item.title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-black text-[#FF5A1F] font-mono text-[9px] uppercase px-2 py-0.5 font-bold border border-[#FF5A1F]">
                    {item.theme}
                  </span>
                </div>

                <h3 className="font-syne text-lg font-bold text-white group-hover:text-[#FF5A1F] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed font-space border-l-2 border-white/20 pl-2">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-[10px] text-zinc-500 uppercase">Lab Design Hub</span>
                <a
                  href={item.exploreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#FF5A1F] hover:underline text-[11px]"
                >
                  <span>Explore Design</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VisualCultureGallery;
