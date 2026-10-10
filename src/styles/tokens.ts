// PRD Section 19: Design Tokens
export const colors = {
  bg: '#F5F2EC',
  surface: '#FBFAF7',
  elevated: '#FFFFFF',
  sunken: '#EFEBE3',
  ink900: '#1E2623',
  ink700: '#47524D',
  ink500: '#7B857F',
  ink300: '#B9BFBA',
  border: '#E2DDD3',
  borderStrong: '#CFC9BD',
  primary: '#2E4A42',
  primaryHover: '#253D36',
  primaryActive: '#1D312B',
  primaryTint: '#E4ECE8',
  secondary: '#5B6B76',
  accent: '#B4713B',
  accentHover: '#9C5F2F',
  accentTint: '#F4E7DB',
  success: '#3F7A5B',
  successTint: '#E3F0E8',
  warning: '#B2842B',
  warningTint: '#F6ECD3',
  error: '#A4453B',
  errorTint: '#F5E2DF',
  info: '#3F6B8A',
  infoTint: '#E1ECF3',
  darkBg: '#16201D',
  darkSurface: '#1E2A26',
  darkText: '#EDEAE3',
  darkMuted: '#9AA59F',
} as const;

export const space = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96, 128] as const;

export const radius = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  full: '9999px',
} as const;

export const shadow = {
  xs: '0 1px 0 rgba(30,38,35,0.04)',
  sm: '0 1px 2px rgba(30,38,35,0.06), 0 1px 1px rgba(30,38,35,0.04)',
  md: '0 6px 16px -4px rgba(30,38,35,0.10)',
  lg: '0 24px 48px -12px rgba(30,38,35,0.18)',
} as const;

export const motion = {
  fast: '140ms',
  base: '240ms',
  slow: '480ms',
  cinematic: '900ms',
  easeOut: 'cubic-bezier(0.22,1,0.36,1)',
  easeInOut: 'cubic-bezier(0.76,0,0.24,1)',
  standard: 'cubic-bezier(0.4,0,0.2,1)',
} as const;

export const z = {
  base: 0,
  sticky: 10,
  nav: 20,
  dropdown: 30,
  drawer: 40,
  modal: 50,
  toast: 60,
  loader: 100,
} as const;

export const breakpoints = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
