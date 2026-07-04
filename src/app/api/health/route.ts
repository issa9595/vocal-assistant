/**
 * @file route.ts
 * @description Endpoint de healthcheck — utilisé par le HEALTHCHECK Docker,
 * Prometheus (blackbox) et Uptime Kuma. Ne dépend d'aucun service externe
 * pour éviter les faux positifs (si Supabase est down, l'app tourne quand même).
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "lumia",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
