export interface MatchedReferenceInfo {
  matchType: 'primary' | 'alternate' | 'description';
  oemName?: string;
  matchedNumber?: string;
  isExact: boolean;
}

/**
 * Normalizes part numbers by uppercasing and stripping spaces, hyphens, underscores, dots, slashes.
 * e.g., 'sdv-4471 023' -> 'SDV4471023'
 */
export function normalizePartNumber(str: string): string {
  if (!str) return '';
  return str.toUpperCase().replace(/[\s\-_./]/g, '');
}

/**
 * Checks if a search query matches any part identifiers (ID, description, or OEM references).
 */
export function matchPartQuery(
  part: {
    id: string;
    description: string;
    oemReferences: Array<{ oem: string; number: string; type?: string }>;
  },
  query: string
): MatchedReferenceInfo | null {
  if (!query || !query.trim()) return null;
  const rawQ = query.trim().toUpperCase();
  const normQ = normalizePartNumber(query);
  const normId = normalizePartNumber(part.id);

  // 1. Direct Part ID match
  if (normId === normQ) {
    return { matchType: 'primary', matchedNumber: part.id, isExact: true };
  }
  if (normId.startsWith(normQ)) {
    return { matchType: 'primary', matchedNumber: part.id, isExact: false };
  }

  // 2. OEM references match
  for (const ref of part.oemReferences) {
    const normRef = normalizePartNumber(ref.number);
    if (normRef === normQ) {
      return {
        matchType: 'alternate',
        oemName: ref.oem,
        matchedNumber: ref.number,
        isExact: true,
      };
    }
  }

  for (const ref of part.oemReferences) {
    const normRef = normalizePartNumber(ref.number);
    if (normRef.startsWith(normQ) || normRef.includes(normQ)) {
      return {
        matchType: 'alternate',
        oemName: ref.oem,
        matchedNumber: ref.number,
        isExact: false,
      };
    }
  }

  // 3. Description search
  if (part.description.toUpperCase().includes(rawQ)) {
    return { matchType: 'description', isExact: false };
  }

  return null;
}
