import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface DemoRequestReceivedData {
  recipient_first_name?: string;
  prospect_organization_name?: string;
  prospect_contact_name?: string;
}

export interface DemoRequestReceivedEmailProps {
  payload: CanonicalEmailPayload;
}

export const DemoRequestReceivedEmail: React.FC<DemoRequestReceivedEmailProps> = ({ payload }) => {
  const data = payload.eventData as DemoRequestReceivedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organization', value: payload.eventData?.prospect_organization_name || 'Unknown' },
    { label: 'Account contact', value: payload.eventData?.prospect_contact_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="We received your ZoikoNex demo request"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, We have received demo request.`}
      primaryCtaText="Review next steps"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review next steps to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default DemoRequestReceivedEmail;

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
