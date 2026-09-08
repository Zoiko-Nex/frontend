import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SubscriptionSuspendedData {
  recipient_first_name?: string;
  billing_customer_name: string;
  document_reference_number: string;
  document_total_amount_formatted: string;
}

export interface SubscriptionSuspendedEmailProps {
  payload: CanonicalEmailPayload;
}

export const SubscriptionSuspendedEmail: React.FC<SubscriptionSuspendedEmailProps> = ({ payload }) => {
  const data = payload.eventData as SubscriptionSuspendedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Customer', value: data?.billing_customer_name || 'Unknown' },
    { label: 'Subscription reference', value: data?.document_reference_number || 'Unknown' },
    { label: 'Amount', value: data?.document_total_amount_formatted || 'Unknown' },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Action required: Your ZoikoNex subscription is suspended"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This has been suspended: subscription.`}
      primaryCtaText="Review issue"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>Review issue</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default SubscriptionSuspendedEmail;

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
