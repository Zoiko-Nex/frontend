import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TicketResolvedData {
  recipient_first_name?: string;
  ticket_reference: string;
  ticket_subject_display: string;
  resolution_summary_display: string;
  [key: string]: any;
}

export interface TicketResolvedEmailProps {
  payload: CanonicalEmailPayload;
}

export const TicketResolvedEmail: React.FC<TicketResolvedEmailProps> = ({ payload }) => {
  const data = payload.eventData as TicketResolvedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Ticket', value: data?.ticket_reference || 'Unknown' },
    { label: 'Subject', value: data?.ticket_subject_display || 'Unknown' },
    { label: 'Resolution', value: data?.resolution_summary_display || 'See ticket for details' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your support ticket has been resolved"
      preheader="Your case has been closed. Review the resolution and share your feedback."
      openingText={`Hello ${firstName}, Your ZoikoNex support ticket has been resolved.`}
      primaryCtaText="View resolution"
      primaryCtaLink={`https://zoikonex.com/support/tickets?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View resolution</strong> to review the full case record. If the issue persists, you can reopen the ticket from the support portal.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default TicketResolvedEmail;

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
  backgroundColor: '#f0fdf4',
  borderLeft: '4px solid #22c55e',
};
