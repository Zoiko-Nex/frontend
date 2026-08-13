'use server';

import { render } from '@react-email/render';
import React from 'react';
import { CanonicalEmailPayload, BrandRendering, SenderRendering, SupportRendering } from '../../emails/types/CanonicalEmail';

// ── COM: Commercial Lifecycle ─────────────────────────────────────────────────
import DemoRequestReceivedEmail from '../../emails/templates/COM/DemoRequestReceived';
import DemoBookedEmail from '../../emails/templates/COM/DemoBooked';
import OnboardingWelcomeEmail from '../../emails/templates/COM/OnboardingWelcome';
import PlanUpgradeEmail from '../../emails/templates/COM/PlanUpgrade';
import RenewalReminderEmail from '../../emails/templates/COM/RenewalReminder';
import ChurnPreventionEmail from '../../emails/templates/COM/ChurnPrevention';
import PromotionalOfferEmail from '../../emails/templates/COM/PromotionalOffer';

// ── IAM: Identity & Authentication ───────────────────────────────────────────
import UserInvitationEmail from '../../emails/templates/IAM/UserInvitation';
import PasswordResetEmail from '../../emails/templates/IAM/PasswordReset';
import SuspiciousLoginEmail from '../../emails/templates/IAM/SuspiciousLogin';
import MfaChallengeEmail from '../../emails/templates/IAM/MfaChallenge';
import AccountRecoveryEmail from '../../emails/templates/IAM/AccountRecovery';

// ── TNT: Tenant Onboarding ────────────────────────────────────────────────────
import TenantWelcomeEmail from '../../emails/templates/TNT/TenantWelcome';
import TenantSetupConfirmedEmail from '../../emails/templates/TNT/TenantSetupConfirmed';
import AdminAssignedEmail from '../../emails/templates/TNT/AdminAssigned';

// ── CRM: Subscriber / CRM ────────────────────────────────────────────────────
import SubscriberWelcomeEmail from '../../emails/templates/CRM/SubscriberWelcome';
import TicketResolvedEmail from '../../emails/templates/CRM/TicketResolved';
import FeedbackRequestEmail from '../../emails/templates/CRM/FeedbackRequest';
import EscalationNoticeEmail from '../../emails/templates/CRM/EscalationNotice';

// ── BIL: Billing ──────────────────────────────────────────────────────────────
import InvoiceIssuedEmail from '../../emails/templates/BIL/InvoiceIssued';
import InvoiceReminderEmail from '../../emails/templates/BIL/InvoiceReminder';
import InvoicePaidEmail from '../../emails/templates/BIL/InvoicePaid';
import InvoiceOverdueEmail from '../../emails/templates/BIL/InvoiceOverdue';

// ── PAY: Payments ─────────────────────────────────────────────────────────────
import PaymentReceivedEmail from '../../emails/templates/PAY/PaymentReceived';
import PaymentFailedEmail from '../../emails/templates/PAY/PaymentFailed';
import RefundProcessedEmail from '../../emails/templates/PAY/RefundProcessed';
import AutoDebitNoticeEmail from '../../emails/templates/PAY/AutoDebitNotice';

// ── CMP: Compliance & Regulatory ─────────────────────────────────────────────
import TermsUpdatedEmail from '../../emails/templates/CMP/TermsUpdated';
import PrivacyNoticeEmail from '../../emails/templates/CMP/PrivacyNotice';
import ConsentChangedEmail from '../../emails/templates/CMP/ConsentChanged';
import AuditAlertEmail from '../../emails/templates/CMP/AuditAlert';

// ── PAR: Partner Communications ───────────────────────────────────────────────
import PartnerInvitationEmail from '../../emails/templates/PAR/PartnerInvitation';
import PartnerOnboardingEmail from '../../emails/templates/PAR/PartnerOnboarding';
import IntegrationUpdateEmail from '../../emails/templates/PAR/IntegrationUpdate';
import SlaBreachEmail from '../../emails/templates/PAR/SlaBreach';

// ── CAT: Catalog & Product ────────────────────────────────────────────────────
import NewProductLaunchEmail from '../../emails/templates/CAT/NewProductLaunch';
import CatalogUpdateEmail from '../../emails/templates/CAT/CatalogUpdate';
import ServiceAvailabilityEmail from '../../emails/templates/CAT/ServiceAvailability';

// ── API: API & Developer ──────────────────────────────────────────────────────
import ApiSecretGeneratedEmail from '../../emails/templates/API/ApiSecretGenerated';
import ApiUsageAlertEmail from '../../emails/templates/API/ApiUsageAlert';
import ApiQuotaExceededEmail from '../../emails/templates/API/ApiQuotaExceeded';
import ApiDeprecationNoticeEmail from '../../emails/templates/API/ApiDeprecationNotice';

