import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface RefundProcessedData {
  recipient_first_name?: string;
  refund_reference: string;
  refund_amount_formatted: string;
  refund_method_display: string;
  refund_eta_display: string;
}

export interface RefundProcessedEmailProps {
  payload: CanonicalEmailPayload;
}

export const RefundProcessedEmail: React.FC<RefundProcessedEmailProps> = ({ payload }) => {
  const data = payload.eventData as RefundProcessedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Refund reference', value: data?.refund_reference || 'Unknown' },
    { label: 'Amount refunded', value: data?.refund_amount_formatted || '$0.00' },
    { label: 'Refund method', value: data?.refund_method_display || 'Original payment method' },
    { label: 'Expected arrival', value: data?.refund_eta_display || '3–5 business days' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your refund has been processed"
      preheader="Refund confirmation and expected arrival details."
      openingText={`Hello ${firstName}, Your refund from ZoikoNex has been processed successfully.`}
      primaryCtaText="View refund details"
      primaryCtaLink={`https://zoikonex.com/payments/refunds?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View refund details</strong> to review the authoritative refund record.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default RefundProcessedEmail;

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
