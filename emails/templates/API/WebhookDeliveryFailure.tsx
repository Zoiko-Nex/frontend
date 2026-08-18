import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface WebhookDeliveryFailureData {
  recipient_first_name?: string;
  integration_display_name?: string;
  environment_name?: string;
  [key: string]: any;
}

export interface WebhookDeliveryFailureEmailProps {
  payload: CanonicalEmailPayload;
}

export const WebhookDeliveryFailureEmail: React.FC<WebhookDeliveryFailureEmailProps> = ({ payload }) => {
  const data = payload.eventData as WebhookDeliveryFailureData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Integration', value: payload.eventData?.integration_display_name || 'Unknown' },
    { label: 'Environment', value: payload.eventData?.environment_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Webhook delivery failures detected"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, This email relates to webhook delivery failure.`}
      primaryCtaText="Review deliveries"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Review deliveries to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        If you did not expect this activity, do not forward this email or share credentials. Use the verified ZoikoNex sign-in  page or contact your authorized administrator immediately.
      </Text>
    </CanonicalLayout>
  );
};

export default WebhookDeliveryFailureEmail;

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
