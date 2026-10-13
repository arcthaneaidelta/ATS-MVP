import { useDemoStore } from '../store/demo';

export async function simulateLatency(type: 'read' | 'write' = 'read'): Promise<void> {
  const isSlow = useDemoStore.getState().simulateSlowNetwork;
  const baseMs =
    type === 'read'
      ? 250 + Math.random() * 450 // 250 - 700ms
      : 500 + Math.random() * 700; // 500 - 1200ms

  const duration = isSlow ? baseMs * 4 : baseMs;
  return new Promise((resolve) => setTimeout(resolve, duration));
}
