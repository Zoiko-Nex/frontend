import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface RealTimeChargingFallbackActivatedData {
  recipient_first_name?: string;
  service_masked_reference?: string;
  usage_summary?: string;
  environment_name?: string;
  [key: string]: any;
}

export interface RealTimeChargingFallbackActivatedEmailProps {
  payload: CanonicalEmailPayload;
}

export const RealTimeChargingFallbackActivatedEmail: React.FC<RealTimeChargingFallbackActivatedEmailProps> = ({ payload }) => {
  const data = (payload.eventData || {}) as RealTimeChargingFallbackActivatedData;
  const firstName = data.recipient_first_name || 'there';

  const facts = [
    { label: 'Line or account', value: data.service_masked_reference || 'Authoritative Record' },
    { label: 'Usage status', value: data.usage_summary || 'Charging Fallback Mode Active' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Operational alert: Charging fallback mode activated"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, This is now active: real-time charging fallback.`}
      primaryCtaText="Review incident"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Review incident to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default RealTimeChargingFallbackActivatedEmail;

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
