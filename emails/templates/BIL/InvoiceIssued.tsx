import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface InvoiceIssuedData {
  recipient_first_name?: string;
  billing_document_reference?: string;
  billing_amount_formatted?: string;
  [key: string]: any;
}

export interface InvoiceIssuedEmailProps {
  payload: CanonicalEmailPayload;
}

export const InvoiceIssuedEmail: React.FC<InvoiceIssuedEmailProps> = ({ payload }) => {
  const data = payload.eventData as InvoiceIssuedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Invoice or statement', value: payload.eventData?.billing_document_reference || 'Unknown' },
    { label: 'Amount', value: payload.eventData?.billing_amount_formatted || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`Your invoice ${data.invoice_number || 'INV-2026-08892'} is ready`}
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This has been issued: invoice.`}
      primaryCtaText="View invoice"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select View invoice to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or  complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default InvoiceIssuedEmail;

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
