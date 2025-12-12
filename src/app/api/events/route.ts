/**
 * @file route.ts
 * @description API Route pour gérer les événements du calendrier
 * 
 * Endpoints:
 * - GET /api/events : Liste les événements (avec filtres optionnels)
 * - POST /api/events : Crée un ou plusieurs événements
 * - PUT /api/events/[id] : Met à jour un événement
 * - DELETE /api/events/[id] : Supprime un événement
 */

import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";
import type { CalendarEvent } from "@/types/message";

const DEMO_USER_ID = "demo-user";

/**
 * GET /api/events
 * Liste les événements avec filtres optionnels (start, end)
 */
export async function GET(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase n'est pas configuré. Veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    let query = supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .order("start_time", { ascending: true });

    // Filtres optionnels par période
    if (startParam) {
      query = query.gte("start_time", startParam);
    }
    if (endParam) {
      query = query.lte("start_time", endParam);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des événements" },
        { status: 500 }
      );
    }

    // Convertir les données Supabase en CalendarEvent
    const events: CalendarEvent[] = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      start: new Date(row.start_time),
      end: new Date(row.end_time),
      createdAt: new Date(row.created_at),
      source: row.source || undefined,
      description: row.description || undefined,
      location: row.location || undefined,
      meta: row.meta ? (row.meta as { groupId?: string }) : undefined,
    }));

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Erreur API events:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Crée un ou plusieurs événements
 */
export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase n'est pas configuré. Veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { events } = body;

    // Support pour un seul événement ou plusieurs
    const eventsToInsert = Array.isArray(events) ? events : [events];

    const insertData = eventsToInsert.map((event: Omit<CalendarEvent, "id" | "createdAt">) => ({
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      user_id: DEMO_USER_ID,
      title: event.title,
      start_time: event.start instanceof Date ? event.start.toISOString() : event.start,
      end_time: event.end instanceof Date ? event.end.toISOString() : event.end,
      description: event.description || null,
      location: event.location || null,
      source: event.source || "manual",
      meta: event.meta ? { groupId: event.meta.groupId } : null,
    }));

    const { data, error } = await supabase
      .from("calendar_events")
      .insert(insertData)
      .select();

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création des événements" },
        { status: 500 }
      );
    }

    // Convertir les données Supabase en CalendarEvent
    const createdEvents: CalendarEvent[] = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      start: new Date(row.start_time),
      end: new Date(row.end_time),
      createdAt: new Date(row.created_at),
      source: row.source || undefined,
      description: row.description || undefined,
      location: row.location || undefined,
      meta: row.meta ? (row.meta as { groupId?: string }) : undefined,
    }));

    // Toujours retourner un tableau d'événements pour simplifier le traitement côté client
    return NextResponse.json({
      events: createdEvents,
    });
  } catch (error) {
    console.error("Erreur API events:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

