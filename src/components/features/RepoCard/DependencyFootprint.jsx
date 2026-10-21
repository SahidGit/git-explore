import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  ExternalLink,
  Loader2,
  FileCode2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { getDependencyFootprint } from '../../../services/githubService';

const DependencyFootprint = ({ repo }) => {
  const [footprint, setFootprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'runtime' | 'dev'

  const owner = repo.owner?.login || repo.full_name?.split('/')[0] || '';
  const repoName = repo.name || repo.full_name?.split('/')[1] || '';

  useEffect(() => {
    let isMounted = true;
    const fetchFootprint = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDependencyFootprint(owner, repoName);
        if (isMounted) setFootprint(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to scan package manifest');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (owner && repoName) {
      fetchFootprint();
    }
  }, [owner, repoName]);

  const dependencies = footprint?.dependencies || [];
  const devDependencies = footprint?.devDependencies || [];

  const allItems = [
    ...dependencies.map((d) => ({ ...d, isDev: false })),
    ...devDependencies.map((d) => ({ ...d, isDev: true })),
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'runtime') return !item.isDev;
    if (filterType === 'dev') return item.isDev;
    return true;
  });

  return (
    <div className="space-y-4 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-black/40 border border-white/[0.08]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Declared Dependency Footprint</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Parsed from declared manifests (package.json, Cargo.toml, requirements.txt, go.mod).
          </p>
        </div>
        {footprint?.manifestFound && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              {footprint.ecosystem}
            </span>
            <a
              href={footprint.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <span>{footprint.manifestPath}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span>Scanning repository root for declared manifests…</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : !footprint?.manifestFound ? (
        <div className="p-6 rounded-xl bg-[#0A0A0D] border border-white/[0.08] text-center space-y-3">
          <FileCode2 className="w-8 h-8 text-zinc-500 mx-auto" />
          <div>
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
              No Supported Manifest Detected
            </h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
              Searched for standard package manifests (`package.json`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `go.mod`).
              The project may use a specialized build tool, C/C++ Makefiles, or a monorepo sub-directory structure.
            </p>
          </div>
          <p className="text-[10px] font-mono text-zinc-500">
            Scanned on {new Date(footprint?.scanTime).toLocaleTimeString()} · GitHub Contents API
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary metrics strip */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#0A0A0D] border border-white/[0.08]">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Total Declared</span>
              <span className="text-base font-bold font-mono text-white mt-0.5 block">
                {footprint.totalCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0A0A0D] border border-white/[0.08]">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Runtime Dependencies</span>
              <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                {dependencies.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0A0A0D] border border-white/[0.08]">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Dev / Build Tools</span>
              <span className="text-base font-bold font-mono text-zinc-300 mt-0.5 block">
                {devDependencies.length}
              </span>
            </div>
          </div>

          {/* Search and filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dependencies…"
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-mono"
              />
            </div>

            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                  filterType === 'all' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({allItems.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('runtime')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                  filterType === 'runtime' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Runtime ({dependencies.length})
              </button>
              {devDependencies.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterType('dev')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                    filterType === 'dev' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Dev ({devDependencies.length})
                </button>
              )}
            </div>
          </div>

          {/* Dependencies list */}
          <div className="p-3 rounded-xl bg-[#0A0A0D] border border-white/[0.08] max-h-80 overflow-y-auto divide-y divide-white/[0.05]">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="py-2 flex items-center justify-between gap-3 font-mono text-xs">
                  <div className="min-w-0 flex items-center gap-2">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold border ${
                        item.isDev
                          ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {item.isDev ? 'dev' : 'runtime'}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white hover:text-blue-400 transition-colors truncate"
                    >
                      {item.name}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-zinc-400 truncate max-w-[120px]">
                      {item.spec}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-zinc-500 hover:text-white transition-colors"
                      title={`View ${item.name} on ${footprint.ecosystem} registry`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 py-4 text-center font-sans">
                No dependencies matching your search filter.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
            <span>Scan timestamp: {new Date(footprint.scanTime).toLocaleTimeString()}</span>
            <span>Registry links generated directly from package ecosystem identifiers</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyFootprint;
