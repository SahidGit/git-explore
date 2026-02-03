/**
 * Lazy content loader utility
 * Dynamically imports content modules only when needed to reduce initial bundle size
 */

const contentModules = {
  features: () => import('./content/features').then(m => m.featuresContent),
  changelog: () => import('./content/changelog').then(m => m.changelogContent),
  docs: () => import('./content/docs').then(m => m.docsContent),
  api: () => import('./content/api').then(m => m.apiContent),
  resources: () => import('./content/resources').then(m => m.resourcesContent),
  roadmap: () => import('./content/roadmap').then(m => m.roadmapContent),
};

const cache = new Map();

/**
 * Get content by key with lazy loading and caching
 * @param {string} key - The content key (features, changelog, docs, etc.)
 * @returns {Promise<Object>} The content object with title, subtitle, and content
 */
export const getContentByKey = async (key) => {
  // Return from cache if available
  if (cache.has(key)) {
    return cache.get(key);
  }

  // Load from module if available
  if (contentModules[key]) {
    try {
      const content = await contentModules[key]();
      cache.set(key, content);
      return content;
    } catch (error) {
      console.error(`Failed to load content for key: ${key}`, error);
      return null;
    }
  }

  console.warn(`Content not found for key: ${key}`);
  return null;
};

/**
 * Get all available content keys
 * @returns {Array<string>} Array of available content keys
 */
export const getAvailableContentKeys = () => {
  return Object.keys(contentModules);
};
