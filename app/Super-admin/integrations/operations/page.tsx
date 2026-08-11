'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Play, 
  RotateCcw, 
  Eye, 
  Sliders, 
  Layers, 
  Clock, 
  ArrowRight,
  Database,
  ShieldAlert,
  Server
} from 'lucide-react';

interface IntegrationEvent {
  correlationId: string;
  providerEventId: string;
  tenantId: string;
  partnerName: string;
  eventType: string;
  protocol: 'Webhook' | 'Kafka Stream' | 'SFTP File' | 'REST Call';
  status: 'DELIVERED' | 'RETRYING' | 'FAILED' | 'DLQ' | 'QUARANTINE';
  timestamp: string;
  attempts: number;
  payloadSummary: string;
  errorDetail?: string;
  rawPayload: any;
}

const MOCK_EVENTS: IntegrationEvent[] = [
  {
    correlationId: 'corr_evt_99812401',
    providerEventId: 'evt_stripe_charge_fulfilled_881',
    tenantId: 'ten_golite_us',
    partnerName: 'Stripe Payments',
    eventType: 'PAYMENT.CHARGE_SUCCEEDED.V1',
    protocol: 'Webhook',
    status: 'DELIVERED',
    timestamp: '2026-08-11 13:42:10 UTC',
    attempts: 1,
    payloadSummary: 'Payment $45.00 captured successfully for Account ACC-9921',
    rawPayload: { amount: 4500, currency: 'usd', customer: 'cus_M129', id: 'ch_3M001' }
  },
  {
    correlationId: 'corr_evt_99812402',
    providerEventId: 'evt_smdp_profile_release_002',
    tenantId: 'ten_zoiko_uk',
    partnerName: 'GSMA SM-DP+',
    eventType: 'TEL.ESIM_PROFILE_RELEASED.V1',
    protocol: 'Kafka Stream',
    status: 'QUARANTINE',
    timestamp: '2026-08-11 13:40:02 UTC',
    attempts: 3,
    payloadSummary: 'eSIM activation confirmation signature mismatch',
    errorDetail: 'INT-SEC-014 Violation: Signature validation failed against provider key ring',
    rawPayload: { iccid: '8944500129841209841', matching_id: 'MATCH-902', status: 'UNVERIFIED' }
  },
  {
    correlationId: 'corr_evt_99812403',
    providerEventId: 'evt_suretax_calc_retry_409',
    tenantId: 'ten_driverx_us',
    partnerName: 'SureTax Regulatory',
    eventType: 'TAX.JURISDICTION_CALC.V1',
    protocol: 'REST Call',
    status: 'DLQ',
    timestamp: '2026-08-11 13:35:19 UTC',
    attempts: 5,
    payloadSummary: 'USF tax calculation timeout after 5 retries',
    errorDetail: 'INT-REL-003 Max retries exhausted. Bounded exponential backoff failed.',
    rawPayload: { invoice_id: 'INV-88120', state: 'US-CA', subtotal: 120.00 }
  },
  {
    correlationId: 'corr_evt_99812404',
    providerEventId: 'file_gamma_cdr_20260811_01.csv',
    tenantId: 'ten_zoiko_uk',
    partnerName: 'Gamma Telecom MVNA',
    eventType: 'USAGE.CDR_BATCH_INGEST.V1',
    protocol: 'SFTP File',
    status: 'DELIVERED',
    timestamp: '2026-08-11 13:30:00 UTC',
    attempts: 1,
    payloadSummary: 'Batch 14,290 usage CDR records processed',
    rawPayload: { file_name: 'gamma_cdr_01.csv', records: 14290, hash: 'sha256_88192a...' }
  }
];

