/**
 * ZN-IAM-RBAC-001 • Operational Roles, Permissions & User Access Matrix
 * Authoritative RBAC catalogue, Master Permission Matrix, and Data Models.
 */

export type UserType = "PLATFORM_USER" | "TENANT_USER" | "API_USER";

export type RoleType =
  | "PLATFORM_SYSTEM"
  | "TENANT_SYSTEM"
  | "TENANT_CUSTOM"
  | "API_SCOPE_PROFILE";

export type ScopeType = "PLATFORM" | "TENANT";

export type PermissionClass =
  | "PLATFORM_ONLY"
  | "TENANT_ADMIN_ONLY"
  | "TENANT_DELEGABLE_CONTROLLED"
  | "TENANT_DELEGABLE"
  | "API_ELIGIBLE";

export interface AccessRole {
  access_role_id: string;
  code: string;
  name: string;
  role_type: RoleType;
  scope_type: ScopeType;
  tenant_id?: string | null;
  description: string;
  permissions: string[];
  assigned_users_count: number;
  is_system_role: boolean;
  is_editable: boolean;
  status: "ACTIVE" | "INACTIVE" | "RETIRED";
  created_at: string;
  updated_at: string;
}

export interface PermissionDefinition {
  permission_id: string;
  domain: string;
  task: string;
  description: string;
  scope: ScopeType;
  permission_class: PermissionClass;
  default_governance: string;
}

export interface MasterMatrixRow {
  domain: string;
  task: string;
  permission_id: string;
  scope: ScopeType;
  permission_class: PermissionClass;
  sa: string; // ALL
  pa: string; // M, V, A, —
  ta: string; // M, V, A, —
  csm: string; // M, V, L, A, —
  csa: string; // M, V, L, —
  bf: string; // M, V, A, —
  so: string; // M, V, L, A, —
  to: string; // M, V, A, —
  cr: string; // M, V, A, L, —
  ro: string; // V, —
  api: string; // S, —
}

