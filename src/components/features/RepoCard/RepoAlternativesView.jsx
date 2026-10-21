import React, { useState, useEffect } from 'react';
import {
  Compass,
  Star,
  ExternalLink,
  Loader2,
  Tag,
  Code2,
  ArrowRight,
  GitFork,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRepositoryAlternatives } from '../../../services/githubService';

const RepoAlternativesView = ({ repo, onSelectRepo }) => {
  const navigate = useNavigate();
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlts = async () => {
      setLoading(true);
      try {
        const result = await getRepositoryAlternatives(repo);
        if (isMounted) {
          setAlternatives(result.items || []);
          setFetchedAt(result.fetchedAt || null);
        }
      } catch (err) {
        console.error('Failed to load alternatives:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (repo) {
      fetchAlts();
    }
  }, [repo]);

  return (
    <div className="space-y-4 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-black/40 border border-white/[0.08]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Explainable Repository Alternatives</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Recommendations matched on verified shared language and common topic tags. No opaque similarity scores.
          </p>
        </div>
        {fetchedAt && (
          <div className="text-[10px] font-mono text-zinc-500 shrink-0">
            Fetched: {new Date(fetchedAt).toLocaleTimeString()} · GitHub API
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span>Searching for related repositories with matching topics…</span>
        </div>
      ) : alternatives.length === 0 ? (
        <div className="p-6 rounded-xl bg-[#0A0A0D] border border-white/[0.08] text-center space-y-2">
          <p className="text-xs text-zinc-400">
            No related open-source repositories found matching the specific topic tags of this project.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alternatives.map((alt) => {
            const starsFormatted =
              alt.stargazers_count >= 1000
                ? `${(alt.stargazers_count / 1000).toFixed(1)}k`
                : `${alt.stargazers_count || 0}`;

            return (
              <div
                key={alt.id || alt.name}
                className="p-4 rounded-xl bg-[#0A0A0D] border border-white/[0.08] hover:border-white/20 transition-all space-y-2.5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate">
                      <span>{alt.full_name || alt.name}</span>
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {alt.description || 'Open source repository on GitHub.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-zinc-300 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/10">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      <span>{starsFormatted}</span>
                    </div>

                    <a
                      href={alt.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                      title="Open on GitHub"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Explainable Match Reason Box */}
                <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-blue-300 font-sans flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold text-blue-200">Why this matched: </strong>
                    {alt.matchReason}
                  </p>
                </div>

                {/* Topic tags and language */}
                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-400">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {alt.language && (
                      <span className="text-zinc-300 font-medium">
                        {alt.language}
                      </span>
                    )}
                    {Array.isArray(alt.sharedTopics) && alt.sharedTopics.length > 0 && (
                      <span className="text-emerald-400">
                        • {alt.sharedTopics.length} shared {alt.sharedTopics.length === 1 ? 'topic' : 'topics'}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectRepo) {
                        onSelectRepo(alt);
                      } else {
                        navigate(`/dashboard?query=${encodeURIComponent(alt.full_name || alt.name)}`);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    <span>Inspect details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-zinc-500">
        Transparency note: Recommendations are generated from deterministic GitHub topic and language criteria. ExploreGit does not use black-box machine learning embeddings or synthetic similarity percentages.
      </div>
    </div>
  );
};

export default RepoAlternativesView;
