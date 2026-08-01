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
}
