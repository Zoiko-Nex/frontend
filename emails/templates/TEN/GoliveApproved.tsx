import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface GoliveApprovedData {
  recipient_first_name?: string;
  tenant_display_name?: string;
  order_id?: string;
  environment_name?: string;
  [key: string]: any;
}

export interface GoliveApprovedEmailProps {
  payload: CanonicalEmailPayload;
}

export const GoliveApprovedEmail: React.FC<GoliveApprovedEmailProps> = ({ payload }) => {
  const data = (payload.eventData || {}) as GoliveApprovedData;
  const firstName = data.recipient_first_name || 'there';

  const facts = [
    { label: 'Tenant', value: data.order_id || data.tenant_display_name || 'Authoritative Record' },
    { label: 'Environment', value: data.environment_name || 'Production' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex production launch is approved"
      preheader="A key ZoikoNex lifecycle milestone has been completed."
      openingText={`Hello ${firstName}, This has been approved: go-live.`}
      primaryCtaText="Review launch plan"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review launch plan to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default GoliveApprovedEmail;

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
