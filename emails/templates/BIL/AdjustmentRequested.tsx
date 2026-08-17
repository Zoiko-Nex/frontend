import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AdjustmentRequestedData {
  recipient_first_name?: string;
  billing_document_reference?: string;
  billing_amount_formatted?: string;
}

export interface AdjustmentRequestedEmailProps {
  payload: CanonicalEmailPayload;
}

export const AdjustmentRequestedEmail: React.FC<AdjustmentRequestedEmailProps> = ({ payload }) => {
  const data = payload.eventData as AdjustmentRequestedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Invoice or statement', value: payload.eventData?.billing_document_reference || 'Unknown' },
    { label: 'Amount', value: payload.eventData?.billing_amount_formatted || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="We received your billing adjustment request"
      preheader="Review the event details and any next step in ZoikoNex."
      openingText={`Hello ${firstName}, This email relates to adjustment requested.`}
      primaryCtaText="Track request"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Track request to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or  complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default AdjustmentRequestedEmail;

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
