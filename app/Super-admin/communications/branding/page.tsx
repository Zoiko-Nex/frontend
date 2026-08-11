'use client';

import React, { useState, useEffect } from 'react';
import { renderPreviewEmail } from '../../../actions/renderPreviewEmail';

export default function TenantBrandingPage() {
  const [brandName, setBrandName] = useState('Acme Telecom');
  const [logoUrl, setLogoUrl] = useState('https://react.email/static/logo-v.png');
  const [primaryColor, setPrimaryColor] = useState('#6366f1'); // Default Indigo
  const [senderName, setSenderName] = useState('Acme Notifications');
  const [replyTo, setReplyTo] = useState('support@acmetelecom.com');
  const [supportUrl, setSupportUrl] = useState('https://support.acmetelecom.com');

  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Debounce the preview rendering so we don't spam the server action while typing
  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      const result = await renderPreviewEmail(
        { display_name: brandName, logo_url: logoUrl, primary_color: primaryColor },
        { from_name: senderName, reply_to: replyTo },
        { url: supportUrl }
      );
      if (result.success && result.html) {
        setPreviewHtml(result.html);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [brandName, logoUrl, primaryColor, senderName, replyTo, supportUrl]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar: Form Controls */}
      <div className="w-96 bg-white border-r border-gray-200 p-6 flex flex-col h-full overflow-y-auto shadow-sm z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">White-Label Governance</h1>
        <p className="text-sm text-gray-500 mb-8">
          Configure tenant-specific branding that will be strictly applied to all 290 canonical email templates.
        </p>

        <div className="space-y-6">
          {/* Brand Identity */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Brand Identity</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
              <input 
                type="text" 
                value={brandName} 
                onChange={e => setBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
              <input 
                type="text" 
                value={logoUrl} 
                onChange={e => setLogoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="h-9 w-14 p-1 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                />
                <input 
                  type="text" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm uppercase"
                />
              </div>
            </div>
          </div>

          {/* Sender & Support */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Sender & Support</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sender Name (From)</label>
              <input 
                type="text" 
                value={senderName} 
                onChange={e => setSenderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Reply-To Email</label>
              <input 
                type="email" 
                value={replyTo} 
                onChange={e => setReplyTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Support URL</label>
              <input 
                type="text" 
                value={supportUrl} 
                onChange={e => setSupportUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="pt-6">
            <button className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Configuration
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Applies globally to all 290 templates for this tenant.
            </p>
          </div>

        </div>
      </div>

      {/* Main Area: Live Email Preview */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Live Simulator</h2>
            <p className="text-sm text-gray-500 mt-0.5">Previewing: ZNX-EM-IAM-001 (User Invitation)</p>
          </div>
          <div className="flex items-center gap-3">
             {isLoading && <span className="text-sm font-medium text-indigo-500 animate-pulse">Rendering...</span>}
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto flex justify-center items-start">
          <div className="w-[800px] min-h-[600px] bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 ring-1 ring-black ring-opacity-5">
             {previewHtml ? (
               <iframe 
                 srcDoc={previewHtml} 
                 className="w-full h-full min-h-[600px] border-0" 
                 title="Live Email Preview Simulator"
               />
             ) : (
               <div className="flex items-center justify-center h-[600px] text-gray-400">
                 Loading preview...
               </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
}
