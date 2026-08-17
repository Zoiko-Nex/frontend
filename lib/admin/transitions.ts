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
