export const docsContent = {
  title: 'Documentation',
  subtitle: 'The definitive guide to leveraging GitExplorer.',
  content: `
    <div class="space-y-12">
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Overview</h2>
        <p class="text-slate-400 leading-relaxed mb-4">
          GitExplorer is a privacy-centric intelligence tool engineered for developers to navigate the GitHub ecosystem with precision. 
          It augments the standard GitHub interface with enhanced discovery mechanisms and data visualization, enabling users to 
          make informed decisions about the dependencies and tools they adopt.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Core Modules</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-white mb-2">1. Discovery Engine</h3>
            <p class="text-slate-400">
              The <strong>Explore</strong> module allows for deep querying of the repository registry. Filter by language, 
              sort by engagement metrics (stars, forks), and analyze project velocity.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white mb-2">2. Developer Intelligence</h3>
            <p class="text-slate-400">
              Access the <strong>Profile</strong> module to generate comprehensive analytics for any GitHub user. 
              Visualize contribution patterns and activity density to gauge developer consistency.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white mb-2">3. Local Collections</h3>
            <p class="text-slate-400">
              Utilize the bookmarking system to curate lists of repositories. All data is persisted in your 
              browser's local storage, ensuring zero data egress and complete privacy.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-white mb-4">API Rate Limiting</h2>
        <p class="text-slate-400 mb-4">
          GitExplorer operates via the public GitHub REST API. Unauthenticated usage is capped at 60 requests per hour. 
          To unlock the full potential (5,000 requests/hour):
        </p>
        <ol class="list-decimal list-inside text-slate-400 space-y-2 ml-4">
          <li>Generate a <strong>Personal Access Token (Classic)</strong> in your GitHub Developer Settings.</li>
          <li>Navigate to <strong>Settings</strong> within GitExplorer.</li>
          <li>Input your token to authenticate your session locally.</li>
        </ol>
        <p class="text-slate-500 text-sm mt-4">
          Security Note: Your token is stored exclusively in your browser's local storage and is never transmitted to any third-party server.
        </p>
      </section>

      <hr class="border-white/10 my-8" />

      <section id="rules">
        <h2 class="text-2xl font-bold text-white mb-6">Legal & Compliance</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-white mb-2">Terms of Use</h3>
            <p class="text-slate-400 leading-relaxed">
              By accessing GitExplorer, you agree to utilize the platform in strict accordance with all applicable laws. 
              Unauthorized use, including but not limited to the distribution of malicious software or violation of intellectual property rights, is strictly prohibited.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-white mb-2">Disclaimer</h3>
            <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p class="text-red-300 font-medium mb-2">Independent Entity</p>
              <p class="text-slate-400 text-sm leading-relaxed">
                GitExplorer is an independent utility and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with GitHub, Inc. 
                All repositories and content accessed through this tool remain the property of their respective owners. GitExplorer accepts no liability 
                for the security, accuracy, or licensing of third-party code.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
};
