import gitImage1 from '../../assets/docs/doc-quick-start.webp';
import gitImage2 from '../../assets/docs/doc-explore-discovery.webp';
import gitImage3 from '../../assets/docs/doc-deepseek-lens.webp';
import gitImage4 from '../../assets/docs/doc-auth-ratelimit.webp';
import gitImage5 from '../../assets/docs/doc-bookmarks-storage.webp';
import gitImage6 from '../../assets/company/value-professionalism.webp';

export const docsContent = {
  title: 'Documentation',
  subtitle:
    'Architecture guide, GitHub REST API rate-limit governance, repository velocity metrics, and local-first research storage.',
  layout: 'grid',
  cards: [
    {
      id: 'quick-start',
      image: gitImage1,
      title: 'Quick Start & Discovery',
      description:
        'Explore repositories with zero onboarding friction. Query the GitHub registry, filter by language or activity, and inspect metrics immediately.',
      links: [
        { label: 'Open dashboard', href: '/dashboard' },
        { label: 'Browse languages', href: '/languages' },
      ],
    },
    {
      id: 'explore-discovery',
      image: gitImage2,
      title: 'Registry Search & Filters',
      description:
        'Execute precision queries across open-source projects. Combine star counts, fork velocity, and recent release filters to uncover active dependencies.',
      links: [
        { label: 'Explore repositories', href: '/dashboard' },
        { label: 'Trending stacks', href: '/languages' },
      ],
    },
    {
      id: 'repository-intelligence',
      image: gitImage3,
      title: 'Repository Intelligence',
      description:
        'Audit commit velocity curves, contribution cadence, and issue closure rates to evaluate maintainer responsiveness before adopting dependencies.',
      links: [
        { label: 'Inspect live metrics', href: '/dashboard' },
        { label: 'AI newsroom', href: '/ai-news' },
      ],
    },
    {
      id: 'api-governance',
      image: gitImage4,
      title: 'API & Rate-Limit Governance',
      description:
        'Unauthenticated requests are capped at 60/hr. Connect a GitHub Personal Access Token to elevate your quota to 5,000/hr, cached client-side.',
      links: [
        { label: 'Manage API token', href: '/api' },
        { label: 'Token setup guide', href: '/api' },
      ],
    },
    {
      id: 'bookmarks-storage',
      image: gitImage5,
      title: 'Local-First Collections',
      description:
        'Bookmark libraries, curate stacks, and persist research locally in your browser with zero cloud telemetry or third-party tracking.',
      links: [
        { label: 'Open saved bookmarks', href: '/bookmarks' },
        { label: 'Privacy standards', href: '/privacy' },
      ],
    },
    {
      id: 'standards-security',
      image: gitImage6,
      title: 'Standards & Security',
      description:
        'Client-side execution, transparent MIT licensing, and zero external database storage safeguard your developer workflow and queries.',
      links: [
        { label: 'Company & vision', href: '/company' },
        { label: 'Git cheat sheet', href: '/cheatsheet' },
      ],
    },
  ],
  content: `
    <!-- Compact Documentation Index Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono mb-8">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
        <span class="text-white font-semibold">Documentation Index:</span>
        <span class="text-zinc-400 hidden sm:inline">Machine-readable index available at</span>
        <a href="https://exploregit.vercel.app/llms.txt" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:underline">
          llms.txt
        </a>
      </div>
      <a href="https://exploregit.vercel.app/llms.txt" target="_blank" rel="noopener noreferrer" class="text-[11px] text-zinc-400 hover:text-white shrink-0">
        Fetch Index &rarr;
      </a>
    </div>

    <!-- Introduction -->
    <div class="space-y-2 mb-8">
      <h2 class="text-xl font-bold font-heading text-white tracking-tight">Introduction</h2>
      <p class="text-sm text-zinc-300 leading-relaxed font-sans">
        ExploreGit aggregates live GitHub repository telemetry—commit velocity, issue turnaround, and language distributions—to help engineers evaluate open-source foundations before adopting them. Move beyond vanity stars to empirical maintenance vitality.
      </p>
    </div>

    <!-- Quick 3-Step Setup -->
    <div class="space-y-3 mb-8">
      <h3 class="text-base font-bold font-heading text-white tracking-tight">Quick Setup</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs">
        <div class="p-4 rounded-xl border border-white/10 bg-[#0E0E12] flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="font-mono text-[10px] text-emerald-400 font-bold uppercase">01 / Discover</div>
            <div class="font-semibold text-white">Instant Exploration</div>
            <p class="text-zinc-400 leading-relaxed text-[11px]">
              Search repositories by language, topic, or keyword with zero registration.
            </p>
          </div>
          <a href="/dashboard" class="inline-flex items-center gap-1 font-mono text-zinc-300 hover:text-white font-medium">
            Open Dashboard &rarr;
          </a>
        </div>

        <div class="p-4 rounded-xl border border-white/10 bg-[#0E0E12] flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="font-mono text-[10px] text-emerald-400 font-bold uppercase">02 / Authenticate</div>
            <div class="font-semibold text-white">5,000 Req/Hr Quota</div>
            <p class="text-zinc-400 leading-relaxed text-[11px]">
              Connect a personal access token for higher limits. Stored only in browser session.
            </p>
          </div>
          <a href="/api" class="inline-flex items-center gap-1 font-mono text-zinc-300 hover:text-white font-medium">
            Connect Token &rarr;
          </a>
        </div>

        <div class="p-4 rounded-xl border border-white/10 bg-[#0E0E12] flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="font-mono text-[10px] text-emerald-400 font-bold uppercase">03 / Curate</div>
            <div class="font-semibold text-white">Private Local Vault</div>
            <p class="text-zinc-400 leading-relaxed text-[11px]">
              Save candidate stacks to your offline storage. Zero third-party telemetry.
            </p>
          </div>
          <a href="/bookmarks" class="inline-flex items-center gap-1 font-mono text-zinc-300 hover:text-white font-medium">
            View Bookmarks &rarr;
          </a>
        </div>
      </div>
    </div>

    <!-- 2-Column: Why Velocity & How It Works -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-4 border-t border-white/10">
      <div class="space-y-3">
        <h3 class="text-base font-bold font-heading text-white tracking-tight">Why Velocity Matters</h3>
        <ul class="space-y-2 text-xs text-zinc-300 font-sans">
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-mono mt-0.5">&bull;</span>
            <div><strong class="text-white">Active commit cadence:</strong> 52-week curves verify sustained developer investment.</div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-mono mt-0.5">&bull;</span>
            <div><strong class="text-white">Issue turnaround:</strong> Differentiate responsive teams from abandoned issue trackers.</div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-mono mt-0.5">&bull;</span>
            <div><strong class="text-white">Contributor diversity:</strong> Detect single-maintainer risks early.</div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-mono mt-0.5">&bull;</span>
            <div><strong class="text-white">Zero tracking:</strong> Stacks and search queries remain private on your machine.</div>
          </li>
        </ul>
      </div>

      <div class="space-y-3">
        <h3 class="text-base font-bold font-heading text-white tracking-tight">Architecture &amp; Flow</h3>
        <ol class="space-y-2 text-xs text-zinc-300 font-sans">
          <li class="flex items-start gap-2">
            <span class="font-mono text-zinc-500 font-bold">1.</span>
            <div><strong class="text-white">Direct GitHub REST API:</strong> Live client requests with no proxy delay.</div>
          </li>
          <li class="flex items-start gap-2">
            <span class="font-mono text-zinc-500 font-bold">2.</span>
            <div><strong class="text-white">Client Token Governance:</strong> Header injection elevating quota to 5,000/hr.</div>
          </li>
          <li class="flex items-start gap-2">
            <span class="font-mono text-zinc-500 font-bold">3.</span>
            <div><strong class="text-white">Interactive Telemetry:</strong> In-browser commit curves &amp; health signals.</div>
          </li>
          <li class="flex items-start gap-2">
            <span class="font-mono text-zinc-500 font-bold">4.</span>
            <div><strong class="text-white">Local-First Storage:</strong> Preferences and bookmarks persist in Web Storage.</div>
          </li>
        </ol>
      </div>
    </div>

    <!-- Compact Navigation Grid -->
    <div class="space-y-3 mb-8 pt-4 border-t border-white/10">
      <h3 class="text-base font-bold font-heading text-white tracking-tight">Explore the Platform</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-sans text-xs">
        <a href="/dashboard" class="p-3 rounded-lg border border-white/10 bg-[#0E0E12] hover:border-white/20 transition-all group">
          <div class="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            Explore Repositories <span class="font-mono text-[10px] text-zinc-500">&rarr;</span>
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Live search &amp; health metrics</p>
        </a>

        <a href="/languages" class="p-3 rounded-lg border border-white/10 bg-[#0E0E12] hover:border-white/20 transition-all group">
          <div class="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            Trending Stacks <span class="font-mono text-[10px] text-zinc-500">&rarr;</span>
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Fast-growing ecosystems</p>
        </a>

        <a href="/cheatsheet" class="p-3 rounded-lg border border-white/10 bg-[#0E0E12] hover:border-white/20 transition-all group">
          <div class="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            Git Cheat Sheet <span class="font-mono text-[10px] text-zinc-500">&rarr;</span>
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Essential workflows &amp; tips</p>
        </a>

        <a href="/api" class="p-3 rounded-lg border border-white/10 bg-[#0E0E12] hover:border-white/20 transition-all group">
          <div class="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            API Quotas &amp; PAT <span class="font-mono text-[10px] text-zinc-500">&rarr;</span>
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Rate limit test console</p>
        </a>

        <a href="/ai-news" class="p-3 rounded-lg border border-white/10 bg-[#0E0E12] hover:border-white/20 transition-all group">
          <div class="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            AI Newsroom <span class="font-mono text-[10px] text-zinc-500">&rarr;</span>
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Open model breakthroughs</p>
        </a>

        <a href="/company" class="p-3 rounded-lg border border-white/10 bg-[#0E0E12] hover:border-white/20 transition-all group">
          <div class="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            Company &amp; Team <span class="font-mono text-[10px] text-zinc-500">&rarr;</span>
          </div>
          <p class="text-[11px] text-zinc-400 mt-1">Open-source philosophy</p>
        </a>
      </div>
    </div>

    <!-- Minimal Platform Resources Bar -->
    <div class="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-400">
      <span class="text-zinc-500 font-semibold uppercase text-[10px]">Resources:</span>
      <a href="/api" class="hover:text-white transition-colors">API Reference</a>
      <span class="text-white/20">&bull;</span>
      <a href="/privacy" class="hover:text-white transition-colors">Privacy</a>
      <span class="text-white/20">&bull;</span>
      <a href="/terms" class="hover:text-white transition-colors">Terms</a>
      <span class="text-white/20">&bull;</span>
      <a href="/changelog" class="hover:text-white transition-colors">Changelog</a>
      <span class="text-white/20">&bull;</span>
      <a href="/report" class="hover:text-white transition-colors">Report Issue</a>
    </div>
  `,
};

