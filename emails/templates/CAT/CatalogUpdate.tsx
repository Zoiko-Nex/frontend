import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface CatalogUpdateData {
  recipient_first_name?: string;
  update_summary_display: string;
  affected_products_display: string;
  effective_date_display: string;
  [key: string]: any;
}

export interface CatalogUpdateEmailProps {
  payload: CanonicalEmailPayload;
}

export const CatalogUpdateEmail: React.FC<CatalogUpdateEmailProps> = ({ payload }) => {
  const data = payload.eventData as CatalogUpdateData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Update summary', value: data?.update_summary_display || 'See catalogue' },
    { label: 'Affected products', value: data?.affected_products_display || 'See full list' },
    { label: 'Effective date', value: data?.effective_date_display || 'Immediate' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="ZoikoNex catalogue update notification"
      preheader="The product catalogue has been updated. Review the changes relevant to your account."
      openingText={`Hello ${firstName}, The ZoikoNex product catalogue has been updated.`}
      primaryCtaText="View catalogue"
      primaryCtaLink={`https://zoikonex.com/catalog?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View catalogue</strong> to review the full list of updated products and services.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default CatalogUpdateEmail;

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
