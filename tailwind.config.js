/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          2: 'var(--surface-2)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        sand: {
          DEFAULT: 'var(--sand)',
          soft: 'var(--sand-soft)',
        },
        success: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          soft: 'var(--warning-soft)',
        },
        error: {
          DEFAULT: 'var(--error)',
          soft: 'var(--error-soft)',
        },
        info: {
          DEFAULT: 'var(--info)',
          soft: 'var(--info-soft)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'sh-1': '0 1px 2px rgba(29,33,30,0.06)',
        'sh-2': '0 6px 20px -8px rgba(29,33,30,0.16)',
        'sh-3': '0 24px 60px -24px rgba(29,33,30,0.28)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      maxWidth: {
        'content': '1240px',
      },
      zIndex: {
        header: '40',
        drawer: '60',
        modal: '70',
        toast: '80',
        intro: '100',
      },
      ringWidth: { 3: '3px' },
      spacing: { 18: '4.5rem' },
      backdropBlur: { xs: '2px' },
      keyframes: {
        slowzoom: { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.06)' } },
        scrollcue: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
      },
      animation: {
        slowzoom: 'slowzoom 24s cubic-bezier(.2,0,0,1) infinite alternate',
        scrollcue: 'scrollcue 2.4s cubic-bezier(.76,0,.24,1) infinite',
      },
    },
  },
  plugins: [],
}
