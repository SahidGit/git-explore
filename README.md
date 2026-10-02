# ExploreGit

> Raw GitHub data, structured into signal.

ExploreGit is an autonomous, privacy-first developer interface for tracking open-source repository velocity, inspecting contributor momentum, and navigating Git workflows without telemetry or account walls.

[Live Application](https://exploregit.vercel.app) · [Documentation](https://exploregit.vercel.app/docs) · [Changelog](https://exploregit.vercel.app/changelog)

---

## Overview

Software engineers spend hours sifting through noisy search results to identify high-velocity dependencies, track emerging libraries, or recall complex Git operational patterns. ExploreGit structures raw telemetry from the GitHub REST API into real-time visual signals:

- **Momentum Discovery**: Filter trending open-source projects by language, star velocity, and update windows.
- **Repository Intelligence**: Inspect commit activity curves, issue resolution velocity, language distributions, and contributor health.
- **Local-First Persistence**: Bookmarks and research collections remain in browser `localStorage` and never leave your machine.
- **Interactive Git Reference**: One-click operational commands for branching, rewriting history, and recovering lost commits.
- **Frontier AI Newsroom**: Live tracking of open-weight model releases, context window advances, and latency benchmarks.

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

ExploreGit operates entirely client-side without requiring a backend proxy or database.

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
│   │   ├── features/      # Repository intelligence, filters, bookmarks, and profile views
│   │   ├── layouts/       # Header, navigation, and contextual footers
│   │   ├── newsroom/      # Frontier model tracking and research feeds
│   │   └── ui/            # Design system, error boundaries, and charts
│   ├── data/              # Static reference schemas and Git command datasets
│   ├── pages/             # Route modules (Explorer, Languages, Cheatsheet, etc.)
│   ├── services/          # GitHub REST client and local storage managers
│   └── styles/            # Design tokens and Tailwind utilities
├── server/                # Optional feedback ledger daemon
└── package.json
```

### Route Index

- `/` — Product overview and momentum highlights
- `/dashboard` — Explorer, multi-variable filters, and repository metrics
- `/languages` — Programming language ecosystem trends and velocity breakdown
- `/bookmarks` — Local-first repository collections and private developer notes
- `/profile` — GitHub user profile intelligence and contribution history
- `/cheatsheet` — Step-by-step Git command reference and operational recipes
- `/ai-news` — Frontier model index, benchmarks, and release changelog
- `/company` — Mission, architectural constraints, and operational principles
- `/docs` — API integration guides, authentication, and platform documentation
- `/report` — Bug reporting and feedback submission

---

## Commands

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

---

## Contributing

Contributions are welcome. Please open an issue to discuss proposed architectural changes prior to submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/momentum-metric`)
3. Validate tests and linter (`npm test && npm run lint`)
4. Commit your changes (`git commit -m "feat(analytics): add release velocity signal"`)
5. Push to the branch (`git push origin feature/momentum-metric`)
6. Open a Pull Request

---

## License

ExploreGit is open source software licensed under the [MIT License](LICENSE).
