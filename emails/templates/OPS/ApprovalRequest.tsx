import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ApprovalRequestData {
  recipient_first_name?: string;
  operation_display_name?: string;
  operation_status_display?: string;
}

export interface ApprovalRequestEmailProps {
  payload: CanonicalEmailPayload;
}

export const ApprovalRequestEmail: React.FC<ApprovalRequestEmailProps> = ({ payload }) => {
  const data = payload.eventData as ApprovalRequestData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Job, report or workflow', value: payload.eventData?.operation_display_name || 'Unknown' },
    { label: 'Status', value: payload.eventData?.operation_status_display || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Approval required in ZoikoNex"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to approval request.`}
      primaryCtaText="Review request"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Review request to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default ApprovalRequestEmail;

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
