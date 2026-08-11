import React from 'react';
import { render } from '@react-email/render';
import { UserInvitationEmail } from '../../../../emails/templates/IAM/UserInvitation';
import { CanonicalEmailPayload } from '../../../../emails/types/CanonicalEmail';

export default async function EmailPreviewPage() {
  // Mock payload based on Canonical Specification
  const mockPayload: CanonicalEmailPayload = {
    identity: {
      tenant_id: 'ten_9a8b7c6d5e4f',
      operator_id: 'op_1a2b3c4d5e6f',
      brand_id: 'brnd_12345',
      environment_name: 'production',
      recipient_role: 'Invited platform user',
      recipient_locale: 'en-US',
      recipient_time_zone: 'America/New_York',
    },
    traceability: {
      event_type: 'IAM.USER_INVITATION.V1',
      event_version: '1.0',
      event_id: 'evt_123456789',
      correlation_id: 'req_987654321',
      message_reference: 'MSG-IAM-001-A',
      template_id: 'ZNX-EM-IAM-001',
      template_version: '1.0',
    },
    rendering: {
      brand: {
        display_name: 'Acme Telecom',
        logo_url: 'https://react.email/static/logo-v.png', // Fallback placeholder
        primary_color: '#6366f1', // Indigo 500
      },
      sender: {
        from_name: 'Acme Telecom Notifications',
        reply_to: 'support@acmetelecom.example',
      },
      support: {
        url: 'https://support.acmetelecom.example',
      },
    },
    governance: {
      message_classification: 'Security transactional',
      message_legal_basis: 'Legitimate interest',
      message_preference_category: 'Mandatory',
      message_sensitivity: 'Normal',
    },
    localizedValues: {
      currency_code: 'USD',
      date_local: 'August 15, 2026, 10:00 AM EDT',
      date_utc: '2026-08-15T14:00:00Z',
      jurisdiction_code: 'US',
      language_code: 'en',
    },
    eventData: {
      recipient_first_name: 'Jane',
      user_masked_email: 'j***@example.com',
      tenant_display_name: 'Acme Telecom',
    },
  };

  // Render the email to a HTML string
  const html = await render(<UserInvitationEmail payload={mockPayload} />);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for Template Selection */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-full overflow-y-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Communications</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              IAM (Identity)
            </h2>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium text-sm">
                  User Invitation
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-sm">
                  Invitation Reminder
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-sm">
                  Password Created
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              COM (Commercial)
            </h2>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-sm">
                  Demo Request
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-sm">
                  Trial Started
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">ZNX-EM-IAM-001 — User invitation</h2>
            <p className="text-sm text-gray-500 mt-1">Class: Security transactional</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
              View JSON Payload
            </button>
            <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Edit Template
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto flex justify-center bg-gray-100">
          <div className="w-[800px] h-[800px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
             {/* We use an iframe to safely render the complete HTML including <head> and <style> tags injected by React Email */}
            <iframe 
              srcDoc={html} 
              className="w-full h-full border-0" 
              title="Email Preview"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