export default function IntegrationOperationsPage() {
  const [events, setEvents] = useState<IntegrationEvent[]>(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<IntegrationEvent | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReplayEvent = (correlationId: string) => {
    setIsReplaying(true);
    setTimeout(() => {
      setEvents(prev => prev.map(e => e.correlationId === correlationId ? { ...e, status: 'DELIVERED', attempts: e.attempts + 1 } : e));
      if (selectedEvent && selectedEvent.correlationId === correlationId) {
        setSelectedEvent(prev => prev ? { ...prev, status: 'DELIVERED', attempts: prev.attempts + 1 } : null);
      }
      setIsReplaying(false);
      showToast(`Safe replay executed for [${correlationId}]. Status updated to DELIVERED.`);
    }, 600);
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      e.correlationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.providerEventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tenantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: IntegrationEvent['status']) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" />DELIVERED</span>;
      case 'RETRYING':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><RefreshCw className="w-3.5 h-3.5 animate-spin" />RETRYING</span>;
      case 'DLQ':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><AlertOctagon className="w-3.5 h-3.5" />DLQ STORE</span>;
      case 'QUARANTINE':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20"><ShieldAlert className="w-3.5 h-3.5" />QUARANTINE</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 lg:p-10">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-sky-950 border border-sky-500/50 text-sky-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span>OPERATIONS CONSOLE & EVIDENCE LEDGER</span>
            <span>•</span>
            <span className="text-slate-400">INT-OPS-001 / INT-OPS-003</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            Integration Observability & Correlation Trace
          </h1>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <Link 
            href="/Super-admin/integrations/partners" 
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5" />
            Partner Controls
          </Link>
          <Link 
            href="/Super-admin/integrations/operations" 
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            Operations & Trace
          </Link>
          <Link 
            href="/Super-admin/communications/branding" 
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            Email System
          </Link>
        </div>
      </div>

      {/* Universal Correlation ID Search Bar (INT-OPS-003) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Search className="w-4 h-4" />
          UNIVERSAL TRANSACTION TRACE & EVIDENCE SEARCH
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by Correlation ID, Provider Event ID, Tenant ID, or Partner Name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition font-mono"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-cyan-500 font-mono"
            >
              <option value="ALL">Status: All Records</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="RETRYING">RETRYING</option>
              <option value="DLQ">DLQ STORE</option>
              <option value="QUARANTINE">QUARANTINED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Transactions Table & Drawer */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Event & Delivery Log Table */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Event Backbone & Execution Stream
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredEvents.length} transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="pb-3 font-semibold">Correlation / Event</th>
                  <th className="pb-3 font-semibold">Partner & Protocol</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEvents.map(evt => (
                  <tr 
                    key={evt.correlationId} 
                    onClick={() => setSelectedEvent(evt)}
                    className={`hover:bg-slate-850 cursor-pointer transition ${
                      selectedEvent?.correlationId === evt.correlationId ? 'bg-cyan-950/30 border-l-2 border-cyan-500' : ''
                    }`}
                  >
                    <td className="py-4 pr-3">
                      <div className="font-mono font-bold text-cyan-400 text-xs">{evt.correlationId}</div>
                      <div className="text-slate-300 text-xs mt-1 font-semibold">{evt.eventType}</div>
                      <div className="text-slate-500 text-[11px] font-mono mt-0.5">{evt.timestamp}</div>
                    </td>
                    <td className="py-4 pr-3">
                      <div className="font-semibold text-white">{evt.partnerName}</div>
                      <div className="text-slate-400 text-[11px] font-mono mt-0.5">{evt.protocol} • {evt.tenantId}</div>
                    </td>
                    <td className="py-4 pr-3">
                      {getStatusBadge(evt.status)}
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-xs transition"
                      >
                        Inspect Payload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: DLQ / Quarantine Triage Drawer */}
        {selectedEvent && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    TRANSACTION TRIAGE & REPLAY
                  </div>
                  <h3 className="text-sm font-mono font-bold text-white mt-1">
                    {selectedEvent.correlationId}
                  </h3>
                </div>
                {getStatusBadge(selectedEvent.status)}
              </div>

              {/* Event Metadata Cards */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 mb-5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">EVENT TYPE:</span>
                  <span className="text-white font-bold">{selectedEvent.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PARTNER:</span>
                  <span className="text-cyan-400">{selectedEvent.partnerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TENANT SCOPE:</span>
                  <span className="text-emerald-400">{selectedEvent.tenantId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PROVIDER EVENT ID:</span>
                  <span className="text-slate-300">{selectedEvent.providerEventId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DELIVERY ATTEMPTS:</span>
                  <span className="text-amber-400 font-bold">{selectedEvent.attempts}</span>
                </div>
              </div>

              {/* Error Detail Banner if Failed/DLQ/Quarantine */}
              {selectedEvent.errorDetail && (
                <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 mb-5 text-xs text-rose-300">
                  <div className="font-mono font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    EXCEPTION RECORDED:
                  </div>
                  <p className="leading-relaxed font-mono">{selectedEvent.errorDetail}</p>
                </div>
              )}

              {/* Raw JSON Payload Inspection */}
              <div className="space-y-2 mb-6">
                <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Canonical Envelope Payload JSON
                </label>
                <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56">
                  {JSON.stringify(selectedEvent.rawPayload, null, 2)}
                </pre>
              </div>

              {/* Operator Replay Action Button (INT-REL-005) */}
              {(selectedEvent.status === 'DLQ' || selectedEvent.status === 'QUARANTINE' || selectedEvent.status === 'FAILED') && (
                <button
                  disabled={isReplaying}
                  onClick={() => handleReplayEvent(selectedEvent.correlationId)}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
                >
                  <RotateCcw className={`w-4 h-4 ${isReplaying ? 'animate-spin' : ''}`} />
                  {isReplaying ? 'Executing Replay...' : 'Execute Safe Operator Replay (INT-REL-005)'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
