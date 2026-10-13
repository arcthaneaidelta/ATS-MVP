/**
 * Deterministic pseudo-random latency simulator for demo reproducibility.
 */
export function getLatency(seedStr: string, isSlow: boolean = false): number {
  if (isSlow) return 2400;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash % 1000) / 1000;
  // 300ms to 750ms latency range
  return 300 + Math.floor(normalized * 450);
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
