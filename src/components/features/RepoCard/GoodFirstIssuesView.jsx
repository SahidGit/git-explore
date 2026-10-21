import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Clock,
  Loader2,
  AlertCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { getGoodFirstIssues } from '../../../services/githubService';

const GoodFirstIssuesView = ({ repo }) => {
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  const owner = repo.owner?.login || repo.full_name?.split('/')[0] || '';
  const repoName = repo.name || repo.full_name?.split('/')[1] || '';

  useEffect(() => {
    let isMounted = true;
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getGoodFirstIssues({ owner, repo: repoName, perPage: 15 });
        if (isMounted) {
          setIssues(result.items || []);
          setTotalCount(result.totalCount || 0);
          setFetchedAt(result.fetchedAt || null);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch issues');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (owner && repoName) {
      fetchIssues();
    }
  }, [owner, repoName]);

  return (
    <div className="space-y-4 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-black/40 border border-white/[0.08]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Good First Issues & Help Wanted</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Open beginner-friendly issues curated by maintainers for new contributors.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`https://github.com/${owner}/${repoName}/contribute`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GitHub Contribute Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {fetchedAt && (
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
          <span>Found {totalCount} open contribution issues</span>
          <span>Fetched: {new Date(fetchedAt).toLocaleTimeString()}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span>Searching for beginner-labeled issues on GitHub…</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : issues.length === 0 ? (
        <div className="p-6 rounded-xl bg-[#0A0A0D] border border-white/[0.08] text-center space-y-2">
          <p className="text-xs text-zinc-400">
            No open issues currently tagged with `good first issue` or `help wanted` in this repository.
          </p>
          <a
            href={`https://github.com/${owner}/${repoName}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Browse all open issues on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="p-3.5 rounded-xl bg-[#0A0A0D] border border-white/[0.08] hover:border-white/20 transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
                      #{issue.number} {issue.title}
                    </a>
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1">
                    Opened by @{issue.author?.login || 'contributor'} · Updated {new Date(issue.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {issue.comments > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                      <MessageSquare className="w-3 h-3" />
                      {issue.comments}
                    </span>
                  )}
                  <a
                    href={issue.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                    title="Open issue on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {issue.labels && issue.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {issue.labels.map((l, i) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default GoodFirstIssuesView;
