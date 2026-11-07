import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const h: any = {};
  req.headers.forEach((v, k) => { h[k] = v; });
  return NextResponse.json({ headers: h });
}
