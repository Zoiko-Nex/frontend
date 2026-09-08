import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface UsageThresholdData {
  recipient_first_name?: string;
  service_masked_reference: string;
  usage_summary: string;
  percentage?: number;
}

export interface UsageThresholdNoticeEmailProps {
  payload: CanonicalEmailPayload;
}

export const UsageThresholdNoticeEmail: React.FC<UsageThresholdNoticeEmailProps> = ({ payload }) => {
  const data = payload.eventData as UsageThresholdData;
  const firstName = data?.recipient_first_name || 'there';
  const percent = data?.percentage || 50;

  const facts = [
    { label: 'Line or account', value: data?.service_masked_reference || 'Unknown' },
    { label: 'Current usage or balance', value: data?.usage_summary || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`You have used ${percent}% of your allowance`}
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This email relates to usage threshold ${percent} percent.`}
      primaryCtaText="View usage"
      primaryCtaLink={`https://zoikonex.com/usage?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>View usage</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default UsageThresholdNoticeEmail;

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
  backgroundColor: '#f3f4f6',
  borderLeft: '4px solid #9ca3af',
};
