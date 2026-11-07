import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/email/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, html, text, from, replyTo, metadata } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: to, subject, html" },
        { status: 400 }
      );
    }

    const result = await sendMail({
      to,
      subject,
      html,
      text,
      from,
      replyTo,
      metadata,
    });

    return NextResponse.json({
      ok: true,
      messageId: result.messageId,
      transport: result.transport,
      message: `Email successfully dispatched to ${to}`,
    });
  } catch (err: any) {
    console.error("POST /api/email/send error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
