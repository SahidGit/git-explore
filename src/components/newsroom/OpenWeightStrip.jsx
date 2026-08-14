import React from 'react';
import { OPEN_WEIGHT_FAMILIES } from '../../data/aiNewsData';
import { ExternalLink, Code2, ShieldCheck, Cpu, GitFork } from 'lucide-react';

const OpenWeightStrip = () => {
  return (
    <section id="open-source-section" className="bg-[#FF5A1F] text-black py-14 font-space border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-black pb-6 gap-4">
          <div>
            <span className="font-mono text-xs font-black uppercase tracking-widest block mb-1">
              SECTION 04 — OPEN WEIGHT &amp; APACHE/MIT DIRECTORY
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-black tracking-tight text-black">
              Democratized Foundation Weights &amp; Permissive Codebases
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-black/80 uppercase tracking-widest">
            Verified Hugging Face &amp; GitHub Hubs
          </span>
        </div>

        {/* 4 Open Weight Families Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OPEN_WEIGHT_FAMILIES.map((family) => (
            <div
              key={family.family}
              className="bg-[#F8F3EA] border-2 border-black p-5 flex flex-col justify-between shadow-[6px_6px_0px_#101010] group hover:translate-y-[-2px] transition-transform"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-black/70 border-b-2 border-black/15 pb-2">
                  <span className="font-bold uppercase">{family.org}</span>
                  <span className="bg-black text-[#FF5A1F] px-2 py-0.5 font-bold">
                    {family.license}
                  </span>
                </div>

                <h3 className="font-syne text-xl font-black text-black tracking-tight group-hover:text-[#FF5A1F] transition-colors">
                  {family.family}
                </h3>

                <p className="font-mono text-xs font-bold text-black/90">
                  Params: {family.params}
                </p>

                <p className="text-xs text-black/80 leading-relaxed font-space border-l-2 border-black pl-2">
                  {family.strengths}
                </p>
              </div>

              {/* Links */}
              <div className="pt-4 mt-4 border-t-2 border-black/15 flex items-center justify-between font-mono text-xs">
                <a
                  href={family.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-black hover:text-[#FF5A1F] transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>

                <a
                  href={family.hfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-black hover:text-[#FF5A1F] transition-colors"
                >
                  <span>HuggingFace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OpenWeightStrip;
