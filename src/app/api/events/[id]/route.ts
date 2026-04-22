/**
 * @file route.ts
 * @description API Route pour gérer un événement spécifique
 *
 * Endpoints:
 * - PUT /api/events/[id] : Met à jour un événement
 * - DELETE /api/events/[id] : Supprime un événement
 */

import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { CalendarEvent } from "@/types/message";

/**
 * PUT /api/events/[id]
 * Met à jour un événement
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const updates: Partial<CalendarEvent> = body;

    const updateData: Partial<{
      title: string;
      start_time: string;
      end_time: string;
      description: string | null;
      location: string | null;
      source: "voice" | "manual" | "ai" | null;
      meta: { groupId?: string } | null;
    }> = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.start !== undefined) {
      updateData.start_time = updates.start instanceof Date
        ? updates.start.toISOString()
        : updates.start;
    }
    if (updates.end !== undefined) {
      updateData.end_time = updates.end instanceof Date
        ? updates.end.toISOString()
        : updates.end;
    }
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.location !== undefined) updateData.location = updates.location || null;
    if (updates.source !== undefined) updateData.source = (updates.source as "voice" | "manual" | "ai" | null) || null;
    if (updates.meta !== undefined) {
      updateData.meta = updates.meta ? { groupId: updates.meta.groupId } : null;
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour de l'événement" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    const event: CalendarEvent = {
      id: data.id,
      title: data.title,
      start: new Date(data.start_time),
      end: new Date(data.end_time),
      createdAt: new Date(data.created_at),
      source: data.source || undefined,
      description: data.description || undefined,
      location: data.location || undefined,
      meta: data.meta ? (data.meta as { groupId?: string }) : undefined,
    };

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Erreur API events:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/[id]
 * Supprime un événement
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la suppression de l'événement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API events:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
