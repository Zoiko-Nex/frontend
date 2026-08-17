import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SubscriptionPlanChangedData {
  recipient_first_name?: string;
  subscription_reference?: string;
  subscription_effective_date?: string;
}

export interface SubscriptionPlanChangedEmailProps {
  payload: CanonicalEmailPayload;
}

export const SubscriptionPlanChangedEmail: React.FC<SubscriptionPlanChangedEmailProps> = ({ payload }) => {
  const data = payload.eventData as SubscriptionPlanChangedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Agreement or subscription', value: payload.eventData?.subscription_reference || 'Unknown' },
    { label: 'Effective or renewal date', value: payload.eventData?.subscription_effective_date || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex subscription plan changed"
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This has changed: subscription plan.`}
      primaryCtaText="Review plan"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review plan to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default SubscriptionPlanChangedEmail;

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
