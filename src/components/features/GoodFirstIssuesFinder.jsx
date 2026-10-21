import React, { useState, useEffect, useCallback } from 'react';
import {
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Clock,
  Loader2,
  AlertCircle,
  Tag,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { getGoodFirstIssues } from '../../services/githubService';

const POPULAR_LANGUAGES = [
  { id: '', label: 'All Languages' },
  { id: 'python', label: 'Python' },
  { id: 'rust', label: 'Rust' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'go', label: 'Go' },
  { id: 'cpp', label: 'C++' },
];

const GoodFirstIssuesFinder = ({ onSelectRepo }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchIssues = useCallback(async (lang) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGoodFirstIssues({ language: lang, perPage: 25 });
      setIssues(result.items || []);
      setTotalCount(result.totalCount || 0);
      setFetchedAt(result.fetchedAt || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch beginner-friendly issues');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues(selectedLanguage);
  }, [selectedLanguage, fetchIssues]);

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E12] border border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
              Good First Issues Finder
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Discover verified open issues labeled <code className="text-zinc-300 font-mono">good first issue</code> or <code className="text-zinc-300 font-mono">help wanted</code> across active open-source projects.
          </p>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {POPULAR_LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelectedLanguage(l.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 border ${
                selectedLanguage === l.id
                  ? 'bg-blue-600 text-white font-semibold border-blue-500 shadow-sm'
                  : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {fetchedAt && (
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
          <span>
            {totalCount.toLocaleString()} open issues indexed with beginner-friendly labels
            {selectedLanguage ? ` in ${selectedLanguage}` : ''}
          </span>
          <span>Fetched: {new Date(fetchedAt).toLocaleTimeString()} · GitHub REST API</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span>Querying open issues labeled `good first issue` on GitHub…</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : issues.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#0E0E12] border border-white/10 text-center space-y-2">
          <p className="text-xs text-zinc-400 font-mono">
            No open issues matching the selected language criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 rounded-xl bg-[#0E0E12] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-blue-400 font-semibold truncate">
                    {issue.repoFullName}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    Updated {new Date(issue.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mt-1.5 leading-snug">
                  <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
                    #{issue.number} {issue.title}
                  </a>
                </h3>

                {issue.labels && issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2.5">
                    {issue.labels.slice(0, 4).map((l, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono border"
                        style={{
                          backgroundColor: `#${l.color}15`,
                          borderColor: `#${l.color}35`,
                          color: `#${l.color}`,
                        }}
                      >
                        {l.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-500 text-[10px]">
                  @{issue.author?.login || 'contributor'}
                </span>

                <a
                  href={issue.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  <span>Solve on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoodFirstIssuesFinder;
