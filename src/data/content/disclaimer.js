export const disclaimerContent = {
  title: 'Disclaimer & Safety Notice',
  subtitle: 'Official statement regarding third-party software independence, liability boundaries, and security best practices.',
  content: `
    <div class="space-y-6 text-zinc-300 leading-relaxed font-sans text-xs sm:text-sm">
      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">1. Statement of Independence</h2>
      <p>
        <strong>ExploreGit is an independent open-source discovery platform</strong> created and maintained by Sahid Sarfaraz. ExploreGit is <em>not</em> affiliated with, associated with, authorized by, endorsed by, or in any way officially connected to <strong>GitHub, Inc.</strong>, <strong>Microsoft Corporation</strong>, or any of their subsidiaries or affiliates. The official GitHub website is located at <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-purple-400 underline hover:text-purple-300">github.com</a>.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">2. Independent Third-Party Apps, Gems &amp; Tools</h2>
      <p>
        All third-party tools, applications, packages, repositories, and software featured throughout ExploreGit (including the <strong>Gems &amp; Essential Tools</strong> directory, trending repositories, and developer utilities) are created, maintained, and distributed entirely by independent third-party open-source developers and organizations. ExploreGit does not develop, operate, audit, or control these external projects.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">3. User Choice, Security &amp; Limitation of Liability</h2>
      <p>
        <strong>Installing, downloading, cloning, or executing any third-party software or repository is entirely at the user's sole discretion and risk.</strong> ExploreGit curates freely available open-source software and long-term useful tools, but <strong>does NOT and CANNOT guarantee</strong> the safety, security, privacy, performance, code integrity, or harmlessness of any third-party code, binary, repository, APK, IPA, or installer.
      </p>
      <p class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
        <strong>Important:</strong> Under no circumstances shall ExploreGit, its creator, or its contributors be held liable for any direct, indirect, incidental, punitive, or consequential damages, including but not limited to system compromise, malware or ransomware infection, data corruption, privacy loss, hardware issues, or financial harm resulting from the download, execution, installation, or misuse of any software or repository found on this platform.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">4. Official Documentation &amp; Store Links</h2>
      <p>
        Users are strongly encouraged to always read the official documentation, review the source code, check software licenses (MIT, Apache 2.0, GPL, etc.), and verify official release signatures. Where available, ExploreGit provides direct links to verified official platforms such as the <strong>Google Play Store</strong>, <strong>Apple App Store</strong>, <strong>Microsoft Windows Store</strong>, and official maintainer websites to help users obtain legitimate copies safely.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">5. Broken Links, Outdated Info &amp; Reporting Abuse</h2>
      <p>
        While we strive to keep our curated catalog clean, accurate, and up-to-date, external project URLs and software packages may change or be deprecated over time. If you encounter a broken link, an invalid website, inaccurate metadata, or suspect any listed project of misuse or malicious activity, please report it immediately via our <a href="/report" class="text-purple-400 font-bold underline hover:text-purple-300">Report Section</a>. Our team will review the issue and correct or remove the listing as quickly as possible.
      </p>

      <h2 class="text-base sm:text-lg font-bold text-white font-heading mt-6 mb-2">6. Security Guide: How to Protect Yourself Before Installing Unknown Repositories &amp; Tools</h2>
      <div class="space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
        <p class="text-zinc-200 font-semibold text-xs sm:text-sm">
          Follow these essential security practices whenever discovering and installing new software:
        </p>
        <ol class="list-decimal list-inside space-y-2 text-zinc-300">
          <li><strong>Audit the Repository &amp; Commit History:</strong> Review recent commits, active maintainers, open issues, and pull requests to assess the project's health and credibility.</li>
          <li><strong>Inspect Install Scripts &amp; Post-Install Hooks:</strong> Never run raw commands like <code class="bg-black/40 px-1.5 py-0.5 rounded text-zinc-200 font-mono">curl | sh</code> or execute <code class="bg-black/40 px-1.5 py-0.5 rounded text-zinc-200 font-mono">npm / pip</code> packages without checking the script contents and <code class="bg-black/40 px-1.5 py-0.5 rounded text-zinc-200 font-mono">postinstall</code> hooks.</li>
          <li><strong>Use Sandboxes &amp; Virtualized Environments:</strong> Test unfamiliar tools inside isolated environments such as Docker containers, Podman, Windows Sandbox, or virtual machines before executing on your primary operating system.</li>
          <li><strong>Verify Official App Stores &amp; Checksums:</strong> Whenever possible, download apps directly from official distribution stores (Google Play, Apple App Store, Microsoft Store) and verify SHA-256 hashes or PGP release signatures against maintainer release notes.</li>
          <li><strong>Scan Binaries with Multi-Engine Security Tools:</strong> Upload downloaded setup files and executables to reputable security scanners (e.g., VirusTotal) prior to installation.</li>
        </ol>
      </div>
    </div>
  `,
};
