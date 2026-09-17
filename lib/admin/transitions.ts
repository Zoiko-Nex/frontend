/**
 * Lifecycle state machines, mirrored from the Go domain tables.
 *
 * Every table here is a copy of a backend table, and the copy is the point: the UI
 * must only ever offer a transition the backend permits. An illegal one comes back
 * as a 422 the operator cannot interpret, and getting the ORDER of two states wrong
 * once left every order permanently stuck in PROVISIONING.
 *
 * They all live in this one file so the mirroring can be audited in one place rather
 * than hunted across dashboards. When a backend table changes, this is the only file
 * that needs to change with it.
 *
 * Source of truth for each:
 *   TENANT       services/identity-tenancy/internal/domain/tenant/tenant.go
 *   ORDER        services/order-management-provisioning/internal/domain/order/order.go
 *   PROVISIONING .../internal/domain/provisioning/provisioning.go
 *   SIM          .../internal/domain/sim/sim.go
 *   CUSTOMER     services/customer-account/internal/domain/customer/customer.go
 *   ACCOUNT      services/customer-account/internal/domain/account/account.go
 *   PRODUCT      services/product-catalogue-commercial (UpdateProduct switch)
 *   OFFER        services/product-catalogue-commercial (UpdateOffer switch)
 *   KYC_DOCUMENT services/custmr-lfc-kyc (UpdateDocument switch)
 *   INVOICE      services/billing-invoice/internal/domain/billing/invoice.go
 *   BILL_CYCLE   services/billing-invoice/internal/domain/billing/billcycle.go
 *   PAYMENT      services/payments/internal/domain/payment/payment.go
 */

export type Transition = {
  /** The exact `action` string the backend switch expects. */
  action: string;
  label: string;
  /** Rendered apart and in a warning colour: cancels, suspensions, terminations. */
  destructive?: boolean;
};

export type TransitionTable = Record<string, Transition[]>;

/**
 * Tenant lifecycle: Provisioned → Active ⇄ Suspended → Archived.
 *
 * Keys are UPPERCASED here while the backend stores mixed case ("Provisioned",
 * "Active", ...), so every lookup must uppercase the status first — see
 * `tenantTransitionsFor`.
 *
 * Two edges are easy to get wrong and both strand a tenant:
 *   - ARCHIVE is legal only from Suspended (Tenant.Archive), never straight
 *     from Active.
 *   - Archived is terminal. Offering "Activate" on an archived tenant — which
 *     a plain "is it ACTIVE?" toggle does — sends an ACTIVATE the backend
 *     rejects with 422 "invalid tenant state transition", every single time.
 *
 * Reactivating a Suspended tenant uses REACTIVATE, not ACTIVATE: the handler
 * accepts both (Tenant.Activate also allows Suspended), but REACTIVATE is what
 * emits the TenantReactivated audit event rather than TenantActivated.
 */
export const TENANT_TRANSITIONS: TransitionTable = {
  PROVISIONED: [{ action: "ACTIVATE", label: "Activate" }],
  ACTIVE: [{ action: "SUSPEND", label: "Suspend", destructive: true }],
  SUSPENDED: [
    { action: "REACTIVATE", label: "Reactivate" },
    { action: "ARCHIVE", label: "Archive", destructive: true },
  ],
  ARCHIVED: [],
};

/** Tenant statuses arrive mixed-case from identity-tenancy; normalise first. */
export function tenantTransitionsFor(status: string | undefined): Transition[] {
  return transitionsFor(TENANT_TRANSITIONS, (status ?? "").toUpperCase());
}

/**
 * ACTIVE precedes COMPLETED. Reversing those two is not a cosmetic error: the only
 * legal moves out of PROVISIONING are ACTIVE and FAILED, so offering COMPLETE there
 * strands the order forever.
 */
