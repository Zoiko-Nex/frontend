// @ts-nocheck
"use client";
import * as React from 'react';
import './super-admin.css';

const DEFAULT_TENANT_ID = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d';

export default function SuperAdminPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // We scope the query selectors to the container
    const $ = (s: string) => containerRef.current!.querySelector(s) as HTMLElement;
    const $$ = (s: string) => Array.from(containerRef.current!.querySelectorAll(s)) as HTMLElement[];


    "use strict";

    window.adminToken = '';
    window.adminTenantId = DEFAULT_TENANT_ID;
    window.adminUserEmail = '';

    function setUserChrome(session) {
      const email = session && session.email ? session.email : 'Super Admin';
      const initials = email.split('@')[0].split(/[.\s_-]+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase() || 'SA';
      const nameEl = document.getElementById('super-admin-user-name');
      const roleEl = document.getElementById('super-admin-user-role');
      const avEl = document.getElementById('super-admin-user-avatar');
      if (nameEl) nameEl.textContent = email;
      if (roleEl) roleEl.textContent = session && session.roles && session.roles.length ? session.roles.join(', ') : 'Global Super Admin';
      if (avEl) avEl.textContent = initials;
    }

    window.doLogout = function () {
      window.adminToken = '';
      window.adminTenantId = DEFAULT_TENANT_ID;
      localStorage.removeItem('zx_platform_session');
      window.dispatchEvent(new Event('zx-platform-auth-change'));
      toast('Logged out');
      window.location.href = '/Super-admin/login';
    }

    // Auto-load token from the platform session (stored under zx_platform_session)
    try {
      const raw = localStorage.getItem('zx_platform_session');
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.accessToken) {
          window.adminToken = session.accessToken;
          window.adminTenantId = session.tenantId || DEFAULT_TENANT_ID;
          window.adminUserEmail = session.email || '';
          setUserChrome(session);
          // Hide the login overlay immediately
          const overlay = document.getElementById('login-overlay');
          if (overlay) overlay.style.display = 'none';
          // Start health polling and load tenants
          if (typeof window.pollServicesHealth === 'function') window.pollServicesHealth();
          if (typeof window.loadTenants === 'function') window.loadTenants();
        } else {
          // No valid session, redirect to login
          window.location.href = '/Super-admin/login';
          return;
        }
      } else {
        // No session at all, redirect to login
        window.location.href = '/Super-admin/login';
        return;
      }
    } catch (e) {
      window.location.href = '/Super-admin/login';
      return;
    }

    window.doLogin = async function (e) {
      e.preventDefault();
      const btn = document.getElementById('login-btn');
      btn.textContent = 'Logging in...';
      const emailEl = document.getElementById('login-email') || document.getElementById('login-username');
      const passEl = document.getElementById('login-password');
      const emailVal = emailEl ? emailEl.value.trim() : '';
      const passVal = passEl ? passEl.value : '';
      try {
        // Use the correct sessions endpoint (NOT /oauth/v1/token which is for machine clients)
        const res = await fetch('/api/identity/v1/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': DEFAULT_TENANT_ID
          },
          body: JSON.stringify({
            email: emailVal || 'admin@acme.com',
            password: passVal || 'SecurePassword123'
          })
        });
        const data = await res.json();
        if (!res.ok) {
          const errMsg = data.message || ('Login failed: ' + res.status);
          throw new Error(errMsg);
        }
        window.adminToken = data.access_token || '';
        if (!window.adminToken) {
          console.error('Session response:', data);
          throw new Error('No access_token in response.');
        }
        window.adminTenantId = data.tenant_id || DEFAULT_TENANT_ID;
        const session = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || '',
          sessionId: data.session_id,
          expiresAt: Date.now() + (data.expires_in || 900) * 1000,
          tenantId: window.adminTenantId,
          brandId: data.brand_id || '',
          email: emailVal || 'admin@acme.com',
          roles: []
        };
        localStorage.setItem('zx_admin_session', JSON.stringify(session));
        window.dispatchEvent(new Event('zx-auth-change'));
        setUserChrome(session);
        document.getElementById('login-overlay').style.display = 'none';
        toast('Logged in as ' + (emailVal || 'admin@acme.com'));
        window.pollServicesHealth();
      } catch (err) {
        toast('Login error: ' + err.message);
        btn.textContent = 'Login';
      }
    }

    window.doCreateTenant = async function (e) {
      e.preventDefault();
      const btn = document.getElementById('t-submit-btn');
      btn.textContent = 'Onboarding...';
      try {
        // Step 1: Provision tenant via /api/proxy
        const proxyRes1 = await fetch('/api/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            port: 8080,
            method: 'POST',
            path: '/v1/tenants',
            headers: { 'authorization': 'Bearer ' + window.adminToken },
            body: {
              name: document.getElementById('t-name').value,
              domain_suffix: document.getElementById('t-domain').value,
              brand_name: document.getElementById('t-brandname').value,
              brand_code: document.getElementById('t-brandcode').value.toLowerCase().replace(/[^a-z0-9-]/g, '')
            }
          })
        });
        const payload1 = await proxyRes1.json();
        if (!payload1.ok || !payload1.data) throw new Error(payload1.data?.message || 'Failed to provision tenant');
        const tenantId = payload1.data.tenant_id;
        const brandId = payload1.data.brand_id;

        // Step 2: Create admin user via /api/proxy
        const adminEmail = document.getElementById('t-admin-email').value;
        const adminName = document.getElementById('t-admin-name').value;
        const adminPass = document.getElementById('t-admin-pass').value;
        if (adminEmail && adminName && adminPass) {
          const proxyRes2 = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              port: 8080,
              method: 'POST',
              path: '/v1/tenants/' + tenantId + '/admin-user',
              headers: { 'authorization': 'Bearer ' + window.adminToken },
              body: {
                email: adminEmail,
                full_name: adminName,
                password: adminPass,
                brand_id: brandId
              }
            })
          });
          const payload2 = await proxyRes2.json();
          if (!payload2.ok) {
            toast('Tenant created but admin user failed: ' + (payload2.data?.message || 'Unknown error'));
          }
        }

        // Show credential block
        const tenantName = document.getElementById('t-name').value;
        const tenantDomain = document.getElementById('t-domain').value;
        const loginUrl = 'https://' + tenantDomain + '/login';
        const credBlock = 'ZoikoNex Operations Console login\n' +
          'URL: ' + loginUrl + '\n' +
          'Tenant ID: ' + tenantId + '\n' +
          'Email: ' + (adminEmail || 'N/A') + '\n' +
          'Temporary password: ' + (adminPass || 'N/A');

        document.getElementById('invite-modal').style.display = 'none';
        e.target.reset();

        // Show credential modal
        openModal(`<div class="modal-h violet"><div class="ic"><svg viewBox="0 0 24 24">${IC.check}</svg></div><div><h3>${tenantName} is onboarded</h3><p>This is the only time the temporary password is shown. Copy it now and share it securely.</p></div></div>
  <div class="modal-b">
    <pre class="envcode" style="white-space:pre-wrap;font-size:12px;background:var(--bg-l);border:1px solid var(--border);border-radius:8px;padding:14px;">${credBlock}</pre>
    <button class="btn btn-sec" id="copyCredBtn" style="margin-top:10px;">Copy login details</button>
  </div>
  <div class="modal-f"><button class="btn btn-primary" data-close>Done</button></div>`);
        document.getElementById('copyCredBtn').addEventListener('click', () => {
          navigator.clipboard.writeText(credBlock).then(() => toast('Copied to clipboard')).catch(() => toast('Copy failed'));
        });

        toast(tenantName + ' onboarded successfully!');
        if (typeof window.loadTenants === 'function') window.loadTenants();
      } catch (err) {
        toast('Error: ' + err.message);
      } finally {
        btn.textContent = 'Onboard';
      }
    }

    // Auto-generate fields when Super Admin types Tenant Name
    window.handleTenantNameInput = function (e) {
      const raw = e.target.value;
      const slug = raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      const domainEl = document.getElementById('t-domain');
      const brandNameEl = document.getElementById('t-brandname');
      const brandCodeEl = document.getElementById('t-brandcode');
      const adminEmailEl = document.getElementById('t-admin-email');
      const adminNameEl = document.getElementById('t-admin-name');
      const adminPassEl = document.getElementById('t-admin-pass');

      if (domainEl && !domainEl.dataset.customized) {
        domainEl.value = slug ? (slug + '.zoikonex.com') : '';
      }
      if (brandNameEl && !brandNameEl.dataset.customized) {
        brandNameEl.value = raw.trim();
      }
      if (brandCodeEl && !brandCodeEl.dataset.customized) {
        brandCodeEl.value = slug ? (slug + '-mobile') : '';
      }
      if (adminEmailEl && !adminEmailEl.dataset.customized) {
        adminEmailEl.value = slug ? ('admin@' + slug + '.com') : '';
      }
      if (adminNameEl && !adminNameEl.dataset.customized) {
        adminNameEl.value = raw.trim() ? (raw.trim() + ' Admin') : '';
      }
      if (adminPassEl && !adminPassEl.dataset.customized && !adminPassEl.value) {
        const randSuffix = Math.floor(1000 + Math.random() * 9000);
        adminPassEl.value = 'Zoiko#2026!' + (slug ? (slug.charAt(0).toUpperCase() + slug.slice(1, 6)) : 'Pass') + randSuffix;
      }
    }

    window.markFieldCustomized = function (e) {
      if (e.target.value.trim() !== '') {
        e.target.dataset.customized = 'true';
      } else {
        delete e.target.dataset.customized;
      }
    }

    window.autoFillDemoTenant = function () {
      const demos = [
        { name: "Nova Cellular", brand: "Nova Mobile", code: "nova-mobile" },
        { name: "Apex Wireless", brand: "Apex Mobile", code: "apex-mobile" },
        { name: "Starlight Telecom", brand: "Starlight Mobile", code: "starlight-mobile" },
        { name: "Vanguard Net", brand: "Vanguard Mobile", code: "vanguard-mobile" },
        { name: "Quantum Connect", brand: "Quantum Mobile", code: "quantum-mobile" },
        { name: "Aether Telecom", brand: "Aether Mobile", code: "aether-mobile" }
      ];

      const item = demos[Math.floor(Math.random() * demos.length)];
      const randNum = Math.floor(100 + Math.random() * 900);
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + randNum;

      const nameEl = document.getElementById('t-name');
      const domainEl = document.getElementById('t-domain');
      const brandNameEl = document.getElementById('t-brandname');
      const brandCodeEl = document.getElementById('t-brandcode');
      const adminEmailEl = document.getElementById('t-admin-email');
      const adminNameEl = document.getElementById('t-admin-name');
      const adminPassEl = document.getElementById('t-admin-pass');

      [nameEl, domainEl, brandNameEl, brandCodeEl, adminEmailEl, adminNameEl, adminPassEl].forEach(el => {
        if (el) delete el.dataset.customized;
      });

      if (nameEl) nameEl.value = item.name + " " + randNum;
      if (domainEl) domainEl.value = slug + ".zoikonex.com";
      if (brandNameEl) brandNameEl.value = item.brand + " " + randNum;
      if (brandCodeEl) brandCodeEl.value = item.code + "-" + randNum;
      if (adminEmailEl) adminEmailEl.value = "admin@" + slug + ".com";
      if (adminNameEl) adminNameEl.value = item.name + " " + randNum + " Admin";
      if (adminPassEl) adminPassEl.value = "Zoiko#2026!Demo" + randNum;
    }

    // Dynamic tenant loading from backend
    window.loadTenants = async function () {
      try {
        const res = await fetch('/api/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            port: 8080,
            method: 'GET',
            path: '/v1/tenants',
            headers: { 'authorization': 'Bearer ' + window.adminToken }
          })
        });
        const payload = await res.json();
        if (payload.ok && payload.data && payload.data.tenants) {
          const liveTenants = payload.data.tenants;
          // Merge with seed data - live tenants go first, then seed data that doesn't overlap
          const liveNames = new Set(liveTenants.map(t => t.name));
          const seedOnly = TENANTS.filter(t => !liveNames.has(t.n));
          const merged = liveTenants.map(t => ({
            n: t.name,
            mkt: t.domain_suffix || 'Global',
            sub: String(t.user_count || 0),
            bill: t.status === 'Active' ? 'Healthy' : t.status === 'Suspended' ? 'Disabled' : 'Preview',
            pack: 'Default',
            intg: t.status === 'Active' ? 'Healthy' : 'Not configured',
            risk: t.status === 'Active' ? 'Low' : t.status === 'Suspended' ? 'High' : 'Medium',
            st: t.status === 'Active' ? 'Live' : t.status === 'Suspended' ? 'Blocked' : 'Preview'
          }));
          // Replace TENANTS array contents
          TENANTS.length = 0;
          merged.forEach(t => TENANTS.push(t));
          seedOnly.forEach(t => TENANTS.push(t));
          renderTenants();
          console.log('[superadmin] Loaded', liveTenants.length, 'tenants from backend');
        } else {
          console.error('List tenants request failed:', payload.data?.message || 'Unknown error');
        }
      } catch (err) {
        console.error('Failed to load tenants:', err.message);
      }
    }

    const REAL_SERVICES = [
      { name: 'Identity & Tenancy', url: 'https://identity.api.zoikonex.com' },
      { name: 'Customer & Account', url: 'https://customer.api.zoikonex.com' },
      { name: 'Product Catalogue', url: 'https://catalogue.api.zoikonex.com' },
      { name: 'Order Mgmt & Provisioning', url: 'https://ordering.api.zoikonex.com' },
      { name: 'Finance Fabric & Ledger', url: 'https://finance.api.zoikonex.com' },
      { name: 'Rating & Charging', url: 'https://rating.api.zoikonex.com' },
      { name: 'Partner Settlement', url: 'https://settlement.api.zoikonex.com' },
      { name: 'Revenue Assurance', url: 'https://assurance.api.zoikonex.com' },
      { name: 'Tax & Jurisdiction', url: 'https://tax.api.zoikonex.com' },
      { name: 'Fraud & Risk', url: 'https://fraud.api.zoikonex.com' },
      { name: 'Customer Lifecycle & KYC', url: 'https://kyc.api.zoikonex.com' },
      { name: 'Billing & Invoice', url: 'https://billing.api.zoikonex.com' },
      { name: 'Evidence Ledger', url: 'https://evidence.api.zoikonex.com' },
      { name: 'Usage Ingestion & Mediation', url: 'https://usage.api.zoikonex.com' },
      { name: 'Dunning & Disputes', url: 'https://dunning.api.zoikonex.com' },
      { name: 'Payments', url: 'https://payments.api.zoikonex.com' },
      { name: 'Integration Ecosystem', url: 'https://integration.api.zoikonex.com' },
      { name: 'Reporting & Regulatory', url: 'https://reporting.api.zoikonex.com' }
    ];

    window.pollServicesHealth = async function () {
      if (!window.adminToken) return;
      const grid = document.getElementById('dynamic-services-grid');
      if (!grid) return;

      for (let s of REAL_SERVICES) {
        const cardId = 'srv-' + s.url.replace(/[^a-zA-Z0-9]/g, '');
        let card = document.getElementById(cardId);
        if (!card) {
          card = document.createElement('div');
          card.id = cardId;
          card.className = 'panel';
          card.style.display = 'flex';
          card.style.justifyContent = 'space-between';
          card.style.alignItems = 'center';
          grid.appendChild(card);
        }

        card.innerHTML = "<span class='strong'>" + s.name + "</span>" + chip('c-amber', IC.clock, 'Checking...');

        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 5000);
          const proxyUrl = s.url.replace('https://', '/api/').replace('.api.zoikonex.com', '');
          const res = await fetch(proxyUrl + '/health', {
            signal: controller.signal,
            headers: {
              'Authorization': 'Bearer ' + window.adminToken,
              'X-Tenant-ID': window.adminTenantId || DEFAULT_TENANT_ID
            }
          });
          clearTimeout(tid);
          if (res.ok) {
            card.innerHTML = "<span class='strong'>" + s.name + "</span>" + chip('c-green', IC.check, 'Live');
          } else {
            card.innerHTML = "<span class='strong'>" + s.name + "</span>" + chip('c-red', IC.warn, 'Degraded');
          }
        } catch (err) {
          card.innerHTML = "<span class='strong'>" + s.name + "</span>" + chip('c-red', IC.warn, 'Down');
        }
      }
    }

    const dl = []; function track(ev, p) { dl.push(Object.assign({ event: ev }, p || {})); console.log("[superadmin]", ev, p || ""); }
    function toast(m) { const t = document.createElement("div"); t.className = "toast"; t.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>' + m; $("#toasts").appendChild(t); setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 300); }, 2800); }
    function chip(cls, ic, label) { return `<span class="chip ${cls}"><svg viewBox="0 0 24 24">${ic}</svg>${label}</span>`; }
    const IC = { check: '<path d="M20 6 9 17l-5-5"/>', warn: '<path d="M12 8v4M12 16h.01"/>', clock: '<path d="M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', dot: '<circle cx="12" cy="12" r="4"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>' };

    /* ============ SEED DATA ============ */
    const KPIS = [
      ['Active Tenants', '6', 'tenants', 'c-green', IC.check, 'Live'],
      ['Active Subscribers', '1.24M', 'tenants', '', ''],
      ['Billable Accounts', '987K', 'billing', '', ''],
      ['Cycle Revenue (est.)', '£4.82M', 'billing', 'c-cyan', '', '', true],
      ['Failed Provisioning', '23', 'orders', 'c-red', IC.warn, '23'],
      ['Failed Rating Events', '147', 'usage', 'c-red', IC.warn, '147'],
      ['Payment Failure Rate', '1.3%', 'billing', 'c-amber', IC.warn],
      ['Open Fraud Alerts', '8', 'assurance', 'c-red', IC.warn, '8'],
      ['Compliance Exposure', '3 gaps', 'jurisdiction', 'c-amber', IC.warn],
      ['Platform Health', '98.7%', 'platform', 'c-green', IC.check, 'SLO']
    ];
    const PANELS = [
      ['Tenant Operations', 'tenants', [['Live tenants', '4', 'good'], ['Onboarding', '1', ''], ['Missing packs', '1', 'warn'], ['Suspended', '0', '']], 'View Tenant Health'],
      ['Revenue Operations', 'billing', [['Unbilled usage', '£312K', 'warn'], ['Failed invoices', '7', 'bad'], ['Failed payments', '1.3%', 'warn'], ['Leakage alerts', '2', 'warn']], 'Open Revenue Monitor'],
      ['Usage & Charging', 'usage', [['CDR/UDR events', '22.1M', ''], ['OCS sessions', '48,302', 'good'], ['Rating errors', '147', 'bad'], ['CDRs in suspense', '89', 'warn']], 'Open Usage & Charging'],
      ['Billing & Finance', 'billing', [['Active bill runs', '4', ''], ['Failed runs', '0', 'good'], ['Exceptions', '7', 'bad'], ['GL export', 'Pending', 'warn']], 'Open Billing Command'],
      ['Provisioning & OSS', 'orders', [['Orders failed', '23', 'bad'], ['eSIM pending', '14', 'warn'], ['Porting failures', '2', 'warn'], ['Saga compensations', '3', 'warn']], 'Open Provisioning Queue'],
      ['Jurisdiction & Compliance', 'jurisdiction', [['Markets', '3', ''], ['Packs missing', '1', 'bad'], ['Residency gaps', '1', 'warn'], ['Go-live blockers', '2', 'bad']], 'Open Compliance Readiness'],
      ['Assurance & Risk', 'assurance', [['Leakage', '2', 'warn'], ['Fraud alerts', '8', 'bad'], ['High-risk accts', '12', 'warn'], ['Settlement gaps', '1', 'warn']], 'Open Assurance Queue'],
      ['Platform Health', 'platform', [['API uptime', '99.9%', 'good'], ['p99 latency', '182ms', 'good'], ['Queue lag', 'Low', 'good'], ['Evidence integrity', 'Intact', 'good']], 'Open Observability']
    ];
    const QUEUE = [
      { sev: 'Critical', dom: 'Billing', scope: 'GoLite Mobile · US', obj: 'Bill Run Nov-2024', desc: '7 invoices failed tax calculation', sla: 'SLA 02h 40m', team: 'Billing Ops', ev: 'EV-90210', cta: 'Review exceptions', go: 'billing' },
      { sev: 'Critical', dom: 'Provisioning', scope: 'DriverX Mobile · US', obj: 'Activation cluster', desc: '23 activations failed (HLR timeout)', sla: 'SLA 02h 14m', team: 'Ops', ev: 'EV-90211', cta: 'Triage queue', go: 'orders' },
      { sev: 'Critical', dom: 'Fraud', scope: 'Zoiko Mobile · US', obj: 'Risk cluster', desc: '8 fraud alerts opened', sla: 'Blocker', team: 'Assurance', ev: 'evidence pending', cta: 'Open fraud queue', go: 'assurance' },
      { sev: 'Warning', dom: 'Compliance', scope: 'Zoiko Orbit · Global', obj: 'Jurisdiction pack', desc: 'No jurisdiction pack assigned', sla: 'Go-live blocked', team: 'Compliance', ev: 'evidence pending', cta: 'Assign pack', go: 'jurisdiction' },
      { sev: 'Warning', dom: 'Usage', scope: 'GoLite Mobile · US', obj: 'Mediation suspense', desc: '89 CDRs in suspense', sla: 'SLA 06h', team: 'Billing Ops', ev: 'EV-90213', cta: 'Resolve suspense', go: 'usage' },
      { sev: 'Warning', dom: 'Evidence', scope: 'Zoiko UK · UK', obj: 'Evidence export pack', desc: 'Export awaiting approval', sla: 'SLA 08h', team: 'Compliance', ev: 'EV-90215', cta: 'Approve / reject', go: 'evidence' },
      { sev: 'Warning', dom: 'KYC', scope: 'GoLite Mobile · US', obj: 'KYC queue', desc: '12 accounts pending KYC', sla: 'SLA 12h', team: 'Compliance', ev: 'evidence pending', cta: 'Review KYC queue', go: 'identity' },
      { sev: 'Info', dom: 'Release', scope: 'Platform', obj: 'Release v2.15.0', desc: 'Scheduled for release train', sla: 'Sched 06 Dec', team: 'Platform', ev: '—', cta: 'View release notes', go: 'platform' }
    ];
    const TENANTS = [
      { n: 'Zoiko Telecom Ltd', mkt: 'UK', sub: '239,112', bill: 'Healthy', pack: 'UK Pack v3.2', intg: 'Healthy', risk: 'Low', st: 'Live' },
      { n: 'GoLite Mobile Inc', mkt: 'USA', sub: '91,840', bill: 'Warning', pack: 'US Pack v2.1', intg: 'Degraded', risk: 'Medium', st: 'Live' },
      { n: 'DriverX Mobile Inc', mkt: 'USA', sub: '42,001', bill: 'Healthy', pack: 'US Pack v2.1', intg: 'HLR issue', risk: 'High', st: 'Live' },
      { n: 'Zoiko Mobile Inc', mkt: 'USA', sub: '18,400', bill: 'Healthy', pack: 'US Pack v2.1', intg: 'Healthy', risk: 'Low', st: 'Live' },
      { n: 'Zoiko Broadband', mkt: 'UK', sub: '12,100', bill: 'Preview', pack: 'UK Pack v3.2', intg: 'Partial', risk: 'Low', st: 'Preview' },
      { n: 'Zoiko Orbit', mkt: 'Global', sub: '0', bill: 'Disabled', pack: 'Missing', intg: 'Not configured', risk: 'Critical', st: 'Blocked' }
    ];
    const MEDIATION = [
      ['Ingest', '22.1M', '22.1M', '0', '0', '0', '0', 'None'],
      ['Validate', '22.1M', '22.0M', '2,236', '0', '0', '0', 'Review validation rejects'],
      ['Normalise', '22.0M', '22.0M', '0', '0', '0', '0', 'None'],
      ['Enrich', '22.0M', '21.9M', '2,192', '0', '120', '0', 'Review enrichment defects'],
      ['Deduplicate', '21.9M', '21.9M', '0', '91', '120', '0', 'Review duplicate rules'],
      ['Correlate', '21.9M', '21.9M', '0', '0', '120', '89', 'Resolve suspense'],
      ['Rate Feed', '21.9M', '21.9M', '147', '0', '0', '0', 'Review rating errors'],
      ['Rated', '21.9M', '21.9M', '0', '0', '0', '0', 'Ready for bill cycle']
    ];
    const BILLCYCLES = [
      { t: 'GoLite Mobile', cyc: 'Nov 2024', state: 'Exception Review', acc: '79,211', exc: '7', rev: '$1.04M', appr: 'Pending', risk: 'Warning' },
      { t: 'Zoiko UK', cyc: 'Nov 2024', state: 'Collecting', acc: '198,440', exc: '0', rev: '£2.81M', appr: 'Approved', risk: 'Low' },
      { t: 'DriverX Mobile', cyc: 'Nov 2024', state: 'Rating Complete', acc: '42,001', exc: '147', rev: '$480K', appr: 'Not Ready', risk: 'Critical' },
      { t: 'Zoiko Mobile', cyc: 'Nov 2024', state: 'Invoice Generation', acc: '18,400', exc: '0', rev: '$210K', appr: 'Approved', risk: 'Low' }
    ];
    const BILLFLOW = ['Open', 'Usage Cut-Off', 'Rating', 'Tax', 'Simulation', 'Exception Review', 'Approval', 'Invoice Gen', 'Collection', 'Reconcile', 'Finance Export', 'Closed'];
    const JURIS = [
      { t: 'Zoiko UK', mkt: 'UK', pack: 'UK Pack v3.2', cells: ['OK', 'GBP/2', 'OK', 'OK', 'OK', 'OK', 'OK'], ready: 99, blk: 'None' },
      { t: 'GoLite Mobile', mkt: 'USA', pack: 'US Pack v2.1', cells: ['Warn', 'USD/2', 'OK', 'OK', 'OK', 'OK', 'OK'], ready: 94, blk: 'USF mapping incomplete' },
      { t: 'DriverX Mobile', mkt: 'USA', pack: 'US Pack v2.1', cells: ['OK', 'USD/2', 'OK', 'OK', 'OK', 'OK', 'OK'], ready: 97, blk: 'None' },
      { t: 'Zoiko Broadband', mkt: 'UK', pack: 'UK Pack v3.2', cells: ['OK', 'GBP/2', 'Missing', 'Missing', 'Missing', 'Missing', 'Missing'], ready: 40, blk: 'Go-live blocked' },
      { t: 'Zoiko Orbit', mkt: 'Global', pack: 'Missing', cells: ['Missing', 'Missing', 'Missing', 'Missing', 'Missing', 'Missing', 'Missing'], ready: 0, blk: 'No jurisdiction pack assigned' }
    ];
    const EVIDENCE = [
      ['2024-12-01 01:28', 'GoLite', 'Billing', 'Bill Run Nov-2024', 'System', 'Invoice simulation completed — 7 exceptions', 'EV-90210', 'Valid'],
      ['2024-12-01 02:10', 'DriverX', 'Provisioning', 'ORD-8841', 'System', 'Compensation saga triggered — HLR timeout', 'EV-90211', 'Valid'],
      ['2024-12-01 03:04', 'Zoiko UK', 'Payment', 'PAY-7701', 'Stripe GW', 'Payment captured — £42.00', 'EV-90212', 'Valid'],
      ['2024-12-01 05:22', 'GoLite', 'Usage', 'Mediation', 'System', '89 CDRs moved to suspense', 'EV-90213', 'Valid'],
      ['2024-12-01 06:40', 'GoLite', 'KYC', 'ACC-33120', 'System', '12 accounts flagged pending KYC', 'EV-90214', 'Valid'],
      ['2024-12-01 06:58', 'Zoiko UK', 'Evidence', 'Export Pack', 'A. Mercer', 'Evidence export requested — awaiting approval', 'EV-90215', 'Pending'],
      ['2024-12-01 07:02', 'Zoiko UK', 'AI Governance', 'Rating-AI-v3', 'AI Engine', 'AI rating decision — human review confirmed', 'EV-90216', 'Valid']
    ];
    const INTEG = [
      ['Gamma MVNA', 'Carrier/MVNA', '2', 'Healthy', '120ms', '0', '2m ago'],
      ['SureTax', 'Tax Engine', '3', 'Degraded', '410ms', '12', '1m ago'],
      ['Stripe', 'Payment', '4', 'Healthy', '180ms', '1', '30s ago'],
      ['SM-DP+', 'eSIM', '2', 'Warning', '550ms', '8', '5m ago']
    ];
    const SAGA = [
      ['ORD-8841', 'DriverX', 'Darnell Webb', '5G Unlimited', 'HLR Activation', 'HLR-US-01', '3×', 'Compensating', '02h 14m', 'Unassigned'],
      ['ORD-8842', 'GoLite', 'Priya Nair', 'eSIM Plan', 'eSIM Profile Push', 'SM-DP+', '1×', 'Awaiting', '04h 22m', 'Ops'],
      ['ORD-8856', 'GoLite', 'Theo Okafor', 'Data Booster', 'Billing Activation', 'Billing Engine', '2×', 'Rolled back', '01h 08m', 'Billing Ops']
    ];
    const ROLES = [
      ['Global Super Admin', 'Full platform authority'], ['Platform Operations Admin', 'Health, incidents, tenant operations, action queue'],
      ['Tenant Provisioning Admin', 'Tenant setup, onboarding, production-readiness'], ['Billing Operations Admin', 'Bill runs, invoices, payments, adjustments, dunning'],
      ['Revenue Assurance Admin', 'Leakage, rating exceptions, assurance workflows'], ['Compliance Admin', 'Jurisdiction packs, readiness, notices, regulatory controls'],
      ['Integration Admin', 'APIs, carrier, payment, tax, webhooks, integration evidence'], ['Security Admin', 'SSO, MFA, roles, sessions, privileged activity'],
      ['Support Admin', 'Restricted customer lookup and support tooling'], ['Auditor', 'Evidence, audit logs, exportable reports'], ['Read-Only Executive', 'KPIs and performance visibility only']
    ];
    const NAMES = { control: 'Control Room', ecosystem: 'Ecosystem Map', tenants: 'Tenants & Operators', identity: 'Identity & Customers', catalogue: 'Catalogue & Commercial', orders: 'Orders & OSS', usage: 'Usage & Charging', billing: 'Billing & Finance', jurisdiction: 'Jurisdiction & Compliance', assurance: 'Assurance & Risk', evidence: 'Evidence & Governance', integrations: 'Integrations', platform: 'Platform Admin' };
    const CHARGING = [
      { n: 'OCS — Online Charging', sub: 'Real-time prepaid · balance control', st: 'Healthy', cls: 'c-green', slo: 'p99 182ms / 200ms', q: '48,302 live sessions', fd: 'Isolated' },
      { n: 'OFCS — Offline Charging', sub: 'Batch postpaid · accumulation', st: 'Warning', cls: 'c-amber', slo: 'Backlog 1.2M records', q: 'Batch lag ~6m', fd: 'Isolated' },
      { n: 'Convergent Charging Engine', sub: 'Balance federation above OCS + OFCS', st: 'Healthy', cls: 'c-green', slo: 'p99 96ms', q: 'Federated', fd: 'Isolated' }
    ];
    const SLO = [
      ['OCS session authorisation', 'p99 < 200 ms', '182 ms', 'good', 'Indicative'],
      ['Online balance check', 'p99 < 150 ms', '128 ms', 'good', 'Indicative'],
      ['Mediation throughput', '≥ 25M events/day', '22.1M', 'warn', 'Indicative'],
      ['Evidence critical write', 'p95 < 300 ms', '240 ms', 'good', 'Absolute · fail-closed'],
      ['Provisioning saga', 'p95 < 5 min', '3m 40s', 'good', 'Indicative'],
      ['Financial data RPO', '< 1 min', '35 s', 'good', 'Absolute'],
      ['Cross-tenant leakage', 'Zero tolerance', '0', 'good', 'Absolute · P0'],
      ['Data residency violation', 'Zero tolerance', '0', 'good', 'Absolute']
    ];
    const WAVES = [
      ['1', 'Platform Foundation', 'Delivered', 'done'], ['2', 'Commercial & Identity Core', 'Delivered', 'done'],
      ['3', 'Orders, Resources & Provisioning', 'Delivered', 'done'], ['4', 'Usage, Mediation & Charging', 'Current', 'cur'],
      ['5', 'Billing, Payments & Finance', 'Next', 'todo'], ['6', 'Assurance, Risk & Governance', 'Planned', 'todo'],
      ['7', 'Experience, Analytics & Optimisation', 'Planned', 'todo']
    ];
    const TMF = [
      ['TMF620', 'Product Catalog', 'Catalogue & offers'], ['TMF622', 'Product Ordering', 'Orders & service change'], ['TMF629', 'Customer', 'Profile & lifecycle'],
      ['TMF632', 'Party', 'Tenant, brand, partner'], ['TMF635', 'Product Usage', 'Usage & rated visibility'], ['TMF638', 'Service Inventory', 'Active services'],
      ['TMF639', 'Resource Inventory', 'SIM/eSIM/MSISDN/device'], ['TMF641', 'Service Ordering', 'Activation orchestration'], ['TMF666', 'Account', 'Billing account & payer'],
      ['TMF676', 'Payment', 'Capture, retries, refunds'], ['TMF678', 'Customer Bill', 'Bill runs & invoices'], ['TMF724', 'Revenue Assurance', 'Leakage & cases']
    ];
    const SAGA_STEPS = ['Reserve number', 'Allocate SIM/eSIM', 'Activate network', 'Activate policy', 'Activate billing', 'Confirm service'];
    const HIERARCHY = ['Platform', 'Tenant', 'Brand', 'Market', 'Customer', 'Account (payer)', 'Subscriber', 'Product Instance', 'Service Instance', 'Resource Instance', 'Usage', 'Charge', 'Invoice', 'Payment', 'Evidence'];
    const ENVELOPE = `{
  "event_type": "billing.invoice.issued",
  "event_version": "1.0",
  "environment": "production",
  "tenant_id": "golite",  "brand_id": "golite-mobile",
  "market": "US",  "jurisdiction_pack": "US-Pack-v2.1",
  "actor": { "type": "system", "id": "billing-engine" },
  "object": { "type": "invoice", "id": "INV-2026-8841" },
  "payload": { "amount_minor": 7020, "currency": "USD", "currency_exponent": 2 },
  "evidence_ref": "EV-90210"
}`;

    /* ============ SEVERITY / STATUS HELPERS ============ */
    function sevChip(s) { return s === 'Critical' ? chip('c-red', IC.warn, 'Critical') : s === 'Warning' ? chip('c-amber', IC.warn, 'Warning') : chip('c-blue', IC.dot, 'Info'); }
    function statusChip(s) { const m = { Live: ['c-green', IC.check], Preview: ['c-blue', IC.dot], Blocked: ['c-red', IC.lock], Healthy: ['c-green', IC.check], Warning: ['c-amber', IC.warn], Degraded: ['c-amber', IC.warn], Disabled: ['c-grey', IC.x], High: ['c-red', IC.warn], Medium: ['c-amber', IC.warn], Low: ['c-green', IC.check], Critical: ['c-red', IC.warn], Approved: ['c-green', IC.check], Pending: ['c-amber', IC.clock], 'Not Ready': ['c-red', IC.warn] }; const x = m[s] || ['c-grey', IC.dot]; return chip(x[0], x[1], s); }

    /* ============ RENDERERS ============ */
    function crumb(m) { return `<div class="crumb">${grpOf(m)} / <b>${NAMES[m]}</b></div>`; }
    function grpOf(m) { if (['control', 'ecosystem'].includes(m)) return 'Command'; if (['tenants', 'identity', 'catalogue'].includes(m)) return 'Govern'; if (['orders', 'usage', 'billing'].includes(m)) return 'Operate'; if (['jurisdiction', 'assurance', 'evidence'].includes(m)) return 'Assure'; return 'Platform'; }

    function renderControl() {
      const kpi = KPIS.map(k => `<div class="kpi" data-go="${k[2]}"><div class="l">${k[0]}</div><div class="v${k[1].length > 5 ? ' sm' : ''}">${k[1]}</div>${k[3] ? `<div class="d">${chip(k[3], k[4] || IC.dot, k[5] || '')}</div>` : ''}</div>`).join("");
      const panels = PANELS.map(p => `<div class="panel"><h3><svg viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h16"/></svg>${p[0]}</h3>
    ${p[2].map(r => `<div class="kv"><span class="k">${r[0]}</span><span class="v ${r[2] || ''}">${r[1]}</span></div>`).join("")}
    <button class="btn btn-ghost btn-sm" data-go="${p[1]}">${p[3]} <svg viewBox="0 0 24 24">${IC.arrow}</svg></button></div>`).join("");
      $("#m-control").innerHTML = `
    <div class="headrow"><div>${crumb('control')}<div class="ptitle">Global Control Room</div><div class="psub">Cross-tenant operational picture. Every exception carries tenant, brand, market, domain, object ID, severity, SLA, owner and evidence — resolve from the Action Queue.</div></div></div>
    <div class="stdstrip">
      <span class="stdlbl">Locked baseline v3.0</span>
      ${['TM Forum', '3GPP', 'GSMA', 'ISO 4217', 'WORM', 'ADR-driven'].map(s => `<span class="std">${s}</span>`).join("")}
      <span class="sep"></span>
      ${['Tenant isolation', 'Synchronous evidence', 'No-float money', 'Region-locked residency'].map(s => `<span class="std ok">${s}</span>`).join("")}
    </div>
    <div class="kpis">${kpi}</div>
    <div class="sectitle">Command panels <span class="mono">click a panel to open its domain</span></div>
    <div class="panels">${panels}</div>
    <div class="sectitle">Platform object model <span class="mono">enforced at data, API &amp; event layers</span></div>
    <div class="card hierarchy">${HIERARCHY.map((h, i) => `<span class="hn">${h}</span>${i < HIERARCHY.length - 1 ? '<span class="hsep">›</span>' : ''}`).join("")}</div>`;
      bindGo($("#m-control"));
    }

    function renderTenants() {
      const rows = TENANTS.map((t, i) => `<tr class="clickable" data-t="${i}"><td class="strong">${t.n}</td><td>${t.mkt}</td><td>${t.sub}</td><td>${statusChip(t.bill)}</td><td class="mono" style="font-size:11px">${t.pack}</td><td>${t.intg === 'Healthy' ? statusChip('Healthy') : chip(t.intg === 'Degraded' ? 'c-amber' : t.intg === 'Not configured' ? 'c-grey' : 'c-amber', IC.warn, t.intg)}</td><td>${statusChip(t.risk)}</td><td>${statusChip(t.st)}</td>
    <td style="text-align:right;white-space:nowrap">${t.st === 'Blocked' ? `<button class="btn btn-ghost btn-sm" data-promote="${i}">Promote</button>` : `<button class="btn btn-ghost btn-sm" data-suspend="${i}">Suspend</button>`}</td></tr>`).join("");
      $("#m-tenants").innerHTML = `
    <div class="headrow"><div>${crumb('tenants')}<div class="ptitle">Tenant Registry</div><div class="psub">Cross-tenant governance. Production promotion is a hard block until the jurisdiction pack, billing issuer, currency, invoice rules, payment rails and residency are valid.</div></div>
      <button class="btn btn-primary" id="newTenant"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Onboard tenant</button></div>
    <div class="filters">
      <select><option>All markets</option><option>UK</option><option>USA</option><option>Global</option></select>
      <select><option>All statuses</option><option>Live</option><option>Preview</option><option>Blocked</option></select>
      <select><option>All risk</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
      <input placeholder="Search tenant…" style="flex:1;min-width:160px">
    </div>
    <div class="tablewrap"><table><thead><tr><th>Tenant</th><th>Market</th><th>Subscribers</th><th>Billing</th><th>Jurisdiction pack</th><th>Integrations</th><th>Risk</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
      $("#newTenant").addEventListener("click", () => { const m = document.getElementById("invite-modal"); if (m) m.style.display = "block"; });
      $$("#m-tenants [data-suspend]").forEach(b => b.addEventListener('click', e => { e.stopPropagation(); suspendModal(TENANTS[+b.dataset.suspend]); }));
      $$("#m-tenants [data-promote]").forEach(b => b.addEventListener('click', e => { e.stopPropagation(); promoteModal(TENANTS[+b.dataset.promote]); }));
      $$("#m-tenants tr.clickable").forEach(r => r.addEventListener('click', () => toast('Tenant detail — Overview · Brands · Entitlements · Jurisdiction · Billing · Usage · Provisioning · Integrations · Evidence · Settings')));
    }

    function renderUsage() {
      const rows = MEDIATION.map(m => {
        const flagged = m[3] !== '0' || m[5] !== '0' || m[6] !== '0';
        return `<tr><td class="strong">${m[0]}</td><td>${m[1]}</td><td>${m[2]}</td><td class="${m[3] !== '0' ? 'rc-bad' : ''}">${m[3]}</td><td class="${m[4] !== '0' ? 'rc-warn' : ''}">${m[4]}</td><td class="${m[5] !== '0' ? 'rc-warn' : ''}">${m[5]}</td><td class="${m[6] !== '0' ? 'rc-warn' : ''}">${m[6]}</td><td>${m[7] === 'None' ? chip('c-green', IC.check, 'Clear') : `<a href="#" data-act="${m[7]}">${m[7]}</a>`}</td></tr>`;
      }).join("");
      $("#m-usage").innerHTML = `
    <div class="headrow"><div>${crumb('usage')}<div class="ptitle">Usage &amp; Charging</div><div class="psub">OCS, OFCS and Convergent Charging are separate deployable components — independent data stores, queues, SLOs and failure domains (ADR-005). Mediation is a stage-based, stateful, replayable pipeline.</div></div></div>
    <div class="sectitle">Charging services <span class="mono">three separate components · OCS · OFCS · convergent</span></div>
    <div class="grid" style="grid-template-columns:repeat(3,1fr)">
      ${CHARGING.map(c => `<div class="panel"><div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px"><div style="flex:1"><h3 style="margin:0;font-size:14px;display:block">${c.n}</h3><div class="mono" style="font-size:10px;color:var(--ink-faint);margin-top:5px">${c.sub}</div></div>${chip(c.cls, c.cls === 'c-green' ? IC.check : IC.warn, c.st)}</div>
        <div class="kv"><span class="k">SLO / load</span><span class="v ${c.cls === 'c-amber' ? 'warn' : 'good'}">${c.slo}</span></div>
        <div class="kv"><span class="k">Queue</span><span class="v">${c.q}</span></div>
        <div class="kv"><span class="k">Failure domain</span><span class="v good">${c.fd}</span></div></div>`).join("")}
    </div>
    <div class="kpis" style="grid-template-columns:repeat(4,1fr);margin-top:16px">
      <div class="kpi"><div class="l">CDR/UDR events</div><div class="v sm">22.1M</div></div>
      <div class="kpi"><div class="l">Rating errors</div><div class="v sm" style="color:var(--danger)">147</div><div class="d">${chip('c-red', IC.warn, 'Review')}</div></div>
      <div class="kpi"><div class="l">CDRs in suspense</div><div class="v sm" style="color:var(--amber)">89</div></div>
      <div class="kpi"><div class="l">Roaming TAP3 / NRTRDE</div><div class="v sm">3 files</div><div class="d">${chip('c-blue', IC.dot, 'GSMA TD.57')}</div></div>
    </div>
    <div class="sectitle">Mediation pipeline <span class="mono">ingest → validate → normalise → enrich → deduplicate → correlate → rate → rated · DLQ per stage</span></div>
    <div class="tablewrap"><table><thead><tr><th>Stage</th><th>Received</th><th>Processed</th><th>Rejected</th><th>Duplicates</th><th>Late</th><th>Suspense</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      $$("#m-usage [data-act]").forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(a.dataset.act + ' — evidence-backed queue') }));
      bindGo($("#m-usage"));
    }

    function renderBilling() {
      const rows = BILLCYCLES.map((b, i) => `<tr><td class="strong">${b.t}</td><td>${b.cyc}</td><td>${chip(b.state === 'Exception Review' ? 'c-amber' : b.state === 'Rating Complete' ? 'c-red' : 'c-blue', IC.dot, b.state)}</td><td>${b.acc}</td><td class="${b.exc !== '0' ? 'rc-bad' : ''}">${b.exc}</td><td class="strong">${b.rev}</td><td>${statusChip(b.appr)}</td><td>${statusChip(b.risk)}</td>
    <td style="text-align:right;white-space:nowrap"><button class="btn btn-ghost btn-sm" data-billrun="${i}">Manage</button></td></tr>`).join("");
      $("#m-billing").innerHTML = `
    <div class="headrow"><div>${crumb('billing')}<div class="ptitle">Bill Run Command</div><div class="psub">Approving, executing, aborting or overriding a bill run is privileged — it requires reason code, simulation evidence, dual approval where policy applies, and immutable Evidence Ledger capture. Amounts are ISO 4217 integer minor units; rounding is jurisdiction-pack governed (ADR-003).</div></div></div>
    <div class="sectitle">Bill cycle workflow</div>
    <div class="flow">${BILLFLOW.map((s, i) => `<span class="fs ${i < 5 ? 'done' : i === 5 ? 'cur' : ''}">${s}</span>`).join("")}</div>
    <div class="sectitle">Active bill runs <span class="mono">Nov 2024</span></div>
    <div class="tablewrap"><table><thead><tr><th>Tenant</th><th>Cycle</th><th>State</th><th>Accounts</th><th>Exceptions</th><th>Revenue</th><th>Approval</th><th>Risk</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
      $$("#m-billing [data-billrun]").forEach(b => b.addEventListener('click', () => billRunModal(BILLCYCLES[+b.dataset.billrun])));
    }

    function renderJurisdiction() {
      const cellHdr = ['Tax', 'Currency', 'Invoice', 'Payments', 'KYC', 'Residency', 'Notices'];
      const cell = v => v === 'OK' ? '<span class="rc-ok">OK</span>' : v === 'Warn' ? '<span class="rc-warn">Warn</span>' : v === 'Missing' ? '<span class="rc-bad">Missing</span>' : `<span class="mono" style="font-size:11px">${v}</span>`;
      const rows = JURIS.map(j => `<tr><td class="strong">${j.t}</td><td>${j.mkt}</td><td class="mono" style="font-size:11px">${j.pack}</td>${j.cells.map(cell).map(c => `<td>${c}</td>`).join("")}
    <td style="min-width:120px"><div style="display:flex;align-items:center;gap:8px"><div class="progress"><i style="width:${j.ready}%;background:${j.ready >= 95 ? 'var(--green)' : j.ready >= 60 ? 'var(--amber)' : 'var(--danger)'}"></i></div><b style="font-size:11px">${j.ready}%</b></div></td>
    <td>${j.blk === 'None' ? chip('c-green', IC.check, 'Ready') : chip(j.ready === 0 ? 'c-red' : 'c-amber', IC.warn, j.blk)}</td></tr>`).join("");
      $("#m-jurisdiction").innerHTML = `
    <div class="headrow"><div>${crumb('jurisdiction')}<div class="ptitle">Compliance Readiness</div><div class="psub">Jurisdiction packs are versioned, independently deployable artefacts (ADR-009) — no country-specific logic in service code. Missing pack elements are a hard production block, and data residency is enforced by infrastructure, not an application checkbox.</div></div></div>
    <div class="sectitle">Jurisdiction pack promotion <span class="mono">versioned artefact lifecycle</span></div>
    <div class="flow">${['Draft', 'Review', 'Staged', 'Production'].map((s, i) => `<span class="fs ${i < 3 ? 'done' : i === 3 ? 'cur' : ''}">${s}</span>`).join("")}</div>
    <div class="sectitle">Readiness matrix <span class="mono">Tenant → Market → Pack → Tax → Invoice → Payments → KYC → Residency → Evidence</span></div>
    <div class="tablewrap"><table><thead><tr><th>Tenant</th><th>Market</th><th>Pack</th>${cellHdr.map(h => `<th>${h}</th>`).join("")}<th>Ready</th><th>Blocker</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }

    function renderEvidence() {
      const rows = EVIDENCE.map(e => `<tr><td class="mono" style="font-size:11px;white-space:nowrap">${e[0]}</td><td class="strong">${e[1]}</td><td>${chip('c-violet', IC.dot, e[2])}</td><td class="mono" style="font-size:11px">${e[3]}</td><td>${e[4]}</td><td>${e[5]}</td><td class="mono" style="font-size:11px;color:var(--violet)">${e[6]}</td><td>${e[7] === 'Valid' ? chip('c-green', IC.check, 'Valid') : chip('c-amber', IC.clock, 'Pending')}</td></tr>`).join("");
      $("#m-evidence").innerHTML = `
    <div class="headrow"><div>${crumb('evidence')}<div class="ptitle">Evidence Ledger</div><div class="psub">WORM-class, append-only, hash-chain verified on read (ADR-008). Critical business actions fail closed if the evidence write does not succeed. The ledger stores hashed references only — no plaintext PII, so GDPR erasure (Art. 17/30) applies to personal-data stores while the audit chain stays intact.</div></div>
      <button class="btn btn-sec" id="exportEv"><svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>Export pack</button></div>
    <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi"><div class="l">Chain integrity</div><div class="v sm" style="color:var(--green-deep)">Intact</div></div>
      <div class="kpi"><div class="l">Records (24h)</div><div class="v sm">7</div></div>
      <div class="kpi"><div class="l">Pending approval</div><div class="v sm" style="color:var(--amber)">1</div></div>
      <div class="kpi"><div class="l">AI decisions logged</div><div class="v sm">1</div></div>
    </div>
    <div class="sectitle">Recent evidence</div>
    <div class="tablewrap"><table><thead><tr><th>Time (UTC)</th><th>Tenant</th><th>Domain</th><th>Object</th><th>Actor</th><th>Action</th><th>Evidence ID</th><th>Integrity</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      $("#exportEv").addEventListener('click', () => exportModal());
    }

    function renderIntegrations() {
      const rows = INTEG.map(i => `<tr><td class="strong">${i[0]}</td><td>${i[1]}</td><td>${i[2]}</td><td>${statusChip(i[3])}</td><td>${i[4]}</td><td class="${i[5] !== '0' ? 'rc-bad' : ''}">${i[5]}</td><td class="mono" style="font-size:11px">${i[6]}</td>
    <td style="text-align:right"><button class="btn btn-ghost btn-sm" data-int="${i[0]}">${i[3] === 'Healthy' ? 'View' : 'Triage'}</button></td></tr>`).join("");
      $("#m-integrations").innerHTML = `
    <div class="headrow"><div>${crumb('integrations')}<div class="ptitle">Integration Ecosystem</div><div class="psub">Carrier/MVNA, tax, payment, eSIM and accounting links. Logs are tenant-scoped with secrets redacted; retries and webhook replays are permissioned and evidence-logged.</div></div></div>
    <div class="tablewrap"><table><thead><tr><th>Integration</th><th>Type</th><th>Tenants</th><th>Status</th><th>p95 latency</th><th>Errors</th><th>Last event</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
      $$("#m-integrations [data-int]").forEach(b => b.addEventListener('click', () => toast(b.dataset.int + ' — logs (secrets redacted) · retry · replay · escalate')));
    }

    function renderOrders() {
      const rows = SAGA.map(s => `<tr><td class="mono strong" style="font-size:11px">${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td><td class="rc-bad">${s[4]}</td><td class="mono" style="font-size:11px">${s[5]}</td><td>${s[6]}</td><td>${chip(s[7] === 'Rolled back' ? 'c-red' : s[7] === 'Compensating' ? 'c-amber' : 'c-blue', IC.dot, s[7])}</td><td class="mono" style="font-size:11px">${s[8]}</td><td>${s[9] === 'Unassigned' ? chip('c-red', IC.warn, 'Unassigned') : s[9]}</td>
    <td style="text-align:right"><button class="btn btn-ghost btn-sm" data-ord="${s[0]}">Actions</button></td></tr>`).join("");
      $("#m-orders").innerHTML = `
    <div class="headrow"><div>${crumb('orders')}<div class="ptitle">Provisioning &amp; Saga Monitor</div><div class="psub">Distributed transaction visibility: current step, failed step, retry count, rollback status and compensating action. Every action is permission-gated and evidence-backed.</div></div></div>
    <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi"><div class="l">Orders failed</div><div class="v sm" style="color:var(--danger)">23</div></div>
      <div class="kpi"><div class="l">eSIM pending</div><div class="v sm" style="color:var(--amber)">14</div></div>
      <div class="kpi"><div class="l">Porting failures</div><div class="v sm" style="color:var(--amber)">2</div></div>
      <div class="kpi"><div class="l">Saga compensations</div><div class="v sm">3</div></div>
    </div>
    <div class="sectitle">Compensation saga <span class="mono">idempotent · compensatable · durable state (ADR-004)</span></div>
    <div class="flow">${SAGA_STEPS.map((s, i) => `<span class="fs ${i < 3 ? 'done' : i === 3 ? 'cur' : ''}">${s}</span>`).join("")}</div>
    <div class="sectitle">Failure queue <span class="mono">not buried inside order details</span></div>
    <div class="tablewrap"><table><thead><tr><th>Order</th><th>Tenant</th><th>Customer</th><th>Product</th><th>Failed step</th><th>External system</th><th>Retry</th><th>Saga</th><th>SLA</th><th>Owner</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
      $$("#m-orders [data-ord]").forEach(b => b.addEventListener('click', () => toast(b.dataset.ord + ' — retry · assign owner · trigger compensation · escalate to carrier · view evidence')));
    }

    function renderAssurance() {
      $("#m-assurance").innerHTML = `
    <div class="headrow"><div>${crumb('assurance')}<div class="ptitle">Assurance &amp; Risk</div><div class="psub">Leakage, fraud, rating and billing exceptions, payment risk and regulatory risk register — each item is evidence-linked.</div></div></div>
    <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi"><div class="l">Open fraud alerts</div><div class="v sm" style="color:var(--danger)">8</div><div class="d">${chip('c-red', IC.warn, 'Zoiko Mobile')}</div></div>
      <div class="kpi"><div class="l">Leakage alerts</div><div class="v sm" style="color:var(--amber)">2</div></div>
      <div class="kpi"><div class="l">Rating exceptions</div><div class="v sm" style="color:var(--danger)">147</div></div>
      <div class="kpi"><div class="l">High-risk accounts</div><div class="v sm" style="color:var(--amber)">12</div></div>
    </div>
    <div class="tablewrap" style="margin-top:6px"><table><thead><tr><th>Case</th><th>Tenant</th><th>Domain</th><th>Severity</th><th>SLA</th><th>Owner</th><th>Evidence</th></tr></thead><tbody>
      <tr><td class="strong">Velocity fraud cluster</td><td>Zoiko Mobile</td><td>${chip('c-violet', IC.dot, 'Fraud')}</td><td>${sevChip('Critical')}</td><td class="mono" style="font-size:11px">Blocker</td><td>Assurance</td><td class="mono" style="font-size:11px;color:var(--violet)">pending</td></tr>
      <tr><td class="strong">Rating leakage — data roaming</td><td>GoLite</td><td>${chip('c-violet', IC.dot, 'Leakage')}</td><td>${sevChip('Warning')}</td><td class="mono" style="font-size:11px">SLA 08h</td><td>Rev Assurance</td><td class="mono" style="font-size:11px;color:var(--violet)">EV-90213</td></tr>
      <tr><td class="strong">147 rating exceptions</td><td>DriverX</td><td>${chip('c-violet', IC.dot, 'Rating')}</td><td>${sevChip('Critical')}</td><td class="mono" style="font-size:11px">SLA 04h</td><td>Billing Ops</td><td class="mono" style="font-size:11px;color:var(--violet)">EV-90211</td></tr>
    </tbody></table></div>`;
    }

    function renderIdentity() {
      $("#m-identity").innerHTML = `
    <div class="headrow"><div>${crumb('identity')}<div class="ptitle">Identity &amp; Customers</div><div class="psub">Customers, accounts, lifecycle, KYC/KYB, consent and payer/subscriber separation — governed across tenants.</div></div></div>
    <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi"><div class="l">Customers</div><div class="v sm">1.24M</div></div>
      <div class="kpi"><div class="l">Accounts</div><div class="v sm">987K</div></div>
      <div class="kpi"><div class="l">Pending KYC</div><div class="v sm" style="color:var(--amber)">12</div><div class="d">${chip('c-amber', IC.warn, 'GoLite')}</div></div>
      <div class="kpi"><div class="l">Consent gaps</div><div class="v sm">0</div><div class="d">${chip('c-green', IC.check, 'Clear')}</div></div>
    </div>
    <div class="sectitle">KYC / KYB queue</div>
    <div class="tablewrap"><table><thead><tr><th>Account</th><th>Tenant</th><th>Type</th><th>Stage</th><th>Risk</th><th>Evidence</th></tr></thead><tbody>
      <tr><td class="mono strong" style="font-size:11px">ACC-33120</td><td>GoLite</td><td>KYC</td><td>${chip('c-amber', IC.clock, 'Document review')}</td><td>${statusChip('Medium')}</td><td class="mono" style="font-size:11px;color:var(--violet)">EV-90214</td></tr>
      <tr><td class="mono strong" style="font-size:11px">ACC-33121</td><td>GoLite</td><td>KYB</td><td>${chip('c-amber', IC.clock, 'Beneficial owner')}</td><td>${statusChip('High')}</td><td class="mono" style="font-size:11px;color:var(--violet)">pending</td></tr>
    </tbody></table></div>`;
    }

    function renderCatalogue() {
      $("#m-catalogue").innerHTML = `
    <div class="headrow"><div>${crumb('catalogue')}<div class="ptitle">Catalogue &amp; Commercial</div><div class="psub">Products, plans, tariffs, promotions and eligibility with jurisdiction price books and a catalogue approval workflow.</div></div>
      <button class="btn btn-primary" onclick="document.querySelector('[data-suspend]')&&0"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>New plan</button></div>
    <div class="tablewrap"><table><thead><tr><th>Product</th><th>Type</th><th>Markets</th><th>Price book</th><th>Rev-rec</th><th>Approval</th></tr></thead><tbody>
      <tr><td class="strong">5G Unlimited</td><td>Plan</td><td>UK, USA</td><td class="mono" style="font-size:11px">PB-UK-3, PB-US-2</td><td>Over time</td><td>${statusChip('Approved')}</td></tr>
      <tr><td class="strong">eSIM Traveller</td><td>Plan</td><td>Global</td><td class="mono" style="font-size:11px">PB-GL-1</td><td>Point in time</td><td>${chip('c-amber', IC.clock, 'In review')}</td></tr>
      <tr><td class="strong">Data Booster 10GB</td><td>Add-on</td><td>USA</td><td class="mono" style="font-size:11px">PB-US-2</td><td>Point in time</td><td>${statusChip('Approved')}</td></tr>
      <tr><td class="strong">Winter Promo −20%</td><td>Promotion</td><td>UK</td><td class="mono" style="font-size:11px">PB-UK-3</td><td>—</td><td>${chip('c-amber', IC.clock, 'Pending')}</td></tr>
    </tbody></table></div>`;
    }

    function renderPlatform() {
      const rows = ROLES.map(r => `<tr><td class="strong">${r[0]}</td><td>${r[1]}</td><td style="text-align:right"><button class="btn btn-ghost btn-sm" onclick="return false" data-role="${r[0]}">Review access</button></td></tr>`).join("");
      $("#m-platform").innerHTML = `
    <div class="headrow"><div>${crumb('platform')}<div class="ptitle">Platform Administration</div><div class="psub">RBAC/ABAC, feature flags, releases, security and observability. Permission rule: deny overrides allow; role enforcement is server-side, the UI is only a secondary guard.</div></div></div>
  <div class="sectitle" style="margin-top:1rem;">Live ZoikoNex Domain Health <span class="mono">18 Microservices</span></div>
  <div class="grid" id="dynamic-services-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;"></div>
  
    <div class="grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px">
      <div class="panel"><h3><svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/></svg>Security</h3><div class="kv"><span class="k">SSO / MFA</span><span class="v good">Enforced</span></div><div class="kv"><span class="k">Privileged sessions</span><span class="v">3 active</span></div><div class="kv"><span class="k">Device posture</span><span class="v good">OK</span></div></div>
      <div class="panel"><h3><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>Feature flags</h3><div class="kv"><span class="k">Roaming TAP/NRTRDE</span><span class="v">${chip('c-blue', IC.dot, 'Preview')}</span></div><div class="kv"><span class="k">Convergent charging</span><span class="v good">On</span></div><div class="kv"><span class="k">AI assurance</span><span class="v warn">Canary 10%</span></div></div>
      <div class="panel"><h3><svg viewBox="0 0 24 24"><path d="M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/></svg>Releases</h3><div class="kv"><span class="k">Current</span><span class="v">v2.14.0</span></div><div class="kv"><span class="k">Scheduled</span><span class="v">v2.15.0 · 06 Dec</span></div><div class="kv"><span class="k">Rollback ready</span><span class="v good">Yes</span></div></div>
    </div>
    <div class="sectitle">Roles &amp; permissions <span class="mono">RBAC / ABAC · server-enforced</span></div>
    <div class="tablewrap"><table><thead><tr><th>Role</th><th>Scope</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="sectitle">Service level objectives <span class="mono">NFR targets · absolute vs indicative</span></div>
    <div class="tablewrap"><table><thead><tr><th>Objective</th><th>Target</th><th>Current</th><th>Type</th><th>Status</th></tr></thead><tbody>
      ${SLO.map(s => `<tr><td class="strong">${s[0]}</td><td class="mono" style="font-size:11px">${s[1]}</td><td class="mono" style="font-size:11px">${s[2]}</td><td class="mono" style="font-size:10px;color:var(--ink-faint)">${s[4]}</td><td>${chip(s[3] === 'good' ? 'c-green' : 'c-amber', s[3] === 'good' ? IC.check : IC.warn, s[3] === 'good' ? 'Within' : 'Watch')}</td></tr>`).join("")}
    </tbody></table></div>
    <div class="sectitle">Build waves <span class="mono">delivery model</span></div>
    <div class="flow">${WAVES.map(w => `<span class="fs ${w[3]}">${w[0]} · ${w[1]}</span>`).join("")}</div>
    <div class="grid" style="grid-template-columns:1.1fr .9fr;margin-top:16px">
      <div class="panel"><h3><svg viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h16"/></svg>TM Forum API map</h3>
        <div class="tablewrap" style="border:0;margin:-4px -4px 0"><table style="min-width:0"><thead><tr><th>API</th><th>Name</th><th>Use</th></tr></thead><tbody>
        ${TMF.map(t => `<tr><td class="mono strong" style="font-size:11px">${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td></tr>`).join("")}
        </tbody></table></div></div>
      <div class="panel"><h3><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>Canonical event envelope</h3>
        <div class="mono" style="font-size:10px;color:var(--ink-faint);margin-bottom:10px">tenant_id, brand_id, environment &amp; evidence_ref are broker-validated — events without them are rejected.</div>
        <pre class="envcode">${ENVELOPE.replace(/</g, '&lt;')}</pre></div>
    </div>`;
      $$("#m-platform [data-role]").forEach(b => b.addEventListener('click', () => toast('Access review — ' + b.dataset.role)));
    }

    function renderEcosystem() {
      const G = {
        bank: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5"/>', user: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20c1.5-4 5-6 8-6s6.5 2 8 6"/>', cat: '<path d="M4 5h16M4 12h16M4 19h10"/>', check: '<path d="M5 13l4 4L19 7"/>', sim: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10 7h4"/>', wave: '<path d="M3 12h4l3 7 4-14 3 7h4"/>', gauge: '<path d="M12 13a5 5 0 1 0-5-5"/><path d="M12 13l3-3"/>', db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/>', gear: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 12a8 8 0 0 1 .2-1.8L2 8.7l2-3.4 2.4 1a8 8 0 0 1 1.6-.9L8.6 3h6.8l.6 2.4a8 8 0 0 1 1.6.9l2.4-1 2 3.4-2.2 1.5A8 8 0 0 1 20 12"/>', bill: '<path d="M6 2h9l5 5v15H6zM9 13h6M9 17h4"/>', card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>', shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/>', scale: '<path d="M12 3v18M6 8h12M6 8l-2.5 6h5zM18 8l-2.5 6h5z"/>', alert: '<path d="M12 9v4M12 17h.01M10.3 4l-7 12a2 2 0 0 0 1.7 3h14a2 2 0 0 0 1.7-3l-7-12a2 2 0 0 0-3.4 0Z"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', api: '<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/>', chart: '<path d="M4 19V5M4 19h16M8 16V9M12 16v-4M16 16V7"/>', eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
        noflt: '<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/>', coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.6 9.5a2.4 2 0 0 1 4.8 0M9.6 14.5a2.4 2 0 0 0 4.8 0"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>', code: '<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/>', bolt: '<path d="m13 2-9 13h7l-1 7 9-13h-7l1-7Z"/>', cloud: '<path d="M6 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 18 18Z"/>', clip: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9z"/>'
      };
      const CORE = [
        { lc: '--blue', h: 'Commercial', nodes: [['Tenant Management', 'tenants', 'bank'], ['Customer & Account', 'identity', 'user'], ['Product Catalogue', 'catalogue', 'cat']] },
        { lc: '--green-deep', h: 'Operational', nodes: [['Orders & Provisioning', 'orders', 'check'], ['SIM / eSIM Lifecycle', 'orders', 'sim'], ['Usage & Mediation', 'usage', 'wave']] },
        { lc: '--amber', h: 'Charging', nodes: [['OCS — Online', 'usage', 'gauge'], ['OFCS — Offline', 'usage', 'db'], ['Convergent Charging', 'usage', 'gear']] },
        { lc: '--violet', h: 'Financial', nodes: [['Billing & Invoicing', 'billing', 'bill'], ['Payments', 'billing', 'card'], ['Revenue Assurance', 'assurance', 'shield']] },
        { lc: '--cyan', h: 'Governance', nodes: [['Jurisdiction Packs', 'jurisdiction', 'scale'], ['Fraud & Risk', 'assurance', 'alert'], ['Evidence Ledger', 'evidence', 'lock']] },
        { lc: '--navy', h: 'Platform', nodes: [['API Gateway & Integrations', 'integrations', 'api'], ['Analytics (Read-only)', 'platform', 'chart'], ['Observability & Admin', 'platform', 'eye']] }
      ];
      const ECOSYS = [
        ['1', 'Telecom Network', ['MNOs', 'MVNOs', 'MVNE/MVNA', 'HLR/HSS/UDM', 'Numbering & Porting', 'Roaming & Interconnect', 'SIM/eSIM RSP'], ['Gamma MVNA', 'SM-DP+']],
        ['2', 'Commercial & Distribution', ['Dealers', 'Resellers', 'eCommerce', 'CRM', 'Self-Service Portal', 'Mobile Apps'], []],
        ['3', 'Finance & Monetisation', ['Payment Gateways', 'Tax Engines', 'GL / ERP', 'Partner Settlement', 'Currency & Rounding'], ['Stripe', 'SureTax']],
        ['4', 'Compliance & Risk', ['KYC/KYB', 'Data Residency', 'Regulatory Notices', 'Consumer Protection', 'Audit'], []],
        ['5', 'Fulfilment & Device', ['3PL Providers', 'Device Suppliers', 'Warehousing', 'SIM Logistics', 'Equipment Insurance'], []],
        ['6', 'Communications & Engagement', ['Email', 'SMS', 'Push', 'Customer Notifications', 'Support Channels'], []],
        ['7', 'Data & Governance', ['Evidence Packs', 'Policy Governance', 'ADR Registry', 'Retention Controls', 'Access Reviews'], []]
      ];
      const PRIN = [['Tenant isolation at every layer', 'shield'], ['Synchronous evidence for critical actions', 'check'], ['No floating-point money', 'noflt'], ['Per-currency ISO 4217 precision', 'coin'], ['Region-locked data residency', 'globe'], ['API-first, event-governed, observable', 'code']];
      const BOTTOM = [['Event-governed', 'bolt'], ['Cloud-native & API-first', 'cloud'], ['Secure by design', 'shield'], ['Observable & resilient', 'eye'], ['Compliant & auditable', 'clip'], ['Scalable & future-ready', 'chart']];
      $("#m-ecosystem").innerHTML = `
    <div class="headrow"><div><div class="crumb">Command / <b>Ecosystem Map</b></div><div class="ptitle">Platform Ecosystem</div><div class="psub">The locked baseline for Tier-1 OSS/BSS engineering decisions. The ZoikoNex core platform sits at the centre; the surrounding ecosystem connects only through governed contracts. Select any core component to open its domain.</div></div></div>
    <div class="stdstrip">
      <span class="stdlbl">Reference architecture v3.0</span>
      ${['TM Forum', '3GPP', 'GSMA', 'ISO 4217', 'WORM', 'ADR-driven'].map(s => `<span class="std">${s}</span>`).join("")}
    </div>
    <div class="coreband">ZoikoNex Core Platform</div>
    <div class="stack">
      ${CORE.map(L => `<div class="layer" style="--lc:var(${L.lc})"><div class="lh">${L.h}</div><div class="nodes">${L.nodes.map(n => `<button class="node" data-go="${n[1]}"><span class="ni"><svg viewBox="0 0 24 24">${G[n[2]]}</svg></span>${n[0]}<span class="ar"><svg viewBox="0 0 24 24">${IC.arrow}</svg></span></button>`).join("")}</div></div>`).join("")}
    </div>
    <div class="sectitle">Ecosystem &amp; external connectors <span class="mono">governed contracts · events · read models</span></div>
    <div class="ecogrid">
      ${ECOSYS.map(e => `<div class="eco"><h4><span class="en">${e[0]}</span>${e[1]}</h4><div class="tags">${e[2].map(m => `<span class="tag">${m}</span>`).join("")}${e[3].map(c => `<span class="tag on">● ${c}</span>`).join("")}</div></div>`).join("")}
    </div>
    <div class="sectitle">Engineering principles <span class="mono">non-negotiable</span></div>
    <div class="principles">${PRIN.map(p => `<div class="prin"><span class="pi"><svg viewBox="0 0 24 24">${G[p[1]]}</svg></span>${p[0]}</div>`).join("")}</div>
    <div class="sectitle">Indicative delivery waves <span class="mono">current: Wave 4</span></div>
    <div class="flow">${WAVES.map(w => `<span class="fs ${w[3]}">${w[0]} · ${w[1]}</span>`).join("")}</div>
    <div class="sectitle">Architecture posture</div>
    <div class="botstrip">${BOTTOM.map(b => `<span class="b"><svg viewBox="0 0 24 24">${G[b[1]]}</svg>${b[0]}</span>`).join("")}</div>`;
      bindGo($("#m-ecosystem"));
    }
    const RENDER = { control: renderControl, ecosystem: renderEcosystem, tenants: renderTenants, identity: renderIdentity, catalogue: renderCatalogue, orders: renderOrders, usage: renderUsage, billing: renderBilling, jurisdiction: renderJurisdiction, assurance: renderAssurance, evidence: renderEvidence, integrations: renderIntegrations, platform: renderPlatform };

    /* ============ ACTION QUEUE ============ */
    function renderQueue() {
      const crit = QUEUE.filter(q => q.sev === 'Critical').length, warn = QUEUE.filter(q => q.sev === 'Warning').length;
      $("#alCrit").textContent = crit; $("#alWarn").textContent = warn;
      $("#qCount").textContent = QUEUE.length + ' items';
      $("#queueList").innerHTML = QUEUE.map((q, i) => `<div class="qitem" data-q="${i}">
    <div class="scope">${q.scope} · ${q.dom}</div>
    <div class="qtop">${sevChip(q.sev)}<span class="mono" style="font-size:10px;color:var(--ink-faint)">${q.sla}</span></div>
    <div class="desc">${q.desc}</div>
    <div class="qmeta"><span class="mono" style="font-size:10px;color:var(--ink-faint)">${q.team}</span><span class="ev">${q.ev}</span></div>
    <div class="cta"><button class="btn btn-sec btn-sm" data-qgo="${i}">${q.cta} <svg viewBox="0 0 24 24">${IC.arrow}</svg></button></div>
  </div>`).join("");
      $("#qMini").innerHTML = `<div class="mb" style="border-color:color-mix(in srgb,var(--danger) 40%,transparent)"><svg viewBox="0 0 24 24" stroke="var(--danger)">${IC.warn}</svg><span class="n">${crit}</span></div>
    <div class="mb" style="border-color:color-mix(in srgb,var(--amber) 40%,transparent)"><svg viewBox="0 0 24 24" stroke="var(--amber)">${IC.warn}</svg><span class="n" style="background:var(--amber)">${warn}</span></div>`;
      $$("#queueList [data-q]").forEach(el => el.addEventListener('click', () => { const q = QUEUE[+el.dataset.q]; go(q.go); track('queue_item_open', { dom: q.dom }); }));
      $$("#queueList [data-qgo]").forEach(b => b.addEventListener('click', e => {
        e.stopPropagation(); const q = QUEUE[+b.dataset.qgo];
        if (q.cta === 'Approve / reject') { exportModal(); return; } if (q.cta === 'Assign pack') { go('jurisdiction'); toast('Assign jurisdiction pack to Zoiko Orbit'); return; }
        go(q.go); track('queue_cta', { cta: q.cta });
      }));
    }

    /* ============ MODALS (high-risk = approval only) ============ */
    function openModal(html) { $("#modal").innerHTML = html; $("#scrim2").classList.add('show'); $$("#modal [data-close]").forEach(b => b.addEventListener('click', closeModal)); }
    function closeModal() { $("#scrim2").classList.remove('show'); }
    $("#scrim2").addEventListener('click', e => { if (e.target === $("#scrim2")) closeModal(); });
    function suspendModal(t) {
      openModal(`<div class="modal-h danger"><div class="ic"><svg viewBox="0 0 24 24">${IC.warn}</svg></div><div><h3>Suspend ${t.n}</h3><p>Privileged action — reason code, dual approval, notification control and evidence capture are required.</p></div></div>
  <div class="modal-b">
    <div class="field"><label>Reason code</label><select><option>Non-payment</option><option>Compliance breach</option><option>Security incident</option><option>Fraud</option><option>Customer request</option></select></div>
    <div class="field"><label>Approval note</label><textarea placeholder="Context for the audit record…"></textarea></div>
    <div class="field"><label>Customer notification</label><select><option>Notify affected customers</option><option>Suppress notification (approval required)</option></select></div>
    <div class="dual"><input type="checkbox" id="dualA"><label style="margin:0;font-weight:500">I confirm a second approver (dual approval) is required and will be requested before execution.</label></div>
    <div class="evnote"><svg viewBox="0 0 24 24">${IC.dot}</svg>This action writes an immutable Evidence Ledger record with actor, timestamp, reason and approval reference.</div>
  </div>
  <div class="modal-f"><button class="btn btn-sec" data-close>Cancel</button><button class="btn btn-danger" id="doSuspend">Request suspension</button></div>`);
      $("#doSuspend").addEventListener('click', () => { if (!$("#dualA").checked) { toast('Dual approval must be acknowledged'); return; } closeModal(); toast(t.n + ' — suspension requested · pending second approval · EV logged'); track('tenant_suspend_request', { tenant: t.n }); });
    }
    function promoteModal(t) {
      openModal(`<div class="modal-h danger"><div class="ic"><svg viewBox="0 0 24 24">${IC.lock}</svg></div><div><h3>Production promotion blocked</h3><p>${t.n} cannot be promoted to production until all jurisdiction-pack elements are valid.</p></div></div>
  <div class="modal-b">
    <div class="kv"><span class="k">Jurisdiction pack</span><span class="v bad">Missing</span></div>
    <div class="kv"><span class="k">Billing issuer</span><span class="v bad">Not set</span></div>
    <div class="kv"><span class="k">Currency &amp; rounding</span><span class="v bad">Not set</span></div>
    <div class="kv"><span class="k">Invoice rules</span><span class="v bad">Missing</span></div>
    <div class="kv"><span class="k">Payment rails</span><span class="v bad">Missing</span></div>
    <div class="kv"><span class="k">Data residency</span><span class="v bad">Missing</span></div>
    <div class="evnote"><svg viewBox="0 0 24 24">${IC.warn}</svg>This is a hard platform block, not an advisory warning. Assign a jurisdiction pack to proceed.</div>
  </div>
  <div class="modal-f"><button class="btn btn-sec" data-close>Close</button><button class="btn btn-primary" id="goJ">Assign jurisdiction pack</button></div>`);
      $("#goJ").addEventListener('click', () => { closeModal(); go('jurisdiction'); toast('Assign a jurisdiction pack to ' + t.n); });
    }
    function billRunModal(b) {
      openModal(`<div class="modal-h violet"><div class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg></div><div><h3>${b.t} — ${b.cyc}</h3><p>State: ${b.state} · ${b.exc} exceptions · ${b.rev}. Bill-run actions are privileged and evidence-backed.</p></div></div>
  <div class="modal-b">
    <div class="field"><label>Action</label><select><option>Simulate</option><option>Review exceptions</option><option>Rerun tax calculation</option><option>Approve run</option><option>Execute run</option><option>Abort run</option></select></div>
    <div class="field"><label>Reason code</label><input placeholder="e.g. tax-rule-correction"></div>
    <div class="dual"><input type="checkbox" id="dualB"><label style="margin:0;font-weight:500">Dual approval acknowledged where policy requires it.</label></div>
    <div class="evnote"><svg viewBox="0 0 24 24">${IC.dot}</svg>Simulation evidence and an immutable ledger record are captured on execution.</div>
  </div>
  <div class="modal-f"><button class="btn btn-sec" data-close>Cancel</button><button class="btn btn-primary" id="doRun">Submit for approval</button></div>`);
      $("#doRun").addEventListener('click', () => { closeModal(); toast(b.t + ' — bill-run action submitted · evidence captured'); track('billrun_action', { tenant: b.t }); });
    }
    function exportModal() {
      openModal(`<div class="modal-h violet"><div class="ic"><svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6zM15 2v5h5"/></svg></div><div><h3>Evidence export pack</h3><p>Export requires Auditor role or approval. The export itself is logged with a retention tag.</p></div></div>
  <div class="modal-b">
    <div class="field"><label>Scope</label><select><option>Zoiko UK — Nov 2024 billing</option><option>Cross-tenant compliance pack</option><option>Single evidence record</option></select></div>
    <div class="field"><label>Retention class</label><select><option>Financial</option><option>Compliance</option><option>Security</option><option>Export-controlled</option></select></div>
    <div class="dual"><input type="checkbox" id="dualE"><label style="margin:0;font-weight:500">Approver confirmed. PII is separated; only hashed references are exported where required.</label></div>
    <div class="evnote"><svg viewBox="0 0 24 24">${IC.dot}</svg>Hash-chain verification runs before export; the export event is itself recorded in the ledger.</div>
  </div>
  <div class="modal-f"><button class="btn btn-sec" data-close>Reject</button><button class="btn btn-primary" id="doExport">Approve export</button></div>`);
      $("#doExport").addEventListener('click', () => { if (!$("#dualE").checked) { toast('Approver confirmation required'); return; } closeModal(); toast('Evidence pack approved · export logged · EV-90215'); track('evidence_export_approved'); });
    }

    /* ============ STATUS BAR ============ */
    function renderStatus() {
      const env = $("#envSel").value;
      $("#statusbar").innerHTML = [
        ['ok', 'Release', 'v2.14.0'], ['ok', 'Live tenants', '6'], ['ok', 'OCS', '48,302 sessions'], ['info', 'OFCS', '1.2M pending'],
        ['ok', 'Billing engine', 'Healthy'], ['ok', 'Evidence ledger', 'Intact'], ['ok', 'Error budget', 'Normal'], ['info', 'Env', env.charAt(0).toUpperCase() + env.slice(1)]
      ].map(s => `<span class="si ${s[0]}"><i></i>${s[1]} <b>${s[2]}</b></span>`).join("");
    }

    /* ============ ROUTER ============ */
    let rendered = {};
    function go(m) {
      $$('.module').forEach(s => s.classList.toggle('active', s.id === 'm-' + m));
      $$('.navi').forEach(n => n.classList.toggle('active', n.dataset.m === m));
      if (!rendered[m]) { RENDER[m](); rendered[m] = true; }
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      $("#side").classList.remove('open'); $("#scrim") && $("#scrim").classList.remove('show');
      track('view', { module: m });
    }
    function bindGo(root) { (root || document).querySelectorAll('[data-go]').forEach(el => { if (el._g) return; el._g = 1; el.addEventListener('click', () => go(el.dataset.go)); }); }
    $$('.navi').forEach(n => n.addEventListener('click', () => go(n.dataset.m)));

    /* ============ TOP BAR / SHELL ============ */
    $("#hamb").addEventListener('click', () => { $("#side").classList.toggle('open'); $("#scrim") && $("#scrim").classList.toggle('show'); });
    $("#scrim") && $("#scrim").addEventListener('click', () => { $("#side").classList.remove('open'); $("#scrim").classList.remove('show'); });
    $("#themeToggle").addEventListener('click', () => { const r = document.documentElement, d = r.getAttribute('data-theme') === 'dark'; r.setAttribute('data-theme', d ? 'light' : 'dark'); });
    $("#alertPill").addEventListener('click', () => { const q = $("#queue"); if (q) { q.scrollIntoView({ behavior: 'smooth' }); } toast('Action Queue — ' + QUEUE.filter(x => x.sev === 'Critical').length + ' critical, ' + QUEUE.filter(x => x.sev === 'Warning').length + ' warnings'); });
    // environment
    $("#envSel").addEventListener('change', e => {
      const v = e.target.value; $("#envPill").className = 'env env-' + v;
      const bn = $("#envBanner");
      if (v === 'prod') { bn.classList.remove('show'); }
      else {
        bn.classList.add('show');
        const map = { sandbox: ['#FBF1DD', '#7a5512', 'Sandbox environment — synthetic data, destructive actions disabled'], staging: ['#E8F1FA', '#0f4d80', 'Staging environment — pre-production validation'], demo: ['#EDEAF9', '#4a3aa8', 'Demo environment — synthetic tenants and evidence'] };
        const m = map[v]; bn.style.background = m[0]; bn.style.color = m[1]; bn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 4l-7 12a2 2 0 0 0 1.7 3h14a2 2 0 0 0 1.7-3l-7-12a2 2 0 0 0-3.4 0Z"/></svg>${m[2]}`;
      }
      renderStatus(); toast('Environment: ' + v.charAt(0).toUpperCase() + v.slice(1));
    });
    // queue collapse
    $("#qCollapse").addEventListener('click', () => {
      const b = $("#bodyGrid"); b.classList.toggle('qcollapsed');
      $("#qCollapse").querySelector('svg').innerHTML = b.classList.contains('qcollapsed') ? '<path d="M15 6l-6 6 6 6"/>' : '<path d="M9 6l6 6-6 6"/>';
    });
    $("#qMini").addEventListener('click', () => { $("#bodyGrid").classList.remove('qcollapsed'); $("#qCollapse").querySelector('svg').innerHTML = '<path d="M9 6l6 6-6 6"/>'; });

    // clock (UTC)
    function tick() { const d = new Date(); const p = n => String(n).padStart(2, '0'); $("#clock").textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`; }
    tick(); setInterval(tick, 1000);

    // global search
    const SI = [...TENANTS.map(t => ({ l: t.n, k: 'Tenant', go: 'tenants' })),
    ...EVIDENCE.map(e => ({ l: e[6] + ' · ' + e[3], k: 'Evidence', go: 'evidence' })),
    ...SAGA.map(s => ({ l: s[0] + ' · ' + s[2], k: 'Order', go: 'orders' })),
    ...Object.keys(NAMES).map(m => ({ l: NAMES[m], k: 'Domain', go: m }))];
    $("#search").addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim(); const pop = $("#searchPop");
      if (!q) { pop.classList.remove('show'); return; }
      const hits = SI.filter(x => x.l.toLowerCase().includes(q)).slice(0, 9);
      pop.innerHTML = hits.length ? hits.map((h, i) => `<a href="#" data-si="${i}">${h.l}<span class="k">${h.k}</span></a>`).join("") : '<div class="none">No results (permission-scoped)</div>';
      pop.classList.add('show');
      pop.querySelectorAll('[data-si]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); go(hits[+a.dataset.si].go); pop.classList.remove('show'); $("#search").value = ''; }));
    });
    $("#search").addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', () => $("#searchPop").classList.remove('show'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); $("#searchPop").classList.remove('show'); } });

    /* ============ INIT ============ */
    renderQueue(); renderStatus(); go('control');

  }, []);

  return (
    <div ref={containerRef} suppressHydrationWarning dangerouslySetInnerHTML={{
      __html: `

<header class="top">
  <button class="hamb" id="hamb" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
  <div class="brand"><img class="logo" src="data:image/png;base64,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" alt="ZoikoNex" width="150" height="30"></div>
  <span class="env env-prod" id="envPill"><i></i><select id="envSel" aria-label="Environment"><option value="prod">Production</option><option value="sandbox">Sandbox</option><option value="staging">Staging</option><option value="demo">Demo</option></select></span>
  <div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><input id="search" type="text" placeholder="Search tenants, MSISDN, ICCID, orders, invoices, evidence IDs…" autocomplete="off" aria-label="Global search"><div class="searchpop" id="searchPop"></div></div>
  <div class="topright">
    <button class="alertpill" id="alertPill"><svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 4l-7 12a2 2 0 0 0 1.7 3h14a2 2 0 0 0 1.7-3l-7-12a2 2 0 0 0-3.4 0Z"/></svg><b class="cr" id="alCrit">3</b><b class="wa" id="alWarn">4</b></button>
    <span class="clock" id="clock">--:--:-- UTC</span>
    <button class="iconbtn" id="themeToggle" aria-label="Theme"><svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg></button>
    <div class="role"><div class="rt"><b id="super-admin-user-name">Super Admin</b><span id="super-admin-user-role">Global Super Admin</span></div><div class="av" id="super-admin-user-avatar">SA</div></div>
    <button class="iconbtn logoutbtn" id="logoutBtn" onclick="doLogout()" aria-label="Logout" title="Logout"><svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M21 3v18"/></svg></button>
  </div>
</header>
<div class="envbanner" id="envBanner"></div>

<div class="body" id="bodyGrid">
  <!-- SIDEBAR (card-sorted: 5 groups / 12 domains) -->
  <nav class="side" id="side" aria-label="Command domains">
    <div class="grp">Command</div>
    <button class="navi active" data-m="control"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>Control Room</button>
    <button class="navi" data-m="ecosystem"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M10 10 6.5 6.5M14 10l3.5-3.5M10 14l-3.5 3.5M14 14l3.5 3.5"/></svg>Ecosystem Map</button>
    <div class="grp">Govern</div>
    <button class="navi" data-m="tenants"><svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5"/></svg>Tenants &amp; Operators</button>
    <button class="navi" data-m="identity"><svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>Identity &amp; Customers</button>
    <button class="navi" data-m="catalogue"><svg viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h10"/><circle cx="8" cy="5" r="1.4"/><circle cx="16" cy="12" r="1.4"/></svg>Catalogue &amp; Commercial</button>
    <div class="grp">Operate</div>
    <button class="navi" data-m="orders"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/><path d="M3 21h18"/></svg>Orders &amp; OSS</button>
    <button class="navi" data-m="usage"><svg viewBox="0 0 24 24"><path d="M3 12h4l3 7 4-14 3 7h4"/></svg>Usage &amp; Charging</button>
    <button class="navi" data-m="billing"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>Billing &amp; Finance</button>
    <div class="grp">Assure</div>
    <button class="navi" data-m="jurisdiction"><svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/></svg>Jurisdiction &amp; Compliance</button>
    <button class="navi" data-m="assurance"><svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 4 9 8 10 4-1 8-5 8-10V5l-8-3ZM9 12l2 2 4-4"/></svg>Assurance &amp; Risk</button>
    <button class="navi" data-m="evidence"><svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6zM15 2v5h5M9 13h6M9 17h4"/></svg>Evidence &amp; Governance</button>
    <div class="grp">Platform</div>
    <button class="navi" data-m="integrations"><svg viewBox="0 0 24 24"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/></svg>Integrations</button>
    <button class="navi" data-m="platform"><svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 12a8 8 0 0 1 .2-1.8L2 8.7l2-3.4 2.4 1a8 8 0 0 1 1.6-.9L8.6 3h6.8l.6 2.4a8 8 0 0 1 1.6.9l2.4-1 2 3.4-2.2 1.5A8 8 0 0 1 20 12"/></svg>Platform Admin</button>
  </nav>
  <div class="scrim" id="scrim"></div>

  <!-- MAIN -->
  <main class="main" id="main">
    <section class="module active" id="m-control"></section>
    <section class="module" id="m-ecosystem"></section>
    <section class="module" id="m-tenants"></section>
    <section class="module" id="m-identity"></section>
    <section class="module" id="m-catalogue"></section>
    <section class="module" id="m-orders"></section>
    <section class="module" id="m-usage"></section>
    <section class="module" id="m-billing"></section>
    <section class="module" id="m-jurisdiction"></section>
    <section class="module" id="m-assurance"></section>
    <section class="module" id="m-evidence"></section>
    <section class="module" id="m-integrations"></section>
    <section class="module" id="m-platform"></section>
  </main>

  <!-- RIGHT RAIL: GLOBAL ACTION QUEUE -->
  <aside class="queue" id="queue" aria-label="Global action queue">
    <div class="queue-h">
      <h3><svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 4l-7 12a2 2 0 0 0 1.7 3h14a2 2 0 0 0 1.7-3l-7-12a2 2 0 0 0-3.4 0Z"/></svg>Action Queue</h3>
      <span class="qc" id="qCount">0 items</span>
      <button class="collapse" id="qCollapse" aria-label="Collapse queue"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>
    <div id="queueList"></div>
    <div id="qMini"></div>
  </aside>

  <!-- ONBOARD TENANT MODAL -->
  <div id="invite-modal" class="modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;display:none;background:var(--bg);border:1px solid var(--border);padding:1.5rem;width:520px;max-width:92%;box-shadow:0 10px 30px rgba(0,0,0,0.5);border-radius:12px;max-height:90vh;overflow-y:auto;">
    <div class="modal-content">
      <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:12px;">
          <h2 style="margin:0;font-size:1.1rem;">Onboard tenant</h2>
          <button type="button" onclick="window.autoFillDemoTenant()" style="font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:#e2e8f0;color:#334155;border:1px solid #cbd5e1;cursor:pointer;">🎲 Auto-Fill Demo</button>
        </div>
        <button type="button" class="icon-btn" onclick="document.getElementById('invite-modal').style.display='none'" style="background:transparent;border:none;color:var(--tx);cursor:pointer;font-size:1.2rem;">&times;</button>
      </div>
      <form onsubmit="doCreateTenant(event)" style="margin-top:1rem;">
        <div class="modal-body">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--ink-faint);margin-bottom:10px;">Company</div>
          <div class="group">
            <label style="display:block;margin-bottom:0.2rem;font-size:0.85rem;color:var(--ink-faint);">Tenant name</label>
            <input type="text" id="t-name" required placeholder="Globex Mobile Ltd" oninput="window.handleTenantNameInput(event)" style="width:100%;background:#ffffff;border:1px solid #cbd5e1;color:#1e293b;border-radius:6px;padding:0.5rem;box-sizing:border-box;">
          </div>
          <div class="group" style="margin-top:0.8rem;">
            <label style="display:block;margin-bottom:0.2rem;font-size:0.85rem;color:var(--ink-faint);">Domain suffix</label>
            <input type="text" id="t-domain" required placeholder="globex.zoikonex.com" oninput="window.markFieldCustomized(event)" class="mono" style="width:100%;background:#ffffff;border:1px solid #cbd5e1;color:#1e293b;border-radius:6px;padding:0.5rem;box-sizing:border-box;font-size:12px;">
            <div style="font-size:10px;color:var(--ink-faint);margin-top:3px;">Auto-generated domain slug. Editable if needed.</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:0.8rem;">
            <div class="group">
              <label style="display:block;margin-bottom:0.2rem;font-size:0.85rem;color:var(--ink-faint);">Brand name</label>
              <input type="text" id="t-brandname" required placeholder="Globex Mobile" oninput="window.markFieldCustomized(event)" style="width:100%;background:#ffffff;border:1px solid #cbd5e1;color:#1e293b;border-radius:6px;padding:0.5rem;box-sizing:border-box;">
            </div>
            <div class="group">
              <label style="display:block;margin-bottom:0.2rem;font-size:0.85rem;color:var(--ink-faint);">Brand code</label>
              <input type="text" id="t-brandcode" required placeholder="globex-mobile" pattern="[a-zA-Z0-9\-]+" title="Alphanumeric and hyphens only" oninput="window.markFieldCustomized(event)" style="width:100%;background:#ffffff;border:1px solid #cbd5e1;color:#1e293b;border-radius:6px;padding:0.5rem;box-sizing:border-box;">
            </div>
          </div>

          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--ink-faint);margin-top:18px;margin-bottom:10px;">First admin user</div>
          <div class="group">
            <label style="display:block;margin-bottom:0.2rem;font-size:0.85rem;color:var(--ink-faint);">Email</label>
            <input type="email" id="t-admin-email" required placeholder="admin@globex.com" oninput="window.markFieldCustomized(event)" style="width:100%;background:#ffffff;border:1px solid #cbd5e1;color:#1e293b;border-radius:6px;padding:0.5rem;box-sizing:border-box;">
          </div>
          <div class="group" style="margin-top:0.8rem;">
            <label style="display:block;margin-bottom:0.2rem;font-size:0.85rem;color:var(--ink-faint);">Full name</label>
            <input type="text" id="t-admin-name" required placeholder="Jane Doe" oninput="window.markFieldCustomized(event)" style="width:100%;background:#ffffff;border:1px solid #cbd5e1;color:#1e293b;border-radius:6px;padding:0.5rem;box-sizing:border-box;">
          </div>
          <div class="group" style="margin-top:0.8rem;">
            <label style="display:block;margin-bottom:0.2rem;font-size:0.85rem;color:var(--ink-faint);">Temporary password</label>
            <input type="password" id="t-admin-pass" required minlength="12" placeholder="At least 12 characters" oninput="window.markFieldCustomized(event)" style="width:100%;background:#ffffff;border:1px solid #cbd5e1;color:#1e293b;border-radius:6px;padding:0.5rem;box-sizing:border-box;">
            <div style="font-size:10px;color:var(--ink-faint);margin-top:3px;">Auto-generated password &mdash; shown once after creation. Editable if needed.</div>
          </div>
        </div>
        <div class="modal-footer" style="margin-top:1.5rem;display:flex;justify-content:flex-end;gap:0.5rem;">
          <button type="button" class="btn btn-sec" onclick="document.getElementById('invite-modal').style.display='none'">Cancel</button>
          <button type="submit" class="btn btn-primary" id="t-submit-btn">Onboard</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="statusbar" id="statusbar"></div>

<!-- modal + toasts -->

<div class="scrim2" id="scrim2"><div class="modal" id="modal"></div></div>
<div class="toasts" id="toasts"></div>

` }} />
  );
}