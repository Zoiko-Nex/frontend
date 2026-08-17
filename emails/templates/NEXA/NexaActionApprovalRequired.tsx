import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface NexaActionApprovalRequiredData {
  recipient_first_name?: string;
  nexa_reference?: string;
  nexa_governance_summary?: string;
}

export interface NexaActionApprovalRequiredEmailProps {
  payload: CanonicalEmailPayload;
}

export const NexaActionApprovalRequiredEmail: React.FC<NexaActionApprovalRequiredEmailProps> = ({ payload }) => {
  const data = payload.eventData as NexaActionApprovalRequiredData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Nexa request or recommendation', value: payload.eventData?.nexa_reference || 'Unknown' },
    { label: 'Human approver or policy', value: payload.eventData?.nexa_governance_summary || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Approval required: Nexa proposed an action"
      preheader="Review the event details and any next step in ZoikoNex."
      openingText={`Hello ${firstName}, Your action is required for: nexa action approval.`}
      primaryCtaText="Review action"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Review action to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Nexa is advisory and governed. Material actions require the configured human approval, policy and audit controls;  this email is not itself authorization to execute an action.
      </Text>
    </CanonicalLayout>
  );
};

export default NexaActionApprovalRequiredEmail;

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
