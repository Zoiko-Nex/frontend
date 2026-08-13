import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ServiceRestrictionData {
  recipient_first_name?: string;
  service_name_display: string;
  restriction_reason_display: string;
  tenant_display_name: string;
}

export interface ServiceRestrictionEmailProps {
  payload: CanonicalEmailPayload;
}

export const ServiceRestrictionEmail: React.FC<ServiceRestrictionEmailProps> = ({ payload }) => {
  const data = payload.eventData as ServiceRestrictionData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Service', value: data?.service_name_display || 'Unknown' },
    { label: 'Tenant', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Reason', value: data?.restriction_reason_display || 'Policy compliance' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Service access has been restricted on your account"
      preheader="A service restriction is now active. Review details and contact support."
      openingText={`Hello ${firstName}, Access to a service on your ZoikoNex account has been restricted.`}
      primaryCtaText="Contact support"
      primaryCtaLink={`https://zoikonex.com/support?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Contact support</strong> to review the authoritative record and available next steps to restore access.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default ServiceRestrictionEmail;

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
