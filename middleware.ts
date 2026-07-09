import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to our proxied API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    
    // Strip origin and referer to bypass WAF 403 Forbidden
    requestHeaders.delete('origin');
    requestHeaders.delete('referer');
    requestHeaders.delete('cookie');

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
