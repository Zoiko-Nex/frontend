import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ApiUsageAlertData {
  recipient_first_name?: string;
  api_key_masked: string;
  usage_percentage_display: string;
  quota_limit_display: string;
  service_name_display: string;
  [key: string]: any;
}

export interface ApiUsageAlertEmailProps {
  payload: CanonicalEmailPayload;
}

export const ApiUsageAlertEmail: React.FC<ApiUsageAlertEmailProps> = ({ payload }) => {
  const data = payload.eventData as ApiUsageAlertData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'API key', value: data?.api_key_masked || 'Unknown' },
    { label: 'Service', value: data?.service_name_display || 'Unknown' },
    { label: 'Usage', value: data?.usage_percentage_display || 'See developer portal' },
    { label: 'Quota limit', value: data?.quota_limit_display || 'See plan' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="API usage alert: Approaching quota limit"
      preheader="Your API usage is approaching its limit. Review and take action."
      openingText={`Hello ${firstName}, Your ZoikoNex API usage is approaching its allocated quota.`}
      primaryCtaText="View API usage"
      primaryCtaLink={`https://zoikonex.com/developer/usage?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View API usage</strong> to monitor consumption and upgrade your quota if required.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full API credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default ApiUsageAlertEmail;

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
