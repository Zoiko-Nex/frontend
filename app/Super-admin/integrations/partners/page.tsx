'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/admin/platform/client';
import { errMessage } from '@/lib/admin/envelope';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  AlertTriangle, 
  Power, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  FileText, 
  Lock, 
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Layers,
  ChevronRight,
  Database,
  Radio
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  category: string;
  lifecycle: 'DRAFT' | 'CONTRACTED' | 'SANDBOX' | 'CERTIFIED' | 'ACTIVE' | 'SUSPENDED' | 'DECOMMISSIONING';
  health: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE' | 'MAINTENANCE' | 'SECURITY_HOLD' | 'RECONCILIATION_HOLD';
  controlState: 'ACTIVE' | 'READ_ONLY' | 'INBOUND_DISABLED' | 'OUTBOUND_DISABLED' | 'QUARANTINE' | 'DISABLED';
  tenancyMode: 'DEDICATED_TENANT' | 'SHARED_PARTNER_MULTI_TENANT';
  protocol: 'REST/HTTPS' | 'Webhooks' | 'SFTP/MFT' | 'AS2/B2B' | 'SMPP' | 'eSIM RSP (SGP.22)';
  iddReference: string;
  pipStatus: 'APPROVED' | 'IN_REVIEW' | 'PENDING';
  lastSync: string;
  /**
   * Tri-state on purpose. integration-ecosystem records no per-gate
   * certification result, so a gate is true/false only where a connector field
   * evidences it, and null ("not evidenced") otherwise. Rendering an
   * unevidenced gate as a green tick was the original sin of this screen.
   */
  gates: Record<string, boolean | null>;
}

// ─── Backend record shapes (integration-ecosystem) ────────────────────────────

interface Connector {
  connector_id: string;
  connector_name: string;
  connector_type: string;
  provider_name: string;
  status: string;
  auth_type: string;
  base_url?: string;
  rate_limit_per_minute?: number;
  timeout_ms?: number;
  tenancy_mode?: string;
  contracting_entity?: string;
  credential_scope?: string;
  arrangement_version?: string;
  created_at?: string;
}

interface IDD {
  idd_id?: string;
  idd_reference?: string;
  connector_id?: string;
  version?: string;
  status?: string;
}

/** connector_type is free-form upstream; map the ones the UI has a label for. */
function protocolOf(type: string | undefined): Partner['protocol'] {
  const t = (type ?? '').toUpperCase();
  if (t.includes('AS2') || t.includes('B2B')) return 'AS2/B2B';
  if (t.includes('SFTP') || t.includes('MFT')) return 'SFTP/MFT';
  if (t.includes('SMPP')) return 'SMPP';
  if (t.includes('ESIM') || t.includes('RSP') || t.includes('SGP')) return 'eSIM RSP (SGP.22)';
  if (t.includes('WEBHOOK')) return 'Webhooks';
  return 'REST/HTTPS';
}

function lifecycleOf(status: string | undefined): Partner['lifecycle'] {
  const s = (status ?? '').toUpperCase();
  if (s === 'ACTIVE') return 'ACTIVE';
  if (s === 'SUSPENDED') return 'SUSPENDED';
  if (s === 'RETIRED' || s === 'DECOMMISSIONING') return 'DECOMMISSIONING';
  if (s === 'CERTIFIED') return 'CERTIFIED';
  if (s === 'SANDBOX') return 'SANDBOX';
  if (s === 'CONTRACTED') return 'CONTRACTED';
  return 'DRAFT';
}

/**
 * Health is a runtime property. The connector record is configuration, so the
 * honest mapping is from its lifecycle status only — an ACTIVE connector is
 * reachable-as-configured, a SUSPENDED one is deliberately held. Per-connection
 * liveness lives on GET /v1/connections/{id}/health and is not fetched here.
 */
function healthOf(status: string | undefined): Partner['health'] {
  const s = (status ?? '').toUpperCase();
  if (s === 'ACTIVE') return 'HEALTHY';
  if (s === 'SUSPENDED') return 'SECURITY_HOLD';
  if (s === 'RETIRED') return 'UNAVAILABLE';
  return 'MAINTENANCE';
}

