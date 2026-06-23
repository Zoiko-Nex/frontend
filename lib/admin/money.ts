/**
 * Money formatting for the ZoikoNex money standard: integer minor units +
 * ISO 4217 currency code. NEVER use floats for arithmetic — these helpers are
 * for DISPLAY only. The backend is the source of truth for all amounts.
 *
 * Most ISO 4217 currencies use 2 minor-unit digits, but not all (JPY=0,
 * BHD/KWD/TND=3). We rely on Intl to apply the correct exponent per currency.
 */

/** Currencies with non-standard minor-unit exponents we may encounter. */
const EXPONENT_OVERRIDES: Record<string, number> = {
  JPY: 0, KRW: 0, VND: 0, CLP: 0, ISK: 0, XAF: 0, XOF: 0,
  BHD: 3, KWD: 3, OMR: 3, TND: 3, JOD: 3, IQD: 3, LYD: 3,
};

export function minorUnitExponent(currency: string): number {
  const c = currency?.toUpperCase();
  if (c in EXPONENT_OVERRIDES) return EXPONENT_OVERRIDES[c];
  return 2;
}

/**
 * Format an integer minor-unit amount as a localized currency string.
 * e.g. formatMoney(55000, "USD") -> "$550.00"; formatMoney(2500, "JPY") -> "¥2,500"
 */
export function formatMoney(
  minorUnits: number | string | null | undefined,
  currency: string | null | undefined,
): string {
  if (minorUnits == null || currency == null) return "—";
  const exp = minorUnitExponent(currency);
  const major = Number(minorUnits) / Math.pow(10, exp);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: exp,
      maximumFractionDigits: exp,
    }).format(major);
  } catch {
    // Unknown currency code — render the raw major value with the code suffix.
    return `${major.toFixed(exp)} ${currency.toUpperCase()}`;
  }
}

/** Basis points to a percentage label: 725 -> "7.25%". */
export function formatBps(bps: number | string | null | undefined): string {
  if (bps == null) return "—";
  return `${(Number(bps) / 100).toFixed(2)}%`;
}
