import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  FileText,
  Clock,
  GitCommit,
  Tag,
  Loader2,
  Lock,
} from 'lucide-react';
import { getCommunityProfile, getLatestRelease } from '../../../services/githubService';

/**
 * Maintenance Checklist Component
 * Shows verifiable adoption signals linked directly to their GitHub sources.
 * Does not combine signals into an unsupported health score.
 */
const MaintenanceChecklist = ({ repo, details }) => {
  const [communityData, setCommunityData] = useState(null);
  const [latestRelease, setLatestRelease] = useState(null);
  const [loading, setLoading] = useState(true);

  const owner = repo.owner?.login || repo.full_name?.split('/')[0] || '';
  const repoName = repo.name || repo.full_name?.split('/')[1] || '';

  useEffect(() => {
    let isMounted = true;
    const fetchSignals = async () => {
      setLoading(true);
      try {
        const [commRes, relRes] = await Promise.allSettled([
          getCommunityProfile(owner, repoName),
          getLatestRelease(owner, repoName),
        ]);
        if (isMounted) {
          if (commRes.status === 'fulfilled') setCommunityData(commRes.value);
          if (relRes.status === 'fulfilled') setLatestRelease(relRes.value);
        }
      } catch (err) {
        console.error('Failed to load maintenance signals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (owner && repoName) {
      fetchSignals();
    }
  }, [owner, repoName]);

  const files = communityData?.files || {};
  const isArchived = repo.archived ?? details?.archived ?? false;
  const pushedDate = repo.pushed_at || details?.pushed_at;
  const licenseSpdx = repo.license?.spdx_id || details?.license?.spdx_id || repo.license?.name || details?.license?.name;

  // Adoption & Maintenance checklist items with verifiable links
  const checklist = [
    {
      id: 'archived',
      title: 'Repository Status',
      value: isArchived ? 'Archived (Read-Only)' : 'Active / Maintained',
      status: isArchived ? 'warning' : 'positive',
      icon: isArchived ? AlertCircle : CheckCircle2,
      description: isArchived
        ? 'This repository has been archived by the owner. It is read-only and no longer receives updates.'
        : 'The repository is open and active for contributions and issues.',
      link: repo.html_url || `https://github.com/${owner}/${repoName}`,
      linkLabel: 'View repository status',
    },
    {
      id: 'last-push',
      title: 'Last Commit / Push',
      value: pushedDate ? new Date(pushedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown',
      status: pushedDate ? 'positive' : 'neutral',
      icon: GitCommit,
      description: pushedDate
        ? `Last push timestamp recorded by GitHub on ${new Date(pushedDate).toISOString()}.`
        : 'Push history unavailable from GitHub API.',
      link: `https://github.com/${owner}/${repoName}/commits`,
      linkLabel: 'View commit history',
    },
    {
      id: 'latest-release',
      title: 'Latest Official Release',
      value: latestRelease ? latestRelease.tagName : 'No releases published',
      status: latestRelease ? 'positive' : 'neutral',
      icon: Tag,
      description: latestRelease
        ? `Published on ${new Date(latestRelease.publishedAt).toLocaleDateString()} (${latestRelease.name || latestRelease.tagName}).`
        : 'The maintainers have not tagged an official release on GitHub (builds track default branch).',
      link: latestRelease?.htmlUrl || `https://github.com/${owner}/${repoName}/releases`,
      linkLabel: 'View releases on GitHub',
    },
    {
      id: 'license',
      title: 'Open Source License',
      value: licenseSpdx || 'Unspecified / Custom',
      status: licenseSpdx ? 'positive' : 'warning',
      icon: FileText,
      description: licenseSpdx
        ? `Explicit SPDX license declaration (${licenseSpdx}). Governs rights and obligations.`
        : 'No standardized SPDX license identified. Without a license, all rights are reserved by default.',
      link: files.license?.html_url || (repo.html_url ? `${repo.html_url}/blob/HEAD/LICENSE` : `https://github.com/${owner}/${repoName}/blob/HEAD/LICENSE`),
      linkLabel: 'Inspect LICENSE file',
    },
    {
      id: 'security-policy',
      title: 'Security Policy (SECURITY.md)',
      value: files.security_advisory ? 'Security Policy Published' : 'No explicit SECURITY.md',
      status: files.security_advisory ? 'positive' : 'neutral',
      icon: Shield,
      description: files.security_advisory
        ? 'A documented vulnerability disclosure policy is published for responsible security reporting.'
        : 'No dedicated SECURITY.md was detected in the repository root or .github folder.',
      link: files.security_advisory?.html_url || `https://github.com/${owner}/${repoName}/security/policy`,
      linkLabel: 'View security policy',
    },
    {
      id: 'contributing-guidance',
      title: 'Contribution Guide (CONTRIBUTING.md)',
      value: files.contributing ? 'Contribution Guide Available' : 'No CONTRIBUTING.md detected',
      status: files.contributing ? 'positive' : 'neutral',
      icon: FileText,
      description: files.contributing
        ? 'Clear guidelines exist for submitting pull requests, coding standards, and testing.'
        : 'No dedicated CONTRIBUTING.md guide file was indexed by GitHub Community Profile.',
      link: files.contributing?.html_url || `https://github.com/${owner}/${repoName}/blob/HEAD/CONTRIBUTING.md`,
      linkLabel: 'Read contribution guide',
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-black/40 border border-white/[0.08]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>Maintenance & Adoption Signals</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Verifiable adoption signals linked to original GitHub source records. Signals are never aggregated into an unsupported score.
          </p>
        </div>
        <div className="text-[10px] font-mono text-zinc-500 shrink-0">
          Source: GitHub REST API
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span>Validating repository adoption signals…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => {
            const Icon = item.icon;
            const isPos = item.status === 'positive';
            const isWarn = item.status === 'warning';

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#0A0A0D] border border-white/[0.08] hover:border-white/20 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isPos
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : isWarn
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-zinc-500/10 text-zinc-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-zinc-300">
                        {item.title}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                        isPos
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isWarn
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.05] flex justify-end">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    <span>{item.linkLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-zinc-500">
        Signal verification policy: Every adoption signal links directly to a verifiable upstream resource (commits, tags, licenses, or community security files). No synthetic score or simulated maintenance weight is applied.
      </div>
    </div>
  );
};

export default MaintenanceChecklist;
