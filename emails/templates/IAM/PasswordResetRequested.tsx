import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PasswordResetRequestedData {
  recipient_first_name?: string;
  user_masked_email?: string;
  tenant_display_name?: string;
  [key: string]: any;
}

export interface PasswordResetRequestedEmailProps {
  payload: CanonicalEmailPayload;
}

export const PasswordResetRequestedEmail: React.FC<PasswordResetRequestedEmailProps> = ({ payload }) => {
  const data = payload.eventData as PasswordResetRequestedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: payload.eventData?.user_masked_email || 'Unknown' },
    { label: 'Tenant', value: payload.eventData?.tenant_display_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Reset your ZoikoNex password"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to password reset requested.`}
      primaryCtaText="Reset password"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Reset password to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        If you did not expect this activity, do not forward this email or share credentials. Use the verified ZoikoNex sign-in  page or contact your authorized administrator immediately.
      </Text>
    </CanonicalLayout>
  );
};

export default PasswordResetRequestedEmail;

const actionCopy = {
  fontSize: '14px',
  color: '#484848',
  lineHeight: '1.5',
  marginTop: '16px',
};

const protectionCopy = {
  fontSize: '14px',
  color: '#484848',
  lineHeight: '1.5',
  marginTop: '16px',
  padding: '12px',
  backgroundColor: '#fff3cd',
  borderLeft: '4px solid #ffc107',
};
