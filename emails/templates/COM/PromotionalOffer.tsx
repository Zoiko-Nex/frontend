import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface PromotionalOfferData {
  recipient_first_name?: string;
  offer_title_display: string;
  offer_discount_display: string;
  offer_expiry_display: string;
  promo_code?: string;
}

export interface PromotionalOfferEmailProps {
  payload: CanonicalEmailPayload;
}

export const PromotionalOfferEmail: React.FC<PromotionalOfferEmailProps> = ({ payload }) => {
  const data = payload.eventData as PromotionalOfferData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Offer', value: data?.offer_title_display || 'Special offer' },
    { label: 'Discount', value: data?.offer_discount_display || 'See offer details' },
    { label: 'Offer expires', value: data?.offer_expiry_display || 'Limited time' },
    ...(data?.promo_code ? [{ label: 'Promo code', value: data.promo_code }] : []),
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`Exclusive offer: ${data?.offer_title_display || 'Special promotion from ZoikoNex'}`}
      preheader="A special offer is available for your account. Act before it expires."
      openingText={`Hello ${firstName}, We have an exclusive offer available for your ZoikoNex account.`}
      primaryCtaText="View offer"
      primaryCtaLink={`https://zoikonex.com/offers?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View offer</strong> to review the full terms and activate your discount before the expiry date.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default PromotionalOfferEmail;

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
