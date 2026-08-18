import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface CommercialHandoffToOnboardingData {
  recipient_first_name?: string;
  prospect_organization_name: string;
  prospect_contact_name: string;
  [key: string]: any;
}

export interface CommercialHandoffToOnboardingEmailProps {
  payload: CanonicalEmailPayload;
}

export const CommercialHandoffToOnboardingEmail: React.FC<CommercialHandoffToOnboardingEmailProps> = ({ payload }) => {
  const data = payload.eventData as CommercialHandoffToOnboardingData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organization', value: data?.prospect_organization_name || 'Unknown' },
    { label: 'Account contact', value: data?.prospect_contact_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Welcome to ZoikoNex — implementation begins now"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to commercial handoff to onboarding.`}
      primaryCtaText="Open onboarding workspace"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>Open onboarding workspace</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default CommercialHandoffToOnboardingEmail;

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
