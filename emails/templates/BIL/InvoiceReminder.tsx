import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface InvoiceReminderData {
  recipient_first_name?: string;
  invoice_reference: string;
  invoice_amount_formatted: string;
  invoice_due_date_display: string;
  tenant_display_name: string;
  [key: string]: any;
}

export interface InvoiceReminderEmailProps {
  payload: CanonicalEmailPayload;
}

export const InvoiceReminderEmail: React.FC<InvoiceReminderEmailProps> = ({ payload }) => {
  const data = payload.eventData as InvoiceReminderData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Invoice', value: data?.invoice_reference || 'Unknown' },
    { label: 'Amount due', value: data?.invoice_amount_formatted || '$0.00' },
    { label: 'Due date', value: data?.invoice_due_date_display || 'See invoice' },
    { label: 'Tenant', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Payment reminder: Invoice due soon"
      preheader="Your invoice payment is due. Review and pay to avoid service interruption."
      openingText={`Hello ${firstName}, This is a reminder that a payment is due on your ZoikoNex account.`}
      primaryCtaText="Pay invoice"
      primaryCtaLink={`https://zoikonex.com/billing/pay?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Pay invoice</strong> to review the authoritative record and complete payment before the due date.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default InvoiceReminderEmail;

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
