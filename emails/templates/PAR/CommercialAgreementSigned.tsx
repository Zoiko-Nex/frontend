import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface CommercialAgreementSignedData {
  recipient_first_name?: string;
  partner_display_name?: string;
  partner_reference_period?: string;
}

export interface CommercialAgreementSignedEmailProps {
  payload: CanonicalEmailPayload;
}

export const CommercialAgreementSignedEmail: React.FC<CommercialAgreementSignedEmailProps> = ({ payload }) => {
  const data = payload.eventData as CommercialAgreementSignedData;
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
      subject="Partner agreement completed"
      preheader="A key ZoikoNex lifecycle milestone has been completed."
      openingText={`Hello ${firstName}, This email relates to commercial agreement signed.`}
      primaryCtaText="View agreement"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select View agreement to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default CommercialAgreementSignedEmail;

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
