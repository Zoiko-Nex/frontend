import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TenantWelcomeData {
  recipient_first_name?: string;
  tenant_display_name: string;
  tenant_subdomain_display: string;
  admin_masked_email: string;
}

export interface TenantWelcomeEmailProps {
  payload: CanonicalEmailPayload;
}

export const TenantWelcomeEmail: React.FC<TenantWelcomeEmailProps> = ({ payload }) => {
  const data = payload.eventData as TenantWelcomeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Subdomain', value: data?.tenant_subdomain_display || 'See portal' },
    { label: 'Primary admin', value: data?.admin_masked_email || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex tenant account is ready"
      preheader="Your tenant has been provisioned. Complete setup to begin."
      openingText={`Hello ${firstName}, Your ZoikoNex tenant account has been successfully provisioned.`}
      primaryCtaText="Complete tenant setup"
      primaryCtaLink={`https://zoikonex.com/tenant/setup?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Complete tenant setup</strong> to configure your organisation settings, invite users and activate services.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default TenantWelcomeEmail;

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
