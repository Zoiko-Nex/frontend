import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PaymentPendingData {
  recipient_first_name?: string;
  payment_reference?: string;
  payment_amount_formatted?: string;
  [key: string]: any;
}

export interface PaymentPendingEmailProps {
  payload: CanonicalEmailPayload;
}

export const PaymentPendingEmail: React.FC<PaymentPendingEmailProps> = ({ payload }) => {
  const data = payload.eventData as PaymentPendingData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Payment or invoice', value: payload.eventData?.payment_reference || 'Unknown' },
    { label: 'Amount and status', value: payload.eventData?.payment_amount_formatted || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your payment is being processed"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to payment pending.`}
      primaryCtaText="Track payment"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Track payment to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or  complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PaymentPendingEmail;

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
