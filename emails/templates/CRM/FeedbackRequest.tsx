import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface FeedbackRequestData {
  recipient_first_name?: string;
  ticket_reference: string;
  agent_name_display: string;
  survey_expiry_display: string;
}

export interface FeedbackRequestEmailProps {
  payload: CanonicalEmailPayload;
}

export const FeedbackRequestEmail: React.FC<FeedbackRequestEmailProps> = ({ payload }) => {
  const data = payload.eventData as FeedbackRequestData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Ticket', value: data?.ticket_reference || 'Unknown' },
    { label: 'Handled by', value: data?.agent_name_display || 'Support team' },
    { label: 'Survey closes', value: data?.survey_expiry_display || '7 days from issue' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="How did we do? Share your feedback"
      preheader="Tell us about your recent support experience. It takes less than a minute."
      openingText={`Hello ${firstName}, We'd love to hear about your recent ZoikoNex support experience.`}
      primaryCtaText="Share feedback"
      primaryCtaLink={`https://zoikonex.com/support/feedback?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Share feedback</strong> to complete a short survey. Your response helps us improve our service.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default FeedbackRequestEmail;

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
  backgroundColor: '#f0f9ff',
  borderLeft: '4px solid #0ea5e9',
};
