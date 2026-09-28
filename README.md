# ExploreGit

> **Raw GitHub data, structured into signal.** Discover trending repositories, inspect contributor velocity, and track open-source momentum before it becomes mainstream.

[![Live App](https://img.shields.io/badge/Live_Demo-exploregit.vercel.app-10B981?style=flat&logo=vercel)](https://exploregit.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)](LICENSE)

ExploreGit is a privacy-first, local-first developer platform for exploring open-source repositories, analyzing code momentum, and mastering Git workflows.

---

## ⚡ Quick Start

Get up and running locally in less than a minute:

```bash
# 1. Clone the repository
git clone https://github.com/SahidGit/git-explore.git
cd git-explore

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Key Features

- **🔥 Trending Repository Discovery**: Filter trending projects by language (Python, Rust, TypeScript, Go, etc.) and timeframe (Daily, Weekly, Monthly).
- **📊 Code Velocity & Contributor Signals**: Interactive charts showing commit momentum, active contributors, language breakdown, and issue health.
- **🔖 Private Local Bookmarks**: Save repositories and personal notes locally. 100% offline-ready in `localStorage`—no account or login required.
- **📖 Step-by-Step Git Cheat Sheet**: Searchable terminal commands for everyday workflows, branching, rebasing, and undoing changes with one-click copy.
- **📰 AI Newsroom**: Real-time intelligence tracking frontier LLMs, open-weight models, pricing changes, and arXiv research papers.
- **🛡️ Zero Telemetry & Local-First**: No tracking cookies, no cross-site analytics, and no centralized databases harvesting your activity.

---

## 🔑 GitHub API Token (Optional)

By default, public GitHub API queries without a token are rate-limited to **60 requests per hour**.

To raise your limit to **5,000 requests per hour**:
1. Click **Connect Token** in the top navigation bar.
2. Paste a GitHub Personal Access Token (classic or fine-grained with read-only access).
3. **Security Note**: Your token is stored **only in your browser's `sessionStorage`** and is sent directly to `api.github.com`. It is **never** transmitted to any external server.

---

## 🗺️ Routes & Pages

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Home** | Product overview, momentum preview, and feature highlights |
| `/dashboard` | **Explorer** | Real-time trending discovery, search, and deep repo analytics |
| `/bookmarks` | **Bookmarks** | Saved repositories and personal notes (stored locally) |
| `/profile` | **Profile Lookup** | Deep-dive into any GitHub user's contributions and top repos |
| `/cheatsheet` | **Git Cheat Sheet** | Interactive, searchable Git command reference |
| `/ai-news` | **AI Newsroom** | Model index, price comparisons, and open-weight releases |
| `/company` | **Company & Vision** | Architectural constraints and operational values |
| `/docs` | **Documentation** | API details, rate limit status, and token verification |
| `/report` | **Report Issue** | Bug reporting and suggestions with Cloudflare Turnstile |

---

## 🛠️ Project Structure

```text
git-explore/
├── src/
│   ├── components/
│   │   ├── features/      # Dashboard, Bookmarks, and Profile components
│   │   ├── layouts/       # Header, Footer, and Hero
│   │   ├── newsroom/      # AI Newsroom sections and model widgets
│   │   └── ui/            # Reusable buttons, badges, modals, and charts
│   ├── data/              # Git cheat sheet data and fallback mock datasets
│   ├── pages/             # Route views (Home, Dashboard, Company, etc.)
│   ├── services/          # GitHub API, OpenRouter, and Storage services
│   └── styles/            # Tailwind tokens and SaaS button styles
├── server/                # Lightweight local feedback ledger service
├── package.json
└── vite.config.js
```

---

## 📦 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `http://localhost:5173` |
| `npm run build` | Builds the optimized production bundle into `/dist` |
| `npm run preview` | Previews the production build locally |

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the repo and create your feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'Add amazing feature'`
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request.

Please check [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more details.
