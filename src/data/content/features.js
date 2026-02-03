export const featuresContent = {
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
                  <h3 class="text-3xl font-bold text-white">Find the perfect open-source libraries.</h3>
                  <p class="text-slate-400 text-lg leading-relaxed">
                      Stop wasting hours searching through generic repositories. Our advanced discovery engine lets you filter by <span class="text-white">programming language</span>, <span class="text-white">stars</span>, <span class="text-white">last updated</span>, and <span class="text-white">activity metrics</span>. Quickly identify battle-tested libraries and frameworks that match your project requirements and maintenance standards.
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
                  <h3 class="text-3xl font-bold text-white">Make data-driven technology decisions.</h3>
                  <p class="text-slate-400 text-lg leading-relaxed">
                      Every repository tells a story through its metrics. Our integrated analytics dashboard displays <span class="text-white">contribution heatmaps</span>, <span class="text-white">commit velocity charts</span>, and <span class="text-white">issue trends</span>. Instantly assess project health, community engagement, and maintainer responsiveness before committing to a dependency.
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
                  <h3 class="text-3xl font-bold text-white">Curate your personal tech stack.</h3>
                  <p class="text-slate-400 text-lg leading-relaxed">
                      Build a personalized library of your favorite open-source tools and libraries. All your bookmarks are stored <span class="text-white">securely in your browser</span> with zero data transmission to external servers. Instant access to your collections anytime, no account required, complete privacy guaranteed.
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
};