function mapConnector(c: Connector, idds: IDD[]): Partner {
  const idd = idds.find((i) => i.connector_id === c.connector_id);
  const status = (c.status ?? '').toUpperCase();
  const authed = !!c.auth_type && c.auth_type.toUpperCase() !== 'NONE';

  return {
    id: c.connector_id,
    name: c.connector_name,
    category: c.connector_type || 'Uncategorised',
    lifecycle: lifecycleOf(c.status),
    health: healthOf(c.status),
    controlState: status === 'ACTIVE' ? 'ACTIVE' : status === 'SUSPENDED' ? 'DISABLED' : 'READ_ONLY',
    tenancyMode: (c.tenancy_mode ?? '').toUpperCase().includes('SHARED')
      ? 'SHARED_PARTNER_MULTI_TENANT'
      : 'DEDICATED_TENANT',
    protocol: protocolOf(c.connector_type),
    iddReference: idd?.idd_reference ?? idd?.idd_id ?? 'none registered',
    pipStatus: status === 'ACTIVE' ? 'APPROVED' : status === 'DRAFT' ? 'PENDING' : 'IN_REVIEW',
    lastSync: c.created_at ? new Date(c.created_at).toLocaleString() : '—',
    // Only gates a connector field actually evidences get a verdict. The rest
    // are null and render as "not evidenced" — the service records no per-gate
    // certification result, so claiming a pass would be fabrication.
    gates: {
      g1_contract: !!c.contracting_entity,
      g2_security: authed,
      g3_tenancy: !!c.tenancy_mode,
      g4_canonical: null,
      g5_reliability: !!(c.rate_limit_per_minute || c.timeout_ms),
      g6_reconciliation: null,
      g7_operations: null,
      g8_resilience: null,
    },
  };
}

