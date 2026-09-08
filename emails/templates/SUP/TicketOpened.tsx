import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TicketOpenedData {
  recipient_first_name?: string;
  ticket_reference: string;
  ticket_subject_display: string;
  ticket_priority_display: string;
}

export interface TicketOpenedEmailProps {
  payload: CanonicalEmailPayload;
}

export const TicketOpenedEmail: React.FC<TicketOpenedEmailProps> = ({ payload }) => {
  const data = payload.eventData as TicketOpenedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Ticket', value: data?.ticket_reference || 'Unknown' },
    { label: 'Subject', value: data?.ticket_subject_display || 'Unknown' },
    { label: 'Priority', value: data?.ticket_priority_display || 'Normal' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your support ticket has been opened"
      preheader="We've received your request and a case has been created."
      openingText={`Hello ${firstName}, Your ZoikoNex support ticket has been received and a case has been opened.`}
      primaryCtaText="View ticket"
      primaryCtaLink={`https://zoikonex.com/support/tickets?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View ticket</strong> to track your case progress, add information or upload attachments.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default TicketOpenedEmail;

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
