import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Note: public/sitemap.xml is manually maintained.
// Keep it synchronized with all routes in App.jsx:
// - Static routes: /, /dashboard, /bookmarks, /profile
// - Dynamic routes from contentLoader: /features, /changelog, /docs, /api, /resources, /roadmap
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true
  },
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
  }
})
