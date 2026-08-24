/**
 * ISO code lists for the console's form fields.
 *
 * Every currency, country and jurisdiction field in the console used to be a
 * bare text input with no placeholder and a maxLength, so the only way to know
 * that currency wanted "USD" and jurisdiction wanted "US-CA" was to have seen a
 * row that already had one. A wrong code is accepted by the field and rejected
 * by the service, which surfaces as a validation error naming a column.
 *
 * Names are resolved through Intl rather than shipped as a table: the runtime
 * already carries them, and a hand-kept table drifts. Both helpers fall back to
 * the bare code, so an unrecognised value still renders as itself.
 */

const CURRENCY_FALLBACK = [
  "AED", "AUD", "BRL", "CAD", "CHF", "CNY", "DKK", "EUR", "GBP", "HKD", "IDR",
  "ILS", "INR", "JPY", "KES", "KRW", "MXN", "MYR", "NGN", "NOK", "NZD", "PHP",
  "PLN", "QAR", "RON", "SAR", "SEK", "SGD", "THB", "TRY", "TWD", "TZS", "UAH",
  "USD", "VND", "ZAR",
];

/**
 * Intl.supportedValuesOf covers the whole active ISO 4217 set where it exists;
 * the fallback is a working subset rather than a promise of completeness.
 */
export const CURRENCY_CODES: string[] = (() => {
  try {
    const all = Intl.supportedValuesOf("currency");
    if (all?.length) return [...all];
  } catch {
    /* older runtime — fall through */
  }
  return CURRENCY_FALLBACK;
})();

/** ISO 3166-1 alpha-2. No Intl equivalent enumerates these, so the codes are listed. */
export const COUNTRY_CODES: string[] = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
  "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
  "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE",
  "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF",
  "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
  "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM",
  "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC",
  "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
  "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA",
  "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
  "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
  "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
  "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
  "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW",
];

function displayName(type: "currency" | "region", code: string): string {
  try {
    const dn = new Intl.DisplayNames(["en"], { type });
    return dn.of(code) ?? code;
  } catch {
    return code;
  }
}

/** "USD — US Dollar". Falls back to the bare code on an unknown value. */
export function currencyLabel(code: string): string {
  const name = displayName("currency", code);
  return name === code ? code : `${code} — ${name}`;
}

/** "US — United States". Falls back to the bare code on an unknown value. */
export function countryLabel(code: string): string {
  const name = displayName("region", code);
  return name === code ? code : `${code} — ${name}`;
}
