import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ApiDeprecationNoticeData {
  recipient_first_name?: string;
  deprecated_endpoint_display: string;
  replacement_endpoint_display: string;
  sunset_date_display: string;
  api_version_display: string;
  [key: string]: any;
}

export interface ApiDeprecationNoticeEmailProps {
  payload: CanonicalEmailPayload;
}

export const ApiDeprecationNoticeEmail: React.FC<ApiDeprecationNoticeEmailProps> = ({ payload }) => {
  const data = payload.eventData as ApiDeprecationNoticeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Deprecated', value: data?.deprecated_endpoint_display || 'Unknown' },
    { label: 'Replacement', value: data?.replacement_endpoint_display || 'See documentation' },
    { label: 'API version', value: data?.api_version_display || 'Unknown' },
    { label: 'Sunset date', value: data?.sunset_date_display || 'See developer portal' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="API deprecation notice: Action required before sunset"
      preheader="A ZoikoNex API endpoint is being deprecated. Migrate before the sunset date."
      openingText={`Hello ${firstName}, A ZoikoNex API endpoint that your integration uses is being deprecated.`}
      primaryCtaText="View migration guide"
      primaryCtaLink={`https://zoikonex.com/developer/migration?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View migration guide</strong> to update your integration before the sunset date. Deprecated endpoints will stop responding after that date.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full API credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default ApiDeprecationNoticeEmail;

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
