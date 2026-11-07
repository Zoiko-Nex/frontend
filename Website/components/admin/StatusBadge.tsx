/**
 * StatusBadge — renders a lifecycle state with a semantic color drawn from the
 * platform's state machines. The mapping below covers the states across the four
 * wired domains; unknown states fall back to neutral.
 */

type Tone = "live" | "pending" | "danger" | "info" | "muted" | "violet";

const TONE_MAP: Record<string, Tone> = {
  // healthy / terminal-good
  ACTIVE: "live", ACTIVATED: "live", ISSUED: "live", CAPTURED: "live", SETTLED: "live",
  APPROVED: "live", COMPLETED: "live", RESOLVED: "live", CONFIRMED: "live", VERIFIED: "live",
  ACKNOWLEDGED: "live", REPROCESSED: "live", CLOSED: "muted",
  // in-flight / awaiting action
  PENDING: "pending", DRAFT: "muted", CREATED: "pending", PENDING_APPROVAL: "pending",
  PENDING_KYC: "pending", SUBMITTED: "pending", IN_REVIEW: "pending", UNDER_REVIEW: "pending",
  INVESTIGATING: "pending", UNDER_INVESTIGATION: "pending", AUTHORISED: "info", OPEN: "pending",
  RESERVED: "info", GENERATING: "pending", READY: "info", RUNNING: "info", CALCULATED: "info",
  PROVISIONING: "pending", VALIDATING: "pending", GRACE_PERIOD: "pending", WARNING: "amber" as Tone,
  // danger / negative-terminal
  SUSPENDED: "danger", FAILED: "danger", CANCELLED: "danger", REJECTED: "danger",
  VOIDED: "danger", TERMINATED: "danger", RESTRICTED: "danger", WRITTEN_OFF: "danger",
  DISPUTED: "danger", ESCALATED: "danger", EXPIRED: "muted", SUPERSEDED: "muted",
  REFUNDED: "violet", DEBITED: "violet", RETIRED: "muted", DISABLED: "muted", ARCHIVED: "muted",
  FALSE_POSITIVE: "muted", DUPLICATE: "muted", FINAL_NOTICE: "danger", COLLECTIONS: "danger",
};

const STYLES: Record<Tone, { bg: string; fg: string; dot: string }> = {
  live: { bg: "var(--ax-accent-dim)", fg: "var(--ax-accent)", dot: "var(--ax-accent)" },
  pending: { bg: "var(--ax-amber-dim)", fg: "var(--ax-amber)", dot: "var(--ax-amber)" },
  danger: { bg: "var(--ax-red-dim)", fg: "var(--ax-red)", dot: "var(--ax-red)" },
  info: { bg: "var(--ax-blue-dim)", fg: "var(--ax-blue)", dot: "var(--ax-blue)" },
  violet: { bg: "var(--ax-violet-dim)", fg: "var(--ax-violet)", dot: "var(--ax-violet)" },
  muted: { bg: "var(--ax-bg-hover)", fg: "var(--ax-text-dim)", dot: "var(--ax-text-faint)" },
};

export default function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span style={{ color: "var(--ax-text-faint)" }}>—</span>;
  const tone = TONE_MAP[status] ?? "muted";
  const s = STYLES[tone] ?? STYLES.muted;
  return (
    <span
      className="mono"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "2px 9px 2px 7px", borderRadius: 999, fontSize: 11.5,
        letterSpacing: "0.02em", background: s.bg, color: s.fg, whiteSpace: "nowrap",
        border: `1px solid color-mix(in srgb, ${s.fg} 22%, transparent)`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}
