import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PaymentReceivedData {
  recipient_first_name?: string;
  payment_reference: string;
  payment_amount_formatted: string;
  payment_status_display: string;
}

export interface PaymentReceivedEmailProps {
  payload: CanonicalEmailPayload;
}

export const PaymentReceivedEmail: React.FC<PaymentReceivedEmailProps> = ({ payload }) => {
  const data = payload.eventData as PaymentReceivedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Payment or invoice', value: data?.payment_reference || 'Unknown' },
    { label: 'Amount and status', value: `${data?.payment_amount_formatted || '$0.00'} — ${data?.payment_status_display || 'COMPLETED'}` },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Payment received — thank you"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, We have received payment.`}
      primaryCtaText="View receipt"
      primaryCtaLink={`https://zoikonex.com/payments/receipt?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>View receipt</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PaymentReceivedEmail;

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