// ── RISK: Risk & Security ─────────────────────────────────────────────────────
import FraudAlertOpenedEmail from '../../emails/templates/RISK/FraudAlertOpened';
import AccountSuspensionEmail from '../../emails/templates/RISK/AccountSuspension';
import ServiceRestrictionEmail from '../../emails/templates/RISK/ServiceRestriction';
import BreachNotificationEmail from '../../emails/templates/RISK/BreachNotification';

// ── SUP: Support ──────────────────────────────────────────────────────────────
import SupportCaseCreatedEmail from '../../emails/templates/SUP/SupportCaseCreated';
import TicketOpenedEmail from '../../emails/templates/SUP/TicketOpened';
import IncidentDetectedEmail from '../../emails/templates/SUP/IncidentDetected';

// ── SUB: Subscription ─────────────────────────────────────────────────────────
import SubscriptionActivatedEmail from '../../emails/templates/SUB/SubscriptionActivated';
import SubscriptionCancelledEmail from '../../emails/templates/SUB/SubscriptionCancelled';
import SubscriptionRenewedEmail from '../../emails/templates/SUB/SubscriptionRenewed';

// ── OPS: Operations ───────────────────────────────────────────────────────────
import ScheduledReportReadyEmail from '../../emails/templates/OPS/ScheduledReportReady';

// ── ORD: Orders ───────────────────────────────────────────────────────────────
import OrderReceivedEmail from '../../emails/templates/ORD/OrderReceived';
import EsimReadyEmail from '../../emails/templates/ORD/EsimReady';

// ── USG: Usage ────────────────────────────────────────────────────────────────
import UsageThresholdNoticeEmail from '../../emails/templates/USG/UsageThresholdNotice';

// ── NEXA: Nexa AI ─────────────────────────────────────────────────────────────
import NexaActionApprovalRequiredEmail from '../../emails/templates/NEXA/NexaActionApprovalRequired';
import NexaSummaryEmail from '../../emails/templates/NEXA/NexaSummary';
import NexaRecommendationEmail from '../../emails/templates/NEXA/NexaRecommendation';
import NexaAdvisoryEmail from '../../emails/templates/NEXA/NexaAdvisory';

