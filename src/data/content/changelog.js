export const changelogContent = {
  title: 'Release Notes',
  subtitle: 'Changelog and version history for the ExploreGit platform.',
  content: `
    <div class="space-y-8">
      <div class="relative border-l border-white/[0.08] ml-3 pl-6 sm:pl-8 space-y-10">
        <!-- v2.3.0 -->
        <div class="relative">
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0A0A0C]"></span>
          <div class="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <h3 class="text-lg font-bold text-white tracking-tight">v2.3.0 — Automated Gems Engine & Criteria v2</h3>
            <span class="font-mono text-xs text-zinc-500">November 2026</span>
          </div>
          <div class="p-4 rounded-xl bg-[#121215] border border-white/[0.06] space-y-2">
            <ul class="space-y-2 text-xs sm:text-sm text-[#A1A1AA]">
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Automated Monthly Gems Engine</strong>: Scheduled evaluator pipeline with rate-limit budgeting, 25% anomaly circuit breaker, and immutable monthly audit snapshots.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Criteria Registry v2</strong>: Append-only criteria registry with permanent IDs, star-derived dynamic tiers, and validated human manual review records.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Static Dataset Pipeline</strong>: Eliminated browser API rate-limits by shifting to precomputed static datasets (/data/gems.json).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>New Curated Gems</strong>: Added KeePassXC, Kdenlive, Stirling-PDF, LosslessCut, and llama.cpp.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Telemetry Caching & Zero Sample Data</strong>: Replaced mock labels with 24-hour cache-first telemetry to prevent token and rate limit exhaustion.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- v2.2.0 -->
        <div class="relative">
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white/40 border-2 border-[#0A0A0C]"></span>
          <div class="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <h3 class="text-lg font-bold text-white tracking-tight">v2.2.0 — Repository Discovery & Data Integrity</h3>
            <span class="font-mono text-xs text-zinc-500">October 2026</span>
          </div>
          <div class="p-4 rounded-xl bg-[#121215] border border-white/[0.06] space-y-2">
            <ul class="space-y-2 text-xs sm:text-sm text-[#A1A1AA]">
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Maintenance Checklist</strong>: Verifiable adoption signals directly linked to GitHub repository roots.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Topic Collections</strong>: Curated ecosystem hubs (Agentic AI, Rust Systems, Dev Tools, Local LLMs, Web3).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Release Radar</strong>: Followed repository release watcher with tag versions, changelogs, and asset links.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Good First Issues Finder</strong>: Targeted discovery for open, beginner-friendly contributions.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span><strong>Dependency Footprint & Licenses</strong>: Direct manifest parsing (npm, Cargo, PyPI, Go) and SPDX license compatibility matrix.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- v2.1.0 -->
        <div class="relative">
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white/40 border-2 border-[#0A0A0C]"></span>
          <div class="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <h3 class="text-lg font-bold text-white tracking-tight">v2.1.0 — AI-Native Design System & Performance</h3>
            <span class="font-mono text-xs text-zinc-500">February 2026</span>
          </div>
          <div class="p-4 rounded-xl bg-[#121215] border border-white/[0.06] space-y-2">
            <ul class="space-y-2 text-xs sm:text-sm text-[#A1A1AA]">
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span>Complete design overhaul with deep canvas theme (#0A0A0C) and JetBrains Mono accents.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span>Real-time API Rate Limit meter with live quota tracking and reset countdowns.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span>Interactive Terminal component with mock query playback and line-by-line inspection.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span>High-density Bento Feature Grid with instant tag navigation and smooth interactions.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- v2.0.0 -->
        <div class="relative">
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white/40 border-2 border-[#0A0A0C]"></span>
          <div class="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <h3 class="text-lg font-bold text-white tracking-tight">v2.0.0 — Platform Foundation & Local Bookmarks</h3>
            <span class="font-mono text-xs text-zinc-500">December 2025</span>
          </div>
          <div class="p-4 rounded-xl bg-[#121215] border border-white/[0.06] space-y-2">
            <ul class="space-y-2 text-xs sm:text-sm text-[#A1A1AA]">
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span>Launched Explore discovery engine with multi-criteria filtering and timeframes.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span>Integrated local-first browser storage for private bookmarking and repository notes.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#4397E0] font-mono text-xs">&plus;</span>
                <span>Contribution heatmap visualization for developer profiles across open source.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
};
