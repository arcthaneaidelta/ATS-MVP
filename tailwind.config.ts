import type { Config } from 'tailwindcss';

/**
 * Every value here points at a CSS variable in src/styles/tokens.css.
 * To re-brand, edit tokens.css only — this file never needs to change.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '360px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: { DEFAULT: 'var(--ink)', 2: 'var(--ink-2)', 3: 'var(--ink-3)' },
        line: { DEFAULT: 'var(--line)', 2: 'var(--line-2)' },
        primary: {
          DEFAULT: 'var(--primary)',
          h: 'var(--primary-h)',
          a: 'var(--primary-a)',
          t: 'var(--primary-t)',
        },
        secondary: 'var(--secondary)',
        accent: { DEFAULT: 'var(--accent)', t: 'var(--accent-t)' },
        success: 'var(--success)',
        warning: { DEFAULT: 'var(--warning)', t: 'var(--warning-t)' },
        error: { DEFAULT: 'var(--error)', t: 'var(--error-t)' },
        info: { DEFAULT: 'var(--info)', t: 'var(--info-t)' },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
        phone: 'var(--r-phone)',
      },
      boxShadow: {
        1: 'var(--sh-1)',
        2: 'var(--sh-2)',
        sheet: 'var(--sh-sheet)',
        phone: 'var(--sh-phone)',
      },
      transitionDuration: {
        fast: 'var(--d-fast)',
        med: 'var(--d-med)',
        slow: 'var(--d-slow)',
        hero: 'var(--d-hero)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        inout: 'var(--ease-inout)',
      },
      zIndex: {
        sticky: 'var(--z-sticky)',
        nav: 'var(--z-nav)',
        sheet: 'var(--z-sheet)',
        toast: 'var(--z-toast)',
        lock: 'var(--z-lock)',
        loader: 'var(--z-loader)',
      },
      maxWidth: {
        container: '1200px',
        'container-lg': '1320px',
      },
    },
  },
  plugins: [],
} satisfies Config;
