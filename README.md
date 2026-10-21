# ExploreGit

> Raw GitHub data, structured into signal.

ExploreGit is an autonomous, privacy-first developer interface for tracking open-source repository velocity, inspecting contributor momentum, comparing project architectures, and navigating Git workflows without telemetry, trackers, or account walls.

[Live Application](https://exploregit.vercel.app) · [Compare](https://exploregit.vercel.app/compare) · [Documentation](https://exploregit.vercel.app/docs) · [Changelog](https://exploregit.vercel.app/changelog)

---

## Overview

Software engineers spend hours sifting through noisy search results to evaluate dependencies, track emerging libraries, or compare competing open-source projects. ExploreGit structures raw telemetry from the GitHub REST API and repository manifests into verifiable visual signals without synthetic or invented numbers:

- **Repository Compare (`/compare`)**: Select 2 or 3 repositories and compare stars, forks, languages, open issues, latest releases, commit cadence, and license compatibility side-by-side with direct upstream source links.
- **Maintenance Checklist**: Inspect verifiable adoption signals—archived status, last push, latest release, license, security policy, and contributing guide—without opaque, unsupported "health scores."
- **Topic Collections**: Browse curated ecosystem hubs (Agentic AI, Rust Systems, Developer Tooling, Local LLMs, Web3 Infrastructure) and automated topic clusters with transparent selection criteria.
- **Release Radar**: Follow repositories to monitor official releases, tag versions, publish dates, and changelog notes in a consolidated feed.
- **Good First Issues Finder**: Discover open, help-wanted, and beginner-friendly issues across active repositories with direct links to GitHub discussions.
- **Change Watch**: Client-side star observation tracker that records verified points in time in browser `localStorage`, reporting honest elapsed intervals without synthetic historical backfills.
- **Explainable Alternatives**: Discover alternative projects matching on shared primary languages and topics, with an explicit explanation of why each match was surfaced.
- **"What Changed?" Digest**: Inspect recent releases, merged PRs, and commit activity across 7, 30, and 90-day windows.
- **Dependency Footprint Explorer**: Parses declared runtime and dev dependencies directly from raw manifest files (`package.json`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `go.mod`) with upstream registry links (npm, crates.io, PyPI, pkg.go.dev).
- **License Compatibility Checker**: Evaluates license interactions against documented SPDX standards (Permissive, Copyleft, Weak Copyleft) with full legal disclaimers.

---

## Data Integrity Guarantees

ExploreGit is built around honest engineering principles:

1. **Direct Provenance**: Every metric, issue, release, and manifest item links directly to its GitHub or package registry source.
2. **No Synthetic Scores**: We do not calculate arbitrary single-number "health scores." Instead, we present raw, verifiable facts (security policies, licenses, release cadence).
3. **No Invented Growth**: Trajectories in Change Watch are strictly device-local observations recorded when you visit, labeled with the exact elapsed time.
4. **Declared Dependencies**: Dependency trees are parsed directly from repository manifest files, never inferred or simulated.
5. **Privacy First**: All tokens and watched items reside strictly in your browser (`sessionStorage` for tokens, `localStorage` for bookmarks and watch lists). No telemetry or tracking scripts.

---

## Quickstart

Run ExploreGit locally with Node.js 18+:

```bash
# Clone the repository
git clone https://github.com/SahidGit/git-explore.git
cd git-explore

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Authentication & API Quotas

ExploreGit operates entirely client-side without requiring a backend proxy or database for GitHub operations.

| Mode | Rate Limit | Scope | Storage |
| :--- | :--- | :--- | :--- |
| **Anonymous** | 60 requests / hour | Public read-only | None |
| **Personal Access Token** | 5,000 requests / hour | Fine-grained (public repo read) | Browser `sessionStorage` |

> **Privacy Guarantee**: User tokens are stored strictly in `sessionStorage` in memory and transmitted solely to `https://api.github.com`. No keys or analytics ever touch third-party servers.

---

## Architecture & Routes

```text
git-explore/
├── src/
│   ├── components/
│   │   ├── features/      # Repository compare, collections, release radar, change watch, issues
│   │   │   └── RepoCard/  # Maintenance checklist, what-changed, dependencies, license, alternatives
│   │   ├── layouts/       # Header, navigation, and contextual footers
│   │   └── ui/            # Design system, error boundaries, SEO, and charts
│   ├── data/              # License compatibility matrix, topic collections, and Git recipes
│   ├── pages/             # Route modules (Home, Dashboard, RepositoryCompare, Languages, Gems, etc.)
│   ├── services/          # GitHub REST client, manifest parsers, and local storage managers
│   └── styles/            # Design tokens and Tailwind utilities
├── public/                # Sitemap, robots.txt, icons, and static assets
├── server/                # Optional feedback ledger daemon (isolated with strict CORS)
└── package.json
```

### Route Index

- `/` — Product overview and live signal highlights
- `/compare` — Multi-repository side-by-side comparison matrix (2–3 repos)
- `/dashboard` — Explorer, multi-variable filters, and integrated discovery tabs:
  - `feed` — Main repository explorer & filter engine
  - `collections` — Topic and ecosystem curated collections
  - `radar` — Followed repository release radar
  - `issues` — Good first issues and help-wanted explorer
  - `watch` — Change watch star observation tracker
  - `bookmarks` — Local-first saved repositories and notes
  - `profile` — GitHub user profile intelligence and contribution history
- `/languages` — Programming language ecosystem trends and velocity breakdown
- `/gems` — Curated and discoverable high-velocity hidden gems
- `/cheatsheet` — Step-by-step Git command reference and operational recipes
- `/company` — Mission, architectural constraints, and operational principles
- `/docs` — API integration guides, authentication, and platform documentation
- `/report` — Bug reporting and feedback submission
- `/changelog` · `/api` · `/privacy` · `/terms` · `/disclaimer` — Technical and compliance pages

---

## Commands & Verification

```bash
# Run local dev server with HMR
npm run dev

# Run unit and integration tests (Vitest)
npm test

# Run code style and ESLint validation
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Automated Test Coverage

The test suite validates:
- **`discoveryServices.test.js`**: Manifest dependency parsing (`package.json`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `go.mod`), digest calculations (7/30/90 days), Good First Issues filtering, and Release Radar.
- **`licenseCompatibility.test.js`**: Permissive vs. copyleft matrix checks (MIT, Apache-2.0, BSD-3-Clause, GPL-3.0, MPL-2.0, Proprietary).
- **`storageService.test.js`**: LocalStorage schema persistence for Change Watch, Release Radar follows, and Bookmarks.
- **`githubService.test.js` & `healthService.test.js`**: Rate limit handling, fallback mechanisms, and API contract resilience.

---

## Contributing

Contributions are welcome. Please open an issue to discuss proposed architectural changes prior to submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/discovery-feature`)
3. Validate tests, linter, and build (`npm test && npm run lint && npm run build`)
4. Commit your changes (`git commit -m "feat: add repository comparison signal"`)
5. Push to the branch (`git push origin feature/discovery-feature`)
6. Open a Pull Request

---

## License

ExploreGit is open source software licensed under the [MIT License](LICENSE).
