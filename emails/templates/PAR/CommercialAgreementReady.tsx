import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface CommercialAgreementReadyData {
  recipient_first_name?: string;
  partner_display_name?: string;
  partner_reference_period?: string;
}

export interface CommercialAgreementReadyEmailProps {
  payload: CanonicalEmailPayload;
}

export const CommercialAgreementReadyEmail: React.FC<CommercialAgreementReadyEmailProps> = ({ payload }) => {
  const data = payload.eventData as CommercialAgreementReadyData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Partner', value: payload.eventData?.partner_display_name || 'Unknown' },
    { label: 'Agreement or settlement period', value: payload.eventData?.partner_reference_period || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your partner agreement is ready for review"
      preheader="Review the event details and any next step in ZoikoNex."
      openingText={`Hello ${firstName}, This is ready: commercial agreement.`}
      primaryCtaText="Review agreement"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Review agreement to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default CommercialAgreementReadyEmail;

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
