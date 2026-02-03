# GitExplorer v2.0 — Explore GitHub Repos & Bookmarks 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-yellow?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.19-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Live Demo:** [https://git-explore-one.vercel.app](https://git-explore-one.vercel.app)  
**Repository:** [https://github.com/SahidGit/git-explorer](https://github.com/SahidGit/git-explorer)

---

## Overview

A modern web application for discovering, analyzing, and bookmarking open-source projects on GitHub. Features advanced filtering, analytics, and a privacy-first design with all data stored locally.

## Features ✨

- **🔍 Intelligent Discovery** - Filter by language, stars, and activity metrics
- **📊 Project Analytics** - Contribution heatmaps and velocity charts
- **⭐ Private Collections** - Bookmark projects locally with zero data collection
- **🎯 Dashboard** - Explore, bookmarks, and profile pages
- **📱 Fully Responsive** - Seamless experience across all devices
- **🌙 Dark Mode** - GitHub-inspired interface

## Tech Stack 🛠️

- **Frontend:** React 18.3.1, React Router 7.13.0
- **Build Tool:** Vite 5.4.21
- **Styling:** Tailwind CSS 3.4.19, PostCSS
- **Data & Charts:** Chart.js, React-ChartJS-2, Axios 1.8.2
- **Animations:** Framer Motion
- **Icons:** Lucide React, React Icons
- **Security:** DOMPurify (XSS protection)

## Getting Started 🚀

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/SahidGit/git-explore.git
cd git-explore (if not inside dir)

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start dev server (http://localhost:5174)
npm run build     # Build for production
npm run preview   # Preview production build
```

## Project Structure

```
src/
├── components/        # UI components
├── pages/            # Page components
├── data/             # Content & utilities
├── services/         # API services
├── styles/           # Global styles
├── hooks/            # Custom hooks
├── utils/            # Helper functions
└── App.jsx           # Root component
```

## GitHub API Integration

- **Public Access:** 60 requests/hour (no authentication required)
- **Authenticated:** 5,000 requests/hour (Personal Access Token)

Generate a token at GitHub Settings → Developer settings → Personal access tokens (classic) and add it in the app settings.


## Deployment 🌍

Configured for Vercel with automatic deployments on push to main branch.

```bash
npm run build
```

The production build is optimized with SPA routing support for all direct URL access.

## Contributing 🤝

Contributions are welcome! Please fork the repository and submit pull requests.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the open-source community**
