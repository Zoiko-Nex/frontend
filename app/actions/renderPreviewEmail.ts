'use server';

import { render } from '@react-email/render';
import React from 'react';
import { CanonicalEmailPayload, BrandRendering, SenderRendering, SupportRendering } from '../../emails/types/CanonicalEmail';

// Templates
import DemoRequestReceivedEmail from '../../emails/templates/COM/DemoRequestReceived';
import DemoBookedEmail from '../../emails/templates/COM/DemoBooked';
import UserInvitationEmail from '../../emails/templates/IAM/UserInvitation';
import SubscriberWelcomeEmail from '../../emails/templates/CRM/SubscriberWelcome';
import OrderReceivedEmail from '../../emails/templates/ORD/OrderReceived';
import EsimReadyEmail from '../../emails/templates/ORD/EsimReady';
import UsageThresholdNoticeEmail from '../../emails/templates/USG/UsageThresholdNotice';
import InvoiceIssuedEmail from '../../emails/templates/BIL/InvoiceIssued';
import PaymentReceivedEmail from '../../emails/templates/PAY/PaymentReceived';
import PaymentFailedEmail from '../../emails/templates/PAY/PaymentFailed';
import TermsUpdatedEmail from '../../emails/templates/CMP/TermsUpdated';
import PartnerInvitationEmail from '../../emails/templates/PAR/PartnerInvitation';
import ApiSecretGeneratedEmail from '../../emails/templates/API/ApiSecretGenerated';
import FraudAlertOpenedEmail from '../../emails/templates/RISK/FraudAlertOpened';
import SupportCaseCreatedEmail from '../../emails/templates/SUP/SupportCaseCreated';
import IncidentDetectedEmail from '../../emails/templates/SUP/IncidentDetected';
import ScheduledReportReadyEmail from '../../emails/templates/OPS/ScheduledReportReady';
import SubscriptionActivatedEmail from '../../emails/templates/SUB/SubscriptionActivated';
import NexaActionApprovalRequiredEmail from '../../emails/templates/NEXA/NexaActionApprovalRequired';

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
      recipient_first_name: 'Alex',
      prospect_organization_name: 'Apex Telecom Ltd',
      prospect_contact_name: 'Alex Rivera',
      user_masked_email: 'a***@example.com',
      tenant_display_name: brand.display_name,
      customer_masked_account_reference: 'ACC-8829-****',
      brand_display_name: brand.display_name,
      order_reference: 'ORD-2026-9901',
      service_masked_reference: '+1 (555) ***-4921',
      usage_summary: '4.5 GB of 9 GB (50%) used',
      percentage: 50,
      invoice_number: 'INV-2026-0812',
      billing_document_reference: 'DOC-INV-9901',
      billing_amount_formatted: '$1,250.00 USD',
      payment_reference: 'PAY-2026-7712',
      payment_amount_formatted: '$1,250.00 USD',
      payment_status_display: 'COMPLETED',
      compliance_jurisdiction: 'United States (FCC / FTC)',
      compliance_effective_date: 'August 1, 2026',
      partner_display_name: 'Global Connect Networks',
      partner_reference_period: '2026-Q3 Settlement',
      integration_display_name: 'Stripe Payments Engine',
      environment_name: 'production',
      case_id: 'CASE-RISK-7710',
      case_severity: 'HIGH',
      case_status_display: 'OPEN',
      operation_display_name: 'Quarterly Revenue Leakage Audit',
      operation_status_display: 'COMPLETED',
      subscription_reference: 'SUB-ENTERPRISE-2026',
      subscription_effective_date: 'August 1, 2026',
      nexa_reference: 'NEXA-REC-404',
      nexa_governance_summary: 'Policy Rule #14: Financial tariff adjustment requires Human Approval',
    },
  };

  let element: React.ReactElement;

  switch (templateId) {
    case 'ZNX-EM-COM-001':
      element = React.createElement(DemoRequestReceivedEmail, { payload });
      break;
    case 'ZNX-EM-COM-002':
      element = React.createElement(DemoBookedEmail, { payload });
      break;
    case 'ZNX-EM-IAM-001':
      element = React.createElement(UserInvitationEmail, { payload });
      break;
    case 'ZNX-EM-CRM-001':
      element = React.createElement(SubscriberWelcomeEmail, { payload });
      break;
    case 'ZNX-EM-ORD-001':
      element = React.createElement(OrderReceivedEmail, { payload });
      break;
    case 'ZNX-EM-ORD-014':
      element = React.createElement(EsimReadyEmail, { payload });
      break;
    case 'ZNX-EM-USG-001':
      element = React.createElement(UsageThresholdNoticeEmail, { payload });
      break;
    case 'ZNX-EM-BIL-002':
      element = React.createElement(InvoiceIssuedEmail, { payload });
      break;
    case 'ZNX-EM-PAY-003':
      element = React.createElement(PaymentReceivedEmail, { payload });
      break;
    case 'ZNX-EM-PAY-005':
      element = React.createElement(PaymentFailedEmail, { payload });
      break;
    case 'ZNX-EM-CMP-001':
      element = React.createElement(TermsUpdatedEmail, { payload });
      break;
    case 'ZNX-EM-PAR-001':
      element = React.createElement(PartnerInvitationEmail, { payload });
      break;
    case 'ZNX-EM-API-003':
      element = React.createElement(ApiSecretGeneratedEmail, { payload });
      break;
    case 'ZNX-EM-RISK-001':
      element = React.createElement(FraudAlertOpenedEmail, { payload });
      break;
    case 'ZNX-EM-SUP-001':
      element = React.createElement(SupportCaseCreatedEmail, { payload });
      break;
    case 'ZNX-EM-SUP-013':
      element = React.createElement(IncidentDetectedEmail, { payload });
      break;
    case 'ZNX-EM-OPS-001':
      element = React.createElement(ScheduledReportReadyEmail, { payload });
      break;
    case 'ZNX-EM-SUB-001':
      element = React.createElement(SubscriptionActivatedEmail, { payload });
      break;
    case 'ZNX-EM-NEXA-004':
      element = React.createElement(NexaActionApprovalRequiredEmail, { payload });
      break;
    default:
      element = React.createElement(UserInvitationEmail, { payload });
  }

  try {
    const html = await render(element);
    return { success: true, html, payload };
  } catch (error: any) {
    console.error("Failed to render preview:", error);
    return { success: false, error: error.message };
  }
}
