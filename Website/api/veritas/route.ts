import { NextRequest, NextResponse } from "next/server";
import { analyzeVeritasQuery, type VeritasContextPayload } from "@/lib/admin/veritas-ai";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<VeritasContextPayload>;
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_QUERY",
            message: "A non-empty query string is required.",
          },
        },
        { status: 400 },
      );
    }

    const payload: VeritasContextPayload = {
      query,
      history: Array.isArray(body.history) ? body.history : [],
      activeModule: body.activeModule,
      activeModuleName: body.activeModuleName,
      environment: body.environment,
      timeRange: body.timeRange,
      focusTenantId: body.focusTenantId,
      tenants: Array.isArray(body.tenants) ? body.tenants : [],
      health: body.health ?? {},
      crossTenantServices: Array.isArray(body.crossTenantServices)
        ? body.crossTenantServices
        : ["identity", "order", "integration"],
      users: Array.isArray(body.users) ? body.users : [],
      roles: Array.isArray(body.roles) ? body.roles : [],
      auditTrails: Array.isArray(body.auditTrails) ? body.auditTrails : [],
      orders: Array.isArray(body.orders) ? body.orders : [],
      connectors: Array.isArray(body.connectors) ? body.connectors : [],
      evidence: Array.isArray(body.evidence) ? body.evidence : [],
      metrics: body.metrics,
      unavailableDomains: Array.isArray(body.unavailableDomains) ? body.unavailableDomains : [],
    };

    const reply = analyzeVeritasQuery(payload);

    return NextResponse.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString(),
        grounded: true,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to process Veritas AI query.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VERITAS_ENGINE_ERROR",
          message,
        },
      },
      { status: 500 },
    );
  }
}

