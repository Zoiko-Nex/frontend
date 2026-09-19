/**
 * Date helpers shared by the dashboard screens.
 *
 * These four were defined identically in five different dashboards. Identical
 * copies of a date helper are worse than they look: every one of these feeds a
 * query parameter that scopes a billing, settlement or assurance figure, so a
 * fix applied to one copy and not the others produces screens that disagree
 * about which period they are reporting — and each looks internally consistent
 * while doing it.
 *
 * Everything here works in UTC. The platform reports money and usage against
 * UTC periods, and a helper that quietly used the viewer's local midnight would
 * shift a period boundary by a day for anyone east or west of it.
 */

/** Today as YYYY-MM-DD, UTC. */
export function today(): string {
  return new Date().toISOString().split("T")[0];
}

/** The first day of the current month as YYYY-MM-DD, UTC. */
export function monthStart(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().split("T")[0];
}

/** The current billing period as YYYY-MM, UTC. */
export function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * Widens a YYYY-MM-DD date to a full RFC 3339 timestamp at UTC midnight, which
 * is the form the backends expect for range filters.
 */
export function asRFC3339(date: string): string {
  return new Date(`${date}T00:00:00Z`).toISOString();
}
