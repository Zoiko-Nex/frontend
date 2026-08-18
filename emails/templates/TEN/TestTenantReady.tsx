import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface TestTenantReadyData {
  recipient_first_name?: string;
  tenant_display_name?: string;
  order_id?: string;
  environment_name?: string;
  [key: string]: any;
}

export interface TestTenantReadyEmailProps {
  payload: CanonicalEmailPayload;
}

export const TestTenantReadyEmail: React.FC<TestTenantReadyEmailProps> = ({ payload }) => {
  const data = (payload.eventData || {}) as TestTenantReadyData;
  const firstName = data.recipient_first_name || 'there';

  const facts = [
    { label: 'Tenant', value: data.order_id || data.tenant_display_name || 'Authoritative Record' },
    { label: 'Environment', value: data.environment_name || 'Production' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex test tenant is ready"
      preheader="Confirmation, key details and the next available action."
      openingText={`Hello ${firstName}, This is ready: test tenant.`}
      primaryCtaText="Open test tenant"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        You can select Open test tenant to review the authoritative record and available next steps.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default TestTenantReadyEmail;

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
  backgroundColor: '#f8fafc',
  borderLeft: '4px solid #0052FF',
};
