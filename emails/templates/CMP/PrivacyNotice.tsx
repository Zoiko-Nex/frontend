import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PrivacyNoticeData {
  recipient_first_name?: string;
  change_summary_display: string;
  effective_date_display: string;
  policy_version_display: string;
  [key: string]: any;
}

export interface PrivacyNoticeEmailProps {
  payload: CanonicalEmailPayload;
}

export const PrivacyNoticeEmail: React.FC<PrivacyNoticeEmailProps> = ({ payload }) => {
  const data = payload.eventData as PrivacyNoticeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Policy version', value: data?.policy_version_display || 'Latest' },
    { label: 'Key changes', value: data?.change_summary_display || 'See full policy' },
    { label: 'Effective date', value: data?.effective_date_display || 'See notice' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Important: Updates to our Privacy Policy"
      preheader="Our Privacy Policy has been updated. Please review the changes."
      openingText={`Hello ${firstName}, We are writing to inform you of updates to the ZoikoNex Privacy Policy.`}
      primaryCtaText="Review privacy policy"
      primaryCtaLink={`https://zoikonex.com/legal/privacy?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Review privacy policy</strong> to read the full updated policy. Continued use of ZoikoNex after the effective date constitutes acceptance.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PrivacyNoticeEmail;

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
  backgroundColor: '#f0f9ff',
  borderLeft: '4px solid #0ea5e9',
};
