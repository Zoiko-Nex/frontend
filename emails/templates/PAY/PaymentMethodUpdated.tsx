import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PaymentMethodUpdatedData {
  recipient_first_name?: string;
  payment_reference?: string;
  payment_amount_formatted?: string;
}

export interface PaymentMethodUpdatedEmailProps {
  payload: CanonicalEmailPayload;
}

export const PaymentMethodUpdatedEmail: React.FC<PaymentMethodUpdatedEmailProps> = ({ payload }) => {
  const data = payload.eventData as PaymentMethodUpdatedData;
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
      subject="Your payment method was updated"
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This has been updated: payment method.`}
      primaryCtaText="Review billing settings"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review billing settings to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or  complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PaymentMethodUpdatedEmail;

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
