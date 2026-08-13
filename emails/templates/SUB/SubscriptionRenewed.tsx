import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SubscriptionRenewedData {
  recipient_first_name?: string;
  tenant_display_name: string;
  plan_name_display: string;
  renewal_amount_formatted: string;
  next_renewal_date_display: string;
}

export interface SubscriptionRenewedEmailProps {
  payload: CanonicalEmailPayload;
}

export const SubscriptionRenewedEmail: React.FC<SubscriptionRenewedEmailProps> = ({ payload }) => {
  const data = payload.eventData as SubscriptionRenewedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Plan renewed', value: data?.plan_name_display || 'Unknown' },
    { label: 'Amount charged', value: data?.renewal_amount_formatted || '$0.00' },
    { label: 'Next renewal', value: data?.next_renewal_date_display || 'See billing portal' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex subscription has been renewed"
      preheader="Renewal confirmed. Your subscription continues without interruption."
      openingText={`Hello ${firstName}, Your ZoikoNex subscription has been successfully renewed.`}
      primaryCtaText="View subscription"
      primaryCtaLink={`https://zoikonex.com/billing/subscription?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View subscription</strong> to review your renewal receipt and manage upcoming billing cycles.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default SubscriptionRenewedEmail;

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
  backgroundColor: '#f0fdf4',
  borderLeft: '4px solid #22c55e',
};
