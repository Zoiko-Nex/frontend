import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AuditAlertData {
  recipient_first_name?: string;
  audit_event_display: string;
  actor_masked_display: string;
  affected_resource_display: string;
  tenant_display_name: string;
}

export interface AuditAlertEmailProps {
  payload: CanonicalEmailPayload;
}

export const AuditAlertEmail: React.FC<AuditAlertEmailProps> = ({ payload }) => {
  const data = payload.eventData as AuditAlertData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Event', value: data?.audit_event_display || 'Unknown' },
    { label: 'Actor', value: data?.actor_masked_display || 'Unknown' },
    { label: 'Resource', value: data?.affected_resource_display || 'Unknown' },
    { label: 'Tenant', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Compliance audit alert on your account"
      preheader="A compliance-relevant event has been recorded. Review immediately."
      openingText={`Hello ${firstName}, A compliance-relevant event has been detected on your ZoikoNex account.`}
      primaryCtaText="View audit log"
      primaryCtaLink={`https://zoikonex.com/compliance/audit?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View audit log</strong> to review the full compliance event record and take any required action.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default AuditAlertEmail;

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
