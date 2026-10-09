/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        sunken: "var(--sunken)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        text: "var(--text)",
        "text-2": "var(--text-2)",
        "text-muted": "var(--text-muted)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
          soft: "var(--primary-soft)",
        },
        secondary: "var(--secondary)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        chip: "6px",
        input: "8px",
        card: "12px",
        modal: "16px",
      },
      boxShadow: {
        "sh-1": "0 1px 2px rgba(31,36,32,.06)",
        "sh-2": "0 4px 14px rgba(31,36,32,.08)",
        "sh-3": "0 18px 48px rgba(31,36,32,.14)",
      },
      transitionTimingFunction: {
        "ease-out-custom": "cubic-bezier(.22,.8,.24,1)",
        "ease-in-out-custom": "cubic-bezier(.6,.05,.2,.95)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "220ms",
        slow: "420ms",
        scenic: "700ms",
      },
    },
  },
  plugins: [],
}
