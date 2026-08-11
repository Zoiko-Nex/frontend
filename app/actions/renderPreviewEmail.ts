'use server';

import { render } from '@react-email/render';
import { UserInvitationEmail } from '../../emails/templates/IAM/UserInvitation';
import { CanonicalEmailPayload, BrandRendering, SenderRendering, SupportRendering } from '../../emails/types/CanonicalEmail';
import React from 'react';

export async function renderPreviewEmail(brand: BrandRendering, sender: SenderRendering, support: SupportRendering) {
  // Construct a mock payload with the provided branding
  const payload: CanonicalEmailPayload = {
    identity: {
      tenant_id: 'ten_mock123',
      operator_id: 'op_mock456',
      brand_id: 'brnd_custom',
      environment_name: 'production',
      recipient_role: 'Invited platform user',
      recipient_locale: 'en-US',
      recipient_time_zone: 'UTC',
    },
    traceability: {
      event_type: 'IAM.USER_INVITATION.V1',
      event_version: '1.0',
      event_id: 'evt_mock',
      correlation_id: 'req_mock',
      message_reference: 'MSG-IAM-001-MOCK',
      template_id: 'ZNX-EM-IAM-001',
      template_version: '1.0',
    },
    rendering: {
      brand,
      sender,
      support,
    },
    governance: {
      message_classification: 'Security transactional',
      message_legal_basis: 'Legitimate interest',
      message_preference_category: 'Mandatory',
      message_sensitivity: 'Normal',
    },
    localizedValues: {
      currency_code: 'USD',
      date_local: new Date().toLocaleString(),
      date_utc: new Date().toISOString(),
      jurisdiction_code: 'GLOBAL',
      language_code: 'en',
    },
    eventData: {
      recipient_first_name: 'Alex',
      user_masked_email: 'a***@example.com',
      tenant_display_name: brand.display_name,
    },
  };

  try {
    const html = await render(React.createElement(UserInvitationEmail, { payload }));
    return { success: true, html };
  } catch (error: any) {
    console.error("Failed to render preview:", error);
    return { success: false, error: error.message };
  }
}
