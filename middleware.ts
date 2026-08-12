import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getTenantIdFromToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payloadBase64);
    const payload = JSON.parse(decoded);
    return payload.tenant_id || null;
  } catch (e) {
    return null;
  }
}

// The one host the internal super-admin console is served from. Kept in sync
// with lib/admin/platform/host.ts (which can't be imported here — middleware
// runs in the edge runtime and that module is a client module).
const SUPERADMIN_HOST = 'super-admin.zoikonex.com';
// Pre-existing un-hyphenated spelling: redirected to the canonical host, never
// served, so old bookmarks keep working without becoming a second login origin.
const LEGACY_SUPERADMIN_HOST = 'superadmin.zoikonex.com';

// Page paths that make up the super-admin console. These are only ever served
// on SUPERADMIN_HOST; requests for them on any other host are redirected there.
const SUPERADMIN_PATHS = ['/Super-admin'];

// Hosts that serve the marketing site / tooling — never treated as a tenant subdomain
const APEX_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'zoikonex.com',
  'www.zoikonex.com',
  SUPERADMIN_HOST,
  LEGACY_SUPERADMIN_HOST,
]);

function isApexHost(hostname: string): boolean {
  return APEX_HOSTS.has(hostname) || hostname.endsWith('.vercel.app');
}

/** Local dev / preview, where there is no super-admin subdomain to serve from. */
function isDevHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.vercel.app');
}

function isSuperAdminPath(pathname: string): boolean {
  return SUPERADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  // Only apply to our proxied API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);

    // Strip origin and referer to bypass WAF 403 Forbidden
    requestHeaders.delete('origin');
    requestHeaders.delete('referer');
    requestHeaders.delete('cookie');

    // Auto-inject X-Tenant-ID from Bearer JWT if missing
    if (!requestHeaders.has('x-tenant-id')) {
      const authHeader = request.headers.get('authorization');
      const tenantId = getTenantIdFromToken(authHeader);
      if (tenantId) {
        requestHeaders.set('x-tenant-id', tenantId);
      }
    }

    // Dynamically set the Host header to match the target service so JWT validation doesn't fail with 401
    const parts = request.nextUrl.pathname.split('/');
    if (parts.length > 2 && parts[1] === 'api') {
      const service = parts[2];
      requestHeaders.set('host', `${service}.api.zoikonex.com`);
    }

    // Create a new response and pass the modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Never rewrite Next.js internals or static assets — only actual page navigations
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    /\.[a-zA-Z0-9]+$/.test(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  // Subdomain-based routing for page requests (*.zoikonex.com)
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  // Old un-hyphenated host: send everything to the canonical one, so there is
  // exactly one origin where super-admin credentials are ever entered.
  if (hostname === LEGACY_SUPERADMIN_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = SUPERADMIN_HOST;
    url.protocol = 'https';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  if (hostname === SUPERADMIN_HOST) {
    // super-admin.zoikonex.com -> our internal super-admin consoles only.
    // /platform-admin is served as-is; anything else is mapped under
    // /Super-admin so the bare domain lands on the console.
    if (pathname.startsWith('/platform-admin')) {
      return NextResponse.next();
    }
    if (!pathname.startsWith('/Super-admin')) {
      const url = request.nextUrl.clone();
      url.pathname = `/Super-admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // The super-admin console is not served from the apex, from a tenant
  // subdomain, or from anywhere else — this is what makes
  // super-admin.zoikonex.com the only place a super admin can sign in.
  if (isSuperAdminPath(pathname) && !isDevHost(hostname)) {
    const url = request.nextUrl.clone();
    url.hostname = SUPERADMIN_HOST;
    url.protocol = 'https';
    url.port = '';
    return NextResponse.redirect(url, 307);
  }

  if (!isApexHost(hostname)) {
    // Any other *.zoikonex.com is a tenant subdomain (e.g. golite.zoikonex.com).
    // Land the bare domain on the tenant login screen; the login page resolves
    // the tenant from the hostname itself (see lib/admin/tenant-resolver.ts).
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
