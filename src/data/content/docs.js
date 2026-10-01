import gitImage1 from '../../assets/doc-quick-start.webp';
import gitImage2 from '../../assets/doc-explore-discovery.webp';
import gitImage3 from '../../assets/doc-deepseek-lens.webp';
import gitImage4 from '../../assets/doc-auth-ratelimit.webp';
import gitSync from '../../assets/doc-bookmarks-storage.webp';

export const docsContent = {
  title: 'Documentation',
  subtitle:
    'Search the GitHub registry, inspect repository health metrics, bookmark projects locally, and authenticate API requests.',
  layout: 'grid',
  cards: [
    {
      id: 'quick-start',
      image: gitImage1,
      title: 'Quick Start',
      badge: 'Start here',
      description:
        'Search and inspect trending GitHub repositories without creating an account. Filter by language, activity, and star count, then select any repository to review its maintenance metrics.',
      links: [
        { label: 'Open dashboard', href: '/dashboard' },
        { label: 'Company overview', href: '/company' },
      ],
    },
    {
      id: 'explore-module',
      image: gitImage2,
      title: 'Explore & Discovery',
      badge: 'Core module',
      description:
        'Query the GitHub registry with language, star, fork, and update filters. Sort by engagement metrics to identify active projects and evaluate candidates for your stack.',
      links: [
        { label: 'Launch Explore', href: '/dashboard' },
        { label: 'Feature overview', href: '/features' },
      ],
    },
    {
      id: 'repository-intelligence',
      image: gitImage3,
      title: 'Repository Intelligence',
      badge: 'Analytics',
      description:
        'Inspect contribution heatmaps, weekly commit activity curves, language distributions, and issue closure rates. Use these health signals to evaluate maintenance velocity before adding a dependency.',
      links: [
        { label: 'Try it live', href: '/dashboard' },
        { label: 'View changelog', href: '/changelog' },
      ],
    },
    {
      id: 'bookmarks-collections',
      image: gitImage4,
      title: 'Bookmarks & Collections',
      badge: 'Local-first',
      description:
        'Save repositories directly from any card or detail view. All bookmarks persist in browser local storage and never transmit to remote servers. Manage saved repositories from the Bookmarks panel.',
      links: [
        { label: 'Open bookmarks', href: '/bookmarks' },
        { label: 'Privacy details', href: '/features' },
      ],
    },
    {
      id: 'api-authentication',
      image: gitSync,
      title: 'API & Authentication',
      badge: 'Recommended',
      description:
        'Unauthenticated requests are limited to 60 GitHub API requests per hour. Add a personal access token to raise this threshold to 5,000 requests per hour. Tokens remain in session storage and transmit solely to GitHub.',
      links: [
        { label: 'Add your token', href: '/api' },
        {
          label: 'Create PAT on GitHub',
          href: 'https://github.com/settings/tokens',
        },
      ],
    },
    {
      id: 'privacy-compliance',
      image: gitImage2,
      title: 'Privacy & Compliance',
      badge: 'Legal',
      description:
        'ExploreGit is an independent platform and is not affiliated with GitHub, Inc. The platform does not store credentials or queries on external servers. All repository metadata remains the property of respective owners.',
      links: [
        { label: 'API security notes', href: '/api' },
        { label: 'Changelog', href: '/changelog' },
      ],
    },
  ],
};
