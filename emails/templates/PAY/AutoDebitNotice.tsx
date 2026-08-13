import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AutoDebitNoticeData {
  recipient_first_name?: string;
  debit_amount_formatted: string;
  debit_date_display: string;
  payment_method_display: string;
  invoice_reference: string;
}

export interface AutoDebitNoticeEmailProps {
  payload: CanonicalEmailPayload;
}

export const AutoDebitNoticeEmail: React.FC<AutoDebitNoticeEmailProps> = ({ payload }) => {
  const data = payload.eventData as AutoDebitNoticeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Invoice', value: data?.invoice_reference || 'Unknown' },
    { label: 'Amount', value: data?.debit_amount_formatted || '$0.00' },
    { label: 'Scheduled debit date', value: data?.debit_date_display || 'See billing portal' },
    { label: 'Payment method', value: data?.payment_method_display || 'Default method on file' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Upcoming auto-debit scheduled on your account"
      preheader="A scheduled payment will be collected soon. Review details."
      openingText={`Hello ${firstName}, An automatic payment is scheduled to be collected from your ZoikoNex account.`}
      primaryCtaText="Manage payment methods"
      primaryCtaLink={`https://zoikonex.com/billing/payment-methods?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Manage payment methods</strong> to update your payment details before the scheduled debit date.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default AutoDebitNoticeEmail;

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
