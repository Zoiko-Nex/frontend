"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { renderPreviewEmail } from '../../../actions/renderPreviewEmail';
import { BrandRendering, SenderRendering, SupportRendering } from '../../../../emails/types/CanonicalEmail';

interface TemplateRegistryItem {
  id: string;
  name: string;
  family: string;
  classification: string;
  recipient: string;
}

const TEMPLATE_REGISTRY: TemplateRegistryItem[] = [
  // ── COM: Commercial Lifecycle ────────────────────────────────────────────
  { id: 'ZNX-EM-COM-001', name: 'Demo request received', family: 'COM', classification: 'Commercial transactional', recipient: 'Prospect' },
  { id: 'ZNX-EM-COM-002', name: 'Demo booked', family: 'COM', classification: 'Commercial transactional', recipient: 'Prospect' },
  { id: 'ZNX-EM-COM-003', name: 'Onboarding welcome', family: 'COM', classification: 'Commercial transactional', recipient: 'New customer' },
  { id: 'ZNX-EM-COM-004', name: 'Plan upgrade', family: 'COM', classification: 'Commercial transactional', recipient: 'Account owner' },
  { id: 'ZNX-EM-COM-005', name: 'Renewal reminder', family: 'COM', classification: 'Commercial transactional', recipient: 'Account owner' },
  { id: 'ZNX-EM-COM-006', name: 'Churn prevention', family: 'COM', classification: 'Retention notice', recipient: 'Account owner' },
  { id: 'ZNX-EM-COM-007', name: 'Promotional offer', family: 'COM', classification: 'Commercial marketing', recipient: 'Account owner' },
  // ── IAM: Identity & Authentication ──────────────────────────────────────
  { id: 'ZNX-EM-IAM-001', name: 'User invitation', family: 'IAM', classification: 'Security transactional', recipient: 'Invited platform user' },
  { id: 'ZNX-EM-IAM-002', name: 'Password reset', family: 'IAM', classification: 'Security critical', recipient: 'Account holder' },
  { id: 'ZNX-EM-IAM-003', name: 'Suspicious login alert', family: 'IAM', classification: 'Security alert', recipient: 'Account holder' },
  { id: 'ZNX-EM-IAM-004', name: 'MFA challenge', family: 'IAM', classification: 'Security transactional', recipient: 'Account holder' },
  { id: 'ZNX-EM-IAM-005', name: 'Account recovery', family: 'IAM', classification: 'Security critical', recipient: 'Account holder' },
  // ── TNT: Tenant Onboarding ───────────────────────────────────────────────
  { id: 'ZNX-EM-TNT-001', name: 'Tenant welcome', family: 'TNT', classification: 'Onboarding transactional', recipient: 'Tenant admin' },
  { id: 'ZNX-EM-TNT-002', name: 'Tenant setup confirmed', family: 'TNT', classification: 'Onboarding transactional', recipient: 'Tenant admin' },
  { id: 'ZNX-EM-TNT-003', name: 'Admin assigned', family: 'TNT', classification: 'Security transactional', recipient: 'Assigned admin' },
  // ── CRM: Subscriber / CRM ───────────────────────────────────────────────
  { id: 'ZNX-EM-CRM-001', name: 'Subscriber welcome', family: 'CRM', classification: 'Customer transactional', recipient: 'Subscriber / Account contact' },
  { id: 'ZNX-EM-CRM-002', name: 'Ticket resolved', family: 'CRM', classification: 'Support transactional', recipient: 'Requester' },
  { id: 'ZNX-EM-CRM-003', name: 'Feedback request', family: 'CRM', classification: 'Customer engagement', recipient: 'Requester' },
  { id: 'ZNX-EM-CRM-004', name: 'Escalation notice', family: 'CRM', classification: 'Support alert', recipient: 'Requester' },
  // ── BIL: Billing ────────────────────────────────────────────────────────
  { id: 'ZNX-EM-BIL-002', name: 'Invoice issued', family: 'BIL', classification: 'Billing transactional', recipient: 'Billing contact' },
  { id: 'ZNX-EM-BIL-003', name: 'Invoice reminder', family: 'BIL', classification: 'Billing transactional', recipient: 'Billing contact' },
  { id: 'ZNX-EM-BIL-004', name: 'Invoice paid', family: 'BIL', classification: 'Billing transactional', recipient: 'Billing contact' },
  { id: 'ZNX-EM-BIL-005', name: 'Invoice overdue', family: 'BIL', classification: 'Billing alert', recipient: 'Billing contact' },
  // ── PAY: Payments ───────────────────────────────────────────────────────
  { id: 'ZNX-EM-PAY-003', name: 'Payment received', family: 'PAY', classification: 'Payment transactional', recipient: 'Payer & billing contact' },
  { id: 'ZNX-EM-PAY-005', name: 'Payment failed', family: 'PAY', classification: 'Payment alert', recipient: 'Payer & billing contact' },
  { id: 'ZNX-EM-PAY-006', name: 'Refund processed', family: 'PAY', classification: 'Payment transactional', recipient: 'Payer' },
  { id: 'ZNX-EM-PAY-007', name: 'Auto-debit notice', family: 'PAY', classification: 'Payment notice', recipient: 'Billing contact' },
  // ── CMP: Compliance & Regulatory ────────────────────────────────────────
  { id: 'ZNX-EM-CMP-001', name: 'Terms updated', family: 'CMP', classification: 'Legal notice', recipient: 'Platform user' },
  { id: 'ZNX-EM-CMP-002', name: 'Privacy notice', family: 'CMP', classification: 'Legal notice', recipient: 'Platform user' },
  { id: 'ZNX-EM-CMP-003', name: 'Consent changed', family: 'CMP', classification: 'Compliance transactional', recipient: 'Account holder' },
  { id: 'ZNX-EM-CMP-004', name: 'Audit alert', family: 'CMP', classification: 'Compliance alert', recipient: 'Compliance officer' },
  // ── PAR: Partner Communications ─────────────────────────────────────────
  { id: 'ZNX-EM-PAR-001', name: 'Partner invitation', family: 'PAR', classification: 'Partner transactional', recipient: 'Partner user' },
  { id: 'ZNX-EM-PAR-002', name: 'Partner onboarding', family: 'PAR', classification: 'Partner transactional', recipient: 'Partner admin' },
  { id: 'ZNX-EM-PAR-003', name: 'Integration update', family: 'PAR', classification: 'Partner notice', recipient: 'Integration engineer' },
  { id: 'ZNX-EM-PAR-004', name: 'SLA breach', family: 'PAR', classification: 'Partner alert', recipient: 'Partner account manager' },
  // ── CAT: Catalog & Product ───────────────────────────────────────────────
  { id: 'ZNX-EM-CAT-001', name: 'New product launch', family: 'CAT', classification: 'Commercial notice', recipient: 'Account owner' },
  { id: 'ZNX-EM-CAT-002', name: 'Catalog update', family: 'CAT', classification: 'Product notice', recipient: 'Account owner' },
  { id: 'ZNX-EM-CAT-003', name: 'Service availability', family: 'CAT', classification: 'Operational notice', recipient: 'Account owner' },
  // ── API: API & Developer ────────────────────────────────────────────────
  { id: 'ZNX-EM-API-003', name: 'API secret generated', family: 'API', classification: 'Security critical', recipient: 'Integration engineer' },
  { id: 'ZNX-EM-API-004', name: 'API usage alert', family: 'API', classification: 'Usage notice', recipient: 'Integration engineer' },
  { id: 'ZNX-EM-API-005', name: 'API quota exceeded', family: 'API', classification: 'Usage alert', recipient: 'Integration engineer' },
  { id: 'ZNX-EM-API-006', name: 'API deprecation notice', family: 'API', classification: 'Developer notice', recipient: 'Integration engineer' },
  // ── RISK: Risk & Security ───────────────────────────────────────────────
  { id: 'ZNX-EM-RISK-001', name: 'Fraud alert opened', family: 'RISK', classification: 'Risk alert', recipient: 'Fraud operations' },
  { id: 'ZNX-EM-RISK-002', name: 'Account suspension', family: 'RISK', classification: 'Risk critical', recipient: 'Account holder' },
  { id: 'ZNX-EM-RISK-003', name: 'Service restriction', family: 'RISK', classification: 'Risk alert', recipient: 'Account holder' },
  { id: 'ZNX-EM-RISK-004', name: 'Breach notification', family: 'RISK', classification: 'Security critical', recipient: 'Account holder' },
  // ── SUP: Support ────────────────────────────────────────────────────────
  { id: 'ZNX-EM-SUP-001', name: 'Support case created', family: 'SUP', classification: 'Support transactional', recipient: 'Requester' },
  { id: 'ZNX-EM-SUP-002', name: 'Ticket opened', family: 'SUP', classification: 'Support transactional', recipient: 'Requester' },
  { id: 'ZNX-EM-SUP-013', name: 'Incident detected', family: 'SUP', classification: 'Incident critical', recipient: 'Affected tenant contacts' },
  // ── SUB: Subscription ───────────────────────────────────────────────────
  { id: 'ZNX-EM-SUB-001', name: 'Subscription activated', family: 'SUB', classification: 'Commercial transactional', recipient: 'Tenant finance owner' },
  { id: 'ZNX-EM-SUB-002', name: 'Subscription cancelled', family: 'SUB', classification: 'Commercial transactional', recipient: 'Tenant finance owner' },
  { id: 'ZNX-EM-SUB-003', name: 'Subscription renewed', family: 'SUB', classification: 'Commercial transactional', recipient: 'Tenant finance owner' },
  // ── OPS: Operations ─────────────────────────────────────────────────────
  { id: 'ZNX-EM-OPS-001', name: 'Scheduled report ready', family: 'OPS', classification: 'Reporting transactional', recipient: 'Report recipient' },
  // ── ORD: Orders ─────────────────────────────────────────────────────────
  { id: 'ZNX-EM-ORD-001', name: 'Order received', family: 'ORD', classification: 'Order transactional', recipient: 'Subscriber / Business contact' },
  { id: 'ZNX-EM-ORD-014', name: 'eSIM ready', family: 'ORD', classification: 'Provisioning transactional', recipient: 'Authorized line user' },
  // ── USG: Usage ──────────────────────────────────────────────────────────
  { id: 'ZNX-EM-USG-001', name: 'Usage threshold 50%', family: 'USG', classification: 'Usage notice', recipient: 'Subscriber / Account contact' },
  // ── NEXA: Nexa AI ───────────────────────────────────────────────────────
  { id: 'ZNX-EM-NEXA-001', name: 'Nexa AI summary', family: 'NEXA', classification: 'AI advisory', recipient: 'Account owner' },
  { id: 'ZNX-EM-NEXA-002', name: 'Nexa recommendation', family: 'NEXA', classification: 'AI advisory', recipient: 'Account owner' },
  { id: 'ZNX-EM-NEXA-003', name: 'Nexa advisory', family: 'NEXA', classification: 'AI advisory', recipient: 'Account owner' },
  { id: 'ZNX-EM-NEXA-004', name: 'Nexa action approval required', family: 'NEXA', classification: 'AI human-in-command', recipient: 'Authorized human approver' },
];

