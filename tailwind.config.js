/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary, #FFFFFF)',
        accent: {
          DEFAULT: 'var(--accent, #FFFFFF)',
          hover: 'var(--accent-hover, #F4F4F5)',
          bright: 'var(--accent-bright, #FFFFFF)',
          muted: 'var(--accent-muted, rgba(255, 255, 255, 0.12))',
          border: 'var(--accent-border, rgba(255, 255, 255, 0.20))',
        },
        magenta: {
          DEFAULT: '#FFFFFF',
          hover: '#F4F4F5',
          bright: '#FFFFFF',
          muted: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.20)',
        },
        orange: {
          DEFAULT: 'var(--orange)',
          hover: 'var(--orange-hover)',
          muted: 'var(--orange-muted)',
        },
        blue: {
          DEFAULT: 'var(--blue)',
          hover: 'var(--blue-hover)',
          bright: 'var(--blue-bright)',
          muted: 'var(--blue-muted)',
        },
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          4: 'var(--surface-4)',
          5: 'var(--surface-5)',
          DEFAULT: 'var(--surface-2)',
          elevated: 'var(--surface-3)',
        },
        canvas: 'var(--background)',
        trigray: {
          700: 'var(--surface-4)',
          800: 'var(--surface-3)',
          900: 'var(--surface-2)',
        },
        // Retain legacy github tokens for dashboard/other pages
        github: {
          bg: 'var(--surface-2)',
          card: 'var(--surface-3)',
          border: 'var(--border)',
          text: 'var(--text-primary)',
          'text-muted': 'var(--text-secondary)',
          accent: '#FFFFFF',
          purple: '#A1A1AA',
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
        // ── Body / UI — Inter ────────────────────────────────────
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        body: [
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        // ── Headings / Display — Neue Machina ───────────────────
        heading: [
          'Neue Machina',
          'Space Grotesk',
          'system-ui',
          'sans-serif',
        ],
        space: [
          'Neue Machina',
          'Space Grotesk',
          'system-ui',
          'sans-serif',
        ],
        // ── Accent Highlight — Neue Machina ─────────────────────
        highlight: [
          'Neue Machina',
          'sans-serif',
        ],
        // Legacy alias: syne → highlight (Neue Machina)
        syne: [
          'Neue Machina',
          'Space Grotesk',
          'sans-serif',
        ],
        // Legacy alias: jakarta → body (Inter)
        jakarta: [
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        // ── Monospace — Geist Mono stack ─────────────────────────
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
