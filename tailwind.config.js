/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F5F2EC',
        surface: {
          DEFAULT: '#FBF9F5',
          elevated: '#FFFFFF',
          sunken: '#EDE9E1',
        },
        ink: '#1B2420',
        textSecondary: '#4A5650',
        textMuted: '#7C867F',
        borderSubtle: '#DDD8CD',
        borderStrong: '#C7C1B3',
        primary: {
          DEFAULT: '#2C4A3E',
          hover: '#223A30',
          active: '#1A2D25',
          soft: '#E3EBE6',
        },
        secondary: '#6B7A72',
        accent: {
          DEFAULT: '#B08A4E',
          soft: '#F1E7D3',
        },
        success: '#3E7D5A',
        warning: '#B7791F',
        error: '#A8453A',
        info: '#3F6B8A',
        footerBg: '#16201C',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        'sh-1': '0 1px 2px rgba(27,36,32,0.05)',
        'sh-2': '0 6px 20px rgba(27,36,32,0.08)',
        'sh-3': '0 20px 48px rgba(27,36,32,0.14)',
      },
      transitionTimingFunction: {
        'out-custom': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-custom': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'exit-custom': 'cubic-bezier(0.4, 0, 1, 1)',
        'emph-custom': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
