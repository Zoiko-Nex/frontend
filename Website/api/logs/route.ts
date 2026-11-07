import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    "[INFO] System initialized successfully",
    "[INFO] All backend services are healthy and running",
    "[INFO] Connected to primary database",
    "[INFO] Started polling for events"
  ]);
}
