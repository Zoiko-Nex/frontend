import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SupportCaseCreatedData {
  recipient_first_name?: string;
  case_id: string;
  case_status_display: string;
}

export interface SupportCaseCreatedEmailProps {
  payload: CanonicalEmailPayload;
}

export const SupportCaseCreatedEmail: React.FC<SupportCaseCreatedEmailProps> = ({ payload }) => {
  const data = payload.eventData as SupportCaseCreatedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Case, incident or maintenance reference', value: data?.case_id || 'CASE-SUP-101' },
    { label: 'Current status', value: data?.case_status_display || 'OPEN' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`Support case ${data?.case_id || ''} created`}
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This has been created: support case.`}
      primaryCtaText="View case"
      primaryCtaLink={`https://zoikonex.com/support/case?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>View case</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default SupportCaseCreatedEmail;

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
