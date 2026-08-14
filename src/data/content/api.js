export const apiContent = {
  title: 'API & Authentication',
  subtitle: 'Direct integration with GitHub REST v3 ecosystem.',
  content: `
    <div class="space-y-8">
      <!-- Callout -->
      <div class="p-5 rounded-xl bg-[#121215] border border-white/[0.08] flex items-start gap-4">
        <div class="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white flex-shrink-0 font-mono text-sm">
          5k
        </div>
        <div>
          <h3 class="text-base font-bold text-white mb-1">Unlock 5,000 requests per hour</h3>
          <p class="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            By default, unauthenticated GitHub API requests are capped at <strong>60 calls/hr</strong> per IP address. 
            Providing a Personal Access Token elevates your quota to <strong>5,000 calls/hr</strong> with zero cloud storage.
          </p>
        </div>
      </div>

      <!-- Quick Steps -->
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-white tracking-tight">Configuration Workflow</h2>
        
        <div class="grid gap-3">
          <div class="p-4 rounded-xl bg-[#121215] border border-white/[0.06] flex items-start gap-3.5">
            <span class="font-mono text-xs text-zinc-400 bg-white/[0.06] border border-white/10 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0">
              01
            </span>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-white">Generate Personal Access Token</h4>
              <p class="text-xs text-[#A1A1AA] leading-relaxed">
                Open GitHub &rarr; Settings &rarr; Developer Settings &rarr; Personal Access Tokens &rarr; Tokens (classic) or Fine-grained tokens.
              </p>
              <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white pt-1">
                GitHub Token Creator &rarr;
              </a>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#121215] border border-white/[0.06] flex items-start gap-3.5">
            <span class="font-mono text-xs text-zinc-400 bg-white/[0.06] border border-white/10 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0">
              02
            </span>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-white">Select Minimal Read Scopes</h4>
              <p class="text-xs text-[#A1A1AA] leading-relaxed">
                For public repositories, only the <code class="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-200 font-mono text-[11px]">public_repo</code> scope is required. You do not need write or admin access.
              </p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#121215] border border-white/[0.06] flex items-start gap-3.5">
            <span class="font-mono text-xs text-zinc-400 bg-white/[0.06] border border-white/10 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0">
              03
            </span>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-white">Connect in GitExplorer</h4>
              <p class="text-xs text-[#A1A1AA] leading-relaxed">
                Click &quot;Connect Token&quot; in the header bar, paste your token (<code class="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-200 font-mono text-[11px]">ghp_...</code>), and save. It is instantly cached in your local session.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Code Snippet -->
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-white tracking-tight">API Request Format</h2>
        <div class="rounded-xl border border-white/[0.08] bg-[#0E0E10] p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
          <div class="text-zinc-600 mb-1">// Standard Authenticated Request Header</div>
          <div class="text-emerald-400">curl <span class="text-zinc-300">-H</span> <span class="text-sky-300">"Authorization: Bearer ghp_your_token_here"</span> \\</div>
          <div class="text-zinc-400 ml-4">-H <span class="text-sky-300">"Accept: application/vnd.github.v3+json"</span> \\</div>
          <div class="text-zinc-400 ml-4">https://api.github.com/rate_limit</div>
        </div>
      </section>
    </div>
  `
};
