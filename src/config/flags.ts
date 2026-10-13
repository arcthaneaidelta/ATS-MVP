/** Build-time feature flags. Runtime demo toggles live in store/demoFlags.ts. */
export const flags = {
  /** Show the floating "Demo" controls chip next to the framed phone. */
  showDemoControls: true,
  /** Skip the loader in development for faster iteration. */
  skipLoaderInDev: false,
  /** Persist demo state to sessionStorage so each new visit starts clean. */
  persistSession: true,
} as const;
