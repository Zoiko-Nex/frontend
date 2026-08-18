import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface EscalationNoticeData {
  recipient_first_name?: string;
  ticket_reference: string;
  ticket_subject_display: string;
  escalation_level_display: string;
  assigned_team_display: string;
  [key: string]: any;
}

export interface EscalationNoticeEmailProps {
  payload: CanonicalEmailPayload;
}

export const EscalationNoticeEmail: React.FC<EscalationNoticeEmailProps> = ({ payload }) => {
  const data = payload.eventData as EscalationNoticeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Ticket', value: data?.ticket_reference || 'Unknown' },
    { label: 'Subject', value: data?.ticket_subject_display || 'Unknown' },
    { label: 'Escalation level', value: data?.escalation_level_display || 'L2' },
    { label: 'Assigned to', value: data?.assigned_team_display || 'Specialist team' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your support case has been escalated"
      preheader="Your ticket has been assigned to a specialist team for priority handling."
      openingText={`Hello ${firstName}, Your ZoikoNex support case has been escalated for priority resolution.`}
      primaryCtaText="View ticket"
      primaryCtaLink={`https://zoikonex.com/support/tickets?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View ticket</strong> to track progress. A specialist will be in contact with you as a priority.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default EscalationNoticeEmail;

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
