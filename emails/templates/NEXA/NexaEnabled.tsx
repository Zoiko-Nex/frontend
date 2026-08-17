import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface NexaEnabledData {
  recipient_first_name?: string;
  nexa_reference?: string;
  nexa_governance_summary?: string;
}

export interface NexaEnabledEmailProps {
  payload: CanonicalEmailPayload;
}

export const NexaEnabledEmail: React.FC<NexaEnabledEmailProps> = ({ payload }) => {
  const data = payload.eventData as NexaEnabledData;
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
      subject="Nexa is enabled for your ZoikoNex tenant"
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This is now enabled: nexa.`}
      primaryCtaText="Open Nexa"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Open Nexa to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Nexa is advisory and governed. Material actions require the configured human approval, policy and audit controls;  this email is not itself authorization to execute an action.
      </Text>
    </CanonicalLayout>
  );
};

export default NexaEnabledEmail;

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
