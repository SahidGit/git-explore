export const apiContent = {
  title: 'API & Authentication',
  subtitle: 'Direct REST v3 integration, client-side token storage, and rate limit management.',
  content: `
    <div class="space-y-8">
      <!-- Callout Banner -->
      <div class="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 flex items-start gap-4">
        <div class="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-sm font-bold flex-shrink-0">
          5,000/hr
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-bold text-white font-space">Upgrade API Rate Limits</h3>
          <p class="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            Unauthenticated GitHub API requests are capped at <strong>60 calls/hour</strong> per IP address. 
            Connecting a Personal Access Token (PAT) elevates your quota to <strong>5,000 calls/hour</strong>. Tokens are cached strictly in your browser&apos;s local storage and are never transmitted to third-party servers.
          </p>
        </div>
      </div>

      <!-- Quick Steps -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold font-space text-white tracking-tight">Token Setup Workflow</h2>
        
        <div class="grid gap-3 font-sans">
          <div class="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 flex items-start gap-3.5">
            <span class="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 font-bold">
              01
            </span>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-white">Generate GitHub Token</h4>
              <p class="text-xs text-zinc-300 leading-relaxed">
                Open GitHub Settings &rarr; Developer settings &rarr; Personal access tokens &rarr; Tokens (classic).
              </p>
              <a href="https://github.com/settings/tokens/new?scopes=public_repo,read:user&description=GitExplorer" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-mono text-indigo-400 hover:text-indigo-300 pt-1 font-bold">
                Open GitHub Token Generator ↗
              </a>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 flex items-start gap-3.5">
            <span class="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 font-bold">
              02
            </span>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-white">Select Minimal Read Scopes</h4>
              <p class="text-xs text-zinc-300 leading-relaxed">
                Select <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">public_repo</code> to access public repository signals and <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">read:user</code> to verify account status. No write or admin permissions are required.
              </p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 flex items-start gap-3.5">
            <span class="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 font-bold">
              03
            </span>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-white">Connect &amp; Verify Token</h4>
              <p class="text-xs text-zinc-300 leading-relaxed">
                Paste your generated token (<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">ghp_...</code>) into the interactive tester below or in the top navigation bar. It will be verified against GitHub API instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Code Snippet -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold font-space text-white tracking-tight">API Authorization Headers</h2>
        <div class="rounded-xl border border-white/10 bg-[#0B0C0E] p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed space-y-2">
          <div class="text-zinc-500">// Example Authenticated Curl Request</div>
          <div class="text-emerald-400">curl <span class="text-zinc-300">-H</span> <span class="text-sky-300">&quot;Authorization: Bearer ghp_your_token_here&quot;</span> \\</div>
          <div class="text-zinc-400 ml-4">-H <span class="text-sky-300">&quot;Accept: application/vnd.github.v3+json&quot;</span> \\</div>
          <div class="text-zinc-400 ml-4">https://api.github.com/user</div>
        </div>
      </section>
    </div>
  `
};

