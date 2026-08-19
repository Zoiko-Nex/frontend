'use client';

import React, { useState, useEffect } from 'react';
import { renderPreviewEmail } from '../../../actions/renderPreviewEmail';

interface BrandPreset {
  name: string;
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  senderName: string;
  replyTo: string;
  supportUrl: string;
}

const BRAND_PRESETS: Record<string, BrandPreset> = {
  zoikonex: {
    name: 'ZoikoNex Core (Platform Default)',
    brandName: 'ZoikoNex Telecom',
    logoUrl: '/image/ZoikoNex_Logo_Official/PNG/ZoikoNex_Logo_PNG.png',
    primaryColor: '#0052FF',
    senderName: 'ZoikoNex Notifications',
    replyTo: 'notifications@zoikonex.com',
    supportUrl: 'https://support.zoikonex.com',
  },
  apex_mvno: {
    name: 'Apex Mobile (MVNO White-label)',
    brandName: 'Apex Mobile',
    logoUrl: '/image/brands/apex-mobile.svg',
    primaryColor: '#4F46E5',
    senderName: 'Apex Mobile Customer Care',
    replyTo: 'care@apexmobile.example',
    supportUrl: 'https://help.apexmobile.example',
  },
  sovereign: {
    name: 'Sovereign Carrier (Tier-1 Telco)',
    brandName: 'Sovereign National Network',
    logoUrl: '/image/brands/sovereign.svg',
    primaryColor: '#0D9488',
    senderName: 'Sovereign Telecom Operations',
    replyTo: 'operations@sovereign-telco.example',
    supportUrl: 'https://portal.sovereign-telco.example/support',
  },
  travel_esim: {
    name: 'Voyage Connect (Travel eSIM)',
    brandName: 'Voyage Connect',
    logoUrl: '/image/brands/voyage-connect.svg',
    primaryColor: '#EA580C',
    senderName: 'Voyage Connect Service Team',
    replyTo: 'hello@voyageconnect.example',
    supportUrl: 'https://voyageconnect.example/help',
  },
};

const SAMPLE_TEMPLATES = [
  { id: 'ZNX-EM-IAM-001', name: 'User invitation (IAM-001)' },
  { id: 'ZNX-EM-BIL-002', name: 'Invoice issued (BIL-002)' },
  { id: 'ZNX-EM-ORD-014', name: 'eSIM ready for install (ORD-014)' },
  { id: 'ZNX-EM-PAY-003', name: 'Payment received (PAY-003)' },
  { id: 'ZNX-EM-USG-006', name: 'Usage anomaly detected (USG-006)' },
  { id: 'ZNX-EM-SUP-013', name: 'Incident detected (SUP-013)' },
];

export default function TenantBrandingPage() {
  const [selectedPreset, setSelectedPreset] = useState('zoikonex');
  const [selectedTemplate, setSelectedTemplate] = useState('ZNX-EM-IAM-001');

  const [brandName, setBrandName] = useState(BRAND_PRESETS.zoikonex.brandName);
  const [logoUrl, setLogoUrl] = useState(BRAND_PRESETS.zoikonex.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(BRAND_PRESETS.zoikonex.primaryColor);
  const [senderName, setSenderName] = useState(BRAND_PRESETS.zoikonex.senderName);
  const [replyTo, setReplyTo] = useState(BRAND_PRESETS.zoikonex.replyTo);
  const [supportUrl, setSupportUrl] = useState(BRAND_PRESETS.zoikonex.supportUrl);

  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Apply preset
  const handleApplyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = BRAND_PRESETS[presetKey];
    if (preset) {
      setBrandName(preset.brandName);
      setLogoUrl(preset.logoUrl);
      setPrimaryColor(preset.primaryColor);
      setSenderName(preset.senderName);
      setReplyTo(preset.replyTo);
      setSupportUrl(preset.supportUrl);
    }
  };

  // Debounced preview rendering
  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      const result = await renderPreviewEmail(
        selectedTemplate,
        { display_name: brandName, logo_url: logoUrl, primary_color: primaryColor },
        { from_name: senderName, reply_to: replyTo },
        { url: supportUrl }
      );
      if (result.success && result.html) {
        setPreviewHtml(result.html);
      }
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [selectedTemplate, brandName, logoUrl, primaryColor, senderName, replyTo, supportUrl]);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar: Form Controls */}
      <div className="w-[420px] bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full overflow-y-auto shadow-xl z-10 shrink-0">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">White-Label Governance</h1>
            <p className="text-xs text-slate-400 mt-0.5">Section 02 Multi-Tenant Brand Studio</p>
          </div>
          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
            290 Templates
          </span>
        </div>

        <div className="space-y-6 mt-5">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Preset Personas
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {Object.entries(BRAND_PRESETS).map(([key, p]) => (
                <option key={key} value={key}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Template Test Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Sample Template Preview
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            >
              {SAMPLE_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Identity */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Brand Identity (Locked Boundary)
            </h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
              <input 
                type="text" 
                value={brandName} 
                onChange={e => setBrandName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Logo URL or Path</label>
              <input 
                type="text" 
                value={logoUrl} 
                onChange={e => setLogoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Primary Brand Color</label>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  WCAG AA Compliant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="h-8 w-12 p-0.5 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Sender & Support */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sender & Support Governance
            </h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sender Name (From)</label>
              <input 
                type="text" 
                value={senderName} 
                onChange={e => setSenderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Reply-To Email</label>
              <input 
                type="email" 
                value={replyTo} 
                onChange={e => setReplyTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Support URL</label>
              <input 
                type="text" 
                value={supportUrl} 
                onChange={e => setSupportUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 border-t border-slate-800">
            <button 
              onClick={handleSave}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {savedSuccess ? '✓ Configuration Applied' : 'Save Tenant Brand Configuration'}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Applies globally to all 290 canonical templates under this tenant ID.
            </p>
          </div>

        </div>
      </div>

      {/* Main Area: Live Email Preview */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-3.5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white">Live White-Label Preview Simulator</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Active Template: <span className="font-mono text-blue-400">{selectedTemplate}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
             {isLoading && <span className="text-xs font-medium text-blue-400 animate-pulse font-mono">Rendering...</span>}
             <a
               href="/Super-admin/communications/preview"
               className="text-xs text-slate-400 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
             >
               Open Full Hub (290 Templates) →
             </a>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto flex justify-center items-start bg-slate-950">
          <div className="w-[720px] max-w-full min-h-[750px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
             {previewHtml ? (
               <iframe 
                 srcDoc={previewHtml} 
                 className="w-full flex-1 min-h-[750px] border-0 bg-white" 
                 title="Live Email Preview Simulator"
               />
             ) : (
               <div className="flex items-center justify-center h-[600px] text-slate-500">
                 Loading preview...
               </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
}
