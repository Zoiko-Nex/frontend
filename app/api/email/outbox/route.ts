import { NextResponse } from "next/server";
import { getOutbox } from "@/lib/email/mailer";

export async function GET() {
  try {
    const emails = getOutbox();
    return NextResponse.json({ ok: true, count: emails.length, emails });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
