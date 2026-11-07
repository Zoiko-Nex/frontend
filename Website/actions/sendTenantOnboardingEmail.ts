'use server';

import React from 'react';
import { render } from '@react-email/render';
import { CanonicalEmailPayload } from '../../emails/types/CanonicalEmail';
import AccountCreatedEmail from '../../emails/templates/IAM/AccountCreated';
import TenantProvisionedEmail from '../../emails/templates/TEN/TenantProvisioned';
import { sendMail } from '@/lib/email/mailer';

export interface SendTenantOnboardingEmailInput {
  tenantId: string;
  tenantName: string;
  domainSuffix: string;
  adminEmail: string;
  adminName: string;
  adminPassword?: string;
  brandName?: string;
  brandId?: string;
}

export async function sendTenantOnboardingEmail(input: SendTenantOnboardingEmailInput): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
  transport?: string;
  emailPreviewHtml?: string;
}> {
  try {
    const firstName = (input.adminName || 'Administrator').split(' ')[0];
    const loginUrl = input.domainSuffix.startsWith('http')
      ? input.domainSuffix
      : `https://${input.domainSuffix}/login`;

    // Construct Canonical Email Payload (ZNX-EM-TEN-001 / ZNX-EM-IAM-004)
    const payload: CanonicalEmailPayload = {
      identity: {
        tenant_id: input.tenantId || 'platform',
        operator_id: input.tenantId || 'platform',
        brand_id: input.brandId || 'zoikonex',
        environment_name: 'production',
        recipient_role: 'Tenant technical admin',
        recipient_locale: 'en-US',
        recipient_time_zone: 'UTC',
      },
      traceability: {
        event_type: 'TEN.TENANT_PROVISIONED.V1',
        event_version: '1.0',
        event_id: `evt_${Date.now()}_${input.tenantId}`,
        correlation_id: `corr_${Date.now()}`,
        message_reference: `ZNX-ONB-${Date.now().toString(36).toUpperCase()}`,
        template_id: 'ZNX-EM-TEN-001',
        template_version: '1.0',
      },
      rendering: {
        brand: {
          display_name: input.brandName || input.tenantName || 'ZoikoNex',
          logo_url: '/image/ZoikoNex_Logo_Official/PNG/ZoikoNex_Logo_PNG.png',
          primary_color: '#0052FF',
        },
        sender: {
          from_name: 'ZoikoNex Platform Provisioning',
          reply_to: 'support@zoikonex.com',
        },
        support: {
          url: 'https://zoikonex.com/support',
        },
      },
      governance: {
        message_classification: 'Operational transactional',
        message_legal_basis: 'Contract',
        message_preference_category: 'Transactional',
        message_sensitivity: 'Confidential',
      },
      localizedValues: {
        currency_code: 'USD',
        date_local: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        date_utc: new Date().toISOString().replace('T', ' ').substring(0, 19),
        jurisdiction_code: 'GLOBAL',
        language_code: 'en',
      },
      eventData: {
        recipient_first_name: firstName,
        tenant_display_name: input.tenantName,
        tenant_id: input.tenantId,
        user_email: input.adminEmail,
        login_url: loginUrl,
        temporary_password: input.adminPassword || '[Secured in vault]',
        order_id: input.tenantName,
        environment_name: 'Production Cloud',
      },
    };

    // Render canonical React email component to high-fidelity responsive HTML
    const htmlOutput = await render(React.createElement(TenantProvisionedEmail, { payload }));

    const textOutput = `
Welcome to ZoikoNex - Tenant Provisioned

Hello ${firstName},

Your ZoikoNex tenant "${input.tenantName}" has been successfully provisioned.

Key Details:
- Tenant Name: ${input.tenantName}
- Tenant ID: ${input.tenantId}
- Login Portal: ${loginUrl}
- Administrator Email: ${input.adminEmail}
- Temporary Password: ${input.adminPassword || '[As configured]'}

Please log in to your portal and reset your password on first access.
Support: https://zoikonex.com/support
`;

    // 1. Dispatch via mailer (SMTP -> Resend -> Outbox)
    const mailResult = await sendMail({
      to: input.adminEmail,
      subject: `Welcome to ZoikoNex - ${input.tenantName} Operations Console Access & Credentials`,
      html: htmlOutput,
      text: textOutput,
      metadata: {
        tenantId: input.tenantId,
        tenantName: input.tenantName,
        adminName: input.adminName,
        type: 'TENANT_ONBOARDING',
      },
    });

    // 2. Attempt to notify backend notification/email gateway if active
    try {
      const backendUrl = process.env.API_BASE_URL || 'http://localhost:8080';
      await fetch(`${backendUrl}/v1/tenants/${input.tenantId}/send-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: input.adminEmail,
          full_name: input.adminName,
          password: input.adminPassword,
          tenant_name: input.tenantName,
          domain_suffix: input.domainSuffix,
          html_body: htmlOutput,
        }),
      }).catch(() => null);
    } catch {
      // Non-blocking
    }

    return {
      success: true,
      message: `Credentials email dispatched to ${input.adminEmail} (${mailResult.transport})`,
      messageId: mailResult.messageId,
      transport: mailResult.transport,
      emailPreviewHtml: htmlOutput,
    };
  } catch (err: any) {
    console.error('sendTenantOnboardingEmail error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to dispatch onboarding email',
    };
  }
}
