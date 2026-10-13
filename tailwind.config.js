/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
        },
        line: {
          DEFAULT: 'var(--line)',
          2: 'var(--line-2)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          h: 'var(--primary-h)',
          a: 'var(--primary-a)',
        },
        slate: {
          DEFAULT: 'var(--slate)',
          hover: '#3F5970',
        },
        clay: {
          DEFAULT: 'var(--clay)',
          h: 'var(--clay-h, #A04E31)',
          a: 'var(--clay-a, #8A4128)',
          tint: 'var(--clay-tint, #F3E3DB)',
        },
        sage: {
          DEFAULT: 'var(--sage)',
          tint: '#E4ECE7',
        },
        ok: {
          DEFAULT: 'var(--ok)',
          tint: '#E3F0E9',
        },
        warn: {
          DEFAULT: 'var(--warn)',
          tint: '#F8EBD2',
        },
        err: {
          DEFAULT: 'var(--err)',
          tint: '#F8E1DE',
        },
        info: {
          DEFAULT: 'var(--info)',
          tint: '#E1EBF3',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(23,35,31,.06)',
        md: '0 4px 16px -4px rgba(23,35,31,.10)',
        lg: '0 16px 40px -12px rgba(23,35,31,.16)',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
