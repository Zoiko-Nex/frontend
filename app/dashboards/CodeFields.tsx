"use client";

/**
 * Shared pickers for the codes that recur across every domain tab.
 *
 * These replace bare text inputs. A text input for a currency or a jurisdiction
 * puts the burden of knowing the vocabulary on the operator: the field carried
 * no placeholder and no list, so the only discoverable values were the ones
 * already visible in a table row, and a plausible-but-wrong code (GBP vs UKP,
 * "California" vs "US-CA") was accepted here and rejected by the service.
 *
 * Jurisdiction is deliberately live rather than a static ISO list: only the
 * jurisdictions a tenant has actually configured a policy for are valid, so the
 * tax service's own policy list is the authority on what may be selected.
 */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/admin/client";
import { ENVELOPE, listOf } from "@/lib/admin/envelope";
import { CURRENCY_CODES, COUNTRY_CODES, currencyLabel, countryLabel } from "@/lib/admin/codes";

const FIELD =
  "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-sky-500 disabled:bg-slate-50";

type BaseProps = {
  value: string;
  onChange: (v: string) => void;
  /** Rendered as the empty option. Selecting it clears the field. */
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function CurrencySelect({
  value,
  onChange,
  placeholder = "— currency —",
  required,
  disabled,
  className,
}: BaseProps) {
  return (
    <select
      className={className ?? FIELD}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {/* A value the tenant already stored may predate this list; keep it selectable. */}
      {value && !CURRENCY_CODES.includes(value) && <option value={value}>{value}</option>}
      {CURRENCY_CODES.map((c) => (
        <option key={c} value={c}>
          {currencyLabel(c)}
        </option>
      ))}
    </select>
  );
}

export function CountrySelect({
  value,
  onChange,
  placeholder = "— country —",
  required,
  disabled,
  className,
}: BaseProps) {
  return (
    <select
      className={className ?? FIELD}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {value && !COUNTRY_CODES.includes(value) && <option value={value}>{value}</option>}
      {COUNTRY_CODES.map((c) => (
        <option key={c} value={c}>
          {countryLabel(c)}
        </option>
      ))}
    </select>
  );
}

type JurisdictionPolicy = { jurisdiction_code?: string; country_code?: string; status?: string };

/**
 * Distinct jurisdiction codes the tenant has a policy for.
 *
 * Shared query key so the list is fetched once however many fields are on
 * screen. A tax service that is unreachable leaves the field empty rather than
 * blocking the form, and the code already held stays selectable either way.
 */
export function useJurisdictionCodes() {
  const q = useQuery({
    queryKey: ["tax", "jurisdiction-codes"],
    queryFn: async () =>
      listOf<JurisdictionPolicy>(
        await api.get("tax", "/v1/jurisdiction-policies?page_size=200"),
        ENVELOPE.tax,
      ),
    staleTime: 5 * 60_000,
  });
  const codes = Array.from(
    new Set((q.data ?? []).map((p) => p.jurisdiction_code).filter((c): c is string => !!c)),
  ).sort();
  return { codes, isLoading: q.isLoading, isError: q.isError };
}

export function JurisdictionSelect({
  value,
  onChange,
  placeholder = "— jurisdiction —",
  required,
  disabled,
  className,
}: BaseProps) {
  const { codes, isLoading, isError } = useJurisdictionCodes();
  return (
    <>
      <select
        className={className ?? FIELD}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled || isLoading}
      >
        <option value="">
          {isLoading ? "loading…" : codes.length ? placeholder : "no jurisdiction policies"}
        </option>
        {value && !codes.includes(value) && <option value={value}>{value}</option>}
        {codes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {!isLoading && !isError && codes.length === 0 && (
        <span className="text-[11px] text-amber-600">
          Configure one under Tax &amp; Jurisdiction first.
        </span>
      )}
    </>
  );
}

/**
 * Jurisdiction as a free-text field that *suggests* the configured codes.
 *
 * For the form that creates a jurisdiction policy, a picker of existing
 * jurisdictions would be a dead end: the whole point of that form is to name a
 * jurisdiction there is not a policy for yet. A datalist gives the same
 * discoverability without closing the set.
 */
export function JurisdictionInput({
  value,
  onChange,
  placeholder = "US-CA",
  required,
  disabled,
  className,
}: BaseProps) {
  const { codes } = useJurisdictionCodes();
  const listId = "jurisdiction-codes";
  return (
    <>
      <input
        className={className ?? FIELD}
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={5}
      />
      <datalist id={listId}>
        {codes.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </>
  );
}
