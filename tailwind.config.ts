import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F5F2EC',
        surface: {
          DEFAULT: '#FBFAF7',
          elevated: '#FFFFFF',
          sunken: '#EFEBE3',
        },
        ink: {
          900: '#1E2623',
          700: '#47524D',
          500: '#7B857F',
          300: '#B9BFBA',
        },
        border: {
          DEFAULT: '#E2DDD3',
          strong: '#CFC9BD',
        },
        primary: {
          DEFAULT: '#2E4A42',
          hover: '#253D36',
          active: '#1D312B',
          tint: '#E4ECE8',
        },
        secondary: {
          DEFAULT: '#5B6B76',
        },
        accent: {
          DEFAULT: '#B4713B',
          hover: '#9C5F2F',
          tint: '#F4E7DB',
        },
        success: {
          DEFAULT: '#3F7A5B',
          tint: '#E3F0E8',
        },
        warning: {
          DEFAULT: '#B2842B',
          tint: '#F6ECD3',
        },
        error: {
          DEFAULT: '#A4453B',
          tint: '#F5E2DF',
        },
        info: {
          DEFAULT: '#3F6B8A',
          tint: '#E1ECF3',
        },
        dark: {
          bg: '#16201D',
          surface: '#1E2A26',
          text: '#EDEAE3',
          muted: '#9AA59F',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        xs: '0 1px 0 rgba(30,38,35,0.04)',
        sm: '0 1px 2px rgba(30,38,35,0.06), 0 1px 1px rgba(30,38,35,0.04)',
        md: '0 6px 16px -4px rgba(30,38,35,0.10)',
        lg: '0 24px 48px -12px rgba(30,38,35,0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
