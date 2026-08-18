import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface NewProductLaunchData {
  recipient_first_name?: string;
  product_name_display: string;
  product_category_display: string;
  launch_date_display: string;
  [key: string]: any;
}

export interface NewProductLaunchEmailProps {
  payload: CanonicalEmailPayload;
}

export const NewProductLaunchEmail: React.FC<NewProductLaunchEmailProps> = ({ payload }) => {
  const data = payload.eventData as NewProductLaunchData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Product', value: data?.product_name_display || 'New product' },
    { label: 'Category', value: data?.product_category_display || 'ZoikoNex catalogue' },
    { label: 'Available from', value: data?.launch_date_display || 'Now' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`New product launch: ${data?.product_name_display || 'Now available on ZoikoNex'}`}
      preheader="A new product is now available in your ZoikoNex catalogue."
      openingText={`Hello ${firstName}, A new product is now available on the ZoikoNex platform.`}
      primaryCtaText="View product"
      primaryCtaLink={`https://zoikonex.com/catalog?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View product</strong> to explore the full product details, pricing and provisioning options.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default NewProductLaunchEmail;

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
