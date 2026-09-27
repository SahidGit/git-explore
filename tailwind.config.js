/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: 'var(--foreground, #FFFFFF)',
        primary: 'var(--primary, var(--accent))',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          muted: 'var(--accent-muted)',
          subtle: 'var(--accent-subtle)',
          border: 'var(--accent-border)',
        },
        // Unify all emerald and green references to the single accent token oklch(62.7% .194 149.214)
        emerald: {
          50: 'oklch(62.7% 0.194 149.214 / 0.05)',
          100: 'oklch(62.7% 0.194 149.214 / 0.1)',
          200: 'oklch(62.7% 0.194 149.214 / 0.2)',
          300: 'var(--accent)',
          400: 'var(--accent)',
          500: 'var(--accent)',
          600: 'var(--accent)',
          700: 'var(--accent)',
          800: 'oklch(40% 0.14 149.214)',
          900: 'oklch(30% 0.10 149.214)',
          950: 'oklch(20% 0.06 149.214)',
          DEFAULT: 'var(--accent)',
        },
        green: {
          50: 'oklch(62.7% 0.194 149.214 / 0.05)',
          100: 'oklch(62.7% 0.194 149.214 / 0.1)',
          200: 'oklch(62.7% 0.194 149.214 / 0.2)',
          300: 'var(--accent)',
          400: 'var(--accent)',
          500: 'var(--accent)',
          600: 'var(--accent)',
          700: 'var(--accent)',
          800: 'oklch(40% 0.14 149.214)',
          900: 'oklch(30% 0.10 149.214)',
          DEFAULT: 'var(--accent)',
        },
        // Clean modern SaaS flat neutrals
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
          accent: 'var(--accent)',
          purple: '#7C3AED',
        },
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
        '3xl': '8px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        lg: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        xl: '0 2px 6px -1px rgba(0, 0, 0, 0.12)',
        '2xl': 'none',
        none: 'none',
      },
      fontFamily: {
        sans: [
          'Space Grotesk',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        heading: [
          'Neue Machina',
          'Space Grotesk',
          'sans-serif',
        ],
        space: [
          'Space Grotesk',
          'sans-serif',
        ],
        jakarta: [
          'Space Grotesk',
          'sans-serif',
        ],
        syne: [
          'Neue Machina',
          'Space Grotesk',
          'sans-serif',
        ],
        mono: [
          'Geist Mono',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
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
        slideDown: 'slideDown 0.15s ease-out forwards',
        slideUp: 'slideUp 0.15s ease-in forwards',
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
