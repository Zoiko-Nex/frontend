import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface InvoicePaidData {
  recipient_first_name?: string;
  invoice_reference: string;
  invoice_amount_formatted: string;
  payment_method_display: string;
  tenant_display_name: string;
  [key: string]: any;
}

export interface InvoicePaidEmailProps {
  payload: CanonicalEmailPayload;
}

export const InvoicePaidEmail: React.FC<InvoicePaidEmailProps> = ({ payload }) => {
  const data = payload.eventData as InvoicePaidData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Invoice', value: data?.invoice_reference || 'Unknown' },
    { label: 'Amount paid', value: data?.invoice_amount_formatted || '$0.00' },
    { label: 'Payment method', value: data?.payment_method_display || 'Unknown' },
    { label: 'Tenant', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Payment confirmed: Invoice settled"
      preheader="Your invoice payment has been received and confirmed."
      openingText={`Hello ${firstName}, Payment for your ZoikoNex invoice has been successfully received.`}
      primaryCtaText="View invoice"
      primaryCtaLink={`https://zoikonex.com/billing/invoices?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View invoice</strong> to review the authoritative payment record and download your receipt.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default InvoicePaidEmail;

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
