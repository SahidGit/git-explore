import gitImage1 from '../../assets/git-image1.png';
import gitImage2 from '../../assets/git-image2.png';
import gitImage3 from '../../assets/git-image3.png';
import gitImage4 from '../../assets/git-image4.png';
import gitSync from '../../assets/git-sync.png';

export const docsContent = {
  title: 'Documentation',
  subtitle:
    'Guides, modules, and best practices for getting the most out of GitExplorer — from first search to authenticated API workflows.',
  layout: 'grid',
  cards: [
    {
      id: 'quick-start',
      image: gitImage1,
      title: 'Quick Start',
      badge: 'Start here',
      description:
        'GitExplorer is a privacy-first layer on top of GitHub. Open Explore to browse trending repositories, use filters to narrow results, and click any repo for deep analytics — no sign-up required.',
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
        'The Explore module queries the GitHub registry with language, star, fork, and recency filters. Sort by engagement metrics to find actively maintained projects worth evaluating for your stack.',
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
        'Open any repository to view contribution heatmaps, commit activity charts, language breakdowns, and issue trends. Use these signals to assess project health before adding a dependency.',
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
        'Save repositories from any detail view. Bookmarks persist in your browser\'s local storage — they never touch our servers. Access your collections anytime from the Bookmarks tab.',
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
        'Unauthenticated requests are limited to 60 GitHub API calls per hour. Add a Personal Access Token to unlock 5,000 requests/hour. Tokens are stored locally and sent only to GitHub.',
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
        'GitExplorer is an independent tool — not affiliated with GitHub, Inc. We do not store credentials on external servers. All repository content remains the property of its respective owners.',
      links: [
        { label: 'API security notes', href: '/api' },
        { label: 'Changelog', href: '/changelog' },
      ],
    },
  ],
};
