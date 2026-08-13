import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PlanUpgradeData {
  recipient_first_name?: string;
  tenant_display_name: string;
  previous_plan_display: string;
  new_plan_display: string;
  effective_date_display: string;
}

export interface PlanUpgradeEmailProps {
  payload: CanonicalEmailPayload;
}

export const PlanUpgradeEmail: React.FC<PlanUpgradeEmailProps> = ({ payload }) => {
  const data = payload.eventData as PlanUpgradeData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Previous plan', value: data?.previous_plan_display || 'Unknown' },
    { label: 'New plan', value: data?.new_plan_display || 'Unknown' },
    { label: 'Effective date', value: data?.effective_date_display || 'Immediate' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Your ZoikoNex plan has been upgraded"
      preheader="Plan upgrade confirmed. Your new capabilities are now active."
      openingText={`Hello ${firstName}, Your ZoikoNex subscription has been successfully upgraded.`}
      primaryCtaText="Explore new features"
      primaryCtaLink={`https://zoikonex.com/dashboard?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Explore new features</strong> to review what's available on your upgraded plan.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PlanUpgradeEmail;

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
