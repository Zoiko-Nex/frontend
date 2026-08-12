import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface EsimReadyData {
  recipient_first_name?: string;
  order_reference: string;
  service_masked_reference: string;
}

export interface EsimReadyEmailProps {
  payload: CanonicalEmailPayload;
}

export const EsimReadyEmail: React.FC<EsimReadyEmailProps> = ({ payload }) => {
  const data = payload.eventData as EsimReadyData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Order or service reference', value: data?.order_reference || 'Unknown' },
    { label: 'Service or line', value: data?.service_masked_reference || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your eSIM is ready to install"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This is ready: esim.`}
      primaryCtaText="Install eSIM"
      primaryCtaLink={`https://zoikonex.com/esim/install?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>Install eSIM</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default EsimReadyEmail;

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
