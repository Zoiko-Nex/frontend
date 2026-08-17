import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ConsentChangedData {
  recipient_first_name?: string;
  compliance_jurisdiction?: string;
  compliance_effective_date?: string;
}

export interface ConsentChangedEmailProps {
  payload: CanonicalEmailPayload;
}

export const ConsentChangedEmail: React.FC<ConsentChangedEmailProps> = ({ payload }) => {
  const data = payload.eventData as ConsentChangedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Jurisdiction', value: payload.eventData?.compliance_jurisdiction || 'Unknown' },
    { label: 'Effective or response date', value: payload.eventData?.compliance_effective_date || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your consent preferences were changed"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This has changed: consent.`}
      primaryCtaText="Review preferences"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review preferences to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default ConsentChangedEmail;

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
