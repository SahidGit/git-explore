import React from 'react';
import { CAPITAL_INFRASTRUCTURE } from '../../data/aiNewsData';
import { Landmark, ExternalLink, DollarSign, Cpu, CheckCircle2 } from 'lucide-react';

const CapitalInfrastructure = () => {
  return (
    <section id="capital-section" className="bg-[#101010] text-[#F8F3EA] py-16 border-b-2 border-black font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-white/20 pb-6 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              SECTION 06 — CAPITAL &amp; COMPUTE SUPERSTRUCTURE
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#F8F3EA] tracking-tight">
              Sovereign Fabs &amp; Megawatt Scale Data Clusters
            </h2>
          </div>
          <span className="font-mono text-xs text-[#F8F3EA]/70 uppercase tracking-widest">
            Project Stargate &amp; Sovereign Fabs
          </span>
        </div>

        {/* 3 Capital Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPITAL_INFRASTRUCTURE.map((item) => (
            <div
              key={item.title}
              className="bg-[#101010] border-2 border-white/20 p-6 flex flex-col justify-between hover:border-[#FF5A1F] transition-all duration-300 shadow-[6px_6px_0px_#1c1c20] group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#F8F3EA]/60 border-b border-white/15 pb-2">
                  <span className="font-bold text-[#FF5A1F] uppercase">{item.type}</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-3xl font-black text-[#F8F3EA] block font-syne">
                    {item.amount}
                  </span>
                  <h3 className="font-syne text-xl font-bold text-[#F8F3EA] group-hover:text-[#FF5A1F] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="font-mono text-xs text-zinc-400">
                  Key Consortium: <span className="text-zinc-200">{item.partners}</span>
                </p>

                <p className="text-xs text-[#F8F3EA]/80 leading-relaxed font-space border-l-2 border-[#FF5A1F] pl-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between font-mono text-xs">
                <span className="text-[10px] text-zinc-500 uppercase">Verified Sourced Report</span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#FF5A1F] hover:underline"
                >
                  <span>Primary Citation</span>
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

export default CapitalInfrastructure;
