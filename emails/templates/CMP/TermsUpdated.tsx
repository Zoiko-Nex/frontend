import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TermsUpdatedData {
  recipient_first_name?: string;
  compliance_jurisdiction?: string;
  compliance_effective_date?: string;
  [key: string]: any;
}

export interface TermsUpdatedEmailProps {
  payload: CanonicalEmailPayload;
}

export const TermsUpdatedEmail: React.FC<TermsUpdatedEmailProps> = ({ payload }) => {
  const data = payload.eventData as TermsUpdatedData;
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
      subject="Important update to the terms that apply to your account"
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This has been updated: terms.`}
      primaryCtaText="Review terms"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review terms to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default TermsUpdatedEmail;

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
