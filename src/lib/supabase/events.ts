/**
 * @file events.ts
 * @description Fonctions serveur pour gérer les événements du calendrier
 *
 * Ces fonctions utilisent le client Supabase serveur et sont appelées
 * depuis les Server Components ou Server Actions.
 */

import { createClient, isSupabaseConfigured } from "./server";
import type { CalendarEventDB, CalendarEventInsert } from "@/types/supabase";
import type { CalendarEvent } from "@/types/message";

const DEMO_USER_ID = "demo-user";

/**
 * Récupère tous les événements de l'utilisateur
 * Optionnellement filtrés par période (startDate, endDate)
 */
export async function getCalendarEvents(
  startDate?: Date,
  endDate?: Date
): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase non configuré, retourne un tableau vide");
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", DEMO_USER_ID)
    .order("start_time", { ascending: true });

  if (startDate) {
    query = query.gte("start_time", startDate.toISOString());
  }
  if (endDate) {
    query = query.lte("start_time", endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return [];
  }

  return (data || []).map((row) => ({
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
}

/**
 * Récupère un événement par son ID
 */
export async function getCalendarEventById(
  id: string
): Promise<CalendarEvent | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("id", id)
    .eq("user_id", DEMO_USER_ID)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
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
}

/**
 * Crée un ou plusieurs événements
 */
export async function createCalendarEvents(
  events: Array<Omit<CalendarEvent, "id" | "createdAt">>
): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré");
  }

  const supabase = await createClient();

  const insertData: CalendarEventInsert[] = events.map((event) => ({
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
    console.error("Erreur lors de la création des événements:", error);
    throw new Error("Erreur lors de la création des événements");
  }

  return (data || []).map((row) => ({
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
}

/**
 * Met à jour un événement
 */
export async function updateCalendarEvent(
  id: string,
  updates: Partial<Omit<CalendarEvent, "id" | "createdAt">>
): Promise<CalendarEvent | null> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré");
  }

  const supabase = await createClient();
  const updateData: Partial<CalendarEventDB> = {};

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
  if (updates.source !== undefined) updateData.source = updates.source || null;
  if (updates.meta !== undefined) {
    updateData.meta = updates.meta ? { groupId: updates.meta.groupId } : null;
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", DEMO_USER_ID)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
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
}

/**
 * Supprime un événement
 */
export async function deleteCalendarEvent(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id)
    .eq("user_id", DEMO_USER_ID);

  if (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    return false;
  }

  return true;
}
