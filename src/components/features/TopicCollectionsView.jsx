import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Terminal,
  Cpu,
  Globe,
  ShieldCheck,
  Laptop,
  ArrowRight,
  Star,
  ExternalLink,
  Info,
  Search,
  ArrowLeftRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TOPIC_COLLECTIONS } from '../../data/topicCollections';

const ICON_MAP = {
  Laptop,
  Terminal,
  Cpu,
  Layers,
  Globe,
  ShieldCheck,
};

const TopicCollectionsView = ({ onSelectRepo }) => {
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState(TOPIC_COLLECTIONS[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all'); // 'all' | 'curated' | 'auto-generated'

  const filteredCollections = TOPIC_COLLECTIONS.filter((col) => {
    const matchesSearch =
      col.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      col.description.toLowerCase().includes(searchFilter.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTypeFilter === 'curated') return col.type === 'curated';
    if (activeTypeFilter === 'auto-generated') return col.type === 'auto-generated';
    return true;
  });

  const ActiveIcon = ICON_MAP[selectedCollection?.icon] || Layers;

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E12] border border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
              Topic Collections
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Browse thematic developer ecosystems. Each collection is clearly labeled as curated or auto-generated, with documented selection criteria.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTypeFilter === 'all'
                ? 'bg-white text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({TOPIC_COLLECTIONS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('curated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTypeFilter === 'curated'
                ? 'bg-purple-500 text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Curated
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('auto-generated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTypeFilter === 'auto-generated'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Auto-Generated
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Collections Catalog Sidebar */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter collections…"
              className="w-full bg-[#0E0E12] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-mono"
            />
          </div>

          <div className="space-y-2">
            {filteredCollections.map((col) => {
              const Icon = ICON_MAP[col.icon] || Layers;
              const isSelected = selectedCollection?.id === col.id;
              const isCurated = col.type === 'curated';

              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedCollection(col)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.08] border-white/30 shadow-sm'
                      : 'bg-[#0E0E12] border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />
                      <span className="text-xs font-bold text-white truncate">{col.name}</span>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-semibold ${
                        isCurated
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      }`}
                    >
                      {col.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-1">
                    {col.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Collection Focus Card */}
        {selectedCollection && (
          <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0E0E12] border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                      selectedCollection.type === 'curated'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {selectedCollection.type === 'curated'
                      ? 'Curated Collection'
                      : 'Auto-Generated (GitHub Topic)'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
                  <ActiveIcon className="w-5 h-5 text-blue-400" />
                  <span>{selectedCollection.name}</span>
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {selectedCollection.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {selectedCollection.repositories?.length >= 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const r1 = selectedCollection.repositories[0]?.name;
                      const r2 = selectedCollection.repositories[1]?.name;
                      const r3 = selectedCollection.repositories[2]?.name;
                      const url = `/compare?repo1=${encodeURIComponent(r1)}&repo2=${encodeURIComponent(r2)}${r3 ? `&repo3=${encodeURIComponent(r3)}` : ''}`;
                      navigate(url);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>Compare Stack</span>
                  </button>
                )}
              </div>
            </div>

            {/* Documented Selection Criteria Banner */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200 font-mono text-[10px] uppercase block tracking-wider mb-0.5">
                  Selection & Ranking Criteria
                </strong>
                {selectedCollection.criteria}
              </div>
            </div>

            {/* Repository List in Collection */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Indexed Repositories ({selectedCollection.repositories?.length || 0})
              </h4>

              <div className="divide-y divide-white/[0.06] rounded-xl bg-black/30 border border-white/[0.06] p-2">
                {selectedCollection.repositories?.map((r) => (
                  <div
                    key={r.name}
                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.03] rounded-lg transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                          {r.name}
                        </span>
                        {r.lang && (
                          <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
                            {r.lang}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {r.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="flex items-center gap-1 text-xs font-mono text-zinc-300">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                        <span>{r.stars}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectRepo) {
                            onSelectRepo({ full_name: r.name, name: r.name.split('/')[1] || r.name, description: r.desc });
                          } else {
                            navigate(`/dashboard?query=${encodeURIComponent(r.name)}`);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-xs font-mono text-blue-400 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <a
                        href={`https://github.com/${r.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-zinc-500 hover:text-white transition-colors"
                        title="Open on GitHub"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCollectionsView;