export interface ApiScopeProfile {
  profile_id: string;
  name: string;
  description: string;
  scope_type: ScopeType;
  scopes: string[];
  assigned_accounts_count: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiUserAccount {
  api_user_id: string;
  name: string;
  client_id: string;
  tenant_id?: string;
  owner_email: string;
  scope_profile_id: string;
  scope_profile_name: string;
  scopes: string[];
  ip_whitelist?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  created_at: string;
  expires_at: string;
  last_used_at?: string;
}

export interface UserAccountItem {
  user_id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  tenant_id?: string;
  tenant_name?: string;
  roles: string[];
  effective_permissions?: string[];
  mfa_enabled: boolean;
  status: "ACTIVE" | "SUSPENDED" | "INVITED";
  created_at: string;
  last_login_at?: string;
}

// ─── MASTER PERMISSION MATRIX (Section 13) ────────────────────────────────────

export const MASTER_PERMISSION_MATRIX: MasterMatrixRow[] = [
  // Tenant Lifecycle
  { domain: "Tenant Lifecycle", task: "View all tenants", permission_id: "tenant.view_all", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "M", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "Tenant Lifecycle", task: "Create tenant", permission_id: "tenant.create", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "M", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "Tenant Lifecycle", task: "Edit tenant platform configuration", permission_id: "tenant.config.edit", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "M", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "Tenant Lifecycle", task: "Suspend tenant", permission_id: "tenant.suspend", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "M", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "Tenant Lifecycle", task: "Reactivate tenant", permission_id: "tenant.reactivate", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "M", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "Tenant Lifecycle", task: "Terminate tenant", permission_id: "tenant.terminate", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "—", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "Tenant Lifecycle", task: "Manage tenant plan/entitlements", permission_id: "tenant.entitlements.manage", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "M", ta: "V", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "V", api: "—" },

  // Tenant Settings
  { domain: "Tenant Settings", task: "Manage own tenant profile/settings", permission_id: "tenant.settings.manage", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "V", api: "S" },

  // IAM
  { domain: "IAM", task: "View tenant users", permission_id: "iam.tenant_user.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "V", api: "S" },
  { domain: "IAM", task: "Create/invite tenant user", permission_id: "iam.tenant_user.create", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "IAM", task: "Edit/deactivate/reactivate tenant user", permission_id: "iam.tenant_user.manage", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "IAM", task: "Reset tenant user MFA/session", permission_id: "iam.tenant_user.reset_mfa", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "IAM", task: "View tenant roles/permissions", permission_id: "iam.tenant_role.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "V", so: "V", to: "V", cr: "V", ro: "V", api: "S" },
  { domain: "IAM", task: "Create/edit custom tenant role", permission_id: "iam.custom_role.create", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "IAM", task: "Assign tenant roles to users", permission_id: "iam.tenant_role.assign", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "IAM", task: "Create/assign Platform Admin", permission_id: "iam.platform_admin.manage", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "—", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },
  { domain: "IAM", task: "Create/assign Super Admin", permission_id: "iam.super_admin.manage", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "—", ta: "—", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "—", ro: "—", api: "—" },

  // API Users
  { domain: "API Users", task: "View API users", permission_id: "api_user.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "V", so: "—", to: "V", cr: "—", ro: "V", api: "S" },
  { domain: "API Users", task: "Create API user", permission_id: "api_user.create", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "M", cr: "—", ro: "—", api: "—" },
  { domain: "API Users", task: "Assign API scopes", permission_id: "api_user.scope.assign", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "M", cr: "—", ro: "—", api: "—" },
  { domain: "API Users", task: "Rotate/revoke API credential", permission_id: "api_user.credential.rotate", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "M", cr: "—", ro: "—", api: "—" },

  // Customer
  { domain: "Customer", task: "View customer/account/subscriber", permission_id: "customer.account.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "M", bf: "V", so: "M", to: "V", cr: "V", ro: "V", api: "S" },
  { domain: "Customer", task: "Create customer/account/subscriber", permission_id: "customer.account.create", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "M", bf: "—", so: "M", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Customer", task: "Edit customer/account/subscriber", permission_id: "customer.account.update", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "L", bf: "—", so: "M", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Customer", task: "Suspend/reactivate customer/account", permission_id: "customer.account.suspend", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "L", bf: "—", so: "L", to: "—", cr: "A", ro: "—", api: "S" },
  { domain: "Customer", task: "Close customer/account", permission_id: "customer.account.close", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "M", csm: "A", csa: "—", bf: "—", so: "A", to: "—", cr: "A", ro: "—", api: "S" },
  { domain: "Customer", task: "Export sensitive customer data", permission_id: "customer.data.export", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "A", csa: "—", bf: "V", so: "—", to: "—", cr: "A", ro: "V", api: "S" },

  // KYC
  { domain: "KYC", task: "View KYC cases/evidence", permission_id: "kyc.case.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "L", bf: "—", so: "—", to: "—", cr: "M", ro: "V", api: "S" },
  { domain: "KYC", task: "Create/update KYC case", permission_id: "kyc.case.manage", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "L", csa: "—", bf: "—", so: "—", to: "—", cr: "M", ro: "—", api: "S" },
  { domain: "KYC", task: "Approve/reject KYC", permission_id: "kyc.decision.approve", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "A", ro: "—", api: "S" },

  // Compliance
  { domain: "Compliance", task: "Manage privacy/regulatory cases", permission_id: "compliance.case.manage", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "M", ro: "V", api: "S" },

  // Catalogue
  { domain: "Catalogue", task: "View products/offers/prices", permission_id: "catalogue.product.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "V", so: "M", to: "V", cr: "V", ro: "V", api: "S" },
  { domain: "Catalogue", task: "Create/edit draft product/offer", permission_id: "catalogue.product.draft", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "M", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Catalogue", task: "Create/edit pricing/discount", permission_id: "catalogue.pricing.edit", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "—", csa: "—", bf: "—", so: "M", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Catalogue", task: "Approve/activate pricing", permission_id: "catalogue.pricing.activate", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "—", so: "A", to: "—", cr: "—", ro: "—", api: "S" },

  // Orders
  { domain: "Orders", task: "View orders", permission_id: "orders.order.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "M", bf: "V", so: "M", to: "M", cr: "V", ro: "V", api: "S" },
  { domain: "Orders", task: "Create/update orders", permission_id: "orders.order.create", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "M", bf: "—", so: "M", to: "M", cr: "—", ro: "—", api: "S" },
  { domain: "Orders", task: "Cancel order", permission_id: "orders.order.cancel", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "L", bf: "—", so: "M", to: "M", cr: "—", ro: "—", api: "S" },
  { domain: "Orders", task: "Approve controlled order", permission_id: "orders.order.approve", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "A", csa: "—", bf: "—", so: "A", to: "A", cr: "—", ro: "—", api: "S" },

  // Services
  { domain: "Services", task: "View service/SIM/eSIM", permission_id: "services.sim.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "M", bf: "V", so: "V", to: "M", cr: "V", ro: "V", api: "S" },
  { domain: "Services", task: "Activate service/SIM/eSIM", permission_id: "services.sim.activate", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "M", csm: "L", csa: "L", bf: "—", so: "L", to: "M", cr: "—", ro: "—", api: "S" },
  { domain: "Services", task: "Suspend/resume service/SIM/eSIM", permission_id: "service.suspend", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "L", bf: "—", so: "L", to: "M", cr: "L", ro: "—", api: "S" },
  { domain: "Services", task: "Terminate service", permission_id: "services.sim.terminate", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "M", csm: "A", csa: "—", bf: "—", so: "A", to: "A", cr: "—", ro: "—", api: "S" },
  { domain: "Services", task: "Replace SIM/eSIM", permission_id: "services.sim.swap", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "M", csa: "L", bf: "—", so: "—", to: "M", cr: "—", ro: "—", api: "S" },

  // Usage
  { domain: "Usage", task: "View usage", permission_id: "usage.record.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "V", so: "V", to: "M", cr: "V", ro: "V", api: "S" },
  { domain: "Usage", task: "Export usage", permission_id: "usage.record.export", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "—", bf: "M", so: "V", to: "M", cr: "V", ro: "V", api: "S" },
  { domain: "Usage", task: "Reprocess/replay usage", permission_id: "usage.record.replay", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "—", csa: "—", bf: "—", so: "—", to: "M", cr: "—", ro: "—", api: "S" },

  // Rating
  { domain: "Rating", task: "View rating results/rules", permission_id: "rating.rule.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "M", so: "V", to: "M", cr: "V", ro: "V", api: "S" },
  { domain: "Rating", task: "Configure rating rules", permission_id: "rating.rule.configure", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "—", csa: "—", bf: "M", so: "A", to: "M", cr: "—", ro: "—", api: "S" },
  { domain: "Rating", task: "Approve/publish rating rules", permission_id: "rating.rule.publish", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "A", to: "A", cr: "—", ro: "—", api: "S" },

  // Billing
  { domain: "Billing", task: "View invoices/billing runs", permission_id: "billing.invoice.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "M", so: "V", to: "V", cr: "V", ro: "V", api: "S" },
  { domain: "Billing", task: "Generate draft invoice", permission_id: "billing.invoice.draft", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "M", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Billing", task: "Issue invoice", permission_id: "billing.invoice.issue", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Billing", task: "Create adjustment/credit note", permission_id: "billing.credit_note.create", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "L", csa: "—", bf: "M", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Billing", task: "Approve adjustment/credit note", permission_id: "billing.credit_note.approve", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Billing", task: "Void invoice", permission_id: "billing.invoice.void", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "—", ro: "—", api: "S" },

  // Payments
  { domain: "Payments", task: "View payments", permission_id: "payments.payment.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "M", so: "V", to: "—", cr: "V", ro: "V", api: "S" },
  { domain: "Payments", task: "Record/reconcile payment", permission_id: "payments.payment.reconcile", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "—", csa: "—", bf: "M", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Payments", task: "Request refund", permission_id: "payments.refund.request", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "L", csa: "—", bf: "M", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Payments", task: "Approve/execute refund", permission_id: "payments.refund.approve", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "—", ro: "—", api: "S" },

  // Collections
  { domain: "Collections", task: "View/manage collections", permission_id: "collections.case.manage", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "L", bf: "M", so: "—", to: "—", cr: "V", ro: "V", api: "S" },
  { domain: "Collections", task: "Approve write-off", permission_id: "collections.write_off.approve", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "—", ro: "—", api: "S" },

  // Finance
  { domain: "Finance", task: "View ledger/reconciliation", permission_id: "finance.ledger.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "V", csm: "—", csa: "—", bf: "M", so: "—", to: "—", cr: "V", ro: "V", api: "S" },
  { domain: "Finance", task: "Prepare journal", permission_id: "finance.journal.prepare", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "—", csa: "—", bf: "M", so: "—", to: "—", cr: "—", ro: "—", api: "S" },
  { domain: "Finance", task: "Post/reverse journal", permission_id: "finance.journal.post", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "—", ro: "—", api: "S" },

  // Tax
  { domain: "Tax", task: "View tax/jurisdiction configuration", permission_id: "tax.jurisdiction.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "—", bf: "M", so: "V", to: "—", cr: "M", ro: "V", api: "S" },
  { domain: "Tax", task: "Configure/approve tax rules", permission_id: "tax.rule.configure", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "A", ro: "—", api: "S" },

  // Fraud & Risk
  { domain: "Fraud & Risk", task: "View fraud alerts/cases", permission_id: "fraud.case.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "L", bf: "V", so: "—", to: "—", cr: "M", ro: "V", api: "S" },
  { domain: "Fraud & Risk", task: "Manage fraud case", permission_id: "fraud.case.manage", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "M", ro: "—", api: "S" },
  { domain: "Fraud & Risk", task: "Approve fraud override/restriction", permission_id: "fraud.override.approve", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "A", ro: "—", api: "S" },

  // Partners
  { domain: "Partners", task: "View partners/settlements", permission_id: "partners.partner.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "—", bf: "M", so: "V", to: "V", cr: "V", ro: "V", api: "S" },
  { domain: "Partners", task: "Configure partner", permission_id: "partners.partner.configure", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "M", ta: "A", csm: "—", csa: "—", bf: "—", so: "A", to: "M", cr: "—", ro: "—", api: "S" },
  { domain: "Partners", task: "Prepare/approve settlement", permission_id: "partners.settlement.approve", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "A", so: "—", to: "—", cr: "—", ro: "—", api: "S" },

  // Integrations
  { domain: "Integrations", task: "View integrations/connectors", permission_id: "integrations.connector.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "—", bf: "V", so: "V", to: "M", cr: "V", ro: "V", api: "S" },
  { domain: "Integrations", task: "Create/update/activate connector", permission_id: "integrations.connector.manage", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "M", cr: "—", ro: "—", api: "S" },
  { domain: "Integrations", task: "Rotate integration secret", permission_id: "integrations.secret.rotate", scope: "TENANT", permission_class: "TENANT_ADMIN_ONLY", sa: "ALL", pa: "M", ta: "M", csm: "—", csa: "—", bf: "—", so: "—", to: "M", cr: "—", ro: "—", api: "S" },
  { domain: "Integrations", task: "Reveal protected secret", permission_id: "integrations.secret.reveal", scope: "PLATFORM", permission_class: "PLATFORM_ONLY", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "—", so: "—", to: "A", cr: "—", ro: "—", api: "—" },

  // Reporting
  { domain: "Reporting", task: "View dashboards/reports", permission_id: "reporting.report.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "M", so: "M", to: "M", cr: "M", ro: "V", api: "S" },
  { domain: "Reporting", task: "Export reports", permission_id: "reporting.report.export", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "L", bf: "M", so: "M", to: "M", cr: "M", ro: "V", api: "S" },

  // AI & Decisions
  { domain: "AI & Decisions", task: "View AI decisions/explanations", permission_id: "ai.decision.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "V", bf: "V", so: "V", to: "V", cr: "M", ro: "V", api: "S" },
  { domain: "AI & Decisions", task: "Override governed AI decision", permission_id: "ai.decision.override", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "—", so: "—", to: "—", cr: "A", ro: "—", api: "S" },

  // Audit & Evidence
  { domain: "Audit & Evidence", task: "View audit/evidence", permission_id: "evidence.audit.view", scope: "TENANT", permission_class: "TENANT_DELEGABLE", sa: "ALL", pa: "M", ta: "M", csm: "V", csa: "—", bf: "V", so: "—", to: "V", cr: "M", ro: "V", api: "S" },
  { domain: "Audit & Evidence", task: "Export evidence", permission_id: "evidence.audit.export", scope: "TENANT", permission_class: "TENANT_DELEGABLE_CONTROLLED", sa: "ALL", pa: "A", ta: "A", csm: "—", csa: "—", bf: "V", so: "—", to: "—", cr: "A", ro: "V", api: "S" },
];

// ─── INITIAL SYSTEM ROLES CATALOGUE (Section 24) ──────────────────────────────

export const INITIAL_SYSTEM_ROLES: AccessRole[] = [
  // Platform System Roles
  {
    access_role_id: "role_sa_001",
    code: "SA",
    name: "ZoikoNex Super Admin",
    role_type: "PLATFORM_SYSTEM",
    scope_type: "PLATFORM",
    description: "Ultimate platform authority. ALL supported permissions across the entire platform and every tenant.",
    permissions: MASTER_PERMISSION_MATRIX.map((m) => m.permission_id),
    assigned_users_count: 2,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_pa_002",
    code: "PA",
    name: "ZoikoNex Platform Admin",
    role_type: "PLATFORM_SYSTEM",
    scope_type: "PLATFORM",
    description: "Broad platform operations, tenant provisioning, support. Excludes tenant termination and Super Admin creation.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.pa !== "—").map((m) => m.permission_id),
    assigned_users_count: 5,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_sec_003",
    code: "SEC_IAM",
    name: "ZoikoNex Security & IAM Admin",
    role_type: "PLATFORM_SYSTEM",
    scope_type: "PLATFORM",
    description: "Platform security oversight, credential encryption, IAM policy, and key rotations.",
    permissions: ["iam.platform_admin.manage", "evidence.audit.view", "evidence.audit.export", "integrations.secret.rotate", "fraud.case.view"],
    assigned_users_count: 3,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_aud_004",
    code: "PLAT_AUDITOR",
    name: "ZoikoNex Auditor",
    role_type: "PLATFORM_SYSTEM",
    scope_type: "PLATFORM",
    description: "Read-only access to platform evidence ledger, tamper-evident logs, and compliance records.",
    permissions: ["evidence.audit.view", "evidence.audit.export", "tenant.view_all", "reporting.report.view"],
    assigned_users_count: 2,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },

  // Tenant System Roles
  {
    access_role_id: "role_ta_010",
    code: "TA",
    name: "Tenant Admin",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "Full tenant administration inside tenant boundary: users, roles, brand settings, integrations.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.ta !== "—").map((m) => m.permission_id),
    assigned_users_count: 4,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_csm_011",
    code: "CSM",
    name: "Customer Service Manager",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "Customer/subscriber care oversight, case dispatch, service adjustments, agent management.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.csm !== "—").map((m) => m.permission_id),
    assigned_users_count: 8,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_csa_012",
    code: "CSA",
    name: "Customer Service Agent",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "Day-to-day customer care, search subscribers, log cases, view invoices and SIM status.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.csa !== "—").map((m) => m.permission_id),
    assigned_users_count: 24,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_bf_013",
    code: "BF",
    name: "Billing & Finance Manager",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "Bill runs, invoices, payments, credit notes, collections, financial reports, tax review.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.bf !== "—").map((m) => m.permission_id),
    assigned_users_count: 6,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_so_014",
    code: "SO",
    name: "Sales & Order Manager",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "Catalogue visibility, customer acquisition, quotations, order approvals and commercial ops.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.so !== "—").map((m) => m.permission_id),
    assigned_users_count: 7,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_to_015",
    code: "TO",
    name: "Technical & Provisioning Operations",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "Order fulfillment, SIM/eSIM provisioning, service activation, rating configuration, connectors.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.to !== "—").map((m) => m.permission_id),
    assigned_users_count: 9,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_cr_016",
    code: "CR",
    name: "Compliance & Risk Manager",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "KYC validation, fraud cases, regulatory audit, sensitive customer data review.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.cr !== "—").map((m) => m.permission_id),
    assigned_users_count: 3,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    access_role_id: "role_ro_017",
    code: "RO",
    name: "Read Only / Auditor",
    role_type: "TENANT_SYSTEM",
    scope_type: "TENANT",
    description: "Read-only access across selected tenant business modules. No modification or export authority.",
    permissions: MASTER_PERMISSION_MATRIX.filter((m) => m.ro === "V").map((m) => m.permission_id),
    assigned_users_count: 4,
    is_system_role: true,
    is_editable: false,
    status: "ACTIVE",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },

  // Custom Tenant Roles (Sample templates)
  {
    access_role_id: "role_cust_021",
    code: "RETAIL_SUPP_2",
    name: "Retail Support Tier 2",
    role_type: "TENANT_CUSTOM",
    scope_type: "TENANT",
    description: "Front-desk retail store agents with subscriber lookups, SIM swaps, and limited credit adjustments.",
    permissions: [
      "customer.account.view",
      "customer.account.update",
      "services.sim.view",
      "services.sim.swap",
      "orders.order.view",
      "orders.order.create",
      "billing.invoice.view",
      "billing.credit_note.create",
    ],
    assigned_users_count: 12,
    is_system_role: false,
    is_editable: true,
    status: "ACTIVE",
    created_at: "2026-08-20T00:00:00Z",
    updated_at: "2026-08-20T00:00:00Z",
  },
  {
    access_role_id: "role_cust_022",
    code: "ESIM_OPS",
    name: "eSIM Operations Specialist",
    role_type: "TENANT_CUSTOM",
    scope_type: "TENANT",
    description: "Dedicated eSIM QR regeneration, RSP profile download query, and SM-DP+ provisioning.",
    permissions: [
      "services.sim.view",
      "services.sim.activate",
      "services.sim.swap",
      "services.sim.suspend",
      "usage.record.view",
      "integrations.connector.view",
    ],
    assigned_users_count: 5,
    is_system_role: false,
    is_editable: true,
    status: "ACTIVE",
    created_at: "2026-08-22T00:00:00Z",
    updated_at: "2026-08-22T00:00:00Z",
  },
];

// ─── API SCOPE PROFILES (Section 11) ──────────────────────────────────────────

export const INITIAL_API_SCOPE_PROFILES: ApiScopeProfile[] = [
  {
    profile_id: "prof_orders_01",
    name: "Orders & Fulfillment Connector",
    description: "Allows non-human e-commerce and POS integrations to query catalogues, place orders and check status.",
    scope_type: "TENANT",
    scopes: ["catalogue.read", "orders.read", "orders.create", "orders.cancel", "customer.read"],
    assigned_accounts_count: 3,
    status: "ACTIVE",
  },
  {
    profile_id: "prof_usage_02",
    name: "Usage Ingestion & CDR Stream",
    description: "Southbound MVNE/HLR stream collector for raw CDRs, rated session queries and balance checks.",
    scope_type: "TENANT",
    scopes: ["usage.ingest", "usage.read", "rating.evaluate", "services.read"],
    assigned_accounts_count: 2,
    status: "ACTIVE",
  },
  {
    profile_id: "prof_prov_03",
    name: "Southbound Provisioning Gateway",
    description: "Carrier platform connector for SIM activations, suspensions, ICCID reservations and HLR updates.",
    scope_type: "TENANT",
    scopes: ["services.provision", "services.sim.activate", "services.sim.suspend", "services.sim.swap"],
    assigned_accounts_count: 2,
    status: "ACTIVE",
  },
  {
    profile_id: "prof_finance_04",
    name: "ERP & Financial Reconciliation",
    description: "Read-only access for external General Ledger / Netsuite sync of issued invoices and reconciled payments.",
    scope_type: "TENANT",
    scopes: ["billing.invoice.read", "payments.read", "finance.ledger.read"],
    assigned_accounts_count: 1,
    status: "ACTIVE",
  },
];

export const INITIAL_API_USERS: ApiUserAccount[] = [
  {
    api_user_id: "api_usr_001",
    name: "Shopify E-Commerce Storefront Connector",
    client_id: "cl_shpfy_9a8201",
    owner_email: "ecom_ops@zoikomobile.com",
    scope_profile_id: "prof_orders_01",
    scope_profile_name: "Orders & Fulfillment Connector",
    scopes: ["catalogue.read", "orders.read", "orders.create"],
    ip_whitelist: "198.51.100.0/24, 203.0.113.50",
    status: "ACTIVE",
    created_at: "2026-08-15T00:00:00Z",
    expires_at: "2027-08-15T00:00:00Z",
    last_used_at: "2026-09-11T09:14:22Z",
  },
  {
    api_user_id: "api_usr_002",
    name: "Nexus MVNOC Telecom CDR Ingester",
    client_id: "cl_nexus_cdr_71092",
    owner_email: "cdr_pipeline@zoikonex.com",
    scope_profile_id: "prof_usage_02",
    scope_profile_name: "Usage Ingestion & CDR Stream",
    scopes: ["usage.ingest", "usage.read", "rating.evaluate"],
    ip_whitelist: "136.114.16.250/32",
    status: "ACTIVE",
    created_at: "2026-08-18T00:00:00Z",
    expires_at: "2027-08-18T00:00:00Z",
    last_used_at: "2026-09-11T10:02:11Z",
  },
  {
    api_user_id: "api_usr_003",
    name: "Netsuite ERP GL Sync Daemon",
    client_id: "cl_netsuite_55102",
    owner_email: "finance_it@zoikomobile.com",
    scope_profile_id: "prof_finance_04",
    scope_profile_name: "ERP & Financial Reconciliation",
    scopes: ["billing.invoice.read", "payments.read", "finance.ledger.read"],
    ip_whitelist: "52.14.90.11/32",
    status: "ACTIVE",
    created_at: "2026-08-25T00:00:00Z",
    expires_at: "2027-08-25T00:00:00Z",
    last_used_at: "2026-09-10T23:59:00Z",
  },
];

// Helper: Check if a permission is tenant delegable according to the ceiling rule
export function isPermissionTenantDelegable(permissionId: string): boolean {
  const row = MASTER_PERMISSION_MATRIX.find((m) => m.permission_id === permissionId);
  if (!row) return false;
  return row.permission_class !== "PLATFORM_ONLY";
}
