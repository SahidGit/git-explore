/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New AI-native design tokens
        canvas: '#0A0A0C',
        surface: {
          DEFAULT: '#121215',
          elevated: '#16161A',
        },
        // Retain legacy github tokens for dashboard/other pages
        github: {
          bg: '#0D1117',
          card: '#161B22',
          border: '#30363D',
          text: '#F0F6FC',
          'text-muted': '#8B949E',
          accent: '#58A6FF',
          purple: '#7C3AED',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        heading: [
          'Syne',
          'Space Grotesk',
          'Inter',
          'sans-serif',
        ],
        syne: [
          'Syne',
          'sans-serif',
        ],
        space: [
          'Space Grotesk',
          'sans-serif',
        ],
        editorial: [
          'Newsreader',
          'Georgia',
          'serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        terminalBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        fadeInUp: 'fadeInUp 0.7s ease-out forwards',
        'fadeInUp-d1': 'fadeInUp 0.7s ease-out 0.1s forwards',
        'fadeInUp-d2': 'fadeInUp 0.7s ease-out 0.2s forwards',
        'fadeInUp-d3': 'fadeInUp 0.7s ease-out 0.35s forwards',
        'fadeInUp-d4': 'fadeInUp 0.7s ease-out 0.5s forwards',
        terminalBlink: 'terminalBlink 1s step-start infinite',
        glowPulse: 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 4s linear infinite',
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '28px 28px',
      },
    },
  },
  plugins: [],
}
