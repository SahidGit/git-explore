import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    historyApiFallback: true,
  },

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core runtime — always needed
          vendor: ['react', 'react-dom'],
          // Router — needed on every page but can be split from vendor
          router: ['react-router-dom'],
          // Heavy animation library — shared across pages
          animations: ['framer-motion'],
          // Chart rendering — only dashboard needs this
          charts: ['chart.js', 'react-chartjs-2'],
          // Icon set — shared across all components
          icons: ['lucide-react'],
        },
      },
    },
  },
})
