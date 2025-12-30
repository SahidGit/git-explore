import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://gitexplorer.com',
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
