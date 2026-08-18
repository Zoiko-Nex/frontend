import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface RoleChangedData {
  recipient_first_name?: string;
  user_display_name?: string;
  access_scope_summary?: string;
  [key: string]: any;
}

export interface RoleChangedEmailProps {
  payload: CanonicalEmailPayload;
}

export const RoleChangedEmail: React.FC<RoleChangedEmailProps> = ({ payload }) => {
  const data = payload.eventData as RoleChangedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'User', value: payload.eventData?.user_display_name || 'Unknown' },
    { label: 'Access scope', value: payload.eventData?.access_scope_summary || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex role has changed"
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This has changed: role.`}
      primaryCtaText="Review access"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review access to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        If you did not expect this activity, do not forward this email or share credentials. Use the verified ZoikoNex sign-in  page or contact your authorized administrator immediately.
      </Text>
    </CanonicalLayout>
  );
};

export default RoleChangedEmail;

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
