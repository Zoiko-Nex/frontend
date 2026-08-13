import React from 'react';
import { CanonicalLayout } from '../../components/CanonicalLayout';
import { KeyFactsBlock } from '../../components/KeyFactsBlock';
import { CanonicalEmailPayload } from '../../types/CanonicalEmail';
import { Text } from '@react-email/components';

export interface AdminAssignedData {
  recipient_first_name?: string;
  tenant_display_name: string;
  admin_masked_email: string;
  admin_role_display: string;
  assigned_by_masked_display: string;
}

export interface AdminAssignedEmailProps {
  payload: CanonicalEmailPayload;
}

export const AdminAssignedEmail: React.FC<AdminAssignedEmailProps> = ({ payload }) => {
  const data = payload.eventData as AdminAssignedData;
  const firstName = data?.recipient_first_name || 'there';

  const facts = [
    { label: 'Organisation', value: data?.tenant_display_name || 'Unknown' },
    { label: 'Admin account', value: data?.admin_masked_email || 'Unknown' },
    { label: 'Role assigned', value: data?.admin_role_display || 'Tenant Administrator' },
    { label: 'Assigned by', value: data?.assigned_by_masked_display || 'System' },
    { label: 'Reference', value: payload.traceability.message_reference },
    { label: 'Date and time', value: `${payload.localizedValues.date_local} (${payload.localizedValues.date_utc} UTC)` },
  ];

  return (
    <CanonicalLayout
      payload={payload}
      subject="Administrator role assigned to your ZoikoNex account"
      preheader="You have been assigned an administrator role. Review your permissions."
      openingText={`Hello ${firstName}, An administrator role has been assigned to your ZoikoNex account.`}
      primaryCtaText="Review permissions"
      primaryCtaLink={`https://zoikonex.com/account/permissions?ref=${payload.traceability.message_reference}`}
    >
      <KeyFactsBlock facts={facts} />

      <Text style={actionCopy}>
        Select <strong>Review permissions</strong> to view your assigned role and available administrative capabilities.
      </Text>

      <Text style={protectionCopy}>
        If you did not expect this assignment, contact your authorised administrator immediately. For your security, this email does not display complete account identifiers.
      </Text>
    </CanonicalLayout>
  );
};

export default AdminAssignedEmail;

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
