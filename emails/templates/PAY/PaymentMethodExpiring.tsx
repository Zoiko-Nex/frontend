import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PaymentMethodExpiringData {
  recipient_first_name?: string;
  payment_reference?: string;
  payment_amount_formatted?: string;
}

export interface PaymentMethodExpiringEmailProps {
  payload: CanonicalEmailPayload;
}

export const PaymentMethodExpiringEmail: React.FC<PaymentMethodExpiringEmailProps> = ({ payload }) => {
  const data = payload.eventData as PaymentMethodExpiringData;
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
      subject="Your payment method expires soon"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, This is approaching expiry: payment method.`}
      primaryCtaText="Update payment method"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Update payment method to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or  complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PaymentMethodExpiringEmail;

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
