import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PlatformServiceSuspensionForNonpaymentData {
  recipient_first_name?: string;
  subscription_reference?: string;
  subscription_effective_date?: string;
}

export interface PlatformServiceSuspensionForNonpaymentEmailProps {
  payload: CanonicalEmailPayload;
}

export const PlatformServiceSuspensionForNonpaymentEmail: React.FC<PlatformServiceSuspensionForNonpaymentEmailProps> = ({ payload }) => {
  const data = payload.eventData as PlatformServiceSuspensionForNonpaymentData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Agreement or subscription', value: payload.eventData?.subscription_reference || 'Unknown' },
    { label: 'Effective or renewal date', value: payload.eventData?.subscription_effective_date || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Critical: ZoikoNex service suspension scheduled"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, This email relates to platform service suspension for nonpayment.`}
      primaryCtaText="Resolve account"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Resolve account to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default PlatformServiceSuspensionForNonpaymentEmail;

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
