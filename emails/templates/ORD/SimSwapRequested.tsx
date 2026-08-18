import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SimSwapRequestedData {
  recipient_first_name?: string;
  tenant_display_name?: string;
  order_id?: string;
  environment_name?: string;
  [key: string]: any;
}

export interface SimSwapRequestedEmailProps {
  payload: CanonicalEmailPayload;
}

export const SimSwapRequestedEmail: React.FC<SimSwapRequestedEmailProps> = ({ payload }) => {
  const data = (payload.eventData || {}) as SimSwapRequestedData;
  const firstName = data.recipient_first_name || 'there';

  const facts = [
    { label: 'Order', value: data.order_id || data.tenant_display_name || 'Authoritative Record' },
    { label: 'Environment', value: data.environment_name || 'Production' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your SIM swap request was received"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to sim swap requested.`}
      primaryCtaText="Review request"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review request to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or 
complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default SimSwapRequestedEmail;

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
  backgroundColor: '#f8fafc',
  borderLeft: '4px solid #0052FF',
};
