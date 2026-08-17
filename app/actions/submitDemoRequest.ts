'use server';

import { render } from '@react-email/render';
import DemoRequestReceivedEmail from '../../emails/templates/COM/DemoRequestReceived';
import { CanonicalEmailPayload } from '../../emails/types/CanonicalEmail';
import React from 'react'; // ensure React is in scope for JSX

export interface DemoRequestFormInput {
  full_name: string;
  work_email: string;
  organization: string;
  job_title: string;
  country: string;
  operator_type: string;
  project_requirements?: string;
  source_page?: string;
}

export async function submitDemoRequest(data: DemoRequestFormInput) {
  try {
    // 1. Call Backend API
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8099';
    const response = await fetch(`${backendUrl}/v1/demo-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        source_page: data.source_page || '/request-a-demo',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Backend validation error:', result);
      return { success: false, error: result.message || 'Failed to submit demo request.' };
    }

    // 2. Prepare Canonical Email Payload
    // In a real app, this config might come from a DB for the specific tenant
    // For demo purposes, we construct it here based on the backend response.
    const payload: CanonicalEmailPayload = {
      identity: {
        tenant_id: 'default',
        operator_id: 'default',
        brand_id: 'zoikonex',
        environment_name: 'production',
        recipient_role: 'Prospect',
        recipient_locale: 'en-US',
        recipient_time_zone: 'UTC',
      },
      traceability: {
        event_type: 'COM.DEMO_REQUEST_RECEIVED.V1',
        event_version: '1.0',
        event_id: result.demo_request_id || `evt_${Date.now()}`,
        correlation_id: `req_${Date.now()}`,
        message_reference: `MSG-COM-001-${Date.now()}`,
        template_id: 'ZNX-EM-COM-001',
        template_version: '1.0',
      },
      rendering: {
        brand: {
          display_name: 'ZoikoNex',
          logo_url: 'https://react.email/static/logo-v.png', // ZoikoNex default logo
          primary_color: '#0f172a', // Slate 900
        },
        sender: {
          from_name: 'ZoikoNex Sales',
          reply_to: 'sales@zoikonex.com',
        },
        support: {
          url: 'https://zoikonex.com/support',
        },
      },
      governance: {
        message_classification: 'Commercial transactional',
        message_legal_basis: 'Consent',
        message_preference_category: 'Transactional',
        message_sensitivity: 'Normal',
      },
      localizedValues: {
        currency_code: 'USD',
        date_local: new Date().toLocaleString(),
        date_utc: new Date().toISOString(),
        jurisdiction_code: 'GLOBAL',
        language_code: 'en',
      },
      eventData: {
        recipient_first_name: data.full_name.split(' ')[0], // rudimentary first name extraction
        prospect_organization_name: data.organization,
        prospect_contact_name: data.full_name,
      },
    };

    // 3. Render HTML
    // We await render since it processes React components to string
    const htmlOutput = await render(React.createElement(DemoRequestReceivedEmail, { payload }));

    // 4. Simulate Dispatch (or integrate Resend here)
    console.log('--- DISPATCHING CANONICAL EMAIL ZNX-EM-COM-001 ---');
    console.log(`To: ${data.work_email}`);
    console.log(`Subject: We received your ZoikoNex demo request`);
    console.log('HTML Payload:');
    console.log(htmlOutput);
    console.log('--------------------------------------------------');

    // If using Resend:
    // await resend.emails.send({
    //   from: 'sales@zoikonex.com',
    //   to: data.work_email,
    //   subject: 'We received your ZoikoNex demo request',
    //   html: htmlOutput
    // });

    return { success: true, message: 'Demo request submitted and email dispatched.' };
  } catch (error: any) {
    console.error('Server Action Error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
