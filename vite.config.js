import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
// Note: The sitemap plugin generates sitemap during build, but public/sitemap.xml is manually maintained.
// Ensure dynamicRoutes here matches all routes in App.jsx:
// - Static routes: /, /dashboard, /bookmarks, /profile
// - Dynamic routes from PAGES_CONTENT: /features, /changelog, /docs, /api, /resources, /roadmap
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://git-explore-one.vercel.app',
      dynamicRoutes: [
        '/dashboard',
        '/bookmarks',
        '/profile',
        '/features',
        '/changelog',
        '/docs',
        '/api',
        '/roadmap',
        '/resources'
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          charts: ['chart.js', 'react-chartjs-2'],
          ui: ['lucide-react', 'react-icons']
        }
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
})
