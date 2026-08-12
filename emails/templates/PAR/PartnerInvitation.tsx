import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PartnerInvitationData {
  recipient_first_name?: string;
  partner_display_name: string;
  partner_reference_period: string;
}

export interface PartnerInvitationEmailProps {
  payload: CanonicalEmailPayload;
}

export const PartnerInvitationEmail: React.FC<PartnerInvitationEmailProps> = ({ payload }) => {
  const data = payload.eventData as PartnerInvitationData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Partner', value: data?.partner_display_name || 'Unknown' },
    { label: 'Agreement or settlement period', value: data?.partner_reference_period || '2026-Q3' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="You have been invited to the ZoikoNex partner workspace"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This email relates to partner invitation.`}
      primaryCtaText="Accept invitation"
      primaryCtaLink={`https://zoikonex.com/partner/accept?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select <strong>Accept invitation</strong> to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default PartnerInvitationEmail;

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
