import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TrialEndingData {
  recipient_first_name?: string;
  prospect_organization_name?: string;
  prospect_contact_name?: string;
  [key: string]: any;
}

export interface TrialEndingEmailProps {
  payload: CanonicalEmailPayload;
}

export const TrialEndingEmail: React.FC<TrialEndingEmailProps> = ({ payload }) => {
  const data = payload.eventData as TrialEndingData;
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
      subject="Your ZoikoNex evaluation ends soon"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to trial ending.`}
      primaryCtaText="Review evaluation"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review evaluation to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default TrialEndingEmail;

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
