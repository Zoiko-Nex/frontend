import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AccountSuspensionData {
  recipient_first_name?: string;
  user_masked_email: string;
  suspension_reason_display: string;
  tenant_display_name: string;
  [key: string]: any;
}

export interface AccountSuspensionEmailProps {
  payload: CanonicalEmailPayload;
}

export const AccountSuspensionEmail: React.FC<AccountSuspensionEmailProps> = ({ payload }) => {
  const data = payload.eventData as AccountSuspensionData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Account', value: data?.user_masked_email || 'Unknown' },
    { label: 'Tenant', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Reason', value: data?.suspension_reason_display || 'Policy violation' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex account has been suspended"
      preheader="Account access has been restricted. Review the details and contact support."
      openingText={`Hello ${firstName}, Access to your ZoikoNex account has been suspended.`}
      primaryCtaText="Contact support"
      primaryCtaLink={`https://zoikonex.com/support?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Contact support</strong> to review the authoritative record and submit an appeal or enquiry.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default AccountSuspensionEmail;

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
