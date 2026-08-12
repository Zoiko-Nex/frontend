import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TermsUpdatedData {
  recipient_first_name?: string;
  compliance_jurisdiction: string;
  compliance_effective_date: string;
}

export interface TermsUpdatedEmailProps {
  payload: CanonicalEmailPayload;
}

export const TermsUpdatedEmail: React.FC<TermsUpdatedEmailProps> = ({ payload }) => {
  const data = payload.eventData as TermsUpdatedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Jurisdiction', value: data?.compliance_jurisdiction || payload.localizedValues.jurisdiction_code },
    { label: 'Effective or response date', value: data?.compliance_effective_date || payload.localizedValues.date_local },
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
      primaryCtaLink={`https://zoikonex.com/terms?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>Review terms</strong> to review the authoritative record and available next steps.
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
  backgroundColor: '#f3f4f6',
  borderLeft: '4px solid #9ca3af',
};
