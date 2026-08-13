import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SuspiciousLoginData {
  recipient_first_name?: string;
  user_masked_email: string;
  login_location_display: string;
  login_device_display: string;
}

export interface SuspiciousLoginEmailProps {
  payload: CanonicalEmailPayload;
}

export const SuspiciousLoginEmail: React.FC<SuspiciousLoginEmailProps> = ({ payload }) => {
  const data = payload.eventData as SuspiciousLoginData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: data?.user_masked_email || 'Unknown' },
    { label: 'Location', value: data?.login_location_display || 'Unknown' },
    { label: 'Device', value: data?.login_device_display || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Suspicious login detected on your account"
      preheader="We detected unusual sign-in activity. Review immediately."
      openingText={`Hello ${firstName}, We detected a sign-in to your ZoikoNex account from an unrecognised location or device.`}
      primaryCtaText="Review activity"
      primaryCtaLink={`https://zoikonex.com/security/activity?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Review activity</strong> to inspect the sign-in event and secure your account if the activity was not authorised by you.
      </Text>

      <Text style={protectionCopy}>
        If you did not sign in at this time, reset your password immediately and contact your administrator. Do not share this email or any credentials.
      </Text>
    </CanonicalLayout>
  );
};

export default SuspiciousLoginEmail;

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
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #ef4444',
};
