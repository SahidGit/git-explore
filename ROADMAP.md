# GitExplorer Development Roadmap

This document outlines the strategic plan for the future development of GitExplorer, focusing on data visualization, user experience enhancements, and functional depth.

## 1. Data Visualization & Insights 📊
**Objective:** Transform raw data into actionable insights using visual metrics.

### Contribution & Activity Tracking
- **Contribution Heatmaps**: **Completed ✅** Implement a GitHub-style contribution calendar to visualize commit frequency over the last year.
    - *Tech Used*: Custom CSS Grid (replaced `react-activity-calendar` due to React 19 incompatibility)
- **Activity Trends**: **Completed ✅** Line charts showing commit/issue activity over time to identify project velocity.
    - *Tech Used*: `react-chartjs-2` and `chart.js`

### Project Metrics Dashboard
- **Issue Analytics**: Pie charts displaying the ratio of Open vs. Closed issues and PRs.
- **Language Distribution**: Interactive doughnut charts showing the exact breakdown of languages used in a repository.
- **Star History**: A graph showing the growth of stars over time (requires historical data fetching).

## 2. Functional Enhancements 🛠️
**Objective:** Ensure every interaction provides value and deepens the user journey.

### Navigation & Content
- **Meaningful Destinations**: Audit all application links (Footer, Sidebar, Header) to ensure they lead to:
    - Dedicated internal views (like the new Info Pages).
    - Curated external resources.
    - No dead ends or `#` placeholders.
- **Deep Linking**: Enable URL sharing for specific dashboard states (e.g., `gitexplorer.com/repo/facebook/react`).

### Comparison Tools
- **Repo vs. Repo**: A new feature to compare two repositories side-by-side on metrics like:
    - Community size (Stars/Forks).
    - Maintenance health (Last commit, Open issues).
    - Bundle size (if applicable).

## 3. UX/UI & Animations ✨
**Objective:** Create a premium, "alive" feel with subtle, high-quality interactions.

### Micro-Interactions
- **Button Feedback**: Implement ripple effects or subtle scale animations on clicks.
- **Hover States**: Enhance cards with "lift" effects, shadow deepening, and border glows (building on the "Trusted by" badge style).
- **Skeleton Loading**: Replace spinning loaders with shimmering skeleton screens for a smoother perceived load time.

### Transitions
- **Page Transitions**: Use `framer-motion` to add smooth fade or slide transitions when navigating between the Home, Dashboard, and Info pages.
- **Scroll Animations**: Elements should gracefully fade/slide in as the user scrolls down the landing page.

## 4. Technical Debt & Infrastructure ⚙️
- **State Management**: Evaluate moving from local state to Context API or Redux if the app complexity grows.
- **Testing**: Introduce unit tests (Vitest) for critical utility functions and component rendering.
- **Accessibility (a11y)**: Ensure full keyboard navigation support and ARIA compliance for all new interactive elements.

---
*Status: Draft*
*Last Updated: November 30, 2025*
