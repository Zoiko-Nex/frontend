import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface RenewalReminderData {
  recipient_first_name?: string;
  tenant_display_name: string;
  plan_name_display: string;
  renewal_date_display: string;
  renewal_amount_formatted: string;
}

export interface RenewalReminderEmailProps {
  payload: CanonicalEmailPayload;
}

export const RenewalReminderEmail: React.FC<RenewalReminderEmailProps> = ({ payload }) => {
  const data = payload.eventData as RenewalReminderData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Plan', value: data?.plan_name_display || 'Unknown' },
    { label: 'Renewal date', value: data?.renewal_date_display || 'See billing portal' },
    { label: 'Renewal amount', value: data?.renewal_amount_formatted || 'See billing portal' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex subscription is due for renewal"
      preheader="Renewal is coming up. Review your plan and confirm continuation."
      openingText={`Hello ${firstName}, Your ZoikoNex subscription is scheduled to renew soon.`}
      primaryCtaText="Review subscription"
      primaryCtaLink={`https://zoikonex.com/billing/subscription?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Review subscription</strong> to confirm, modify or cancel your renewal before the date shown above.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default RenewalReminderEmail;

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
