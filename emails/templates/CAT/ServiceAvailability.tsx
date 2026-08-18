import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface ServiceAvailabilityData {
  recipient_first_name?: string;
  service_name_display: string;
  availability_status_display: string;
  affected_regions_display: string;
  estimated_resolution_display?: string;
  [key: string]: any;
}

export interface ServiceAvailabilityEmailProps {
  payload: CanonicalEmailPayload;
}

export const ServiceAvailabilityEmail: React.FC<ServiceAvailabilityEmailProps> = ({ payload }) => {
  const data = payload.eventData as ServiceAvailabilityData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Service', value: data?.service_name_display || 'Unknown' },
    { label: 'Status', value: data?.availability_status_display || 'See status page' },
    { label: 'Affected regions', value: data?.affected_regions_display || 'See status page' },
    ...(data?.estimated_resolution_display ? [{ label: 'Estimated resolution', value: data.estimated_resolution_display }] : []),
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject={`Service availability notice: ${data?.service_name_display || 'ZoikoNex service update'}`}
      preheader="A service availability change has been detected. Review the status."
      openingText={`Hello ${firstName}, We are writing to inform you of a service availability update on the ZoikoNex platform.`}
      primaryCtaText="View status page"
      primaryCtaLink={`https://zoikonex.com/status?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>View status page</strong> to monitor live service availability and receive real-time updates.
      </Text>

      <Text style={protectionCopy}>
        For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default ServiceAvailabilityEmail;

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
