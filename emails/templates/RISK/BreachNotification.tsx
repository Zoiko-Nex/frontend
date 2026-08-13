import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface BreachNotificationData {
  recipient_first_name?: string;
  user_masked_email: string;
  affected_data_categories: string;
  tenant_display_name: string;
}

export interface BreachNotificationEmailProps {
  payload: CanonicalEmailPayload;
}

export const BreachNotificationEmail: React.FC<BreachNotificationEmailProps> = ({ payload }) => {
  const data = payload.eventData as BreachNotificationData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: data?.user_masked_email || 'Unknown' },
    { label: 'Tenant', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Affected data', value: data?.affected_data_categories || 'See security advisory' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Important: Security breach notification"
      preheader="Your data may have been affected. Review details and take immediate action."
      openingText={`Hello ${firstName}, We are writing to notify you of a security incident that may have affected your ZoikoNex account.`}
      primaryCtaText="View security advisory"
      primaryCtaLink={`https://zoikonex.com/security/advisory?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View security advisory</strong> to review the full incident report and recommended protective actions.
      </Text>

      <Text style={protectionCopy}>
        Reset your password immediately. Do not share this notification or any account credentials. Contact support if you detect any unauthorised activity.
      </Text>
    </CanonicalLayout>
  );
};

export default BreachNotificationEmail;

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
