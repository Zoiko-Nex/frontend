import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface RegulatorySubmissionRejectedData {
  recipient_first_name?: string;
  compliance_jurisdiction?: string;
  compliance_effective_date?: string;
}

export interface RegulatorySubmissionRejectedEmailProps {
  payload: CanonicalEmailPayload;
}

export const RegulatorySubmissionRejectedEmail: React.FC<RegulatorySubmissionRejectedEmailProps> = ({ payload }) => {
  const data = payload.eventData as RegulatorySubmissionRejectedData;
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
      subject="Action required: Regulatory submission was not accepted"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, This was not approved: regulatory submission.`}
      primaryCtaText="Resolve submission"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Resolve submission to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default RegulatorySubmissionRejectedEmail;

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
