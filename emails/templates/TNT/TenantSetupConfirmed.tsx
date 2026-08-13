import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TenantSetupConfirmedData {
  recipient_first_name?: string;
  tenant_display_name: string;
  services_activated_display: string;
  user_count_display: string;
}

export interface TenantSetupConfirmedEmailProps {
  payload: CanonicalEmailPayload;
}

export const TenantSetupConfirmedEmail: React.FC<TenantSetupConfirmedEmailProps> = ({ payload }) => {
  const data = payload.eventData as TenantSetupConfirmedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Services activated', value: data?.services_activated_display || 'See portal' },
    { label: 'Users provisioned', value: data?.user_count_display || 'See portal' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Tenant setup confirmed — your account is fully active"
      preheader="Setup is complete. Your ZoikoNex tenant is now fully operational."
      openingText={`Hello ${firstName}, Your ZoikoNex tenant setup has been confirmed and all services are now active.`}
      primaryCtaText="Go to dashboard"
      primaryCtaLink={`https://zoikonex.com/dashboard?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Go to dashboard</strong> to begin managing your tenant, users and services.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default TenantSetupConfirmedEmail;

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