export const ORDER_TRANSITIONS: TransitionTable = {
  PENDING: [
    { action: "VALIDATE", label: "Validate order structure" },
    { action: "CANCEL", label: "Cancel", destructive: true },
  ],
  VALIDATING: [
    { action: "CONFIRM", label: "Confirm commercials" },
    { action: "FAIL", label: "Fail", destructive: true },
  ],
  CONFIRMED: [
    { action: "START_PROVISIONING", label: "Start provisioning" },
    { action: "CANCEL", label: "Cancel", destructive: true },
  ],
  PROVISIONING: [
    { action: "ACTIVATE", label: "Activate subscription" },
    { action: "FAIL", label: "Fail", destructive: true },
  ],
  ACTIVE: [
    { action: "COMPLETE", label: "Complete order" },
    { action: "CANCEL", label: "Cancel", destructive: true },
  ],
  FAILED: [],
  CANCELLED: [],
  COMPLETED: [],
};

export const PROVISIONING_TRANSITIONS: TransitionTable = {
  PENDING: [
    { action: "START", label: "Start network provisioning" },
    { action: "FAIL", label: "Fail", destructive: true },
  ],
  IN_PROGRESS: [
    { action: "ACTIVATE", label: "Activate on network" },
    { action: "FAIL", label: "Fail", destructive: true },
  ],
  ACTIVATED: [
    { action: "SUSPEND", label: "Suspend", destructive: true },
    { action: "DEACTIVATE", label: "Deactivate", destructive: true },
  ],
  SUSPENDED: [
    { action: "REACTIVATE", label: "Reactivate" },
    { action: "DEACTIVATE", label: "Deactivate", destructive: true },
  ],
  DEACTIVATED: [],
  FAILED: [],
};

