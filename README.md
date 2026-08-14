# GitExplorer & AI Newsroom 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-yellow?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.19-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Live Demo:** [https://git-explore-one.vercel.app](https://git-explore-one.vercel.app)  
**AI Newsroom:** [https://git-explore-one.vercel.app/ai-news](https://git-explore-one.vercel.app/ai-news) `New`

---

## Overview

**GitExplorer** is a modern, privacy-first web application for discovering open-source software, featuring **AI Newsroom** — an experimental high-end AI intelligence magazine covering frontier foundation models, open-source weight releases (DeepSeek, Llama, Qwen, Mistral), regional labs (**Sakana AI** in Japan, **Sarvam AI** in India), mega-compute investments (**Project Stargate**), and arXiv research.
It also includes a comprehensive **Git Cheat Sheet** to help developers learn and use Git commands effectively.

---

## 🎨 AI Newsroom Visual & Technical Features

- **Experimental Editorial Aesthetic:** Asymmetrical grid layouts, expressive serif headlines, warm off-white (`#F8F3EA`), near-black (`#101010`), and vivid editorial orange (`#FF5A1F`) accents. `New`
- **Model Intelligence Index:** Interactive comparison table with live OpenRouter API model fetching, cost normalization ($/1M tokens), context window scaling, and modality filters.
- **Open-Weights Directory:** Direct links to official Hugging Face repositories and GitHub source repos for DeepSeek R1, Llama 3.3, Qwen 2.5, and Mistral.
- **Global AI Atlas:** Dedicated spotlights for regional sovereign AI labs including **Sakana AI (Japan)** and **Sarvam AI (India)**.
- **Capital & Infrastructure:** Coverage of compute cluster buildouts, Project Stargate $100B supercomputer, and sovereign European compute initiatives.
- **arXiv Research Briefings:** Curated papers with why-it-matters summaries and direct pre-print links.

---

## 🌐 OpenRouter Fetch & Fallback Strategy

The AI Newsroom integrates a client-side model intelligence service (`src/services/openRouterService.js`):

1. **Live Fetching:** Calls OpenRouter's public endpoint (`GET https://openrouter.ai/api/v1/models`) without exposing any client API keys.
2. **Data Normalization:** Converts per-token pricing to standard USD per 1M tokens (`prompt * 1,000,000`), formats context windows, maps modalities, and assigns capabilities.
3. **Graceful Fallback:** If the API request is throttled, fails, or encounters network errors, the app automatically switches to a date-stamped, curated fallback dataset (`FALLBACK_MODEL_SNAPSHOT`).
4. **Transparency:** Clear status badges inform the user whether data is coming live from OpenRouter or from the date-stamped snapshot.

---

## 🛠️ Project File Tree

```
git-explore/
├── src/
│   ├── components/
│   │   ├── newsroom/               # AI Newsroom Magazine Components
│   │   │   ├── NewsroomNav.jsx           # Sticky top navbar with ticker
│   │   │   ├── HeroEditorial.jsx         # Lead story headline & visual
│   │   │   ├── LeadStoryGrid.jsx         # 4-card dispatch grid
│   │   │   ├── ModelIntelligenceTable.jsx# OpenRouter table & price visualizer
│   │   │   ├── OpenWeightStrip.jsx       # Open weight model family links
│   │   │   ├── GlobalAiAtlas.jsx         # Regional labs (Sakana AI, Sarvam AI)
│   │   │   ├── CapitalInfrastructure.jsx # Project Stargate & capital buildouts
│   │   │   ├── WorthReadingResearch.jsx  # arXiv paper briefings
│   │   │   ├── VisualCultureGallery.jsx  # Design direction & asset references
│   │   │   └── NewsroomFooter.jsx        # Newsletter demo & disclaimers
│   │   ├── layouts/
│   │   │   ├── Header.jsx                # Floating dock navbar
│   │   │   └── Footer.jsx                # Compact footer with dropdown
│   │   └── ui/                       # Reusable UI controls
│   │       ├── PageNavigation.jsx        # Sequential page redirection
│   │       ├── ErrorBoundary.jsx         # Dark mode runtime error screen
│   │       └── SEO.jsx                   # Dynamic meta tags & titles
│   ├── data/
│   │   ├── aiNewsData.js                 # Editorial content, labs & research
│   │   ├── contentLoader.js              # Lazy-loaded documentation keys
│   │   └── gitCheatSheetData.js          # Git CLI commands
│   ├── pages/
│   │   ├── AiNewsroom.jsx                # AI Newsroom single-page magazine
│   │   ├── Dashboard.jsx                 # Explore repositories & bookmarks
│   │   ├── GitCheatSheet.jsx             # Git CLI cheat sheet
│   │   ├── InfoPage.jsx                  # Dynamic documentation routes
│   │   ├── ReportIssue.jsx               # Issue & token support form
│   │   └── Resources.jsx                 # Developer tooling & credits
│   ├── services/
│   │   ├── openRouterService.js          # OpenRouter API client & fallback
│   │   ├── githubService.js              # GitHub REST API client
│   │   └── storageService.js             # LocalStorage manager
│   ├── App.jsx                           # Route definitions & transitions
│   └── main.jsx                          # Application entry point
├── package.json
└── README.md
```

---

## 💻 Setup & Run Instructions

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/SahidGit/git-explore.git
cd git-explore

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5173`.  
Access the AI Newsroom at `http://localhost:5173/ai-news`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
