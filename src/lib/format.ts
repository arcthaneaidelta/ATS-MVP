export function formatCurrency(
  value: number,
  options?: { showSign?: boolean; maximumFractionDigits?: number }
): string {
  const digits = options?.maximumFractionDigits ?? 2;
  const absFormatted = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  if (options?.showSign) {
    if (value > 0) return `+$${absFormatted}`;
    if (value < 0) return `-$${absFormatted}`;
  }

  return `$${absFormatted}`;
}

export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address || address.length < startChars + endChars) return address || '';
  return `${address.slice(0, startChars)}…${address.slice(-endChars)}`;
}

export function formatTxHash(hash: string): string {
  if (!hash || hash.length < 12) return hash || '';
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

export function getTimeRemaining(targetIso: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formatted: string;
} {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${pad(hours)}h ${pad(minutes)}m`;
  } else {
    formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return { days, hours, minutes, seconds, totalSeconds, formatted };
}

export function calculateModuloWinner(randomWordStr: string, entriesCount: number) {
  try {
    const bigRandom = BigInt(randomWordStr);
    const bigEntries = BigInt(entriesCount > 0 ? entriesCount : 1);
    const remainder = Number(bigRandom % bigEntries);
    const winningEntryNumber = remainder + 1; // 1-indexed entry number

    return {
      success: true,
      winningEntryNumber,
      remainder,
      steps: [
        `Step 1: Read verified 256-bit random word from Chainlink VRF: ${randomWordStr.slice(0, 16)}...`,
        `Step 2: Calculate modulo with total sealed entries count (${entriesCount}): ${bigRandom.toString().slice(0, 12)}... mod ${entriesCount}`,
        `Step 3: Remainder is ${remainder}. Adding 1 yields Winning Entry #${winningEntryNumber}.`
      ]
    };
  } catch {
    return {
      success: false,
      winningEntryNumber: 1,
      remainder: 0,
      steps: ['Invalid number input format']
    };
  }
}
