import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SubscriberWelcomeData {
  recipient_first_name?: string;
  customer_masked_account_reference: string;
  brand_display_name: string;
}

export interface SubscriberWelcomeEmailProps {
  payload: CanonicalEmailPayload;
}

export const SubscriberWelcomeEmail: React.FC<SubscriberWelcomeEmailProps> = ({ payload }) => {
  const data = payload.eventData as SubscriberWelcomeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: data?.customer_masked_account_reference || 'Unknown' },
    { label: 'Brand', value: data?.brand_display_name || payload.rendering.brand.display_name },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Welcome — your account is ready"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to subscriber welcome.`}
      primaryCtaText="Open account"
      primaryCtaLink={`https://zoikonex.com/account?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>Open account</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default SubscriberWelcomeEmail;

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
