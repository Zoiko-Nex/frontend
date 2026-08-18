/**
 * ZoikoNex Email Communications System
 * Section 05: Mandatory Event and Rendering Contract & Safe Reference Masking
 * Baseline Specification v1.0 - Section 05
 */

import { CanonicalEmailPayload } from '@/emails/types/CanonicalEmail';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Safe reference masking utilities as mandated by Section 04 & 05
 * Never display full credentials, government IDs or payment account numbers
 */
export const SafeMask = {
  msisdn: (phone?: string): string => {
    if (!phone) return '+1 (***) ***-****';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return '***';
    return `+${digits.slice(0, 1)} (***) ***-${digits.slice(-4)}`;
  },

  iccid: (sim?: string): string => {
    if (!sim) return '8901410321111854***';
    if (sim.length <= 6) return '******';
    return `${sim.slice(0, 6)}************${sim.slice(-4)}`;
  },

  accountNumber: (acc?: string): string => {
    if (!acc) return 'ACC-****-7890';
    if (acc.length <= 4) return '****';
    return `ACC-****-${acc.slice(-4)}`;
  },

  email: (email?: string): string => {
    if (!email) return 'u***@zoikonex.com';
    const parts = email.split('@');
    if (parts.length !== 2) return 'u***@zoikonex.com';
    const [name, domain] = parts;
    return `${name.charAt(0)}***@${domain}`;
  },

  paymentCard: (cardLast4?: string): string => {
    return `•••• •••• •••• ${cardLast4 || '4242'}`;
  },

  nationalId: (id?: string): string => {
    if (!id) return '***-**-****';
    return `***-**-${id.slice(-4)}`;
  }
};

/**
 * Validates any outgoing or preview CanonicalEmailPayload against Section 05 Mandatory Contract
 */
export function validateEventPayload(payload: Partial<CanonicalEmailPayload>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Identity Validation
  if (!payload.identity?.tenant_id) errors.push('Missing Identity: tenant.id is mandatory');
  if (!payload.identity?.environment_name) errors.push('Missing Identity: environment.name is mandatory');
  if (!payload.identity?.recipient_role) warnings.push('Identity warning: recipient.role is recommended for audit');

  // 2. Traceability Validation
  if (!payload.traceability?.template_id) errors.push('Missing Traceability: template.id is required for dispatch');
  if (!payload.traceability?.message_reference) errors.push('Missing Traceability: message.reference is mandatory for idempotency');
  if (!payload.traceability?.correlation_id) warnings.push('Traceability warning: correlation_id missing');

  // 3. Rendering Validation
  if (!payload.rendering?.brand?.display_name) errors.push('Missing Rendering: brand.display_name is required');
  if (!payload.rendering?.brand?.primary_color) errors.push('Missing Rendering: brand.primary_color is required');
  if (!payload.rendering?.sender?.from_name) errors.push('Missing Rendering: sender.from_name is required');
  if (!payload.rendering?.support?.url) warnings.push('Rendering warning: support.url is recommended');

  // 4. Governance Validation
  if (!payload.governance?.message_classification) errors.push('Missing Governance: message.classification is mandatory');
  if (!payload.governance?.message_legal_basis) warnings.push('Governance warning: message.legal_basis recommended for GDPR/compliance');

  // 5. Localized Values Validation
  if (!payload.localizedValues?.date_local || !payload.localizedValues?.date_utc) {
    errors.push('Missing Localized Values: date.local and date.utc are mandatory');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generates domain-aware synthetic event data for live simulation based on Template Family
 */
export function generateSyntheticPayload(
  templateId: string,
  family: string,
  overrides?: Partial<CanonicalEmailPayload>
): CanonicalEmailPayload {
  const now = new Date();
  const dateLocal = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dateUtc = now.toISOString();

  const basePayload: CanonicalEmailPayload = {
    identity: {
      tenant_id: 'ten_zoiko_prod_01',
      operator_id: 'op_nex_us',
      brand_id: 'br_zoikonex_global',
      environment_name: 'Production',
      recipient_role: 'Platform Administrator',
      recipient_locale: 'en-US',
      recipient_time_zone: 'America/New_York'
    },
    traceability: {
      event_type: `${family}.EVENT_OCCURRED.V1`,
      event_version: '1.0',
      event_id: `evt_${Date.now().toString(36)}`,
      correlation_id: `corr_${Math.random().toString(36).substring(2, 9)}`,
      message_reference: `ZNX-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      template_id: templateId,
      template_version: '1.0'
    },
    rendering: {
      brand: {
        display_name: 'ZoikoNex Telecom',
        logo_url: 'https://react.email/static/logo-v.png',
        primary_color: '#0052FF',
      },
      sender: {
        from_name: 'ZoikoNex Notifications',
        reply_to: 'notifications@zoikonex.com'
      },
      support: {
        url: 'https://support.zoikonex.com'
      }
    },
    governance: {
      message_classification: 'Operational transactional',
      message_legal_basis: 'Contract Fulfillment',
      message_preference_category: 'System Service',
      message_sensitivity: 'Restricted'
    },
    localizedValues: {
      jurisdiction_code: 'US-FED',
      language_code: 'en-US',
      currency_code: 'USD',
      date_local: `${dateLocal} 14:30 EST`,
      date_utc: dateUtc,
      amount_formatted: '$149.50'
    },
    eventData: {
      recipient_first_name: 'Alexander',
      tenant_display_name: 'Apex Mobile MVNO',
      environment_name: 'Production US-East',
      order_id: 'ORD-98231-A',
      service_masked_reference: SafeMask.msisdn('+12025550198'),
      case_id: 'CASE-88219',
      usage_summary: '4.8 GB of 5.0 GB (96%)',
      case_status_display: 'Investigating - Tier 2',
      invoice_number: 'INV-2026-08892',
      payment_reference: 'PAY-REF-449102',
      integration_display_name: 'Salesforce CRM Connector',
      access_scope_summary: 'Admin: Billing, eSIM Provisioning, Nexa AI Policies'
    }
  };

  // Merge overrides
  return {
    ...basePayload,
    ...overrides,
    rendering: {
      brand: { ...basePayload.rendering.brand, ...overrides?.rendering?.brand },
      sender: { ...basePayload.rendering.sender, ...overrides?.rendering?.sender },
      support: { ...basePayload.rendering.support, ...overrides?.rendering?.support }
    }
  };
}