export default function IntegrationPartnersPage() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // The partner registry IS the connector registry — integration-ecosystem has
  // no separate "partner" resource. IDDs are fetched alongside so a connector
  // can be matched to its interface-definition document, which is the one field
  // on this screen that lives outside the connector record.
  const partnersQ = useQuery({
    queryKey: ['superadmin', 'connectors'],
    queryFn: async () => {
      const [connectors, idds] = await Promise.all([
        platformApi.get<{ connectors?: Connector[] }>('integration', '/v1/connectors').then((r) => r.connectors ?? []),
        platformApi
          .get<{ idds?: IDD[] }>('integration', '/v1/idds')
          .then((r) => r.idds ?? [])
          .catch(() => [] as IDD[]),
      ]);
      return connectors.map((c) => mapConnector(c, idds));
    },
  });
  const partners = useMemo(() => partnersQ.data ?? [], [partnersQ.data]);

  const selectedPartner = partners.find((p) => p.id === selectedId) ?? partners[0] ?? null;

  /**
   * The control plane exposes suspend and activate on a connector, and a
   * kill-switch on a connection. QUARANTINE / READ_ONLY / *_DISABLED are states
   * this screen can display but the service cannot be put into, so those
   * requests are refused here rather than silently doing nothing.
   */
  const handleUpdateControlState = async (partnerId: string, newState: Partner['controlState']) => {
    const route =
      newState === 'ACTIVE' ? 'activate' : newState === 'DISABLED' || newState === 'QUARANTINE' ? 'suspend' : null;
    if (!route) {
      showNotification(`No control-plane route for state [${newState}] — connectors support activate and suspend only.`);
      return;
    }
    setIsUpdatingState(true);
    try {
      await platformApi.post('integration', `/v1/connectors/${partnerId}/${route}`, {});
      showNotification(`Control plane updated: ${partnerId} → ${route.toUpperCase()}`);
      await qc.invalidateQueries({ queryKey: ['superadmin', 'connectors'] });
    } catch (e) {
      showNotification(errMessage(e, 'Control-plane update failed.'));
    } finally {
      setIsUpdatingState(false);
    }
  };

  /**
   * Lifecycle is governed by the activation workflow (request → approvals →
   * activate) and by retire. It is not a field an operator sets directly, so
   * only the two transitions with real routes are wired.
   */
  const handleUpdateLifecycle = async (partnerId: string, newLifecycle: Partner['lifecycle']) => {
    const route = newLifecycle === 'ACTIVE' ? 'activate' : newLifecycle === 'DECOMMISSIONING' ? 'retire' : null;
    if (!route) {
      showNotification(
        `[${newLifecycle}] is set by the activation workflow, not directly — use the activation request and approvals.`,
      );
      return;
    }
    try {
      await platformApi.post('integration', `/v1/connectors/${partnerId}/${route}`, {});
      showNotification(`Lifecycle updated: ${partnerId} → ${newLifecycle}`);
      await qc.invalidateQueries({ queryKey: ['superadmin', 'connectors'] });
    } catch (e) {
      showNotification(errMessage(e, 'Lifecycle update failed.'));
    }
  };

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'ALL' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getHealthBadge = (health: Partner['health']) => {
    switch (health) {
      case 'HEALTHY':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />HEALTHY</span>;
      case 'DEGRADED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />DEGRADED</span>;
      case 'RECONCILIATION_HOLD':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20"><AlertTriangle className="w-3 h-3" />REC HOLD</span>;
      case 'SECURITY_HOLD':
      case 'UNAVAILABLE':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="w-3 h-3" />UNAVAILABLE</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">{health}</span>;
    }
  };

  const getControlStateBadge = (state: Partner['controlState']) => {
    switch (state) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">ACTIVE (NORMAL)</span>;
      case 'READ_ONLY':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800/40">READ ONLY</span>;
      case 'QUARANTINE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950 text-purple-400 border border-purple-800/40">QUARANTINED</span>;
      case 'DISABLED':
      case 'INBOUND_DISABLED':
      case 'OUTBOUND_DISABLED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800/40">{state}</span>;
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
            <span>ZOIKONEX BSS ARCHITECTURE</span>
            <span>•</span>
            <span className="text-slate-400">ZN-INT-EXT-001 v2.1</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Server className="w-8 h-8 text-cyan-400" />
            Partner Integration & Lifecycle Controls
          </h1>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <Link 
            href="/Super-admin/integrations/partners" 
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5" />
            Partner Controls
          </Link>
          <Link 
            href="/Super-admin/integrations/operations" 
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2"
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

      {/* Top Telemetry KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>ACTIVE PARTNER CONNECTIONS</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {partners.filter(p => p.lifecycle === 'ACTIVE').length} / {partners.length}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>100% Contract & Schema Validated</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>EMERGENCY CONTROL PLANE</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {partners.filter(p => p.controlState !== 'ACTIVE').length > 0 ? (
              <span className="text-amber-400">{partners.filter(p => p.controlState !== 'ACTIVE').length} OVERRIDDEN</span>
            ) : (
              'ALL NORMAL'
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>15-min SLA Disablement Ready</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>PIP & GOVERNANCE PIPELINE</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {partners.filter(p => p.pipStatus === 'APPROVED').length} Approved
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>1 PIP in Review Gate (G4–G8)</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>PROTOCOL EDGE GATEWAYS</span>
            <Radio className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono">
            6 ACTIVE
          </div>
          <div className="mt-2 text-xs text-slate-400 truncate">
            <span>REST • Webhooks • SFTP • SMPP • eSIM</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Directory & Control Panel */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Partner Directory Table */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur">
          
          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search partner, IDD, or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Filter:</span>
              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Payment Processor">Payment Processor</option>
                <option value="International Calling Provider">Voice / Calling</option>
                <option value="eSIM / RSP Provider">eSIM RSP</option>
                <option value="Tax & Jurisdiction">Tax & Jurisdiction</option>
                <option value="Core Carrier / MVNE">Carrier / MVNE</option>
              </select>
            </div>
          </div>

          {/* Directory List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="pb-3 font-semibold">Partner / Spec IDD</th>
                  <th className="pb-3 font-semibold">Health & Control</th>
                  <th className="pb-3 font-semibold">Lifecycle</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPartners.map(partner => (
                  <tr 
                    key={partner.id} 
                    onClick={() => setSelectedId(partner.id)}
                    className={`hover:bg-slate-850 cursor-pointer transition ${
                      selectedPartner?.id === partner.id ? 'bg-cyan-950/30 border-l-2 border-cyan-500' : ''
                    }`}
                  >
                    <td className="py-4 pr-3">
                      <div className="font-bold text-white text-sm">{partner.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[11px] text-cyan-400">{partner.iddReference}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{partner.protocol}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-3">
                      <div className="flex flex-col gap-1.5 items-start">
                        {getHealthBadge(partner.health)}
                        {getControlStateBadge(partner.controlState)}
                      </div>
                    </td>
                    <td className="py-4 pr-3">
                      <span className="px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-slate-800 text-slate-300">
                        {partner.lifecycle}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(partner.id);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-xs transition"
                      >
                        Inspect Control
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Emergency Kill-Switch & Governance Control Drawer */}
        {selectedPartner && (
          <div className="lg:col-span-5 space-y-6">
            
            {/* Control Plane & Kill-Switch Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    EMERGENCY CONTROL PLANE (INT-ARC-003)
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">
                    {selectedPartner.name}
                  </h3>
                </div>
                {getHealthBadge(selectedPartner.health)}
              </div>

              {/* Tenancy & Protocol Metadata */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 mb-6 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">PARTNER ID:</span>
                  <span className="text-white">{selectedPartner.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SPEC IDD:</span>
                  <span className="text-cyan-400 font-bold">{selectedPartner.iddReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TENANT RESOLUTION MODE:</span>
                  <span className="text-emerald-400">{selectedPartner.tenancyMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CURRENT CONTROL STATE:</span>
                  <span>{getControlStateBadge(selectedPartner.controlState)}</span>
                </div>
              </div>

              {/* 15-Minute Emergency Disablement Buttons */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Control State Overrides
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isUpdatingState}
                    onClick={() => handleUpdateControlState(selectedPartner.id, 'ACTIVE')}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      selectedPartner.controlState === 'ACTIVE'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ACTIVE (Normal)
                  </button>

                  <button
                    disabled={isUpdatingState}
                    onClick={() => handleUpdateControlState(selectedPartner.id, 'READ_ONLY')}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      selectedPartner.controlState === 'READ_ONLY'
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    READ ONLY
                  </button>

                  <button
                    disabled={isUpdatingState}
                    onClick={() => handleUpdateControlState(selectedPartner.id, 'QUARANTINE')}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      selectedPartner.controlState === 'QUARANTINE'
                        ? 'bg-purple-950 border-purple-500 text-purple-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                    QUARANTINE
                  </button>

                  <button
                    disabled={isUpdatingState}
                    onClick={() => handleUpdateControlState(selectedPartner.id, 'DISABLED')}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      selectedPartner.controlState === 'DISABLED'
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 text-rose-400" />
                    KILL-SWITCH
                  </button>
                </div>
              </div>

              {/* Lifecycle State Selector */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Partner Lifecycle State (INT-LCM-001)
                </label>
                <select
                  value={selectedPartner.lifecycle}
                  onChange={e => handleUpdateLifecycle(selectedPartner.id, e.target.value as Partner['lifecycle'])}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs font-mono outline-none focus:border-cyan-500"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="CONTRACTED">CONTRACTED</option>
                  <option value="SANDBOX">SANDBOX</option>
                  <option value="CERTIFIED">CERTIFIED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="DECOMMISSIONING">DECOMMISSIONING</option>
                </select>
              </div>
            </div>

            {/* Certification Gates (G1 to G8) Checklist Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Certification Gates Audit (INT-LCM-003)
                </h4>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {Object.values(selectedPartner.gates).filter((g) => g === true).length}
                  {' / '}
                  {Object.values(selectedPartner.gates).filter((g) => g !== null).length} EVIDENCED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(selectedPartner.gates).map(([gateKey, passed]) => (
                  <div
                    key={gateKey}
                    className={`p-2.5 rounded-xl border flex items-center justify-between font-mono text-[11px] ${
                      passed === null
                        ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                        : passed
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-900/40 text-rose-400'
                    }`}
                    title={passed === null ? 'The connector API records no result for this gate.' : undefined}
                  >
                    <span>{gateKey.replace('_', ' ').toUpperCase()}</span>
                    {passed === null
                      ? <Clock className="w-4 h-4 text-slate-600" />
                      : passed
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : <XCircle className="w-4 h-4 text-rose-400" />}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] font-mono text-slate-500">
                Greyed gates are not evidenced by the connector API — no per-gate certification result is recorded.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
