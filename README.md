# GitExplorer

> Find open-source momentum before it becomes obvious.

GitExplorer is a privacy-conscious React app for exploring GitHub repositories, understanding their activity, and keeping a personal shortlist. It also includes a practical Git command reference and an experimental AI Newsroom for tracking models, open-weight releases, research, and infrastructure.

[Live app](https://git-explore-one.vercel.app) · [AI Newsroom](https://git-explore-one.vercel.app/ai-news) · [Git cheat sheet](https://git-explore-one.vercel.app/cheatsheet) · [Report an issue](https://github.com/SahidGit/git-explore/issues)

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-06B6D4?logo=tailwindcss&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## What you can do

- Discover trending repositories by timeframe and language, or search GitHub directly.
- Inspect repository details including language mix, top contributors, recent commit activity, and issue statistics.
- Save repositories and personal notes locally in the browser—no account required.
- Connect a GitHub personal access token for higher API rate limits; it stays in session storage and is never sent to this app's server.
- Browse a searchable Git command cheat sheet.
- Read the AI Newsroom: model comparisons, open-weight references, research briefs, and global AI coverage.

## How it works

GitExplorer calls the public GitHub REST API directly from the browser. When GitHub is unavailable or rate-limited, selected discovery and analytics views fall back to bundled sample data so the interface remains useful. The AI Newsroom reads OpenRouter's public models endpoint and similarly uses a dated local fallback snapshot when a live request cannot succeed.

Your bookmarks and notes are stored in `localStorage`. Optional GitHub tokens are held only for the current browser session in `sessionStorage`.

## Screens and routes

| Route | Purpose |
| --- | --- |
| `/` | Product overview and entry point |
| `/dashboard` | Repository discovery and analysis |
| `/bookmarks` | Your saved repositories and notes |
| `/profile` | GitHub profile lookup |
| `/cheatsheet` | Git command reference |
| `/ai-news` | AI Newsroom |
| `/report` | Report an issue or provide feedback |

## Run it locally

### Prerequisites

- Node.js 18 or later
- npm 9 or later

```bash
git clone https://github.com/SahidGit/git-explore.git
cd git-explore
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### Production preview

```bash
npm run build
npm run preview
```

## Configuration

No environment variables are required for the default experience. To route GitHub requests through a proxy or compatible API host, create a `.env.local` file:

```bash
VITE_GITHUB_API_URL=https://api.github.com
```

Leave it unset to use GitHub's public API. Authenticated requests can also be enabled by adding a GitHub personal access token through the app interface; use the minimum read-only scope necessary for the repositories you want to inspect.

## Project structure

```text
src/
├── components/   # Reusable UI, dashboard features, charts, and newsroom sections
├── data/         # Cheat-sheet content and resilient fallback datasets
├── pages/        # Route-level React pages
├── services/     # GitHub, OpenRouter, health, and browser-storage services
├── styles/       # Global and application styles
└── App.jsx       # Lazy-loaded route definitions
server/           # Lightweight report and GitHub-support API
```

## Technology

- React 18 and React Router
- Vite
- Tailwind CSS
- Framer Motion
- Chart.js / react-chartjs-2
- GitHub REST API and OpenRouter public models API

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), create a focused branch, and open a pull request with a clear description of the change.

## Deployment

See [docs/deployment.md](docs/deployment.md) for deployment notes and configuration details.

## License

Released under the [MIT License](LICENSE).
