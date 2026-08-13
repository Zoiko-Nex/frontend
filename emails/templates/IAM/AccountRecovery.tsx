import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AccountRecoveryData {
  recipient_first_name?: string;
  user_masked_email: string;
  recovery_expiry_minutes: number;
}

export interface AccountRecoveryEmailProps {
  payload: CanonicalEmailPayload;
}

export const AccountRecoveryEmail: React.FC<AccountRecoveryEmailProps> = ({ payload }) => {
  const data = payload.eventData as AccountRecoveryData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: data?.user_masked_email || 'Unknown' },
    { label: 'Recovery link expires', value: `${data?.recovery_expiry_minutes || 60} minutes from issue` },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Recover access to your ZoikoNex account"
      preheader="Use the recovery link below to regain access. It expires shortly."
      openingText={`Hello ${firstName}, An account recovery request was submitted for your ZoikoNex account.`}
      primaryCtaText="Recover account"
      primaryCtaLink={`https://zoikonex.com/account-recovery?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Recover account</strong> to verify your identity and restore access. The link is single-use and expires after the time shown above.
      </Text>

      <Text style={protectionCopy}>
        If you did not request account recovery, do not follow this link. Contact your authorized administrator immediately to secure your account.
      </Text>
    </CanonicalLayout>
  );
};

export default AccountRecoveryEmail;

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
