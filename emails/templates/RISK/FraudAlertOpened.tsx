import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface FraudAlertOpenedData {
  recipient_first_name?: string;
  case_id: string;
  case_severity: string;
}

export interface FraudAlertOpenedEmailProps {
  payload: CanonicalEmailPayload;
}

export const FraudAlertOpenedEmail: React.FC<FraudAlertOpenedEmailProps> = ({ payload }) => {
  const data = payload.eventData as FraudAlertOpenedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Case', value: data?.case_id || 'CASE-RISK-001' },
    { label: 'Severity', value: data?.case_severity || 'HIGH' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Fraud alert opened in ZoikoNex"
      preheader="Review the details, impact and required next step without delay."
      openingText={`Hello ${firstName}, This email relates to fraud alert opened.`}
      primaryCtaText="Investigate alert"
      primaryCtaLink={`https://zoikonex.com/risk/cases?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select <strong>Investigate alert</strong> to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        If you did not expect this activity, do not forward this email or share credentials. Use the verified ZoikoNex sign-in page or contact your authorized administrator immediately.
      </Text>
    </CanonicalLayout>
  );
};

export default FraudAlertOpenedEmail;

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