export async function renderPreviewEmail(
  templateId: string,
  brand: BrandRendering,
  sender: SenderRendering,
  support: SupportRendering
) {
  const payload: CanonicalEmailPayload = {
    identity: {
      tenant_id: 'ten_mock123',
      operator_id: 'op_mock456',
      brand_id: 'brnd_custom',
      environment_name: 'production',
      recipient_role: 'Platform user',
      recipient_locale: 'en-US',
      recipient_time_zone: 'UTC',
    },
    traceability: {
      event_type: `${templateId}.EVENT`,
      event_version: '1.0',
      event_id: 'evt_mock_999',
      correlation_id: 'corr_mock_888',
      message_reference: `MSG-${templateId}-REF`,
      template_id: templateId,
      template_version: '1.0',
    },
    rendering: {
      brand,
      sender,
      support,
    },
    governance: {
      message_classification: 'Transactional',
      message_legal_basis: 'Legitimate interest',
      message_preference_category: 'Mandatory',
      message_sensitivity: 'Normal',
    },
    localizedValues: {
      currency_code: 'USD',
      date_local: new Date().toLocaleDateString('en-US', { dateStyle: 'full' }),
      date_utc: new Date().toISOString(),
      jurisdiction_code: 'GLOBAL',
      language_code: 'en',
    },
    eventData: {
      // shared fields used across many templates
      recipient_first_name: 'Alex',
      tenant_display_name: brand.display_name,
      user_masked_email: 'a***@example.com',
      admin_masked_email: 'a***@example.com',
      assigned_by_masked_display: 'System Administrator',
      // COM
      prospect_organization_name: 'Apex Telecom Ltd',
      prospect_contact_name: 'Alex Rivera',
      plan_name_display: 'ZoikoNex Enterprise',
      previous_plan_display: 'ZoikoNex Standard',
      new_plan_display: 'ZoikoNex Enterprise',
      effective_date_display: 'August 1, 2026',
      renewal_date_display: 'September 1, 2026',
      renewal_amount_formatted: '$1,250.00',
      cancellation_date_display: 'August 31, 2026',
      offer_title_display: 'Enterprise Upgrade — 20% off first 3 months',
      offer_discount_display: '20% discount',
      offer_expiry_display: 'August 31, 2026',
      promo_code: 'ENTERPRISE20',
      // IAM
      reset_expiry_minutes: 30,
      login_location_display: 'Lagos, Nigeria',
      login_device_display: 'Chrome on Windows',
      otp_code: '847 291',
      otp_expiry_minutes: 10,
      recovery_expiry_minutes: 60,
      // TNT
      tenant_subdomain_display: 'apex-telecom.zoikonex.com',
      services_activated_display: 'eSIM, Voice, Data, Billing',
      user_count_display: '12 users',
      admin_role_display: 'Tenant Administrator',
      // CRM
      ticket_reference: 'CASE-2026-4421',
      ticket_subject_display: 'eSIM provisioning failed on device',
      resolution_summary_display: 'Profile re-provisioned successfully',
      agent_name_display: 'Support Team',
      survey_expiry_display: '7 days',
      escalation_level_display: 'L2 Specialist',
      assigned_team_display: 'Network Operations Specialists',
      ticket_priority_display: 'High',
      // BIL
      invoice_reference: 'INV-2026-0812',
      invoice_amount_formatted: '$1,250.00',
      payment_method_display: 'Visa ending 4921',
      invoice_due_date_display: 'August 31, 2026',
      overdue_days: 5,
      // PAY
      payment_reference: 'PAY-2026-7712',
      payment_amount_formatted: '$1,250.00',
      payment_status_display: 'COMPLETED',
      refund_reference: 'REF-2026-0091',
      refund_amount_formatted: '$250.00',
      refund_method_display: 'Visa ending 4921',
      refund_eta_display: '3–5 business days',
      debit_amount_formatted: '$1,250.00',
      debit_date_display: 'August 20, 2026',
      invoice_number: 'INV-2026-0812',
      billing_document_reference: 'DOC-INV-9901',
      billing_amount_formatted: '$1,250.00 USD',
      // CMP
      change_summary_display: 'Updated data retention and AI processing clauses',
      policy_version_display: 'v3.2',
      consent_type_display: 'Marketing communications',
      consent_action_display: 'Withdrawn',
      audit_event_display: 'Admin role assigned to unverified user',
      actor_masked_display: 'admin@***example.com',
      affected_resource_display: 'User account: u***@example.com',
      compliance_jurisdiction: 'United States (FCC / FTC)',
      compliance_effective_date: 'August 1, 2026',
      // PAR
      partner_display_name: 'Global Connect Networks',
      partner_organisation_display: 'Global Connect Networks',
      partner_tier_display: 'Gold Partner',
      onboarding_contact_display: 'Partner Success Manager',
      partner_reference_period: '2026-Q3 Settlement',
      integration_display_name: 'Stripe Payments Engine',
      integration_name_display: 'Stripe Payments Engine v2',
      update_type_display: 'Breaking change',
      sla_metric_display: 'API Uptime SLA',
      breach_threshold_display: '99.9% uptime',
      current_value_display: '98.2% uptime',
      partner_organisation: 'Global Connect Networks',
      // CAT
      product_name_display: 'ZoikoNex 5G eSIM Enterprise Pack',
      product_category_display: 'eSIM & Connectivity',
      launch_date_display: 'August 15, 2026',
      update_summary_display: 'New 5G data bundles and revised eSIM tiers',
      affected_products_display: '12 products updated',
      service_name_display: 'eSIM Provisioning Service',
      availability_status_display: 'Degraded — partial outage',
      affected_regions_display: 'EU-West, AP-Southeast',
      estimated_resolution_display: 'August 13, 2026 at 18:00 UTC',
      // API
      api_key_masked: 'sk_live_***...f7a2',
      usage_percentage_display: '87% of monthly quota used',
      quota_limit_display: '500,000 requests/month',
      service_name: 'ZoikoNex Core API',
      reset_date_display: 'September 1, 2026',
      deprecated_endpoint_display: '/v1/esim/provision',
      replacement_endpoint_display: '/v2/esim/provision',
      api_version_display: 'v1 → v2',
      sunset_date_display: 'October 1, 2026',
      environment_name: 'production',
      integration_name: 'Stripe Payments Engine',
      // RISK
      suspension_reason_display: 'Suspicious payment activity detected',
      restriction_reason_display: 'Account under compliance review',
      affected_data_categories: 'Account metadata, billing contact details',
      case_id: 'CASE-RISK-7710',
      case_severity: 'HIGH',
      case_status_display: 'OPEN',
      // OPS
      operation_display_name: 'Quarterly Revenue Leakage Audit',
      operation_status_display: 'COMPLETED',
      // ORD
      order_reference: 'ORD-2026-9901',
      service_masked_reference: '+1 (555) ***-4921',
      // USG
      customer_masked_account_reference: 'ACC-8829-****',
      usage_summary: '4.5 GB of 9 GB (50%) used',
      percentage: 50,
      // SUB
      subscription_reference: 'SUB-ENTERPRISE-2026',
      subscription_effective_date: 'August 1, 2026',
      cancellation_effective_date_display: 'August 31, 2026',
      data_retention_display: '90 days after cancellation',
      next_renewal_date_display: 'September 1, 2027',
      // NEXA
      nexa_reference: 'NEXA-REC-404',
      nexa_governance_summary: 'Policy Rule #14: Financial tariff adjustment requires Human Approval',
      summary_period_display: 'August 1–12, 2026',
      summary_headline_display: 'Revenue up 12% — 3 eSIM provisioning anomalies flagged',
      key_metric_display: '12,441 active eSIMs (+8% WoW)',
      recommendation_title_display: 'Switch high-volume accounts to annual billing',
      recommendation_category_display: 'Revenue optimisation',
      potential_impact_display: 'Estimated $48,000 ARR uplift',
      advisory_title_display: 'Unusual bulk provisioning pattern detected',
      advisory_severity_display: 'Medium',
      advisory_summary_display: '340 eSIMs provisioned by single admin in 4 minutes',
      brand_display_name: brand.display_name,
    },
  };

  let element: React.ReactElement;

  switch (templateId) {
    // ── COM ──
    case 'ZNX-EM-COM-001': element = React.createElement(DemoRequestReceivedEmail, { payload }); break;
    case 'ZNX-EM-COM-002': element = React.createElement(DemoBookedEmail, { payload }); break;
    case 'ZNX-EM-COM-003': element = React.createElement(OnboardingWelcomeEmail, { payload }); break;
    case 'ZNX-EM-COM-004': element = React.createElement(PlanUpgradeEmail, { payload }); break;
    case 'ZNX-EM-COM-005': element = React.createElement(RenewalReminderEmail, { payload }); break;
    case 'ZNX-EM-COM-006': element = React.createElement(ChurnPreventionEmail, { payload }); break;
    case 'ZNX-EM-COM-007': element = React.createElement(PromotionalOfferEmail, { payload }); break;
    // ── IAM ──
    case 'ZNX-EM-IAM-001': element = React.createElement(UserInvitationEmail, { payload }); break;
    case 'ZNX-EM-IAM-002': element = React.createElement(PasswordResetEmail, { payload }); break;
    case 'ZNX-EM-IAM-003': element = React.createElement(SuspiciousLoginEmail, { payload }); break;
    case 'ZNX-EM-IAM-004': element = React.createElement(MfaChallengeEmail, { payload }); break;
    case 'ZNX-EM-IAM-005': element = React.createElement(AccountRecoveryEmail, { payload }); break;
    // ── TNT ──
    case 'ZNX-EM-TNT-001': element = React.createElement(TenantWelcomeEmail, { payload }); break;
    case 'ZNX-EM-TNT-002': element = React.createElement(TenantSetupConfirmedEmail, { payload }); break;
    case 'ZNX-EM-TNT-003': element = React.createElement(AdminAssignedEmail, { payload }); break;
    // ── CRM ──
    case 'ZNX-EM-CRM-001': element = React.createElement(SubscriberWelcomeEmail, { payload }); break;
    case 'ZNX-EM-CRM-002': element = React.createElement(TicketResolvedEmail, { payload }); break;
    case 'ZNX-EM-CRM-003': element = React.createElement(FeedbackRequestEmail, { payload }); break;
    case 'ZNX-EM-CRM-004': element = React.createElement(EscalationNoticeEmail, { payload }); break;
    // ── BIL ──
    case 'ZNX-EM-BIL-002': element = React.createElement(InvoiceIssuedEmail, { payload }); break;
    case 'ZNX-EM-BIL-003': element = React.createElement(InvoiceReminderEmail, { payload }); break;
    case 'ZNX-EM-BIL-004': element = React.createElement(InvoicePaidEmail, { payload }); break;
    case 'ZNX-EM-BIL-005': element = React.createElement(InvoiceOverdueEmail, { payload }); break;
    // ── PAY ──
    case 'ZNX-EM-PAY-003': element = React.createElement(PaymentReceivedEmail, { payload }); break;
    case 'ZNX-EM-PAY-005': element = React.createElement(PaymentFailedEmail, { payload }); break;
    case 'ZNX-EM-PAY-006': element = React.createElement(RefundProcessedEmail, { payload }); break;
    case 'ZNX-EM-PAY-007': element = React.createElement(AutoDebitNoticeEmail, { payload }); break;
    // ── CMP ──
    case 'ZNX-EM-CMP-001': element = React.createElement(TermsUpdatedEmail, { payload }); break;
    case 'ZNX-EM-CMP-002': element = React.createElement(PrivacyNoticeEmail, { payload }); break;
    case 'ZNX-EM-CMP-003': element = React.createElement(ConsentChangedEmail, { payload }); break;
    case 'ZNX-EM-CMP-004': element = React.createElement(AuditAlertEmail, { payload }); break;
    // ── PAR ──
    case 'ZNX-EM-PAR-001': element = React.createElement(PartnerInvitationEmail, { payload }); break;
    case 'ZNX-EM-PAR-002': element = React.createElement(PartnerOnboardingEmail, { payload }); break;
    case 'ZNX-EM-PAR-003': element = React.createElement(IntegrationUpdateEmail, { payload }); break;
    case 'ZNX-EM-PAR-004': element = React.createElement(SlaBreachEmail, { payload }); break;
    // ── CAT ──
    case 'ZNX-EM-CAT-001': element = React.createElement(NewProductLaunchEmail, { payload }); break;
    case 'ZNX-EM-CAT-002': element = React.createElement(CatalogUpdateEmail, { payload }); break;
    case 'ZNX-EM-CAT-003': element = React.createElement(ServiceAvailabilityEmail, { payload }); break;
    // ── API ──
    case 'ZNX-EM-API-003': element = React.createElement(ApiSecretGeneratedEmail, { payload }); break;
    case 'ZNX-EM-API-004': element = React.createElement(ApiUsageAlertEmail, { payload }); break;
    case 'ZNX-EM-API-005': element = React.createElement(ApiQuotaExceededEmail, { payload }); break;
    case 'ZNX-EM-API-006': element = React.createElement(ApiDeprecationNoticeEmail, { payload }); break;
    // ── RISK ──
    case 'ZNX-EM-RISK-001': element = React.createElement(FraudAlertOpenedEmail, { payload }); break;
    case 'ZNX-EM-RISK-002': element = React.createElement(AccountSuspensionEmail, { payload }); break;
    case 'ZNX-EM-RISK-003': element = React.createElement(ServiceRestrictionEmail, { payload }); break;
    case 'ZNX-EM-RISK-004': element = React.createElement(BreachNotificationEmail, { payload }); break;
    // ── SUP ──
    case 'ZNX-EM-SUP-001': element = React.createElement(SupportCaseCreatedEmail, { payload }); break;
    case 'ZNX-EM-SUP-002': element = React.createElement(TicketOpenedEmail, { payload }); break;
    case 'ZNX-EM-SUP-013': element = React.createElement(IncidentDetectedEmail, { payload }); break;
    // ── SUB ──
    case 'ZNX-EM-SUB-001': element = React.createElement(SubscriptionActivatedEmail, { payload }); break;
    case 'ZNX-EM-SUB-002': element = React.createElement(SubscriptionCancelledEmail, { payload }); break;
    case 'ZNX-EM-SUB-003': element = React.createElement(SubscriptionRenewedEmail, { payload }); break;
    // ── OPS ──
    case 'ZNX-EM-OPS-001': element = React.createElement(ScheduledReportReadyEmail, { payload }); break;
    // ── ORD ──
    case 'ZNX-EM-ORD-001': element = React.createElement(OrderReceivedEmail, { payload }); break;
    case 'ZNX-EM-ORD-014': element = React.createElement(EsimReadyEmail, { payload }); break;
    // ── USG ──
    case 'ZNX-EM-USG-001': element = React.createElement(UsageThresholdNoticeEmail, { payload }); break;
    // ── NEXA ──
    case 'ZNX-EM-NEXA-001': element = React.createElement(NexaSummaryEmail, { payload }); break;
    case 'ZNX-EM-NEXA-002': element = React.createElement(NexaRecommendationEmail, { payload }); break;
    case 'ZNX-EM-NEXA-003': element = React.createElement(NexaAdvisoryEmail, { payload }); break;
    case 'ZNX-EM-NEXA-004': element = React.createElement(NexaActionApprovalRequiredEmail, { payload }); break;
    default:
      element = React.createElement(UserInvitationEmail, { payload });
  }

  try {
    const html = await render(element);
    return { success: true, html, payload };
  } catch (error: any) {
    console.error('Failed to render preview:', error);
    return { success: false, error: error.message };
  }
}
