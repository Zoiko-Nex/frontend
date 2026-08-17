import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AccountOwnershipTransferCompletedData {
  recipient_first_name?: string;
  customer_masked_account_reference?: string;
  brand_display_name?: string;
}

export interface AccountOwnershipTransferCompletedEmailProps {
  payload: CanonicalEmailPayload;
}

export const AccountOwnershipTransferCompletedEmail: React.FC<AccountOwnershipTransferCompletedEmailProps> = ({ payload }) => {
  const data = payload.eventData as AccountOwnershipTransferCompletedData;
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
      subject="Account ownership transfer completed"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This has been completed: account ownership transfer.`}
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

export default AccountOwnershipTransferCompletedEmail;

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
