import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface CustomerActionRequiredData {
  recipient_first_name?: string;
  service_masked_reference?: string;
  case_id?: string;
  usage_summary?: string;
  case_status_display?: string;
  environment_name?: string;
  [key: string]: any;
}

export interface CustomerActionRequiredEmailProps {
  payload: CanonicalEmailPayload;
}

export const CustomerActionRequiredEmail: React.FC<CustomerActionRequiredEmailProps> = ({ payload }) => {
  const data = (payload.eventData || {}) as CustomerActionRequiredData;
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
      subject={`Action required for support case ${data.case_id || 'CAS-88219'}`}
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, Your action is required for: customer action.`}
      primaryCtaText="Respond to case"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Respond to case to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default CustomerActionRequiredEmail;

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
