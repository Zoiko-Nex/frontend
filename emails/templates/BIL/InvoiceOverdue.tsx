import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface InvoiceOverdueData {
  recipient_first_name?: string;
  invoice_reference: string;
  invoice_amount_formatted: string;
  overdue_days: number;
  tenant_display_name: string;
}

export interface InvoiceOverdueEmailProps {
  payload: CanonicalEmailPayload;
}

export const InvoiceOverdueEmail: React.FC<InvoiceOverdueEmailProps> = ({ payload }) => {
  const data = payload.eventData as InvoiceOverdueData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Invoice', value: data?.invoice_reference || 'Unknown' },
    { label: 'Amount overdue', value: data?.invoice_amount_formatted || '$0.00' },
    { label: 'Days overdue', value: `${data?.overdue_days || 1} day(s)` },
    { label: 'Tenant', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Action required: Overdue invoice on your account"
      preheader="Your invoice is overdue. Immediate payment is required to avoid service disruption."
      openingText={`Hello ${firstName}, An invoice on your ZoikoNex account is now overdue.`}
      primaryCtaText="Pay now"
      primaryCtaLink={`https://zoikonex.com/billing/pay?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Pay now</strong> to settle the overdue amount immediately. Continued non-payment may result in service suspension.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default InvoiceOverdueEmail;

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
