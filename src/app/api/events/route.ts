/**
 * @file route.ts
 * @description API Route pour gérer les événements du calendrier
 *
 * Endpoints:
 * - GET /api/events : Liste les événements (avec filtres optionnels)
 * - POST /api/events : Crée un ou plusieurs événements
 */

import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import type { CalendarEvent } from "@/types/message";

/** Bornes anti-abus sur les écritures. */
const MAX_EVENTS_PER_REQUEST = 50;
const MAX_TITLE_LENGTH = 300;
const MAX_TEXT_LENGTH = 2_000;

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

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    let query = supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .order("start_time", { ascending: true });

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

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Rate limit : borne le volume d'écritures par utilisateur.
    const rate = checkRateLimit(`events-write:${user.id}`, {
      limit: 60,
      windowMs: 60_000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes, réessayez dans quelques instants." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { events } = body;

    const eventsToInsert = Array.isArray(events) ? events : [events];

    // Validation : nombre d'évènements et taille des champs bornés.
    if (eventsToInsert.length === 0 || eventsToInsert.length > MAX_EVENTS_PER_REQUEST) {
      return NextResponse.json(
        { error: `Entre 1 et ${MAX_EVENTS_PER_REQUEST} évènements par requête` },
        { status: 400 }
      );
    }
    for (const event of eventsToInsert) {
      if (
        !event ||
        typeof event.title !== "string" ||
        !event.title.trim() ||
        event.title.length > MAX_TITLE_LENGTH ||
        (typeof event.description === "string" && event.description.length > MAX_TEXT_LENGTH) ||
        (typeof event.location === "string" && event.location.length > MAX_TEXT_LENGTH)
      ) {
        return NextResponse.json(
          { error: "Évènement invalide (titre requis, tailles maximales dépassées)" },
          { status: 400 }
        );
      }
    }

    const insertData = eventsToInsert.map((event: Omit<CalendarEvent, "id" | "createdAt">) => ({
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      user_id: user.id,
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

    return NextResponse.json({ events: createdEvents });
  } catch (error) {
    console.error("Erreur API events:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
