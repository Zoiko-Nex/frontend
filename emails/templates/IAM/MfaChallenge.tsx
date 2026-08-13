import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface MfaChallengeData {
  recipient_first_name?: string;
  user_masked_email: string;
  otp_code: string;
  otp_expiry_minutes: number;
}

export interface MfaChallengeEmailProps {
  payload: CanonicalEmailPayload;
}

export const MfaChallengeEmail: React.FC<MfaChallengeEmailProps> = ({ payload }) => {
  const data = payload.eventData as MfaChallengeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: data?.user_masked_email || 'Unknown' },
    { label: 'One-time code', value: data?.otp_code || '------' },
    { label: 'Code expires', value: `${data?.otp_expiry_minutes || 10} minutes from issue` },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex verification code"
      preheader="Use this one-time code to complete sign-in. Do not share it."
      openingText={`Hello ${firstName}, Your multi-factor authentication code is shown below.`}
      primaryCtaText="Go to sign-in"
      primaryCtaLink={`https://zoikonex.com/sign-in?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Enter the <strong>one-time code</strong> on the sign-in screen. The code is single-use and expires after the time shown above.
      </Text>

      <Text style={protectionCopy}>
        If you did not attempt to sign in, do not use this code. Contact your administrator immediately and change your password.
      </Text>
    </CanonicalLayout>
  );
};

export default MfaChallengeEmail;

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
