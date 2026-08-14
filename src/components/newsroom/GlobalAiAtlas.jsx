import React from 'react';
import { Link } from 'react-router-dom';
import { GLOBAL_AI_ATLAS } from '../../data/aiNewsData';
import { Globe, ExternalLink, MapPin, AlertCircle } from 'lucide-react';

const GlobalAiAtlas = () => {
  return (
    <section id="global-ai-section" className="bg-[#F8F3EA] text-[#101010] py-16 border-b-2 border-black font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-black pb-6 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              SECTION 05 — GLOBAL AI ATLAS &amp; REGIONAL LABS
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#101010] tracking-tight">
              Geopolitical Foundation Ecosystems
            </h2>
          </div>
          
          <span className="font-mono text-xs text-[#101010]/70 uppercase tracking-widest">
            Spotlighting Sakana AI (JP) &amp; Sarvam AI (IN)
          </span>
        </div>

        {/* Regional Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_AI_ATLAS.map((item) => (
            <div
              key={item.region}
              className="bg-[#F8F3EA] border-2 border-black p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200 shadow-[5px_5px_0px_#101010] group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.flag}</span>
                    <h3 className="font-syne text-2xl font-black text-[#101010]">
                      {item.region}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-[#101010]/60 font-bold uppercase">
                    {item.hub}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-bold text-[#FF5A1F] uppercase tracking-wider block">
                    Verified Regional Labs:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                    {item.keyLabs.map((lab) => (
                      <span
                        key={lab}
                        className={`px-2 py-0.5 border text-[11px] font-bold ${
                          lab.includes('Sakana') || lab.includes('Sarvam')
                            ? 'bg-[#FF5A1F] text-black border-black shadow-[1px_1px_0px_#000]'
                            : 'bg-black/5 border-black/20 text-[#101010]'
                        }`}
                      >
                        {lab}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#101010]/80 leading-relaxed font-space border-l-2 border-[#101010] pl-3">
                  {item.focus}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-black/15 flex items-center justify-between font-mono text-xs">
                <span className="text-[11px] text-[#101010]/60 font-bold">Featured: {item.featuredLab}</span>
                <a
                  href={item.exploreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#101010] hover:text-[#FF5A1F] transition-colors"
                >
                  <span>Lab Portal</span>
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

export default GlobalAiAtlas;
