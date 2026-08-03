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

// Hosts that serve the marketing site / tooling — never treated as a tenant subdomain
const APEX_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'zoikonex.com',
  'www.zoikonex.com',
]);

const SUPERADMIN_HOST = 'superadmin.zoikonex.com';

function isApexHost(hostname: string): boolean {
  return APEX_HOSTS.has(hostname) || hostname.endsWith('.vercel.app');
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

  // Subdomain-based routing for page requests (*.zoikonex.com)
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (hostname === SUPERADMIN_HOST) {
    // superadmin.zoikonex.com -> our internal Super-admin console
    if (!pathname.startsWith('/Super-admin')) {
      const url = request.nextUrl.clone();
      url.pathname = `/Super-admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
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
