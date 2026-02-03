export const apiContent = {
  title: 'API Integration',
  subtitle: 'Direct access to the GitHub REST API ecosystem.',
  content: `
    <div class="space-y-8">
      <section>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h3 class="text-xl font-bold text-white mb-2">🚀 Unlock unlimited repository access</h3>
          <p class="text-slate-400 mb-4">
            By default, unauthenticated GitHub API requests are limited to <strong>60 per hour</strong>. 
            Provide your Personal Access Token to increase this limit to <strong>5,000 per hour</strong> with additional features.
          </p>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Setup Guide</h2>
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
            <div>
              <p class="text-slate-300 font-medium">Navigate to Token Settings</p>
              <p class="text-sm text-slate-400">Open GitHub Settings, go to Developer settings → Personal access tokens → Tokens (classic). Alternatively, create a new fine-grained token for better security.</p>
              <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 text-blue-400 hover:text-blue-300 text-sm">Visit GitHub Token Settings →</a>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
            <div>
              <p class="text-slate-300 font-medium">Select Appropriate Scopes</p>
              <p class="text-sm text-slate-400">For public repositories only, select <strong>"public_repo"</strong> scope. To access your private repositories as well, select the broader <strong>"repo"</strong> scope. Never share tokens with unnecessary permissions.</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">3</div>
            <div>
              <p class="text-slate-300 font-medium">Paste Token into GitExplorer</p>
              <p class="text-sm text-slate-400">Copy the generated token (starts with <strong>ghp_</strong>) from GitHub and paste it in the settings section below. Your token is stored securely in browser local storage only.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
};
