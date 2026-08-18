import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AutopayEnabledData {
  recipient_first_name?: string;
  payment_reference?: string;
  payment_amount_formatted?: string;
  [key: string]: any;
}

export interface AutopayEnabledEmailProps {
  payload: CanonicalEmailPayload;
}

export const AutopayEnabledEmail: React.FC<AutopayEnabledEmailProps> = ({ payload }) => {
  const data = payload.eventData as AutopayEnabledData;
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
      subject="Autopay is now enabled"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This is now enabled: autopay.`}
      primaryCtaText="Review autopay"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review autopay to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or  complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default AutopayEnabledEmail;

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