export const SIM_TRANSITIONS: TransitionTable = {
  INVENTORY: [
    { action: "ASSIGN", label: "Assign to this order" },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  ASSIGNED: [
    { action: "ACTIVATE", label: "Activate" },
    { action: "REPLACE", label: "Replace", destructive: true },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  ACTIVATED: [
    { action: "SUSPEND", label: "Suspend", destructive: true },
    { action: "REPLACE", label: "Replace", destructive: true },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  SUSPENDED: [
    { action: "REACTIVATE", label: "Reactivate" },
    { action: "REPLACE", label: "Replace", destructive: true },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  TERMINATED: [],
  REPLACED: [],
};

export const CUSTOMER_TRANSITIONS: TransitionTable = {
  DRAFT: [
    { action: "SUBMIT_KYC", label: "Submit for KYC" },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  PENDING_KYC: [
    { action: "ACTIVATE", label: "Activate" },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  ACTIVE: [
    { action: "SUSPEND", label: "Suspend", destructive: true },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  SUSPENDED: [
    { action: "ACTIVATE", label: "Reactivate" },
    { action: "TERMINATE", label: "Terminate", destructive: true },
  ],
  TERMINATED: [],
};

export const ACCOUNT_TRANSITIONS: TransitionTable = {
  CREATED: [
    { action: "ACTIVATE", label: "Activate" },
    { action: "CLOSE", label: "Close", destructive: true },
  ],
  ACTIVE: [
    { action: "SUSPEND", label: "Suspend", destructive: true },
    { action: "CLOSE", label: "Close", destructive: true },
  ],
  SUSPENDED: [
    { action: "ACTIVATE", label: "Reactivate" },
    { action: "CLOSE", label: "Close", destructive: true },
  ],
  CLOSED: [],
};

export const PRODUCT_TRANSITIONS: TransitionTable = {
  DRAFT: [{ action: "SUBMIT_FOR_REVIEW", label: "Submit" }],
  REVIEW: [{ action: "ACTIVATE", label: "Activate" }],
  ACTIVE: [{ action: "RETIRE", label: "Retire", destructive: true }],
  RETIRED: [],
};

export const OFFER_TRANSITIONS: TransitionTable = {
  DRAFT: [{ action: "ACTIVATE", label: "Activate" }],
  ACTIVE: [
    { action: "EXPIRE", label: "Expire", destructive: true },
    { action: "RETIRE", label: "Retire", destructive: true },
  ],
  EXPIRED: [{ action: "RETIRE", label: "Retire", destructive: true }],
  RETIRED: [],
};

export const KYC_DOCUMENT_TRANSITIONS: TransitionTable = {
  PENDING: [
    { action: "VERIFY", label: "Verify" },
    { action: "REJECT", label: "Reject", destructive: true },
  ],
  UPLOADED: [
    { action: "VERIFY", label: "Verify" },
    { action: "REJECT", label: "Reject", destructive: true },
  ],
  VERIFIED: [],
  REJECTED: [],
};

/**
 * Invoice lifecycle. The domain table is
 * DRAFT → {PENDING_APPROVAL, CANCELLED}, PENDING_APPROVAL → {ISSUED, CANCELLED},
 * ISSUED → {CANCELLED} — but there is no HTTP route for the DRAFT →
 * PENDING_APPROVAL hop. `POST /v1/invoices/{id}/issue` auto-submits a DRAFT and
 * then issues it in one transaction (usecase.go IssueInvoice), so the console
 * offers ISSUE directly from DRAFT. Offering a separate "submit" would call a
 * route that does not exist.
 *
 * There is no edit path out of ISSUED by design (ZN-ADR-012): a wrong amount is
 * corrected with a credit or debit note, never by mutating the invoice.
 */
export const INVOICE_TRANSITIONS: TransitionTable = {
  DRAFT: [
    { action: "ISSUE", label: "Issue invoice" },
    { action: "CANCEL", label: "Cancel", destructive: true },
  ],
  PENDING_APPROVAL: [
    { action: "ISSUE", label: "Issue invoice" },
    { action: "CANCEL", label: "Cancel", destructive: true },
  ],
  ISSUED: [{ action: "CANCEL", label: "Cancel & reissue", destructive: true }],
  CANCELLED: [],
};

/**
 * Bill cycle lifecycle. CLOSED → OPEN (reopen) is legal in the domain table but
 * has no HTTP route — only `POST /v1/bill-cycles/{id}/close` exists — so only
 * CLOSE is offered. INVOICED is reached by the billing run, not by an operator.
 */
export const BILL_CYCLE_TRANSITIONS: TransitionTable = {
  OPEN: [{ action: "CLOSE", label: "Close cycle" }],
  CLOSED: [],
  INVOICED: [],
};

/**
 * Payment intent lifecycle (payments/API.INTEGRATION.md §4).
 *
 * REFUNDED is not reached by a transition button: it is the result of
 * `POST /v1/payment-intents/{id}/refunds`, which is its own form because it
 * carries an amount and a reason code. Likewise SETTLED comes from recording a
 * settlement. Both are handled outside this table.
 *
 * Async rails (ACH, DIRECT_DEBIT, MOBILE_MONEY, WIRE) stay CREATED after
 * `authorise` until the provider's webhook confirms — the button is still
 * correct, the state just moves later.
 */
export const PAYMENT_TRANSITIONS: TransitionTable = {
  CREATED: [
    { action: "AUTHORISE", label: "Authorise" },
    { action: "VOID", label: "Void", destructive: true },
  ],
  AUTHORISED: [
    { action: "CAPTURE", label: "Capture" },
    { action: "VOID", label: "Void", destructive: true },
  ],
  CAPTURED: [],
  SETTLED: [],
  REFUNDED: [],
  VOIDED: [],
  FAILED: [],
};

/** Transitions legal from a status, or an empty list for a terminal/unknown one. */
export function transitionsFor(table: TransitionTable, status: string | undefined): Transition[] {
  return table[status ?? ""] ?? [];
}

/** True when a status has no onward transitions — used to explain a dead end. */
export function isTerminal(table: TransitionTable, status: string | undefined): boolean {
  return transitionsFor(table, status).length === 0;
}

// ─── Assurance, risk, collections and regulatory ──────────────────────────────
//
// Mirrored from the Go transition maps, same rule as every table above: the UI
// must only ever offer a move the backend permits.
//
//   SETTLEMENT_RUN / PARTNER_DISPUTE   services/partner-settlement
//   RECON_RUN / LEAKAGE_CASE / RULE    services/revenue-assurance
//   FRAUD_CASE                         services/fraud-risk
//   DUNNING_CASE / BILLING_DISPUTE     services/dunning-collections-disputes
//   REGULATORY_EXPORT                  services/reporting-regulatory

/**
 * Settlement run. Two edges look wrong and are not: DISPUTED returns to
 * APPROVED rather than rewinding to STATEMENT_GENERATED, and SETTLED moves to
 * ADJUSTMENT_PENDING because money that has already moved is corrected by a
 * follow-up adjustment, never by reopening the run.
 */
export const SETTLEMENT_RUN_TRANSITIONS: TransitionTable = {
  OPEN: [{ action: "CLOSE", label: "Close period" }],
  CLOSED: [
    { action: "GENERATE_STATEMENT", label: "Generate statement" },
    { action: "DISPUTE", label: "Raise dispute", destructive: true },
  ],
  STATEMENT_GENERATED: [
    { action: "APPROVE", label: "Approve" },
    { action: "DISPUTE", label: "Raise dispute", destructive: true },
  ],
  APPROVED: [
    { action: "INITIATE_PAYMENT", label: "Initiate payment" },
    { action: "DISPUTE", label: "Raise dispute", destructive: true },
  ],
  PAYMENT_INITIATED: [{ action: "SETTLE", label: "Mark settled" }],
  DISPUTED: [{ action: "APPROVE", label: "Approve after dispute" }],
  SETTLED: [{ action: "ADJUSTMENT_PENDING", label: "Flag adjustment", destructive: true }],
  ADJUSTMENT_PENDING: [],
};

/** Partner settlement dispute — raised by a partner against a run. */
export const PARTNER_DISPUTE_TRANSITIONS: TransitionTable = {
  OPEN: [
    { action: "INVESTIGATE", label: "Investigate" },
    { action: "RESOLVE", label: "Resolve" },
    { action: "REJECT", label: "Reject", destructive: true },
  ],
  UNDER_INVESTIGATION: [
    { action: "RESOLVE", label: "Resolve" },
    { action: "ESCALATE", label: "Escalate", destructive: true },
    { action: "REJECT", label: "Reject", destructive: true },
  ],
  ESCALATED: [
    { action: "RESOLVE", label: "Resolve" },
    { action: "REJECT", label: "Reject", destructive: true },
  ],
  RESOLVED: [],
  REJECTED: [],
};

/** Reconciliation run. PARTIAL is a terminal outcome, not a pause. */
export const RECON_RUN_TRANSITIONS: TransitionTable = {
  RUNNING: [
    { action: "COMPLETE", label: "Complete" },
    { action: "PARTIAL", label: "Complete (partial)" },
    { action: "FAIL", label: "Fail", destructive: true },
  ],
  COMPLETED: [],
  PARTIAL: [],
  FAILED: [],
};

/**
 * Leakage case. WRITE_OFF and FALSE_POSITIVE are both terminal but mean
 * opposite things — the leak was real and abandoned, versus there was no leak.
 * Assurance reporting counts them separately, so they stay separate actions.
 */
export const LEAKAGE_CASE_TRANSITIONS: TransitionTable = {
  OPEN: [
    { action: "INVESTIGATE", label: "Investigate" },
    { action: "RESOLVE", label: "Resolve" },
    { action: "WRITE_OFF", label: "Write off", destructive: true },
    { action: "FALSE_POSITIVE", label: "False positive", destructive: true },
  ],
  UNDER_INVESTIGATION: [
    { action: "RESOLVE", label: "Resolve" },
    { action: "WRITE_OFF", label: "Write off", destructive: true },
    { action: "FALSE_POSITIVE", label: "False positive", destructive: true },
  ],
  RESOLVED: [],
  WRITTEN_OFF: [],
  FALSE_POSITIVE: [],
};

/** Shared by assurance rules and fraud rules — both services use this table. */
export const RULE_TRANSITIONS: TransitionTable = {
  DRAFT: [{ action: "ACTIVATE", label: "Activate" }],
  ACTIVE: [
    { action: "DISABLE", label: "Disable", destructive: true },
    { action: "ARCHIVE", label: "Archive", destructive: true },
  ],
  DISABLED: [
    { action: "ACTIVATE", label: "Re-activate" },
    { action: "ARCHIVE", label: "Archive", destructive: true },
  ],
  ARCHIVED: [],
};

/** Fraud case. ESCALATED can drop back to INVESTIGATING — escalation is not one-way. */
export const FRAUD_CASE_TRANSITIONS: TransitionTable = {
  OPEN: [
    { action: "INVESTIGATE", label: "Investigate" },
    { action: "ESCALATE", label: "Escalate", destructive: true },
    { action: "FALSE_POSITIVE", label: "False positive", destructive: true },
    { action: "CLOSE", label: "Close", destructive: true },
  ],
  INVESTIGATING: [
    { action: "RESOLVE", label: "Resolve" },
    { action: "ESCALATE", label: "Escalate", destructive: true },
    { action: "FALSE_POSITIVE", label: "False positive", destructive: true },
  ],
  ESCALATED: [
    { action: "INVESTIGATE", label: "Back to investigation" },
    { action: "RESOLVE", label: "Resolve" },
    { action: "FALSE_POSITIVE", label: "False positive", destructive: true },
  ],
  RESOLVED: [{ action: "CLOSE", label: "Close" }],
  FALSE_POSITIVE: [{ action: "CLOSE", label: "Close" }],
  CLOSED: [],
};

/**
 * Dunning case — a strict escalation ladder. Each rung has exactly one forward
 * move plus RESOLVE, because payment can land at any point. Skipping a rung is
 * rejected by the backend, so none is offered.
 */
export const DUNNING_CASE_TRANSITIONS: TransitionTable = {
  PENDING: [
    { action: "GRACE_PERIOD", label: "Start grace period" },
    { action: "RESOLVE", label: "Resolve (paid)" },
  ],
  GRACE_PERIOD: [
    { action: "WARNING", label: "Send warning" },
    { action: "RESOLVE", label: "Resolve (paid)" },
  ],
  WARNING: [
    { action: "FINAL_NOTICE", label: "Final notice" },
    { action: "RESOLVE", label: "Resolve (paid)" },
  ],
  FINAL_NOTICE: [
    { action: "RESTRICT", label: "Restrict service", destructive: true },
    { action: "RESOLVE", label: "Resolve (paid)" },
  ],
  RESTRICTED: [
    { action: "SUSPEND", label: "Suspend service", destructive: true },
    { action: "RESOLVE", label: "Resolve (paid)" },
  ],
  SUSPENDED: [
    { action: "COLLECTIONS", label: "Send to collections", destructive: true },
    { action: "RESOLVE", label: "Resolve (paid)" },
  ],
  COLLECTIONS: [
    { action: "RESOLVE", label: "Resolve (paid)" },
    { action: "WRITE_OFF", label: "Write off", destructive: true },
  ],
  RESOLVED: [],
  WRITTEN_OFF: [],
};

/** Customer billing dispute (dunning service) — distinct from a partner dispute. */
export const BILLING_DISPUTE_TRANSITIONS: TransitionTable = {
  OPEN: [
    { action: "INVESTIGATE", label: "Investigate" },
    { action: "RESOLVE_IN_FAVOUR", label: "Resolve for customer" },
    { action: "RESOLVE_AGAINST", label: "Resolve against", destructive: true },
    { action: "PARTIALLY_ADJUST", label: "Partially adjust" },
    { action: "WRITE_OFF", label: "Write off", destructive: true },
  ],
  INVESTIGATING: [
    { action: "RESOLVE_IN_FAVOUR", label: "Resolve for customer" },
    { action: "RESOLVE_AGAINST", label: "Resolve against", destructive: true },
    { action: "PARTIALLY_ADJUST", label: "Partially adjust" },
    { action: "WRITE_OFF", label: "Write off", destructive: true },
  ],
  RESOLVED_IN_FAVOUR: [{ action: "CLOSE", label: "Close" }],
  RESOLVED_AGAINST: [{ action: "CLOSE", label: "Close" }],
  PARTIALLY_ADJUSTED: [{ action: "CLOSE", label: "Close" }],
  WRITTEN_OFF: [{ action: "CLOSE", label: "Close" }],
  CLOSED: [],
};

/**
 * Regulatory export. GENERATING is entered on create; the service marks it
 * READY once the artefact is signed. ACKNOWLEDGED is the regulator's receipt.
 */
export const EXPORT_TRANSITIONS: TransitionTable = {
  GENERATING: [
    { action: "READY", label: "Mark ready" },
    { action: "FAIL", label: "Fail", destructive: true },
  ],
  READY: [{ action: "SUBMIT", label: "Submit to regulator" }],
  SUBMITTED: [{ action: "ACKNOWLEDGE", label: "Record acknowledgement" }],
  ACKNOWLEDGED: [],
  FAILED: [],
};
