import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface OnboardingWelcomeData {
  recipient_first_name?: string;
  tenant_display_name: string;
  plan_name_display: string;
}

export interface OnboardingWelcomeEmailProps {
  payload: CanonicalEmailPayload;
}

export const OnboardingWelcomeEmail: React.FC<OnboardingWelcomeEmailProps> = ({ payload }) => {
  const data = payload.eventData as OnboardingWelcomeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Plan', value: data?.plan_name_display || 'ZoikoNex' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Welcome to ZoikoNex — let's get started"
      preheader="Your account is ready. Here's everything you need to begin."
      openingText={`Hello ${firstName}, Welcome to ZoikoNex. Your account has been created and is ready to use.`}
      primaryCtaText="Get started"
      primaryCtaLink={`https://zoikonex.com/onboarding?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Get started</strong> to complete your onboarding steps and begin using the platform.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default OnboardingWelcomeEmail;

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
