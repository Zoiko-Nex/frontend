import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface IncidentDetectedData {
  recipient_first_name?: string;
  case_id: string;
  case_status_display: string;
}

export interface IncidentDetectedEmailProps {
  payload: CanonicalEmailPayload;
}

export const IncidentDetectedEmail: React.FC<IncidentDetectedEmailProps> = ({ payload }) => {
  const data = payload.eventData as IncidentDetectedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Case, incident or maintenance reference', value: data?.case_id || 'INC-8819' },
    { label: 'Current status', value: data?.case_status_display || 'INVESTIGATING' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Service incident affecting ZoikoNex"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, ZoikoNex detected: incident.`}
      primaryCtaText="View status"
      primaryCtaLink={`https://status.zoikonex.com/incidents?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select <strong>View status</strong> to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default IncidentDetectedEmail;

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
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #ef4444',
};
