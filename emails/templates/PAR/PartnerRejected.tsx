import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PartnerRejectedData {
  recipient_first_name?: string;
  partner_display_name?: string;
  partner_reference_period?: string;
  [key: string]: any;
}

export interface PartnerRejectedEmailProps {
  payload: CanonicalEmailPayload;
}

export const PartnerRejectedEmail: React.FC<PartnerRejectedEmailProps> = ({ payload }) => {
  const data = payload.eventData as PartnerRejectedData;
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
      subject="Partner onboarding decision"
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This was not approved: partner.`}
      primaryCtaText="Review decision"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review decision to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default PartnerRejectedEmail;

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
