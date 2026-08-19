'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/admin/platform/client';
import { errMessage } from '@/lib/admin/envelope';
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
  /** Present only for dead-lettered events — the only ones that can be reprocessed. */
  dlqId?: string;
  /** Present only for webhook deliveries — the only ones with an attempt history. */
  deliveryId?: string;
}

interface DeliveryAttempt {
  attempt_id?: string;
  attempt_number?: number;
  response_status?: number;
  outcome_class?: string;
  error_detail?: string;
  attempted_at?: string;
}

// ─── Backend record shapes ────────────────────────────────────────────────────
// Mirrored from integration-ecosystem:
//   Delivery      internal/domain/webhook/webhook.go:140
//   DLQRecord     internal/delivery/http/dto (DLQRecordResponse)

interface WebhookDelivery {
  delivery_id: string;
  subscription_id: string;
  tenant_id: string;
  event_id: string;
  event_type: string;
  payload_json: string;
  status: string;
  attempts: number;
  max_attempts: number;
  last_attempt_at?: string;
  response_status?: number;
  response_summary?: string;
  outcome_class?: string;
  dlq_id?: string;
  correlation_id?: string;
  created_at: string;
}

interface DLQRecord {
  dlq_id: string;
  connector_id: string;
  event_type: string;
  payload_json: string;
  failure_reason: string;
  retry_count: number;
  status: string;
  created_at: string;
}

interface QuarantineRecord {
  id?: string;
  quarantine_id?: string;
  tenant_id?: string;
  connector_id?: string;
  reason?: string;
  event_type?: string;
  payload_json?: string;
  created_at?: string;
}

