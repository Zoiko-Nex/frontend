import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface SlaBreachData {
  recipient_first_name?: string;
  sla_metric_display: string;
  breach_threshold_display: string;
  current_value_display: string;
  partner_organisation_display: string;
}

export interface SlaBreachEmailProps {
  payload: CanonicalEmailPayload;
}

export const SlaBreachEmail: React.FC<SlaBreachEmailProps> = ({ payload }) => {
  const data = payload.eventData as SlaBreachData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'SLA metric', value: data?.sla_metric_display || 'Unknown' },
    { label: 'Threshold', value: data?.breach_threshold_display || 'See SLA agreement' },
    { label: 'Current value', value: data?.current_value_display || 'See SLA report' },
    { label: 'Partner', value: data?.partner_organisation_display || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="SLA breach notice on your partner account"
      preheader="An SLA threshold has been breached. Immediate review is required."
      openingText={`Hello ${firstName}, An SLA breach has been detected on your ZoikoNex partner agreement.`}
      primaryCtaText="View SLA report"
      primaryCtaLink={`https://zoikonex.com/partners/sla?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View SLA report</strong> to review the breach details and available remediation steps.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default SlaBreachEmail;

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
