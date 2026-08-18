import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ApiQuotaExceededData {
  recipient_first_name?: string;
  api_key_masked: string;
  service_name_display: string;
  quota_limit_display: string;
  reset_date_display: string;
  [key: string]: any;
}

export interface ApiQuotaExceededEmailProps {
  payload: CanonicalEmailPayload;
}

export const ApiQuotaExceededEmail: React.FC<ApiQuotaExceededEmailProps> = ({ payload }) => {
  const data = payload.eventData as ApiQuotaExceededData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'API key', value: data?.api_key_masked || 'Unknown' },
    { label: 'Service', value: data?.service_name_display || 'Unknown' },
    { label: 'Quota limit', value: data?.quota_limit_display || 'See plan' },
    { label: 'Quota resets', value: data?.reset_date_display || 'See developer portal' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Action required: API quota exceeded"
      preheader="Your API quota has been exceeded. Requests are now throttled."
      openingText={`Hello ${firstName}, Your ZoikoNex API quota has been exceeded and requests are now throttled.`}
      primaryCtaText="Upgrade quota"
      primaryCtaLink={`https://zoikonex.com/developer/quota?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Upgrade quota</strong> to increase your API limit and restore full access immediately.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full API credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default ApiQuotaExceededEmail;

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
