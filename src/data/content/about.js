export const aboutContent = {
  title: 'About GitExplorer',
  subtitle: 'An independent open-source discovery platform designed for modern developers and engineering teams.',
  content: `
    <div class="font-['Helvetica_Neue',Helvetica,Arial,sans-serif] space-y-6 text-zinc-300 leading-relaxed">
      <blockquote class="border-l-2 border-indigo-500 pl-4 py-2 italic text-zinc-200 bg-white/[0.02] rounded-r-lg my-4">
        "GitExplorer was built on a simple premise: open-source software moves faster than static search indices. We provide real-time clarity into repository momentum, maintainer velocity, and technology shifts."
      </blockquote>

      <h2 class="text-xl font-bold text-white mt-6 mb-3">Independent Software Architecture</h2>
      <p>
        <strong>GitExplorer is a fully independent web tool</strong> engineered by Sahid Sarfaraz to assist developers, researchers, and open-source contributors in navigating the global software ecosystem. GitExplorer operates autonomously and is not affiliated with, endorsed by, sponsored by, or associated with GitHub, Inc., Microsoft Corporation, or any third-party repository host.
      </p>

      <h2 class="text-xl font-bold text-white mt-6 mb-3">Core Privacy & Architectural Pillars</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            🛡️ Zero Telemetry
          </h3>
          <p class="text-xs text-zinc-400 leading-relaxed">
            <strong>AI Summary:</strong> Zero Telemetry means GitExplorer collects <strong>zero user tracking, analytics cookies, or behavioral telemetry</strong>. Your browsing sessions and queries remain 100% private.
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Telemetry_(software)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs text-sky-400 hover:underline pt-1"
          >
            <span>Read Wikipedia article on Telemetry</span>
            <span class="text-[10px]">↗</span>
          </a>
        </div>

        <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            💾 Local-First Software
          </h3>
          <p class="text-xs text-zinc-400 leading-relaxed">
            <strong>AI Summary:</strong> Local-First software prioritizes local device storage over cloud servers. All bookmarks, search filters, and GitHub Personal Access Tokens (PAT) remain encrypted inside your browser's <code class="text-indigo-300">localStorage</code>.
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Local-first_software"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs text-sky-400 hover:underline pt-1"
          >
            <span>Read Wikipedia article on Local-First</span>
            <span class="text-[10px]">↗</span>
          </a>
        </div>
      </div>

      <h2 class="text-xl font-bold text-white mt-6 mb-3">Our Core Objectives</h2>
      <ul class="list-disc list-inside space-y-2 text-zinc-300">
        <li><strong>Real-Time Signal Detection:</strong> Spot high-velocity repositories, emerging AI models (such as DeepSeek, Llama, and local LLMs), and framework shifts before they hit mainstream feeds.</li>
        <li><strong>Zero Noise Metrics:</strong> Filter past historical star counts to evaluate active release frequency, contributor health, and live commit velocity.</li>
      </ul>

      <h2 class="text-xl font-bold text-white mt-6 mb-3">Editorial Commitment</h2>
      <p>
        We believe open-source tools should be transparent, accessible, and fast. Every feature within GitExplorer—from the interactive Git Cheat Sheet to developer analytics—is designed to enhance productivity without compromising privacy or neutrality.
      </p>
    </div>
  `,
};
