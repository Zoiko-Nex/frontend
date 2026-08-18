import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface CustomerProfileUpdatedData {
  recipient_first_name?: string;
  customer_masked_account_reference?: string;
  brand_display_name?: string;
  [key: string]: any;
}

export interface CustomerProfileUpdatedEmailProps {
  payload: CanonicalEmailPayload;
}

export const CustomerProfileUpdatedEmail: React.FC<CustomerProfileUpdatedEmailProps> = ({ payload }) => {
  const data = payload.eventData as CustomerProfileUpdatedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: payload.eventData?.customer_masked_account_reference || 'Unknown' },
    { label: 'Brand', value: payload.eventData?.brand_display_name || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your account details were updated"
      preheader="Important information about your account, service or configuration."
      openingText={`Hello ${firstName}, This has been updated: customer profile.`}
      primaryCtaText="Review account"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Review account to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or  complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default CustomerProfileUpdatedEmail;

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
