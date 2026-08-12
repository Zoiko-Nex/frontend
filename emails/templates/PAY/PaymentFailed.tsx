import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PaymentFailedData {
  recipient_first_name?: string;
  payment_reference: string;
  payment_amount_formatted: string;
  payment_status_display: string;
}

export interface PaymentFailedEmailProps {
  payload: CanonicalEmailPayload;
}

export const PaymentFailedEmail: React.FC<PaymentFailedEmailProps> = ({ payload }) => {
  const data = payload.eventData as PaymentFailedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Payment or invoice', value: data?.payment_reference || 'Unknown' },
    { label: 'Amount and status', value: `${data?.payment_amount_formatted || '$0.00'} — ${data?.payment_status_display || 'FAILED'}` },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Action required: Your payment was not completed"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, This did not complete successfully: payment.`}
      primaryCtaText="Update payment"
      primaryCtaLink={`https://zoikonex.com/payments/update?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select <strong>Update payment</strong> to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PaymentFailedEmail;

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
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #ef4444',
};
