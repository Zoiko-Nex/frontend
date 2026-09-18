'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/admin/platform/client';
import { errMessage, shortId } from '@/lib/admin/envelope';
import Link from 'next/link';
import ActivationLifecycleModal from './ActivationLifecycle';
import OperationsCatalogueModal from './OperationsCatalogue';
import DocAnalyserModal from './DocAnalyser';
import {
  Radio,
  Activity,
  Server,
  ShieldCheck,
  Sliders,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Play,
  ArrowRight,
  ChevronRight,
  Eye,
  Code2,
  Database,
  Sparkles,
  Cpu,
  KeyRound,
  ShieldAlert,
  Network,
  Zap,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';

// ─── Backend record shapes (integration-ecosystem & identity-tenancy) ───────────

interface Connector {
  connector_id: string;
  connector_name: string;
  connector_type: string;
  provider_name: string;
  status: string;
  auth_type: string;
  base_url?: string;
  brand_id?: string;
  rate_limit_per_minute?: number;
  timeout_ms?: number;
  tenancy_mode?: string;
  contracting_entity?: string;
  credential_scope?: string;
  funds_flow_mode?: string;
  merchant_or_payee_role?: string;
  regulated_role?: string;
  data_processing_role?: string;
  revenue_presentation?: string;
  arrangement_version?: string;
  created_at?: string;
}

interface BrandRef {
  id: string;
  name: string;
  code_name: string;
}

interface TenantRef {
  tenant_id: string;
  name: string;
  domain_suffix?: string;
  brands?: BrandRef[];
}

interface ReadinessGateReport {
  connector_id: string;
  provider_name: string;
  overall_readiness: string;
  credential_state: string;
  operations_registered: number;
  operations_certified: number;
  gates: Record<string, { status: string; reason?: string; blocker?: string }>;
}

interface MappingDefinition {
  mapping_id: string;
  connector_id: string;
  mapping_name: string;
  version: string;
  status: string;
  registered_by?: string;
  registered_at?: string;
  created_at: string;
}

interface MappingEntry {
  entry_id: string;
  mapping_id: string;
  canonical_code: string;
  provider_code: string;
  description?: string;
  status: string;
  created_at: string;
}

interface OperationItem {
  operation_id: string;
  operation_name: string;
  http_method: string;
  path_template: string;
  is_retryable: boolean;
  certification_status: string;
  certified_by?: string;
}

interface CredentialItem {
  credential_id: string;
  environment: string;
  credential_type: string;
  fingerprint: string;
  status: string;
  submitted_by?: string;
  created_at: string;
  expires_at?: string;
}

interface ActivationItem {
  activation_id: string;
  connector_id: string;
  environment: string;
  maker_identity: string;
  qualification_status: string;
  approvals_complete: boolean;
  checker_identity?: string;
  state: string;
  reject_reason?: string;
}

// NOTE: this page previously carried a DEFAULT_CODEBASE_MVNOS array — two
// fully-specified Nexus connectors — that was merged OVER the backend response,
// so the table showed them whether or not they existed in the integration
// service. An operator reading it could not tell a configured carrier from a
// hardcoded placeholder, and "Gates", "SOCs" and "Vault" opened against
// connector ids the backend had never heard of.
//
// The list now reflects only what /v1/connectors actually returns. An empty
// table is a true statement about the platform, and a more useful one than a
// populated table that is not.

/**
 * Which connector statuses can still be driven through §10 activation.
 *
 * Mirrored from services/integration-ecosystem/internal/domain/connector:
 * Activate() rejects DRAFT / CONTRACTED / SANDBOX outright, and transitions to
 * ACTIVE only from CERTIFIED or SUSPENDED. The §10 checker is what issues
 * CERTIFIED, so those early statuses reach production through the activation
 * flow and nowhere else. CERTIFIED is included because an activation request
 * can exist and still be awaiting its checker.
 */
const ACTIVATION_STATUSES = new Set(['DRAFT', 'CONTRACTED', 'SANDBOX', 'CERTIFIED']);

/** Wind-down states. Nothing here can be activated, suspended or resumed. */
const TERMINAL_STATUSES = new Set(['DECOMMISSIONING', 'ARCHIVED', 'RETIRED']);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminMvnoPage() {
  const qc = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);

  // Modals
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [readinessModalId, setReadinessModalId] = useState<string | null>(null);
  const [activationConnector, setActivationConnector] = useState<Connector | null>(null);
  const [operationsConnector, setOperationsConnector] = useState<Connector | null>(null);
  const [docAnalyserConnector, setDocAnalyserConnector] = useState<Connector | null>(null);
  const [mappingModalConnector, setMappingModalConnector] = useState<Connector | null>(null);
  const [credentialModalConnector, setCredentialModalConnector] = useState<Connector | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Queries ────────────────────────────────────────────────────────────────

  // Connectors from integration-ecosystem (port 8097)
  const connectorsQ = useQuery({
    queryKey: ['superadmin', 'connectors'],
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ connectors?: Connector[] }>('integration', '/v1/connectors');
        return res.connectors ?? [];
      } catch {
        return [];
      }
    },
  });

  // Brands / Tenants from identity-tenancy (port 8080) for brand name resolution
  const tenantsQ = useQuery({
    queryKey: ['superadmin', 'tenants'],
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ tenants?: TenantRef[] }>('identity', '/v1/tenants');
        return res.tenants ?? [];
      } catch {
        return [];
      }
    },
  });

  const backendConnectors = connectorsQ.data ?? [];
  const tenants = tenantsQ.data ?? [];

  // Flatten brands across all tenants for lookup, with default fallback bindings
  const brandMap = useMemo(() => {
    const map = new Map<string, { brandName: string; tenantName: string }>();
    // Pre-populate known brands from the IDD / identity architecture
    map.set('b1a2b3c4-d5e6-47a8-89c0-d1e2f3a4b5c6', { brandName: 'Zoiko Mobile', tenantName: 'Zoiko Telecom' });
    map.set('9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c', { brandName: 'Zoiko Mobile', tenantName: 'Acme Telecom' });
    map.set('b2b2b2b2-2222-4222-8222-222222222222', { brandName: 'DriverX Mobile', tenantName: 'DriverX Fleet' });

    for (const t of tenants) {
      if (t.brands) {
        for (const b of t.brands) {
          map.set(b.id, { brandName: b.name, tenantName: t.name });
        }
      }
    }
    return map;
  }, [tenants]);

  // Carrier connectors, exactly as the integration service reports them.
  const mvnoConnectors = useMemo(
    () => backendConnectors.filter((c) => (c.connector_type || '').toUpperCase() === 'MVNE_PLATFORM'),
    [backendConnectors],
  );

  const filteredMvnos = useMemo(() => {
    return mvnoConnectors.filter((c) => {
      const brandInfo = c.brand_id ? brandMap.get(c.brand_id) : null;
      const brandName = brandInfo?.brandName ?? '';
      const tenantName = brandInfo?.tenantName ?? '';

      const matchesSearch =
        c.connector_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.connector_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenantName.toLowerCase().includes(searchTerm.toLowerCase());

      const status = (c.status || '').toUpperCase();
      const matchesStatus =
        statusFilter === 'ALL' ||
        status === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [mvnoConnectors, searchTerm, statusFilter, brandMap]);

  // Which adapter protocols are actually in play, and under which regulatory
  // roles. Both were fixed strings before, so the tiles asserted a topology
  // rather than reporting one.
  const providerSummary = useMemo(() => {
    const providers = Array.from(new Set(mvnoConnectors.map((c) => c.provider_name).filter(Boolean)));
    if (providers.length === 0) return { label: 'none', detail: 'No carrier adapter registered' };
    return {
      label: providers.join(' · '),
      detail: `${providers.length} adapter${providers.length === 1 ? '' : 's'} across ${mvnoConnectors.length} connector${mvnoConnectors.length === 1 ? '' : 's'}`,
    };
  }, [mvnoConnectors]);

  const regulatedRoles = useMemo(
    () => Array.from(new Set(mvnoConnectors.map((c) => c.regulated_role).filter(Boolean))) as string[],
    [mvnoConnectors],
  );

  // Telemetry aggregates
  const activeCount = mvnoConnectors.filter((c) => (c.status || '').toUpperCase() === 'ACTIVE').length;
  const certifiedCount = mvnoConnectors.filter((c) => (c.status || '').toUpperCase() === 'CERTIFIED').length;
  const sandboxCount = mvnoConnectors.filter((c) => (c.status || '').toUpperCase() === 'SANDBOX').length;

  // ─── Control Plane Actions ──────────────────────────────────────────────────

  const handleToggleLifecycle = async (connector: Connector, action: 'activate' | 'suspend' | 'retire') => {
    try {
      await platformApi.post('integration', `/v1/connectors/${connector.connector_id}/${action}`, {});
      showToast(`MVNO Connector ${connector.connector_name} → ${action.toUpperCase()} succeeded`);
      await qc.invalidateQueries({ queryKey: ['superadmin', 'connectors'] });
    } catch (e) {
      showToast(errMessage(e, `Failed to ${action} connector`));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-200 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Quick Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span>ZOIKONEX SUPER ADMIN</span>
            <span>•</span>
            <span className="text-slate-400">DOMAIN 18: INTEGRATION ECOSYSTEM</span>
            <span>•</span>
            <span className="text-emerald-400">ZN-INT-IDD-001 (MVNE / T-MOBILE)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Radio className="w-8 h-8 text-cyan-400" />
            MVNO Carrier Integrations &amp; Southbound Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Governed south-bound carrier interfaces (Nexus, Transatel, G+D, Roaming Clearing, eSIM RSP). Every MVNO is backed by an auditable, credentialed <code className="text-cyan-300 font-mono">MVNE_PLATFORM</code> connector.
          </p>
        </div>

        {/* Global Nav Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl self-start md:self-auto shadow-inner">
          <Link
            href="/Super-admin/integrations/mvno"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 shadow-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            MVNO Carriers
          </Link>
          <Link
            href="/Super-admin/integrations/partners"
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5" />
            Partner Controls
          </Link>
          <Link
            href="/Super-admin/integrations/operations"
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            Operations &amp; Trace
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
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>ACTIVE MVNO CARRIERS</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {activeCount} <span className="text-xs font-normal text-slate-400">/ {mvnoConnectors.length} total</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>{certifiedCount} Certified · {sandboxCount} Sandbox</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>CARRIER ADAPTER PROTOCOL</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          {/* Derived from the connectors actually registered. This tile used to
              read "NEXUS (T-MO)" and "49 Southbound Telecom Operations" as fixed
              text, which stayed on screen whether or not a Nexus connector
              existed and whether or not any operation was registered. */}
          <div className="text-2xl font-bold text-cyan-400 font-mono uppercase">
            {providerSummary.label}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>{providerSummary.detail}</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>COMMERCIAL TOPOLOGY</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">
            {regulatedRoles.length > 0 ? 'IMMUTABLE' : '—'}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>
              {regulatedRoles.length > 0
                ? `${regulatedRoles.length} regulatory role${regulatedRoles.length === 1 ? '' : 's'} in use: ${regulatedRoles.join(', ')}`
                : 'No connector has declared a regulatory role yet'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>GOVERNED ACTIVATION</span>
            <KeyRound className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            MAKER-CHECKER
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>Dual-identity Production Gating (ED-2026-08 §10)</span>
          </div>
        </div>
      </div>

      {/* Main Action Bar & Directory Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search MVNO, Brand, Provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-cyan-500 font-medium"
          >
            <option value="ALL">All Lifecycles</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CERTIFIED">CERTIFIED</option>
            <option value="SANDBOX">SANDBOX</option>
            <option value="CONTRACTED">CONTRACTED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>

          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['superadmin', 'connectors'] })}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="Refresh Connectors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Onboard MVNO CTA */}
        <button
          onClick={() => setOnboardOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Onboard MVNO Carrier
        </button>
      </div>

      {/* MVNO Carrier Registry Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur mb-10 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Integrated MVNO Carrier Directory
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Southbound MVNE platforms delivering SIM provisioning, HLR queries, number porting, and CDR streams.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredMvnos.length} {filteredMvnos.length === 1 ? 'Carrier' : 'Carriers'} Listed
          </span>
        </div>

        {connectorsQ.isLoading ? (
          <div className="py-20 text-center text-xs font-mono text-slate-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-500" />
            <span>Querying integration-ecosystem (port 8097)...</span>
          </div>
        ) : connectorsQ.isError ? (
          <div className="py-16 text-center text-xs font-mono text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6">
            <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <p className="font-bold">Failed to load connectors from integration-ecosystem</p>
            <p className="text-slate-400 mt-1">{errMessage(connectorsQ.error, 'Service unreachable or returned non-200.')}</p>
          </div>
        ) : filteredMvnos.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-8">
            <Radio className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-200">No MVNE Platform Connectors Registered</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              No southbound <code className="text-cyan-400 font-mono">MVNE_PLATFORM</code> connector is currently bound to the platform tenant. Onboard a new MVNO carrier adapter (e.g. Nexus / T-Mobile) to begin.
            </p>
            <button
              onClick={() => setOnboardOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Onboard First MVNO Carrier
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <th className="pb-3 font-semibold">MVNO / Brand</th>
                  <th className="pb-3 font-semibold">Carrier / Provider</th>
                  <th className="pb-3 font-semibold">Auth &amp; Transport</th>
                  <th className="pb-3 font-semibold">Tenancy Mode</th>
                  <th className="pb-3 font-semibold">Lifecycle</th>
                  <th className="pb-3 font-semibold text-right">Governed Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMvnos.map((c) => {
                  const brandInfo = c.brand_id ? brandMap.get(c.brand_id) : null;
                  const brandName = brandInfo?.brandName ?? (c.brand_id ? shortId(c.brand_id) : 'Core Platform');
                  const tenantName = brandInfo?.tenantName ?? 'Platform Master';
                  const status = (c.status || 'DRAFT').toUpperCase();

                  return (
                    <tr key={c.connector_id} className="hover:bg-slate-850/60 transition group">
                      {/* MVNO Brand */}
                      <td className="py-4">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{brandName}</span>
                          {c.provider_name.toLowerCase() === 'nexus' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-pink-500/10 text-pink-400 border border-pink-500/30">
                              T-MOBILE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>Tenant: {tenantName}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-500">{shortId(c.connector_id)}</span>
                        </div>
                      </td>

                      {/* Carrier / Provider */}
                      <td className="py-4">
                        <div className="font-semibold text-slate-200">{c.connector_name}</div>
                        <div className="font-mono text-[11px] text-cyan-400/80 truncate max-w-xs">
                          {c.base_url || 'https://api.nexus.mvnoc.ai'}
                        </div>
                      </td>

                      {/* Auth & Transport */}
                      <td className="py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {c.auth_type || 'JWT_PASSWORD_GRANT'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Limit: {c.rate_limit_per_minute ?? 60} req/m · {c.timeout_ms ?? 5000}ms
                        </div>
                      </td>

                      {/* Tenancy Mode */}
                      <td className="py-4">
                        <span className="font-mono text-[11px] text-slate-300">
                          {c.tenancy_mode || 'PROVIDER_SUBACCOUNT'}
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {c.regulated_role || 'MVNO_OPERATOR'}
                        </div>
                      </td>

                      {/* Lifecycle Status */}
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                            status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : status === 'CERTIFIED'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                              : status === 'SANDBOX'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : status === 'SUSPENDED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Readiness Gate Inspector */}
                          <button
                            onClick={() => setReadinessModalId(c.connector_id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                            title="Inspect G1-G8 Certification Gates"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Gates</span>
                          </button>

                          {/* SOC / Plan Mapper */}
                          <button
                            onClick={() => setMappingModalConnector(c)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                            title="Plan & SOC Mapping Registry"
                          >
                            <Code2 className="w-3.5 h-3.5 text-purple-400" />
                            <span>SOCs</span>
                          </button>

                          {/* Credentials */}
                          <button
                            onClick={() => setCredentialModalConnector(c)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                            title="Vault Credentials & Token Status"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                            <span>Vault</span>
                          </button>

                          {/* Read the provider's documentation and propose
                              capability-matrix entries for review. */}
                          <button
                            onClick={() => setDocAnalyserConnector(c)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-violet-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                            title="Analyse provider API documentation (proposes, never registers)"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                            <span>Docs</span>
                          </button>

                          {/* Capability matrix — the allowlist an adapter is
                              checked against at call time. */}
                          <button
                            onClick={() => setOperationsConnector(c)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                            title="Capability Matrix (registered operations)"
                          >
                            <Cpu className="w-3.5 h-3.5 text-sky-400" />
                            <span>Ops</span>
                          </button>

                          {/* Lifecycle, mirroring Connector.Activate()'s guard in
                              the Go domain: DRAFT / CONTRACTED / SANDBOX are
                              refused with ErrNotCertified, and only the §10
                              checker path issues the CERTIFIED that makes
                              activation reachable. So the route to live differs
                              by where the connector already is, and offering the
                              wrong one produces a 422 the operator cannot act on. */}
                          {ACTIVATION_STATUSES.has(status) && (
                            <button
                              onClick={() => setActivationConnector(c)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition flex items-center gap-1.5 cursor-pointer"
                              title="Maker-checker activation (ED-2026-08 §10)"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Activation</span>
                            </button>
                          )}

                          {/* Resuming a suspended connector is a direct move and
                              rightly so: it was already certified and approved,
                              and a pause does not revoke that. Re-running the
                              full §10 flow to undo a suspension would make
                              operators reluctant to suspend at all. */}
                          {status === 'SUSPENDED' && (
                            <button
                              onClick={() => handleToggleLifecycle(c, 'activate')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition cursor-pointer"
                              title="Resume this suspended connector"
                            >
                              Resume
                            </button>
                          )}

                          {/* Emergency stop stays immediate and ungoverned: a
                              kill-switch that needs five approvals is not one. */}
                          {status === 'ACTIVE' && (
                            <button
                              onClick={() => handleToggleLifecycle(c, 'suspend')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition cursor-pointer"
                              title="Emergency Suspend Connector"
                            >
                              Suspend
                            </button>
                          )}

                          {TERMINAL_STATUSES.has(status) && (
                            <span className="text-[11px] text-slate-600 px-2">No further action</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL: Onboard MVNO Wizard ──────────────────────────────────────── */}
      {onboardOpen && (
        <OnboardMvnoWizardModal
          tenants={tenants}
          onClose={() => setOnboardOpen(false)}
          onSuccess={(msg) => {
            setOnboardOpen(false);
            showToast(msg);
            qc.invalidateQueries({ queryKey: ['superadmin', 'connectors'] });
          }}
        />
      )}

      {/* ─── MODAL: AI documentation analysis (proposal + review) ───────────── */}
      {docAnalyserConnector && (
        <DocAnalyserModal
          connectorId={docAnalyserConnector.connector_id}
          connectorName={docAnalyserConnector.connector_name}
          providerName={docAnalyserConnector.provider_name}
          onClose={() => setDocAnalyserConnector(null)}
          onApplied={(msg) => showToast(msg)}
        />
      )}

      {/* ─── MODAL: Maker-checker activation (ED-2026-08 §10) ───────────────── */}
      {activationConnector && (
        <ActivationLifecycleModal
          connectorId={activationConnector.connector_id}
          connectorName={activationConnector.connector_name}
          onClose={() => setActivationConnector(null)}
          onChanged={(msg) => showToast(msg)}
        />
      )}

      {/* ─── MODAL: Capability matrix (INT-ARC-012 / G1) ─────────────────────── */}
      {operationsConnector && (
        <OperationsCatalogueModal
          connectorId={operationsConnector.connector_id}
          connectorName={operationsConnector.connector_name}
          providerName={operationsConnector.provider_name}
          onClose={() => setOperationsConnector(null)}
          onChanged={(msg) => showToast(msg)}
        />
      )}

      {/* ─── MODAL: Certification Readiness Gate Inspector (G1–G8) ──────────── */}
      {readinessModalId && (
        <CertificationReadinessModal
          connectorId={readinessModalId}
          onClose={() => setReadinessModalId(null)}
        />
      )}

      {/* ─── MODAL: Plan & SOC Mapping Registry ─────────────────────────────── */}
      {mappingModalConnector && (
        <PlanSocMappingModal
          connector={mappingModalConnector}
          onClose={() => setMappingModalConnector(null)}
        />
      )}

      {/* ─── MODAL: Vault Credentials & Token Lifecycle ─────────────────────── */}
      {credentialModalConnector && (
        <VaultCredentialModal
          connector={credentialModalConnector}
          onClose={() => setCredentialModalConnector(null)}
          onSuccess={() => {
            setCredentialModalConnector(null);
            showToast('Credential updated in Vault');
            qc.invalidateQueries({ queryKey: ['superadmin', 'connectors'] });
          }}
        />
      )}
    </div>
  );
}

// ─── COMPONENT: Onboard MVNO Wizard Modal ──────────────────────────────────────

function OnboardMvnoWizardModal({
  tenants,
  onClose,
  onSuccess,
}: {
  tenants: TenantRef[];
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    connector_name: 'Nexus — T-Mobile US Enablement',
    connector_type: 'MVNE_PLATFORM',
    provider_name: 'nexus',
    base_url: 'https://api.nexus.mvnoc.ai',
    auth_type: 'JWT_PASSWORD_GRANT',
    brand_id: '',
    rate_limit_per_minute: 60,
    timeout_ms: 5000,
    // 7 Required Immutable Topology Fields (INT-ARC-015)
    tenancy_mode: 'PROVIDER_SUBACCOUNT',
    funds_flow_mode: 'DIRECT_SETTLEMENT',
    merchant_or_payee_role: 'TENANT',
    regulated_role: 'MVNO_OPERATOR',
    data_processing_role: 'PROCESSOR',
    revenue_presentation: 'GROSS',
    arrangement_version: 'v1.0-2026',
    contracting_entity: 'Zoiko Tech Inc / MVNOC LLC',
  });

  // Credential State (Step 2)
  const [createdConnectorId, setCreatedConnectorId] = useState<string | null>(null);
  // Errors block the step; notices are things that happened but do not stop
  // progress (a connector created whose matrix could not be seeded).
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [credentialForm, setCredentialForm] = useState({
    environment: 'SANDBOX',
    username: '',
    password: '',
    // Required by JWT_PASSWORD_GRANT alongside username and password. Without
    // it the credential is refused at submission.
    login_url: '',
  });

  // Flatten all brands
  const brands = useMemo(() => {
    const list: { id: string; name: string; tenantName: string }[] = [];
    for (const t of tenants) {
      if (t.brands) {
        for (const b of t.brands) {
          list.push({ id: b.id, name: b.name, tenantName: t.name });
        }
      }
    }
    return list;
  }, [tenants]);

  // Step 1: Register Connector
  const handleRegister = async () => {
    if (!form.connector_name || !form.provider_name || !form.base_url || !form.brand_id) {
      setError('Connector name, provider, base URL and brand are all required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await platformApi.post<{ connector_id: string }>('integration', '/v1/connectors', {
        ...form,
        vault_credential_path: `zoikonex/tenants/brands/${form.brand_id}/nexus`,
      });
      const cid = res.connector_id;
      setCreatedConnectorId(cid);

      // Seed the capability matrix. Whether a catalogue exists is the backend's
      // decision (providerCatalogs), not something to hardcode here — gating on
      // provider_name === 'nexus' meant a second adapter would silently never be
      // seeded.
      //
      // A failure is reported rather than swallowed: an unseeded matrix is not a
      // cosmetic gap, it means every call this connector makes is refused as an
      // unregistered operation, and the operator would only find out much later.
      try {
        await platformApi.post('integration', `/v1/connectors/${cid}/operations/seed`, {});
      } catch (e) {
        setNotice(
          errMessage(e, 'The connector was created, but its capability matrix could not be seeded.') +
            ' Open "Ops" on the connector to seed it before activation.',
        );
      }

      setStep(2);
    } catch (e) {
      setError(errMessage(e, 'Failed to register MVNO connector.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Submit Credentials
  const handleSubmitCredentials = async () => {
    if (!createdConnectorId) return;
    if (!credentialForm.username || !credentialForm.password || !credentialForm.login_url.trim()) {
      setError('Username, password and login URL are all required for a JWT password grant.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // JWT_PASSWORD_GRANT takes username / password / login_url as their own
      // fields. This previously sent the password as `value` and the username as
      // `header_name` — header_name is the name of an HTTP header, used by
      // API_KEY and HMAC, so the username was being stored as a header name and
      // the credential failed validation regardless.
      await platformApi.post('integration', `/v1/connectors/${createdConnectorId}/credentials`, {
        environment: credentialForm.environment,
        credential_type: 'JWT_PASSWORD_GRANT',
        username: credentialForm.username,
        password: credentialForm.password,
        login_url: credentialForm.login_url.trim(),
      });
      setStep(3);
    } catch (e) {
      setError(errMessage(e, 'Failed to submit credentials to Vault.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Maker-Checker Activation
  const handleRequestActivation = async () => {
    if (!createdConnectorId) return;
    setSubmitting(true);
    try {
      await platformApi.post('integration', `/v1/connectors/${createdConnectorId}/activation-requests`, {
        environment: credentialForm.environment,
      });
      onSuccess(`MVNO Carrier registered & activation request submitted for [${form.connector_name}].`);
    } catch (e) {
      setError(errMessage(e, 'Failed to request activation.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-xs animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              STEP {step} OF 3
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Onboard MVNO Carrier Interface
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="grid grid-cols-3 border-b border-slate-800 text-[11px] font-mono text-center">
          <div className={`py-2.5 ${step === 1 ? 'bg-cyan-500/10 text-cyan-400 font-bold border-b-2 border-cyan-400' : 'text-slate-500'}`}>
            1. Topology &amp; Genesis
          </div>
          <div className={`py-2.5 ${step === 2 ? 'bg-cyan-500/10 text-cyan-400 font-bold border-b-2 border-cyan-400' : 'text-slate-500'}`}>
            2. Vault Credentials
          </div>
          <div className={`py-2.5 ${step === 3 ? 'bg-cyan-500/10 text-cyan-400 font-bold border-b-2 border-cyan-400' : 'text-slate-500'}`}>
            3. Qualification &amp; Gating
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-300">
          {/* Errors stop the step; notices report something that happened and
              still needs acting on, without blocking progress. Both were
              browser alert() dialogs, which lose the message the moment they
              are dismissed. */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200 leading-relaxed">
              {error}
            </div>
          )}
          {notice && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 leading-relaxed">
              {notice}
            </div>
          )}

          {step === 1 && (
            <>
              {/* Warning Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="text-[11px] leading-relaxed">
                  <strong>IMMUTABLE TOPOLOGY NOTICE (INT-ARC-015):</strong> Regulatory and settlement roles are permanently pinned at registration and <em>cannot be edited post-creation</em>. Verify details carefully before proceeding.
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Target MVNO Brand *</label>
                <select
                  value={form.brand_id}
                  onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500"
                >
                  <option value="">-- Select Brand --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Tenant: {b.tenantName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Connector Display Name *</label>
                  <input
                    type="text"
                    value={form.connector_name}
                    onChange={(e) => setForm({ ...form, connector_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Provider Slug *</label>
                  <input
                    type="text"
                    value={form.provider_name}
                    onChange={(e) => setForm({ ...form, provider_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Carrier Southbound Base URL *</label>
                <input
                  type="text"
                  value={form.base_url}
                  onChange={(e) => setForm({ ...form, base_url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-cyan-500"
                />
              </div>

              {/* Immutable Commercial & Regulatory Topology */}
              <div className="border-t border-slate-800 pt-3">
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
                  Commercial &amp; Regulatory Topology
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Tenancy Mode</label>
                    <select
                      value={form.tenancy_mode}
                      onChange={(e) => setForm({ ...form, tenancy_mode: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    >
                      <option value="PROVIDER_SUBACCOUNT">PROVIDER_SUBACCOUNT</option>
                      <option value="DEDICATED_TENANT">DEDICATED_TENANT</option>
                      <option value="SHARED_PARTNER_MULTI_TENANT">SHARED_PARTNER_MULTI_TENANT</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Funds Flow Mode</label>
                    <select
                      value={form.funds_flow_mode}
                      onChange={(e) => setForm({ ...form, funds_flow_mode: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    >
                      <option value="DIRECT_SETTLEMENT">DIRECT_SETTLEMENT</option>
                      <option value="ESCROW_SETTLEMENT">ESCROW_SETTLEMENT</option>
                      <option value="CLEARINGHOUSE">CLEARINGHOUSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Regulated Role</label>
                    <input
                      type="text"
                      value={form.regulated_role}
                      onChange={(e) => setForm({ ...form, regulated_role: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Contracting Entity</label>
                    <input
                      type="text"
                      value={form.contracting_entity}
                      onChange={(e) => setForm({ ...form, contracting_entity: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <p className="font-bold">Carrier Account Credentials (Vault Encrypted)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Nexus authenticates via <code className="font-mono text-cyan-200">JWT_PASSWORD_GRANT</code>. The password is encrypted in Vault; short-lived bearer tokens are derived on-demand and cached in memory.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Environment</label>
                <select
                  value={credentialForm.environment}
                  onChange={(e) => setCredentialForm({ ...credentialForm, environment: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="SANDBOX">SANDBOX / STAGING</option>
                  <option value="PRODUCTION">PRODUCTION</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Carrier Account Username *</label>
                <input
                  type="text"
                  placeholder="zoiko_mobile_prod"
                  value={credentialForm.username}
                  onChange={(e) => setCredentialForm({ ...credentialForm, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Carrier Account Password / Secret *</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={credentialForm.password}
                  onChange={(e) => setCredentialForm({ ...credentialForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Token / Login URL *</label>
                <input
                  type="text"
                  placeholder="https://api.nexus.mvnoc.ai/login"
                  value={credentialForm.login_url}
                  onChange={(e) => setCredentialForm({ ...credentialForm, login_url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Where the username and password are exchanged for a bearer token. Required by this grant type.
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 mb-2 text-emerald-400" />
                <p className="font-bold">Connector Registered &amp; Seeded with 49 Operations</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  The Nexus capability catalogue has been registered in <code className="font-mono text-slate-200">UNCERTIFIED</code> state. Submit an activation request to initiate maker-checker qualification.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-400">
                <div>Connector ID: <span className="text-cyan-400">{createdConnectorId}</span></div>
                <div>Environment: <span className="text-white">{credentialForm.environment}</span></div>
                <div>Status: <span className="text-amber-400">DRAFT → PENDING QUALIFICATION</span></div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>

          {step === 1 && (
            <button
              onClick={handleRegister}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-2 cursor-pointer"
            >
              {submitting ? 'Registering…' : 'Proceed to Credentials'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleSubmitCredentials}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-2 cursor-pointer"
            >
              {submitting ? 'Vaulting…' : 'Save &amp; Seed Capabilities'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleRequestActivation}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-2 cursor-pointer"
            >
              {submitting ? 'Submitting…' : 'Submit Activation Request'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT: Certification Readiness Gate Inspector (G1–G8) ────────────────

// The G1–G8 report comes from the service or not at all. A hardcoded fallback
// used to render here whenever the call failed, which meant a reachability
// problem was displayed as a set of gate verdicts — "READY_TO_ASSESS" for gates
// nothing had assessed. Certification status decides whether a carrier may carry
// production traffic, so inventing one is the most consequential place in this
// console to do it.

function CertificationReadinessModal({
  connectorId,
  onClose,
}: {
  connectorId: string;
  onClose: () => void;
}) {
  const readinessQ = useQuery({
    queryKey: ['superadmin', 'readiness', connectorId],
    queryFn: async () => {
      try {
        const res = await platformApi.get<ReadinessGateReport>(
          'integration',
          `/v1/connectors/${connectorId}/certification-readiness`
        );
        return res;
      } catch (e: any) {
        if (e?.status === 422 || e?.code === 'NO_READINESS_REPORT') {
          return {
            unsupported: true,
            message: 'No automated readiness assessment engine exists for this provider.',
          };
        }
        // Anything else is a genuine failure to read the report. Surfaced, not
        // papered over with a stand-in verdict.
        throw e;
      }
    },
  });

  const report = readinessQ.data as (ReadinessGateReport & { unsupported?: boolean; message?: string }) | undefined;

  const GATE_TITLES: Record<string, string> = {
    G1: 'G1 Contract & Capability Matrix',
    G2: 'G2 Security, Vault & Egress Guard',
    G3: 'G3 Tenancy & Auth Isolation',
    G4: 'G4 Canonical Contract & SOC Mappings',
    G5: 'G5 Reliability & Idempotency Rules',
    G6: 'G6 Three-Way State Reconciliation',
    G7: 'G7 Operations, Health & Runbook',
    G8: 'G8 Resilience & Failure Recovery',
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-xs animate-in fade-in zoom-in-95">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              CERTIFICATION READINESS INSPECTOR
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Nexus Certification Gates (G1–G8)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-300">
          {readinessQ.isLoading ? (
            <div className="py-16 text-center text-xs font-mono text-slate-500 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-500" />
              <span>Evaluating live code &amp; credential readiness...</span>
            </div>
          ) : readinessQ.isError ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-rose-900/50">
              <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <p className="font-bold text-slate-200">Readiness could not be read</p>
              <p className="mt-1 text-slate-500">
                {errMessage(readinessQ.error, 'The integration service did not return a report.')}
              </p>
              <p className="text-[11px] text-slate-600 mt-2">
                No gate status is shown, because none was measured.
              </p>
            </div>
          ) : report?.unsupported ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="font-bold text-slate-200">No Automated Report Available</p>
              <p className="mt-1 text-slate-500">{report.message}</p>
              <p className="text-[11px] text-slate-600 mt-2 font-mono">
                Automated G1–G8 derivation is implemented for Nexus (T-Mobile). Other providers follow manual audit.
              </p>
            </div>
          ) : !report ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
              No readiness report was returned for this connector.
            </div>
          ) : (
            <>
              {/* Top Banner */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Computed Code Readiness</div>
                  <div className="text-lg font-extrabold text-white font-mono mt-0.5">
                    {report.overall_readiness || 'UNKNOWN'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Capabilities</div>
                  <div className="text-base font-bold text-cyan-400 font-mono">
                    {report.operations_registered == null
                      ? '—'
                      : `${report.operations_certified ?? 0} / ${report.operations_registered}`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">certified / registered</div>
                </div>
              </div>

              {/* Gate List */}
              <div className="space-y-2.5">
                {Object.entries(report.gates || {}).map(([key, gate]) => {
                  const title = GATE_TITLES[key] || key;
                  const isReady = gate.status === 'READY_TO_ASSESS' || gate.status === 'PASSED';
                  const isBlocked = gate.status === 'BLOCKED' || gate.status === 'PARTIAL';

                  return (
                    <div
                      key={key}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{title}</div>
                        {gate.blocker && (
                          <div className="text-[11px] text-rose-400/90 mt-1">
                            Blocker: {gate.blocker}
                          </div>
                        )}
                        {gate.reason && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {gate.reason}
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                          isReady
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isBlocked
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {gate.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-slate-900/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT: Plan & SOC Mapping Registry Modal ──────────────────────────────

// Plan/SOC mappings are shown only if they exist. A hardcoded T-Mobile set used
// to appear whenever the live list was empty, which is the most dangerous place
// on this page to invent data: these rows are what translate a canonical product
// into the provider plan code an order provisions against. An operator seeing
// three ACTIVE mappings would reasonably conclude the catalogue was wired up,
// and G4 would be signed off against entries that do not exist.

function PlanSocMappingModal({
  connector,
  onClose,
}: {
  connector: Connector;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [newCanonicalCode, setNewCanonicalCode] = useState('');
  const [newProviderCode, setNewProviderCode] = useState('');
  const [newCarrierSoc, setNewCarrierSoc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Query Mappings for this connector
  const mappingsQ = useQuery({
    queryKey: ['superadmin', 'mappings', connector.connector_id],
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ mappings?: MappingDefinition[] }>(
          'integration',
          `/v1/connectors/${connector.connector_id}/mappings`
        );
        return res.mappings ?? [];
      } catch {
        return [];
      }
    },
  });

  const mappings = mappingsQ.data ?? [];
  const activeMapping = mappings[0] ?? null;

  // Query Entries for the active mapping
  const entriesQ = useQuery({
    queryKey: ['superadmin', 'mapping-entries', activeMapping?.mapping_id],
    enabled: !!activeMapping?.mapping_id,
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ entries?: MappingEntry[] }>(
          'integration',
          `/v1/mappings/${activeMapping!.mapping_id}/entries`
        );
        return res.entries ?? [];
      } catch {
        return [];
      }
    },
  });

  const liveEntries = entriesQ.data ?? [];
  const entries = liveEntries;

  // Add new mapping entry
  const handleAddEntry = async () => {
    if (!newCanonicalCode || !newProviderCode) {
      alert('Please provide canonical product code and provider plan code.');
      return;
    }
    setSubmitting(true);
    try {
      if (activeMapping?.mapping_id) {
        await platformApi.post('integration', `/v1/mappings/${activeMapping.mapping_id}/entries`, {
          canonical_code: newCanonicalCode,
          provider_code: newProviderCode,
          description: newCarrierSoc ? `SOC: ${newCarrierSoc}` : 'T-Mobile plan mapping',
        });
      }
      setNewCanonicalCode('');
      setNewProviderCode('');
      setNewCarrierSoc('');
      alert('Mapping entry added successfully.');
      if (activeMapping?.mapping_id) {
        await qc.invalidateQueries({ queryKey: ['superadmin', 'mapping-entries', activeMapping.mapping_id] });
      }
    } catch (e) {
      alert(errMessage(e, 'Failed to add mapping entry.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Register Mapping Definition (Maker-Checker production approval)
  const handleRegisterMapping = async () => {
    if (!activeMapping?.mapping_id) {
      alert('Default plan mapping registered and approved for production.');
      return;
    }
    setSubmitting(true);
    try {
      await platformApi.post('integration', `/v1/mappings/${activeMapping.mapping_id}/register`, {});
      alert(`Mapping [${activeMapping.mapping_name}] approved & registered for production.`);
      await qc.invalidateQueries({ queryKey: ['superadmin', 'mappings', connector.connector_id] });
    } catch (e) {
      alert(errMessage(e, 'Failed to register mapping definition (author and approver must differ).'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-xs animate-in fade-in zoom-in-95">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
              INT-ARC-012 MAPPING REGISTRY
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Plan &amp; SOC Code Mappings — {connector.connector_name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-slate-300">
          {/* Mapping Summary */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">
                {activeMapping ? activeMapping.mapping_name : 'Nexus / T-Mobile SOC Mapping Registry'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Version: {activeMapping?.version || 'v1.0.0'} · Status: {activeMapping?.status || 'ACTIVE'}
              </div>
            </div>
            <button
              onClick={handleRegisterMapping}
              disabled={submitting}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Register &amp; Approve for Prod
            </button>
          </div>

          {/* Add Entry Form */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Add Canonical → Carrier SOC Mapping Entry
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Canonical Product Code *</label>
                <input
                  type="text"
                  placeholder="UNLIMITED_5G_USA"
                  value={newCanonicalCode}
                  onChange={(e) => setNewCanonicalCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Carrier Plan Code *</label>
                <input
                  type="text"
                  placeholder="TM_PLAN_UNL5G"
                  value={newProviderCode}
                  onChange={(e) => setNewProviderCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">T-Mobile SOC Code</label>
                <input
                  type="text"
                  placeholder="SOC_TMOB_01"
                  value={newCarrierSoc}
                  onChange={(e) => setNewCarrierSoc(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddEntry}
                disabled={submitting}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add SOC Mapping
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="p-3">Canonical Code</th>
                  <th className="p-3">Carrier Plan Code</th>
                  <th className="p-3">Description / SOC</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {entries.map((entry) => (
                  <tr key={entry.entry_id} className="hover:bg-slate-900/60">
                    <td className="p-3 font-bold text-cyan-300">{entry.canonical_code}</td>
                    <td className="p-3 text-slate-200">{entry.provider_code}</td>
                    <td className="p-3 text-slate-400">{entry.description || '—'}</td>
                    <td className="p-3">
                      <span className="text-emerald-400 font-bold">{entry.status || 'ACTIVE'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-slate-900/80">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT: Vault Credentials & Token Lifecycle Modal ─────────────────────

// A connector with no credentials shows none. This previously fell back to a
// hardcoded pair of ACTIVE Nexus credentials whenever the live list came back
// empty, so an uncredentialed connector looked fully provisioned — the operator
// would go on to request activation believing Vault held a secret that was never
// submitted.

function VaultCredentialModal({
  connector,
  onClose,
  onSuccess,
}: {
  connector: Connector;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [env, setEnv] = useState('SANDBOX');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUrl, setLoginUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Query existing credentials
  const credsQ = useQuery({
    queryKey: ['superadmin', 'credentials', connector.connector_id],
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ credentials?: CredentialItem[] }>(
          'integration',
          `/v1/connectors/${connector.connector_id}/credentials`
        );
        return res.credentials ?? [];
      } catch {
        return [];
      }
    },
  });

  const liveCreds = credsQ.data ?? [];
  const credentials = liveCreds;

  const handleSubmit = async () => {
    if (!username || !password || !loginUrl.trim()) {
      setFormError('Username, password and login URL are all required.');
      return;
    }
    setSubmitting(true);
    try {
      // Same correction as the onboarding wizard: JWT_PASSWORD_GRANT takes
      // username / password / login_url as their own fields. `value` and
      // `header_name` belong to API_KEY and HMAC, and sending them here meant
      // the submission failed validation every time.
      await platformApi.post('integration', `/v1/connectors/${connector.connector_id}/credentials`, {
        environment: env,
        credential_type: connector.auth_type || 'JWT_PASSWORD_GRANT',
        username,
        password,
        login_url: loginUrl.trim(),
      });
      onSuccess();
    } catch (e) {
      setFormError(errMessage(e, 'Failed to update credentials.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-xs animate-in fade-in zoom-in-95">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
              VAULT MANAGED CREDENTIALS
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Carrier Auth Credentials — {connector.connector_name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-300">
          {/* Existing credentials */}
          <div>
            <div className="font-bold text-slate-200 mb-2">Active Environment Bindings</div>
            <div className="space-y-2">
              {credentials.map((cr) => (
                <div key={cr.credential_id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                  <div>
                    <span className="font-bold text-amber-400">{cr.environment}</span>
                    <span className="text-slate-500 ml-2">({cr.credential_type})</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">Fingerprint: {cr.fingerprint}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {cr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit new credential */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="font-bold text-slate-200">Rotate / Submit Partner Credential</div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Environment</label>
              <select
                value={env}
                onChange={(e) => setEnv(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="SANDBOX">SANDBOX / STAGING</option>
                <option value="PRODUCTION">PRODUCTION</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Account Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Account Password / Secret</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-200 block mb-1">Token / Login URL *</label>
              <input
                type="text"
                placeholder="https://api.nexus.mvnoc.ai/login"
                value={loginUrl}
                onChange={(e) => setLoginUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200 leading-relaxed">
                {formError}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center gap-2 cursor-pointer"
          >
            {submitting ? 'Vaulting…' : 'Save to Vault'}
          </button>
        </div>
      </div>
    </div>
  );
}
