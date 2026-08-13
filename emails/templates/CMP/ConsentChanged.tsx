import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ConsentChangedData {
  recipient_first_name?: string;
  consent_type_display: string;
  consent_action_display: string;
  effective_date_display: string;
}

export interface ConsentChangedEmailProps {
  payload: CanonicalEmailPayload;
}

export const ConsentChangedEmail: React.FC<ConsentChangedEmailProps> = ({ payload }) => {
  const data = payload.eventData as ConsentChangedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Consent type', value: data?.consent_type_display || 'Unknown' },
    { label: 'Action taken', value: data?.consent_action_display || 'Updated' },
    { label: 'Effective date', value: data?.effective_date_display || 'Immediate' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your consent preferences have been updated"
      preheader="A change to your consent settings has been recorded."
      openingText={`Hello ${firstName}, Your consent preferences on your ZoikoNex account have been updated.`}
      primaryCtaText="Review consent settings"
      primaryCtaLink={`https://zoikonex.com/account/consent?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Review consent settings</strong> to view or modify your current preferences at any time.
      </Text>

      <Text style={protectionCopy}>
        If you did not make this change, contact your administrator immediately. For your security, this email does not display full payment credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default ConsentChangedEmail;

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
