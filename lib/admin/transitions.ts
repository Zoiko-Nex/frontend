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

/** Transitions legal from a status, or an empty list for a terminal/unknown one. */
export function transitionsFor(table: TransitionTable, status: string | undefined): Transition[] {
  return table[status ?? ""] ?? [];
}

/** True when a status has no onward transitions — used to explain a dead end. */
export function isTerminal(table: TransitionTable, status: string | undefined): boolean {
  return transitionsFor(table, status).length === 0;
}
