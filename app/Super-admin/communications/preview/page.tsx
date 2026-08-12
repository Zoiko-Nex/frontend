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
  { id: 'ZNX-EM-COM-001', name: 'Demo request received', family: 'COM', classification: 'Commercial transactional', recipient: 'Prospect' },
  { id: 'ZNX-EM-COM-002', name: 'Demo booked', family: 'COM', classification: 'Commercial transactional', recipient: 'Prospect' },
  { id: 'ZNX-EM-IAM-001', name: 'User invitation', family: 'IAM', classification: 'Security transactional', recipient: 'Invited platform user' },
  { id: 'ZNX-EM-CRM-001', name: 'Subscriber welcome', family: 'CRM', classification: 'Customer transactional', recipient: 'Subscriber / Account contact' },
  { id: 'ZNX-EM-ORD-001', name: 'Order received', family: 'ORD', classification: 'Order transactional', recipient: 'Subscriber / Business contact' },
  { id: 'ZNX-EM-ORD-014', name: 'eSIM ready', family: 'ORD', classification: 'Provisioning transactional', recipient: 'Authorized line user' },
  { id: 'ZNX-EM-USG-001', name: 'Usage threshold 50%', family: 'USG', classification: 'Usage notice', recipient: 'Subscriber / Account contact' },
  { id: 'ZNX-EM-BIL-002', name: 'Invoice issued', family: 'BIL', classification: 'Billing transactional', recipient: 'Billing contact' },
  { id: 'ZNX-EM-PAY-003', name: 'Payment received', family: 'PAY', classification: 'Payment transactional', recipient: 'Payer & billing contact' },
  { id: 'ZNX-EM-PAY-005', name: 'Payment failed', family: 'PAY', classification: 'Payment alert', recipient: 'Payer & billing contact' },
  { id: 'ZNX-EM-CMP-001', name: 'Terms updated', family: 'CMP', classification: 'Legal notice', recipient: 'Platform user' },
  { id: 'ZNX-EM-PAR-001', name: 'Partner invitation', family: 'PAR', classification: 'Partner transactional', recipient: 'Partner user' },
  { id: 'ZNX-EM-API-003', name: 'API secret generated', family: 'API', classification: 'Security critical', recipient: 'Integration engineer' },
  { id: 'ZNX-EM-RISK-001', name: 'Fraud alert opened', family: 'RISK', classification: 'Risk alert', recipient: 'Fraud operations' },
  { id: 'ZNX-EM-SUP-001', name: 'Support case created', family: 'SUP', classification: 'Support transactional', recipient: 'Requester' },
  { id: 'ZNX-EM-SUP-013', name: 'Incident detected', family: 'SUP', classification: 'Incident critical', recipient: 'Affected tenant contacts' },
  { id: 'ZNX-EM-OPS-001', name: 'Scheduled report ready', family: 'OPS', classification: 'Reporting transactional', recipient: 'Report recipient' },
  { id: 'ZNX-EM-SUB-001', name: 'Subscription activated', family: 'SUB', classification: 'Commercial transactional', recipient: 'Tenant finance owner' },
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
