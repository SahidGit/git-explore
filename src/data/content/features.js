import gitImage1 from '../../assets/git-image1.png';
import gitImage2 from '../../assets/git-image2.png';
import gitImage3 from '../../assets/git-image3.png';
import gitImage4 from '../../assets/git-image4.png';
import gitSync from '../../assets/git-sync.png';

export const featuresContent = {
  title: 'Platform Features',
  subtitle:
    'Everything you need to discover, evaluate, and organize open-source projects — built for developers who move fast.',
  layout: 'grid',
  cards: [
    {
      id: 'intelligent-discovery',
      image: gitImage1,
      title: 'Intelligent Discovery',
      badge: 'Just shipped',
      description:
        'Cut through repository noise with precision filters for language, stars, forks, and last-updated activity. Surface battle-tested libraries that match your stack and maintenance bar in seconds.',
      links: [
        { label: 'Start exploring', href: '/dashboard' },
        { label: 'Filter guide', href: '/docs' },
      ],
    },
    {
      id: 'repository-analytics',
      image: gitImage2,
      title: 'Repository Analytics',
      badge: 'New',
      description:
        'Read the health of any project at a glance. Contribution heatmaps, commit velocity charts, and issue trends reveal maintainer responsiveness before you adopt a dependency.',
      links: [
        { label: 'View a repo', href: '/dashboard' },
        { label: 'Analytics docs', href: '/docs' },
      ],
    },
    {
      id: 'smart-bookmarks',
      image: gitImage3,
      title: 'Smart Bookmarks',
      badge: 'Beta',
      description:
        'Curate a personal library of repositories you trust. Collections live entirely in your browser — no account, no sync servers, and zero data leaving your device.',
      links: [
        { label: 'Open bookmarks', href: '/bookmarks' },
        { label: 'Privacy details', href: '/docs' },
      ],
    },
    {
      id: 'developer-profiles',
      image: gitImage4,
      title: 'Developer Profiles',
      badge: 'New',
      description:
        'Analyze any GitHub contributor with activity density maps and contribution history. Identify consistent maintainers and rising talent across the open-source ecosystem.',
      links: [
        { label: 'Search profiles', href: '/profile' },
        { label: 'Profile docs', href: '/docs' },
      ],
    },
    {
      id: 'github-sync',
      image: gitSync,
      title: 'Live GitHub Sync',
      badge: 'Just shipped',
      description:
        'GitExplorer mirrors GitHub data in real time through the public REST API. Browse trending repos, inspect metadata, and jump to source — all from one focused interface.',
      links: [
        { label: 'Connect token', href: '/api' },
        { label: 'API reference', href: '/api' },
      ],
    },
    {
      id: 'developer-first-ui',
      image: gitImage1,
      title: 'Developer-First UI',
      badge: 'New',
      description:
        'Dark-mode native, keyboard-friendly, and distraction-free. Every screen is tuned for long research sessions — dense information, clear hierarchy, and instant navigation.',
      links: [
        { label: 'See the roadmap', href: '/roadmap' },
        { label: 'Changelog', href: '/changelog' },
      ],
    },
  ],
};
