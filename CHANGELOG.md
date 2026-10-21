# Changelog

All notable changes to this project will be documented in this file.

## [2.2.0] - 2026-10-22

### Added
- **Maintenance Checklist**: Verifiable adoption signals (archived status, last push, latest release, license, security policy, and contributing guide) directly linked to GitHub repository roots.
- **Topic Collections**: Curated ecosystem hubs (Agentic AI, Rust Systems, Developer Tooling, Local LLMs, Web3 Infrastructure) and automated topic clusters with transparent selection criteria.
- **Release Radar**: Repository release tracker with version tags, publication dates, changelog notes, and direct links to release assets.
- **Good First Issues Finder**: Discover open, help-wanted, and beginner-friendly issues across active repositories with labels and comment counts.
- **Change Watch**: Client-side star observation tracker in browser `localStorage` reporting honest elapsed intervals without synthetic backfilled baselines.
- **Explainable Alternatives**: Related repository recommendations based on shared primary languages and topics, explicitly citing the reason for each match.
- **"What Changed?" Digest**: Activity digests across 7, 30, and 90-day timeframes covering releases, merged PRs, and commit cadence.
- **Dependency Footprint Explorer**: Multi-ecosystem manifest parser (`package.json`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `go.mod`) with upstream package registry links (npm, crates.io, PyPI, pkg.go.dev).
- **License Compatibility Matrix**: SPDX-based matrix with documented dual-license compatibility rules and legal disclaimers.
- **Automated Vitest Test Suites**: Comprehensive test coverage across discovery endpoints, manifest parsers, storage schemas, and license matrix logic.

### Changed
- **Data Integrity Overhaul**: Eliminated opaque synthetic "health scores"; all signals now reflect verifiable raw GitHub facts with direct links.
- **Dashboard Navigation**: Added dedicated tabs for `collections`, `radar`, `issues`, and `watch` alongside the main explorer.
- **Sitemap & SEO**: Added `/compare` to `public/sitemap.xml` and refreshed all lastmod dates to `2026-10-22`.
- **Documentation**: Fully overhauled `README.md` with complete route indices, architectural layouts, and data integrity guarantees.

### Security & Infrastructure
- **Strict CORS Policy**: Restricted server API CORS allowlist exclusively to `https://exploregit.vercel.app` and localhost development origins.
- **Database Connection Pooling**: Added serverless-safe cached MongoDB connection manager to prevent socket exhaustion.
- **Rate Limit Hardening**: Hardened memory store sliding-window rate limiters with automatic expired-bucket cleanup.

## [2.1.0] - 2026-08-15

### Added
- **AI Newsroom**: Experimental high-end AI intelligence magazine covering frontier foundation models, open-source weight releases, regional labs, and arXiv research.
- **Git Cheat Sheet**: Comprehensive step-by-step command reference.
- **Report Issue Form**: Mandatory issue selection and description character minimum enforcement, with celebratory success state.
- **Hero Enhancements**: Improved parallax scrolling effects.

### Changed
- **Documentation**: Updated README with AI Newsroom and Git commands information, including "New" tags.
- **Creator Credit**: Footer link updated to point to `#creator-heading` on Resources page.

## [2.0.0] - 2025-11-29
- **New Landing Page**: Completely redesigned landing page with "Hero", "Features", and "Footer" sections.
- **Seamless Marquee**: Infinite scrolling marquee in the Hero section displaying key features.
- **Material Icons**: Integrated `react-icons` for a consistent, professional look.
- **SEO Optimization**: Added meta tags, Open Graph tags, and Twitter Cards.
- **GitHub Actions**: Automated deployment workflow for GitHub Pages.
- **Project Structure**: Reorganized folders into `src/pages`, `src/styles`, `src/hooks`, and `src/utils`.

### Changed
- **Theme**: Updated color palette to match GitHub's dark mode (`#0D1117`, `#58A6FF`, `#F0F6FC`).
- **Typography**: Switched to `Inter` font family for better readability.
- **Favicon**: Updated to the official GitHub logo.

### Fixed
- **Marquee Gaps**: Resolved issues with gaps in the scrolling animation.
- **Mobile Responsiveness**: Improved layout on smaller screens.
