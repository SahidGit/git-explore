export const roadmapContent = {
  title: 'Product Roadmap',
  subtitle: 'Upcoming milestones and technical architecture initiatives.',
  content: `
    <div class="space-y-8">
      <div class="relative border-l border-white/[0.08] ml-3 pl-6 sm:pl-8 space-y-10">
        <!-- Milestone 1 -->
        <div class="relative">
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0A0A0C]"></span>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 class="text-lg font-bold text-white tracking-tight">Q1 2026: Mobile Companion & PWA Sync</h3>
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold uppercase">
              IN PROGRESS
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-3">
            Offline-first architecture enabling fast mobile repository lookup, custom saved stacks, and local push notifications for starred release notes.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
            <div class="p-2.5 rounded-lg bg-[#121215] border border-white/[0.06] flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              Offline cache replication
            </div>
            <div class="p-2.5 rounded-lg bg-[#121215] border border-white/[0.06] flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              Encrypted biometric tokens
            </div>
          </div>
        </div>

        <!-- Milestone 2 -->
        <div class="relative">
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white/40 border-2 border-[#0A0A0C]"></span>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 class="text-lg font-bold text-white tracking-tight">Q2 2026: AI Maintainer Signal Engine</h3>
            <span class="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 font-mono text-[10px] font-semibold uppercase">
              PLANNED
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-3">
            Lightweight model integration to summarize issue turnaround velocities, maintainer response patterns, and architectural stability scores before adopting new dependencies.
          </p>
        </div>

        <!-- Milestone 3 -->
        <div class="relative">
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white/20 border-2 border-[#0A0A0C]"></span>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 class="text-lg font-bold text-white tracking-tight">Q3 2026: Collaborative Stack Registries</h3>
            <span class="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-500 font-mono text-[10px] font-semibold uppercase">
              RESEARCH
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            Team-level shared collections, unified license compliance auditing, and exportable project BOM (Bill of Materials) for engineering organizations.
          </p>
        </div>
      </div>
    </div>
  `
};
