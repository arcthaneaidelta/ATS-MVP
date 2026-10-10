// PRD Section 22: Fixed FX (labeled "demo rates")
// USD->PEN 3.72, USD->ZMW 26.40

export const FX_RATES = {
  USD_TO_PEN: 3.72,
  USD_TO_ZMW: 26.40,
  PEN_TO_USD: 1 / 3.72,
  ZMW_TO_USD: 1 / 26.40,
} as const;

export function convertCurrency(
  amount: number,
  from: 'USD' | 'PEN' | 'ZMW',
  to: 'USD' | 'PEN' | 'ZMW'
): number {
  if (from === to) return amount;
  
  // Convert first to USD
  let amountInUSD = amount;
  if (from === 'PEN') amountInUSD = amount * FX_RATES.PEN_TO_USD;
  else if (from === 'ZMW') amountInUSD = amount * FX_RATES.ZMW_TO_USD;

  // Convert from USD to target
  if (to === 'USD') return amountInUSD;
  if (to === 'PEN') return amountInUSD * FX_RATES.USD_TO_PEN;
  if (to === 'ZMW') return amountInUSD * FX_RATES.USD_TO_ZMW;

  return amountInUSD;
}
