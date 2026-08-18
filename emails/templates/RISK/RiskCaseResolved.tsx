import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface RiskCaseResolvedData {
  recipient_first_name?: string;
  case_id?: string;
  case_severity?: string;
  [key: string]: any;
}

export interface RiskCaseResolvedEmailProps {
  payload: CanonicalEmailPayload;
}

export const RiskCaseResolvedEmail: React.FC<RiskCaseResolvedEmailProps> = ({ payload }) => {
  const data = payload.eventData as RiskCaseResolvedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Case', value: payload.eventData?.case_id || 'Unknown' },
    { label: 'Severity', value: payload.eventData?.case_severity || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`Risk case ${data.case_id || 'CAS-88219'} has been resolved`}
      preheader="Review the event details and any next step in ZoikoNex."
      openingText={`Hello ${firstName}, This has been resolved: risk case.`}
      primaryCtaText="Review resolution"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Review resolution to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        If you did not expect this activity, do not forward this email or share credentials. Use the verified ZoikoNex sign-in  page or contact your authorized administrator immediately.
      </Text>
    </CanonicalLayout>
  );
};

export default RiskCaseResolvedEmail;

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
