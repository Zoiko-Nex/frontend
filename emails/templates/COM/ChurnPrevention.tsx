import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ChurnPreventionData {
  recipient_first_name?: string;
  tenant_display_name: string;
  plan_name_display: string;
  cancellation_date_display: string;
}

export interface ChurnPreventionEmailProps {
  payload: CanonicalEmailPayload;
}

export const ChurnPreventionEmail: React.FC<ChurnPreventionEmailProps> = ({ payload }) => {
  const data = payload.eventData as ChurnPreventionData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Plan', value: data?.plan_name_display || 'Unknown' },
    { label: 'Scheduled cancellation', value: data?.cancellation_date_display || 'See account portal' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="We'd love to keep you — your subscription is ending soon"
      preheader="Your account is scheduled to cancel. Here's what you can do."
      openingText={`Hello ${firstName}, We noticed your ZoikoNex subscription is scheduled to end.`}
      primaryCtaText="Keep my subscription"
      primaryCtaLink={`https://zoikonex.com/billing/reactivate?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Keep my subscription</strong> to reactivate your plan and retain uninterrupted access to ZoikoNex services.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default ChurnPreventionEmail;

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
