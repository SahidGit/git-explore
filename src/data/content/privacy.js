export const privacyContent = {
  title: 'Privacy Policy',
  subtitle: 'How ExploreGit handles local data, browser storage, API credentials, and external links.',
  content: `
    <div class="space-y-6 text-zinc-300 leading-relaxed font-sans text-xs sm:text-sm">
      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">1. Local-First &amp; Privacy-First Architecture</h2>
      <p>
        ExploreGit is engineered with a strict local-first philosophy. Your bookmarks, custom view settings, search history, and GitHub Personal Access Tokens are stored exclusively in your local browser storage (sessionStorage / localStorage). Data never leaves your device and is never stored on our servers.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">2. Zero Tracking &amp; Zero Telemetry</h2>
      <p>
        ExploreGit does not employ third-party advertising cookies, fingerprinting scripts, or cross-site tracking beacons. We do not sell, rent, or trade any user activity data.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">3. Direct GitHub API Communication</h2>
      <p>
        When you search repositories or connect a Personal Access Token (PAT), requests are dispatched directly from your browser to GitHub's official API servers (<code class="bg-black/40 px-1.5 py-0.5 rounded text-zinc-200 font-mono">api.github.com</code>). Tokens are held in-memory and discarded upon session termination.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">4. External Download Links &amp; App Stores</h2>
      <p>
        ExploreGit provides links to external software websites, repository releases, and official app distribution channels (including the <strong>Google Play Store</strong>, <strong>Apple App Store</strong>, and <strong>Microsoft Store</strong>). Clicking these links takes you to third-party domains governed by their respective privacy policies and terms. We encourage you to review their policies prior to providing information or downloading files.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">5. User Safety &amp; Code Inspection Reminder</h2>
      <p>
        Before cloning unknown repositories, copying terminal commands, or downloading software packages, always review repository permissions, inspect source files, and review our <a href="/disclaimer" class="text-purple-400 font-bold underline hover:text-purple-300">Safety &amp; Disclaimer Guide</a>.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">6. Reporting &amp; Contact</h2>
      <p>
        If you discover privacy concerns, suspicious repository behavior, or broken external links, please notify us immediately through our <a href="/report" class="text-purple-400 font-bold underline hover:text-purple-300">Report Section</a>.
      </p>
    </div>
  `,
};
