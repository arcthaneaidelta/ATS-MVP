/**
 * Mock API layer with realistic simulated network latency and optional error triggers.
 */

export async function simulateLatency<T>(data: T, minMs = 250, maxMs = 600): Promise<T> {
  const isErrorForced = typeof window !== 'undefined' && window.location.search.includes('demoError=1');
  const delay = Math.floor(minMs + Math.random() * (maxMs - minMs));

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isErrorForced) {
        reject(new Error('Simulated network error (?demoError=1 active)'));
      } else {
        resolve(data);
      }
    }, delay);
  });
}
