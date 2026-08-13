import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PasswordResetData {
  recipient_first_name?: string;
  user_masked_email: string;
  reset_expiry_minutes: number;
}

export interface PasswordResetEmailProps {
  payload: CanonicalEmailPayload;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ payload }) => {
  const data = payload.eventData as PasswordResetData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: data?.user_masked_email || 'Unknown' },
    { label: 'Link expires', value: `${data?.reset_expiry_minutes || 30} minutes from issue` },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Reset your ZoikoNex password"
      preheader="Use the link below to set a new password. It expires shortly."
      openingText={`Hello ${firstName}, A password reset was requested for your ZoikoNex account.`}
      primaryCtaText="Reset password"
      primaryCtaLink={`https://zoikonex.com/reset-password?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Reset password</strong> to set a new password. The link is single-use and expires after the time shown above.
      </Text>

      <Text style={protectionCopy}>
        If you did not request a password reset, ignore this email — your password will not change. If you believe your account is at risk, contact your authorized administrator immediately.
      </Text>
    </CanonicalLayout>
  );
};

export default PasswordResetEmail;

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
