import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ProductApprovalRequestedData {
  recipient_first_name?: string;
  product_display_name?: string;
  product_effective_date?: string;
}

export interface ProductApprovalRequestedEmailProps {
  payload: CanonicalEmailPayload;
}

export const ProductApprovalRequestedEmail: React.FC<ProductApprovalRequestedEmailProps> = ({ payload }) => {
  const data = payload.eventData as ProductApprovalRequestedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Product or offer', value: payload.eventData?.product_display_name || 'Unknown' },
    { label: 'Effective date', value: payload.eventData?.product_effective_date || 'Unknown' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Approval required: Product configuration"
      preheader="Review the event details and any next step in ZoikoNex."
      openingText={`Hello ${firstName}, This email relates to product approval requested.`}
      primaryCtaText="Review product"
      primaryCtaLink={`https://zoikonex.com/action?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />
      
      <Text style={actionCopy}>
        Please select Review product to review the authoritative record and complete any required next step.
      </Text>
      
      <Text style={protectionCopy}>
        Use the ZoikoNex record as the source of truth. Do not rely on forwarded or altered copies of this message.
      </Text>
    </CanonicalLayout>
  );
};

export default ProductApprovalRequestedEmail;

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