/** Payloads are stored as an opaque JSON string; show the object when it parses. */
function parsePayload(raw: string | undefined): any {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

/**
 * The delivery log has richer states than this console's five. RETRYING covers
 * anything still scheduled; anything terminal-but-unsuccessful is FAILED.
 */
function deliveryStatus(d: WebhookDelivery): IntegrationEvent['status'] {
  const s = (d.status || '').toUpperCase();
  if (d.dlq_id) return 'DLQ';
  if (s === 'DELIVERED' || s === 'SUCCEEDED') return 'DELIVERED';
  if (s === 'PENDING' || s === 'RETRYING' || s === 'SCHEDULED') return 'RETRYING';
  return 'FAILED';
}

function mapDelivery(d: WebhookDelivery): IntegrationEvent {
  return {
    correlationId: d.correlation_id || d.delivery_id,
    providerEventId: d.event_id,
    tenantId: d.tenant_id,
    // The delivery record carries the subscription, not a partner display name.
    // Showing the id beats inventing a friendly label.
    partnerName: `subscription ${d.subscription_id?.slice(0, 8) ?? '—'}`,
    eventType: d.event_type,
    protocol: 'Webhook',
    status: deliveryStatus(d),
    timestamp: d.last_attempt_at || d.created_at,
    attempts: d.attempts ?? 0,
    payloadSummary: d.response_summary
      ? `HTTP ${d.response_status ?? '—'} · ${d.response_summary}`
      : `${d.attempts ?? 0}/${d.max_attempts ?? 0} attempts`,
    errorDetail: d.outcome_class && d.outcome_class !== 'SUCCESS' ? d.outcome_class : undefined,
    rawPayload: parsePayload(d.payload_json),
    dlqId: d.dlq_id,
    deliveryId: d.delivery_id,
  };
}

function mapDlq(r: DLQRecord): IntegrationEvent {
  return {
    correlationId: r.dlq_id,
    providerEventId: r.dlq_id,
    tenantId: '—',
    partnerName: `connector ${r.connector_id?.slice(0, 8) ?? '—'}`,
    eventType: r.event_type,
    protocol: 'Webhook',
    status: 'DLQ',
    timestamp: r.created_at,
    attempts: r.retry_count ?? 0,
    payloadSummary: r.failure_reason || 'Dead-lettered',
    errorDetail: r.failure_reason,
    rawPayload: parsePayload(r.payload_json),
    dlqId: r.dlq_id,
  };
}

function mapQuarantine(r: QuarantineRecord): IntegrationEvent {
  const id = r.quarantine_id ?? r.id ?? '—';
  return {
    correlationId: id,
    providerEventId: id,
    tenantId: r.tenant_id ?? '—',
    partnerName: `connector ${r.connector_id?.slice(0, 8) ?? '—'}`,
    eventType: r.event_type ?? 'QUARANTINED',
    protocol: 'Webhook',
    status: 'QUARANTINE',
    timestamp: r.created_at ?? '',
    attempts: 0,
    payloadSummary: r.reason || 'Held in quarantine',
    errorDetail: r.reason,
    rawPayload: parsePayload(r.payload_json),
  };
}


export default function IntegrationOperationsPage() {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<IntegrationEvent | null>(null);
  const [isWritingOff, setIsWritingOff] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // The event stream is assembled from the three places integration-ecosystem
  // actually records one: the webhook delivery log, the dead-letter store, and
  // the quarantine. They are separate endpoints because they are separate
  // lifecycle states, but an operator triaging "what happened to this event"
  // wants them in one list. One failing must not blank the other two.
  const eventsQ = useQuery({
    queryKey: ['superadmin', 'integration-events'],
    refetchInterval: 30_000,
    queryFn: async () => {
      const [deliveries, dlq, quarantine] = await Promise.all([
        platformApi
          .get<{ deliveries?: WebhookDelivery[] }>('integration', '/v1/webhooks/deliveries?limit=100')
          .then((r) => r.deliveries ?? [])
          .catch(() => [] as WebhookDelivery[]),
        platformApi
          .get<{ records?: DLQRecord[] }>('integration', '/v1/dlq')
          .then((r) => r.records ?? [])
          .catch(() => [] as DLQRecord[]),
        platformApi
          .get<{ records?: QuarantineRecord[] }>('integration', '/v1/quarantine')
          .then((r) => r.records ?? [])
          .catch(() => [] as QuarantineRecord[]),
      ]);
      return [
        ...deliveries.map(mapDelivery),
        ...dlq.map(mapDlq),
        ...quarantine.map(mapQuarantine),
      ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    },
  });
  const events = eventsQ.data ?? [];

  /**
   * Replay is only meaningful for a DLQ record — that is the only one of the
   * three stores with a reprocess route. The button is hidden for the others
   * rather than firing a call that cannot succeed.
   */
  const handleReplayEvent = async (correlationId: string) => {
    const target = events.find((e) => e.correlationId === correlationId);
    if (!target?.dlqId) {
      showToast('Only dead-lettered events can be reprocessed.');
      return;
    }
    setIsReplaying(true);
    try {
      await platformApi.post('integration', `/v1/dlq/${target.dlqId}/reprocess`, {});
      showToast(`Reprocess submitted for [${correlationId}].`);
      setSelectedEvent(null);
      await qc.invalidateQueries({ queryKey: ['superadmin', 'integration-events'] });
    } catch (e) {
      showToast(errMessage(e, 'Reprocess failed.'));
    } finally {
      setIsReplaying(false);
    }
  };

  /**
   * The other terminal option for a dead-lettered event.
   *
   * Reprocess says "try again"; write-off says "this will never succeed, stop
   * counting it as an outstanding failure". A poison message — malformed
   * payload, a partner that no longer exists — is retried forever otherwise,
   * and the DLQ stops being a list anyone reads.
   *
   * Guarded behind a confirmation because it is not reversible: written off is
   * a terminal state, and the event is not delivered by some other route
   * afterwards. Only DLQ records have the route; quarantine and plain failed
   * deliveries do not, so the button is hidden for them rather than firing a
   * call that 404s.
   */
  const handleWriteOff = async (correlationId: string) => {
    const target = events.find((e) => e.correlationId === correlationId);
    if (!target?.dlqId) {
      showToast('Only dead-lettered events can be written off.');
      return;
    }
    if (!window.confirm('Write off this event? It will not be delivered, and this cannot be undone.')) return;
    setIsWritingOff(true);
    try {
      await platformApi.post('integration', `/v1/dlq/${target.dlqId}/write-off`, {});
      showToast(`Written off [${correlationId}].`);
      setSelectedEvent(null);
      await qc.invalidateQueries({ queryKey: ['superadmin', 'integration-events'] });
    } catch (e) {
      showToast(errMessage(e, 'Write-off failed.'));
    } finally {
      setIsWritingOff(false);
    }
  };

  /**
   * Per-delivery attempt history. The list row carries only a count; this is
   * the record of what each attempt actually got back, which is the difference
   * between "the partner is down" and "we are sending them something they
   * reject". Fetched only when a delivery is selected — there is no value in
   * pulling attempt history for every row on screen.
   */
  const attemptsQ = useQuery({
    queryKey: ['superadmin', 'delivery-attempts', selectedEvent?.deliveryId],
    enabled: !!selectedEvent?.deliveryId,
    retry: false,
    queryFn: async () =>
      (await platformApi.get<{ attempts?: DeliveryAttempt[] }>(
        'integration',
        `/v1/webhooks/deliveries/${selectedEvent!.deliveryId}/attempts`,
      )).attempts ?? [],
  });

  /**
   * The full DLQ record. The unified list flattens three stores into one shape,
   * so fields unique to a DLQ record — connector, retry policy, the original
   * headers — are dropped on the way in. Fetched on selection to show them.
   */
  const dlqDetailQ = useQuery({
    queryKey: ['superadmin', 'dlq-detail', selectedEvent?.dlqId],
    enabled: !!selectedEvent?.dlqId,
    retry: false,
    queryFn: () => platformApi.get<Record<string, unknown>>('integration', `/v1/dlq/${selectedEvent!.dlqId}`),
  });

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

              {/* Attempt history — webhook deliveries only */}
              {selectedEvent.deliveryId && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Attempt history
                  </div>
                  {attemptsQ.isLoading && <p className="text-xs text-slate-500">Loading attempts…</p>}
                  {attemptsQ.error && (
                    <p className="text-xs text-rose-400">{errMessage(attemptsQ.error, 'Attempt history unavailable.')}</p>
                  )}
                  {attemptsQ.data && attemptsQ.data.length === 0 && (
                    <p className="text-xs text-slate-500">No attempts recorded yet.</p>
                  )}
                  {attemptsQ.data && attemptsQ.data.length > 0 && (
                    <ol className="flex flex-col gap-2">
                      {attemptsQ.data.map((a, i) => (
                        <li
                          key={a.attempt_id ?? i}
                          className="flex items-start gap-3 text-xs border-b border-slate-800/60 last:border-0 pb-2 last:pb-0"
                        >
                          <span className="font-mono text-slate-500 shrink-0 w-6">#{a.attempt_number ?? i + 1}</span>
                          <span
                            className={`font-mono font-bold shrink-0 w-12 ${
                              a.response_status && a.response_status < 400 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {a.response_status ?? '—'}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="text-slate-300">{a.outcome_class ?? '—'}</span>
                            {a.error_detail && (
                              <span className="block text-slate-500 font-mono text-[10px] mt-0.5 break-all">
                                {a.error_detail}
                              </span>
                            )}
                          </span>
                          <span className="text-slate-600 text-[10px] shrink-0">
                            {a.attempted_at ? new Date(a.attempted_at).toLocaleTimeString() : ''}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}

              {/* Full DLQ record — fields the unified list drops */}
              {selectedEvent.dlqId && dlqDetailQ.data && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Full DLQ record
                  </div>
                  <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto max-h-48">
                    {JSON.stringify(dlqDetailQ.data, null, 2)}
                  </pre>
                </div>
              )}

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

              {/* Write-off — the terminal alternative, DLQ records only */}
              {selectedEvent.dlqId && (
                <div>
                  <button
                    disabled={isWritingOff}
                    onClick={() => handleWriteOff(selectedEvent.correlationId)}
                    className="w-full py-3 bg-transparent hover:bg-rose-950/40 text-rose-400 border border-rose-500/30 font-bold rounded-2xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    {isWritingOff ? 'Writing off…' : 'Write Off — Will Not Be Delivered'}
                  </button>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    Use when the event can never succeed — a malformed payload, or a partner that no longer exists.
                    Terminal and not reversible; the event is not delivered by any other route afterwards.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
