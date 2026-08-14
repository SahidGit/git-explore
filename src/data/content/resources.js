export const resourcesContent = {
  title: 'Developer Resources',
  subtitle: 'Curated references, playbooks, and documentation for modern engineering.',
  content: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <a href="https://git-scm.com/doc" target="_blank" rel="noopener noreferrer" class="group p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3 text-sm font-mono text-zinc-300">
            git
          </div>
          <h3 class="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors">
            Git Reference Manual
          </h3>
          <p class="text-xs text-[#A1A1AA] leading-relaxed">
            The authoritative reference for Git internals, plumbing commands, branching workflows, and rebase strategies.
          </p>
        </div>
        <div class="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-zinc-300">
          <span>git-scm.com</span>
          <span>&nearr;</span>
        </div>
      </a>

      <a href="https://opensource.guide/" target="_blank" rel="noopener noreferrer" class="group p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3 text-sm font-mono text-zinc-300">
            oss
          </div>
          <h3 class="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors">
            Open Source Playbook
          </h3>
          <p class="text-xs text-[#A1A1AA] leading-relaxed">
            A comprehensive guide to launching, scaling, and maintaining open-source projects responsibly.
          </p>
        </div>
        <div class="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-zinc-300">
          <span>opensource.guide</span>
          <span>&nearr;</span>
        </div>
      </a>

      <a href="https://choosealicense.com/" target="_blank" rel="noopener noreferrer" class="group p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3 text-sm font-mono text-zinc-300">
            mit
          </div>
          <h3 class="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors">
            License Selector
          </h3>
          <p class="text-xs text-[#A1A1AA] leading-relaxed">
            Simple breakdown of open-source software licenses: MIT, Apache 2.0, GPL, and BSD trade-offs.
          </p>
        </div>
        <div class="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-zinc-300">
          <span>choosealicense.com</span>
          <span>&nearr;</span>
        </div>
      </a>
    </div>
  `
};
