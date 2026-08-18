import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SubscriptionCancelledData {
  recipient_first_name?: string;
  tenant_display_name: string;
  plan_name_display: string;
  cancellation_effective_date_display: string;
  data_retention_display: string;
  [key: string]: any;
}

export interface SubscriptionCancelledEmailProps {
  payload: CanonicalEmailPayload;
}

export const SubscriptionCancelledEmail: React.FC<SubscriptionCancelledEmailProps> = ({ payload }) => {
  const data = payload.eventData as SubscriptionCancelledData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Plan cancelled', value: data?.plan_name_display || 'Unknown' },
    { label: 'Effective date', value: data?.cancellation_effective_date_display || 'See account portal' },
    { label: 'Data retention', value: data?.data_retention_display || 'See terms' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex subscription has been cancelled"
      preheader="Cancellation confirmed. Review data retention and reactivation options."
      openingText={`Hello ${firstName}, Your ZoikoNex subscription has been cancelled.`}
      primaryCtaText="Reactivate subscription"
      primaryCtaLink={`https://zoikonex.com/billing/reactivate?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        You can select <strong>Reactivate subscription</strong> at any time to restore access. Data is retained for the period shown above.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default SubscriptionCancelledEmail;

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
