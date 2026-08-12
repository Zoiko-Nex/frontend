import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface OrderReceivedData {
  recipient_first_name?: string;
  order_reference: string;
  service_masked_reference: string;
}

export interface OrderReceivedEmailProps {
  payload: CanonicalEmailPayload;
}

export const OrderReceivedEmail: React.FC<OrderReceivedEmailProps> = ({ payload }) => {
  const data = payload.eventData as OrderReceivedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Order reference', value: data?.order_reference || 'Unknown' },
    { label: 'Service / Line', value: data?.service_masked_reference || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="We received your order"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, We have received order.`}
      primaryCtaText="Track order"
      primaryCtaLink={`https://zoikonex.com/track-order?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>Track order</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default OrderReceivedEmail;

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
