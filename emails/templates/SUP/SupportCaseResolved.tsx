import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SupportCaseResolvedData {
  recipient_first_name?: string;
  service_masked_reference?: string;
  case_id?: string;
  usage_summary?: string;
  case_status_display?: string;
  environment_name?: string;
  [key: string]: any;
}

export interface SupportCaseResolvedEmailProps {
  payload: CanonicalEmailPayload;
}

export const SupportCaseResolvedEmail: React.FC<SupportCaseResolvedEmailProps> = ({ payload }) => {
  const data = (payload.eventData || {}) as SupportCaseResolvedData;
  const firstName = data.recipient_first_name || 'there';

  const facts = [
    { label: 'Case reference', value: data.service_masked_reference || data.case_id || 'Authoritative Record' },
    { label: 'Status', value: data.usage_summary || data.case_status_display || 'Active' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`Support case ${data.case_id || 'CAS-88219'} has been resolved`}
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This has been resolved: support case.`}
      primaryCtaText="Review resolution"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review resolution to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default SupportCaseResolvedEmail;

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
