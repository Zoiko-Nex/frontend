import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PartnerOnboardingData {
  recipient_first_name?: string;
  partner_organisation_display: string;
  partner_tier_display: string;
  onboarding_contact_display: string;
  [key: string]: any;
}

export interface PartnerOnboardingEmailProps {
  payload: CanonicalEmailPayload;
}

export const PartnerOnboardingEmail: React.FC<PartnerOnboardingEmailProps> = ({ payload }) => {
  const data = payload.eventData as PartnerOnboardingData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.partner_organisation_display || 'Unknown' },
    { label: 'Partner tier', value: data?.partner_tier_display || 'Standard' },
    { label: 'Your contact', value: data?.onboarding_contact_display || 'Partner success team' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Welcome to the ZoikoNex Partner Programme"
      preheader="Your partner account is active. Let's get you started."
      openingText={`Hello ${firstName}, Welcome to the ZoikoNex Partner Programme. Your partner account has been activated.`}
      primaryCtaText="Access partner portal"
      primaryCtaLink={`https://zoikonex.com/partners/portal?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Access partner portal</strong> to complete your onboarding steps and access partner resources.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PartnerOnboardingEmail;

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