export default function EmailPreviewPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('ZNX-EM-IAM-001');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [currentPayload, setCurrentPayload] = useState<any>(null);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const brand: BrandRendering = {
    display_name: 'ZoikoNex Telecom',
    logo_url: 'https://react.email/static/logo-v.png',
    primary_color: '#4f46e5',
  };

  const sender: SenderRendering = {
    from_name: 'ZoikoNex Platform Operations',
    reply_to: 'support@zoikonex.example',
  };

  const support: SupportRendering = {
    url: 'https://support.zoikonex.example',
  };

  const currentTemplate = TEMPLATE_REGISTRY.find(t => t.id === selectedTemplateId) || TEMPLATE_REGISTRY[0];

  useEffect(() => {
    startTransition(async () => {
      const result = await renderPreviewEmail(selectedTemplateId, brand, sender, support);
      if (result.success && result.html) {
        setRenderedHtml(result.html);
        setCurrentPayload(result.payload);
      }
    });
  }, [selectedTemplateId]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar for Template Selection */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col h-full overflow-y-auto shrink-0">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Communications</h1>
          <p className="text-xs text-gray-500 mt-1">290-Template Baseline Explorer</p>
        </div>
        
        <div className="space-y-6">
          {Array.from(new Set(TEMPLATE_REGISTRY.map(t => t.family))).map(family => (
            <div key={family}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Family: {family}
              </h2>
              <ul className="space-y-1">
                {TEMPLATE_REGISTRY.filter(t => t.family === family).map(template => (
                  <li key={template.id}>
                    <button
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        selectedTemplateId === template.id
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{template.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono ml-2 shrink-0">{template.id.split('-').pop()}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                {currentTemplate.id}
              </span>
              <h2 className="text-lg font-bold text-gray-900">{currentTemplate.name}</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Class: <span className="font-medium text-gray-700">{currentTemplate.classification}</span> &bull; Recipient: <span className="font-medium text-gray-700">{currentTemplate.recipient}</span>
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {isPending && <span className="text-xs text-indigo-600 animate-pulse font-medium">Rendering...</span>}
            <button
              onClick={() => setShowJsonModal(true)}
              className="px-3.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
            >
              View JSON Payload
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto flex justify-center bg-gray-100">
          <div className="w-[750px] h-[820px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <iframe 
              srcDoc={renderedHtml} 
              className="w-full h-full border-0" 
              title="Canonical Email Live Preview"
            />
          </div>
        </main>
      </div>

      {/* JSON Payload Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-base font-bold text-gray-900">Canonical Contract Payload</h3>
                <p className="text-xs text-gray-500 mt-0.5">{currentTemplate.id} — Mandatory Contract Compliance</p>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="my-4 flex-1 overflow-y-auto bg-gray-900 text-emerald-400 p-4 rounded-lg font-mono text-xs leading-relaxed">
              <pre>{JSON.stringify(currentPayload, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-md hover:bg-gray-800"
              >
                Close Payload Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
