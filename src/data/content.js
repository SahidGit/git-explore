export const PAGES_CONTENT = {
  features: {
    title: 'Platform Capabilities',
    subtitle: 'A comprehensive suite of tools designed to accelerate your open-source workflow.',
    content: `
      <div class="space-y-20">
        <!-- Feature 1: Intelligent Discovery -->
        <div class="group relative">
            <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <div class="relative flex flex-col md:flex-row gap-8 items-center">
                <div class="flex-1 space-y-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                        <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        Intelligent Discovery
                    </div>
                    <h3 class="text-3xl font-bold text-white">Pinpoint the perfect tools.</h3>
                    <p class="text-slate-400 text-lg leading-relaxed">
                        Eliminate the noise of generic searches. Leverage advanced filtering by <span class="text-white">language</span>, <span class="text-white">stars</span>, and <span class="text-white">activity metrics</span> to identify high-quality libraries and frameworks for your next initiative.
                    </p>
                </div>
                <div class="flex-1 w-full p-6 rounded-2xl bg-[#161B22] border border-[#30363D] shadow-2xl group-hover:border-blue-500/30 transition-colors">
                    <div class="flex items-center gap-3 mb-4 border-b border-[#30363D] pb-4">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div class="space-y-3">
                        <div class="h-2 w-3/4 bg-slate-700/50 rounded"></div>
                        <div class="h-2 w-1/2 bg-slate-700/50 rounded"></div>
                        <div class="flex gap-2 mt-4">
                            <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">React</span>
                            <span class="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs">TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Feature 2: Project Analytics -->
        <div class="group relative">
            <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <div class="relative flex flex-col md:flex-row-reverse gap-8 items-center">
                <div class="flex-1 space-y-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Project Analytics
                    </div>
                    <h3 class="text-3xl font-bold text-white">Data-driven decisions.</h3>
                    <p class="text-slate-400 text-lg leading-relaxed">
                        Assess project health instantly. Our integrated <span class="text-white">contribution heatmaps</span> and <span class="text-white">velocity charts</span> provide the insights you need to evaluate maintenance levels and community engagement before adoption.
                    </p>
                </div>
                <div class="flex-1 w-full p-6 rounded-2xl bg-[#161B22] border border-[#30363D] shadow-2xl group-hover:border-emerald-500/30 transition-colors">
                     <div class="flex items-end gap-1 h-24 items-end justify-between px-4">
                        <div class="w-2 bg-slate-700/50 rounded-t h-[40%] group-hover:bg-emerald-500/50 transition-all duration-500 delay-75"></div>
                        <div class="w-2 bg-slate-700/50 rounded-t h-[70%] group-hover:bg-emerald-500/50 transition-all duration-500 delay-100"></div>
                        <div class="w-2 bg-slate-700/50 rounded-t h-[50%] group-hover:bg-emerald-500/50 transition-all duration-500 delay-150"></div>
                        <div class="w-2 bg-slate-700/50 rounded-t h-[80%] group-hover:bg-emerald-500/50 transition-all duration-500 delay-200"></div>
                        <div class="w-2 bg-slate-700/50 rounded-t h-[60%] group-hover:bg-emerald-500/50 transition-all duration-500 delay-300"></div>
                        <div class="w-2 bg-slate-700/50 rounded-t h-[90%] group-hover:bg-emerald-500/50 transition-all duration-500 delay-400"></div>
                     </div>
                </div>
            </div>
        </div>

        <!-- Feature 3: Private Collections -->
        <div class="group relative">
            <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <div class="relative flex flex-col md:flex-row gap-8 items-center">
                <div class="flex-1 space-y-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
                        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        Private Collections
                    </div>
                    <h3 class="text-3xl font-bold text-white">Curate your ecosystem.</h3>
                    <p class="text-slate-400 text-lg leading-relaxed">
                        Build a personalized library of essential tools. Your collections are stored <span class="text-white">locally</span> on your device, ensuring complete privacy and immediate access without the need for account creation.
                    </p>
                </div>
                <div class="flex-1 w-full p-6 rounded-2xl bg-[#161B22] border border-[#30363D] shadow-2xl group-hover:border-amber-500/30 transition-colors flex items-center justify-center">
                    <div class="relative">
                        <div class="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-amber-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `
  },
  changelog: {
    title: 'Release Notes',
    subtitle: 'Track the evolution of the GitExplorer platform.',
    content: `
      <div class="space-y-8 relative border-l border-slate-800 ml-4 pl-8">
        <div class="relative">
          <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-[#0D1117]"></span>
          <h3 class="text-lg font-semibold text-white mb-1">v2.0.0 - Platform Overhaul</h3>
          <span class="text-xs font-mono text-slate-500 mb-4 block">December 2, 2025</span>
          <ul class="list-disc list-inside text-slate-400 space-y-2">
            <li>Introduced a completely new UI system based on glassmorphism principles.</li>
            <li>Deployed the "Explore" dashboard with granular filtering capabilities.</li>
            <li>Integrated advanced visualization modules for contribution and activity metrics.</li>
            <li>Enhanced responsive behavior for seamless mobile and tablet experiences.</li>
          </ul>
        </div>
        <div class="relative">
          <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-slate-700 border-4 border-[#0D1117]"></span>
          <h3 class="text-lg font-semibold text-white mb-1">v1.5.0 - Performance Optimization</h3>
          <span class="text-xs font-mono text-slate-500 mb-4 block">November 15, 2025</span>
          <ul class="list-disc list-inside text-slate-400 space-y-2">
            <li>Implemented intelligent API caching to reduce latency.</li>
            <li>Optimized asset delivery, achieving a 30% reduction in bundle size.</li>
            <li>Resolved cumulative layout shifts (CLS) on mobile viewports.</li>
          </ul>
        </div>
      </div>
    `
  },
  docs: {
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
  },
  api: {
    title: 'API Integration',
    subtitle: 'Direct access to the GitHub REST API ecosystem.',
    content: `
      <div class="space-y-8">
        <section>
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 class="text-xl font-bold text-white mb-2">🚀 Supercharge your experience</h3>
            <p class="text-slate-400 mb-4">
              By default, unauthenticated requests are limited to <strong>60 per hour</strong>. 
              Add a Personal Access Token to increase this limit to <strong>5,000 per hour</strong>.
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-white mb-4">Setup Guide</h2>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="flex-none w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
              <div>
                <p class="text-slate-300 font-medium">Generate Token</p>
                <p class="text-sm text-slate-400">Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic).</p>
                <a href="https://github.com/settings/tokens/new" target="_blank" class="inline-block mt-2 text-blue-400 hover:text-blue-300 text-sm">Open Token Settings →</a>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="flex-none w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
              <div>
                <p class="text-slate-300 font-medium">Configure Scopes</p>
                <p class="text-sm text-slate-400">Select "public_repo" scope. If you want to see your private repos, select "repo" scope.</p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-none w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">3</div>
              <div>
                <p class="text-slate-300 font-medium">Save Token</p>
                <p class="text-sm text-slate-400">Copy the generated token (starts with ghp_...) and paste it below.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    `
  },
  resources: {
    title: 'Developer Resources',
    subtitle: 'Curated references for modern software engineering.',
    content: `
        <div class="grid md:grid-cols-3 gap-6">
          <a href="https://git-scm.com/doc" target="_blank" class="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-orange-500/50 transition-all duration-300">
            <div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 text-xl">📚</div>
            <h3 class="font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Git Documentation</h3>
            <p class="text-sm text-slate-400">The authoritative reference for Git commands, workflows, and version control best practices.</p>
          </a>
          
          <a href="https://opensource.guide/" target="_blank" class="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300">
            <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 text-xl">🚀</div>
            <h3 class="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Open Source Guide</h3>
            <p class="text-sm text-slate-400">A definitive playbook for launching, maintaining, and contributing to open source software.</p>
          </a>
          
          <a href="https://choosealicense.com/" target="_blank" class="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-green-500/50 transition-all duration-300">
            <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 text-xl">⚖️</div>
            <h3 class="font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Choose a License</h3>
            <p class="text-sm text-slate-400">Navigate the complexities of open source licensing to protect your work correctly.</p>
          </a>
        </div>
      `
  },
  roadmap: {
    title: 'Product Roadmap',
    subtitle: 'Our vision for the future of GitExplorer.',
    content: `
          <div class="space-y-12">
              <div class="relative border-l border-slate-800 ml-4 pl-8 space-y-12">
                  <!-- Q1 2026 -->
                  <div class="relative">
                      <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-[#0D1117] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                      <div class="flex items-center justify-between mb-2">
                          <h3 class="text-xl font-bold text-white">Q1 2026: Mobile Companion App</h3>
                          <span class="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">PLANNED</span>
                      </div>
                      <p class="text-slate-400 mb-4">Native iOS and Android applications to manage your collections and receive real-time notifications on the go.</p>
                      <ul class="list-disc list-inside text-slate-500 space-y-1 text-sm">
                          <li>Push notifications for starred repo releases</li>
                          <li>Offline access to saved bookmarks</li>
                          <li>Biometric authentication</li>
                      </ul>
                  </div>
  
                  <!-- Q2 2026 -->
                  <div class="relative">
                      <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-purple-500 border-4 border-[#0D1117] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                      <div class="flex items-center justify-between mb-2">
                          <h3 class="text-xl font-bold text-white">Q2 2026: AI-Powered Code Review</h3>
                          <span class="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">RESEARCH</span>
                      </div>
                      <p class="text-slate-400 mb-4">Integrated LLM agents to provide automated code quality assessments and security vulnerability scanning for explored repositories.</p>
                  </div>
  
                   <!-- Q3 2026 -->
                   <div class="relative">
                      <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#0D1117] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                      <div class="flex items-center justify-between mb-2">
                          <h3 class="text-xl font-bold text-white">Q3 2026: Team Workspaces</h3>
                          <span class="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">CONCEPT</span>
                      </div>
                      <p class="text-slate-400 mb-4">Collaborative collections allowing engineering teams to share discovered tools and maintain a unified stack registry.</p>
                  </div>
              </div>
          </div>
        `
  }
};
