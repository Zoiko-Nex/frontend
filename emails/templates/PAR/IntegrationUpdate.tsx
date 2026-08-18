import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface IntegrationUpdateData {
  recipient_first_name?: string;
  integration_name_display: string;
  update_type_display: string;
  change_summary_display: string;
  effective_date_display: string;
  [key: string]: any;
}

export interface IntegrationUpdateEmailProps {
  payload: CanonicalEmailPayload;
}

export const IntegrationUpdateEmail: React.FC<IntegrationUpdateEmailProps> = ({ payload }) => {
  const data = payload.eventData as IntegrationUpdateData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Integration', value: data?.integration_name_display || 'Unknown' },
    { label: 'Update type', value: data?.update_type_display || 'General update' },
    { label: 'Summary', value: data?.change_summary_display || 'See documentation' },
    { label: 'Effective date', value: data?.effective_date_display || 'See notice' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Integration update notice from ZoikoNex"
      preheader="An update to one of your integrations requires your attention."
      openingText={`Hello ${firstName}, An update has been published for an integration connected to your ZoikoNex account.`}
      primaryCtaText="View integration docs"
      primaryCtaLink={`https://zoikonex.com/partners/integrations?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View integration docs</strong> to review the change details and assess the impact on your implementation.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default IntegrationUpdateEmail;

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
