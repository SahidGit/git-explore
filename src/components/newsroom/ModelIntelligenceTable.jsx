import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOpenRouterModels } from '../../services/openRouterService';
import { Filter, ExternalLink, RefreshCw, Layers, CheckCircle2, XCircle, DollarSign, Cpu, AlertCircle } from 'lucide-react';

const ModelIntelligenceTable = () => {
  const [dataState, setDataState] = useState({
    loading: true,
    isLive: false,
    lastUpdated: '',
    models: [],
    error: null
  });

  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setDataState((prev) => ({ ...prev, loading: true }));
    const result = await fetchOpenRouterModels();
    setDataState({
      loading: false,
      isLive: result.isLive,
      lastUpdated: result.lastUpdated,
      models: result.models,
      error: result.error || null
    });
  };

  const filteredModels = dataState.models.filter((m) => {
    if (activeFilter === 'COMMERCIAL') return !m.isOpenSource;
    if (activeFilter === 'OPEN_SOURCE') return m.isOpenSource;
    if (activeFilter === 'REASONING') return m.reasoning.includes('High') || m.reasoning.includes('CoT') || m.reasoning.includes('Frontier') || m.reasoning.includes('Exceptional');
    if (activeFilter === 'MULTIMODAL') return m.modalities.some(x => x.toLowerCase().includes('vision') || x.toLowerCase().includes('audio'));
    if (activeFilter === 'REGIONAL') return m.region === 'Japan' || m.region === 'India' || m.region === 'China' || m.region === 'Europe';
    return true;
  });

  return (
    <section id="models-section" className="bg-[#101010] text-[#F8F3EA] py-16 border-b-2 border-black font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-white/20 pb-6 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              SECTION 03 — PUBLIC MODEL SPECIFICATION LEDGER
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#F8F3EA] tracking-tight">
              Frontier Model Economics, Context &amp; Capabilities
            </h2>
          </div>

          {/* OpenRouter Status Indicator & Report */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold border-2 ${
              dataState.isLive
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-[#FF5A1F]/10 border-[#FF5A1F] text-[#FF5A1F]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${dataState.isLive ? 'bg-emerald-400 animate-ping' : 'bg-[#FF5A1F]'}`} />
              {dataState.isLive ? 'Live API Feed' : 'Verified Feb 2026 Audit'}
            </span>

            <button
              onClick={loadModels}
              disabled={dataState.loading}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-[#F8F3EA] transition-colors cursor-pointer disabled:opacity-50 border border-white/20"
              title="Refresh OpenRouter data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataState.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Buttons & Data Note */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F8F3EA]/05 p-3.5 border-2 border-white/15 font-mono text-xs">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[#F8F3EA]/70 uppercase tracking-widest mr-2 text-[10px] flex items-center gap-1 font-bold">
              <Filter className="w-3 h-3 text-[#FF5A1F]" /> Category Filter:
            </span>

            {[
              { id: 'ALL', label: 'All Models' },
              { id: 'COMMERCIAL', label: 'Commercial' },
              { id: 'OPEN_SOURCE', label: 'Open Weight' },
              { id: 'REASONING', label: 'Reasoning (CoT)' },
              { id: 'MULTIMODAL', label: 'Multimodal' },
              { id: 'REGIONAL', label: 'Regional (JP/IN/CN/EU)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  activeFilter === f.id
                    ? 'bg-[#FF5A1F] text-black font-extrabold border-black shadow-[2px_2px_0px_#FFF]'
                    : 'bg-black text-[#F8F3EA]/80 border-white/20 hover:border-white/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#F8F3EA]/50 italic">
            *Pricing verified per 1 Million input/output tokens
          </span>
        </div>

        {/* Loading Spinner */}
        {dataState.loading && (
          <div className="py-16 text-center font-mono text-xs text-[#F8F3EA]/60">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FF5A1F] animate-spin mb-3" />
            <p>Querying OpenRouter API endpoints...</p>
          </div>
        )}

        {/* Brutalist Data Ledger Table */}
        {!dataState.loading && (
          <div className="overflow-x-auto border-2 border-white/20 shadow-2xl">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-[#F8F3EA] text-[#101010] font-bold text-[11px] uppercase tracking-wider border-b-2 border-black">
                  <th className="p-3.5 border-r border-black/20 font-syne">Model Name</th>
                  <th className="p-3.5 border-r border-black/20">Provider</th>
                  <th className="p-3.5 border-r border-black/20">License Type</th>
                  <th className="p-3.5 border-r border-black/20 text-right">Input ($/1M)</th>
                  <th className="p-3.5 border-r border-black/20 text-right">Output ($/1M)</th>
                  <th className="p-3.5 border-r border-black/20 text-right">Context Scale</th>
                  <th className="p-3.5 border-r border-black/20">Modalities</th>
                  <th className="p-3.5 border-r border-black/20">Reasoning</th>
                  <th className="p-3.5 border-r border-black/20 text-center">Coding</th>
                  <th className="p-3.5 text-right">Source Link</th>
                </tr>
              </thead>
              <tbody className="divide-y border-t border-white/10 divide-white/10">
                {filteredModels.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-white/[0.04] transition-colors group text-[#F8F3EA]/90"
                  >
                    <td className="p-3.5 font-bold text-white border-r border-white/10 font-syne">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${m.isOpenSource ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span>{m.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#F8F3EA]/80 border-r border-white/10">
                      {m.provider} <span className="text-[10px] text-[#F8F3EA]/50 font-mono">({m.region})</span>
                    </td>
                    <td className="p-3.5 border-r border-white/10">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold border ${
                        m.isOpenSource ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/10 text-zinc-300 border-white/20'
                      }`}>
                        {m.license}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400 border-r border-white/10">
                      ${m.inputPrice.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-300 border-r border-white/10">
                      ${m.outputPrice.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-right font-mono border-r border-white/10 text-sky-300 font-bold">
                      {(m.contextWindow / 1024).toFixed(0)}k
                    </td>
                    <td className="p-3.5 border-r border-white/10 text-[11px]">
                      {m.modalities.join(', ')}
                    </td>
                    <td className="p-3.5 border-r border-white/10 font-bold text-[#FF5A1F]">
                      {m.reasoning}
                    </td>
                    <td className="p-3.5 text-center font-mono border-r border-white/10">
                      <span className="bg-white/10 px-2 py-0.5 font-bold border border-white/15">
                        {m.coding}/100
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={m.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#FF5A1F] hover:underline font-bold text-[11px]"
                      >
                        <span>Official</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Visual Economics Tradeoff Visualizer */}
        <div className="bg-[#101010] border-2 border-white/20 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
            <h4 className="font-syne text-lg text-[#F8F3EA] font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FF5A1F]" />
              Model Economics: Input Price vs. Context Window Scale
            </h4>
            <span className="font-mono text-[11px] text-[#F8F3EA]/60">
              Verified Public Pricing Breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-2">
            {filteredModels.slice(0, 4).map((m) => (
              <div key={m.id} className="p-4 bg-black border border-white/20 space-y-3 shadow-[3px_3px_0px_#222]">
                <div className="flex justify-between items-center text-[#FF5A1F] font-bold font-syne">
                  <span>{m.name}</span>
                  <span className="text-[10px] text-[#F8F3EA]/60 font-mono">{m.provider}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">Context:</span>
                    <span className="text-sky-300 font-bold">{(m.contextWindow / 1000).toFixed(0)}k tokens</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-none overflow-hidden">
                    <div
                      className="bg-sky-400 h-full"
                      style={{ width: `${Math.min(100, (m.contextWindow / 1000000) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">Input Cost:</span>
                    <span className="text-emerald-400 font-bold">${m.inputPrice}/1M</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-none overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full"
                      style={{ width: `${Math.min(100, (m.inputPrice / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ModelIntelligenceTable;
