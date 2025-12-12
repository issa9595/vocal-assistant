/**
 * @file supabase.ts
 * @description Types TypeScript simplifiés pour les tables Supabase
 * 
 * Ces types correspondent aux tables de la base de données Supabase
 * et sont utilisés dans l'application pour typer les données.
 */

/**
 * Type pour une conversation
 */
export type Conversation = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
};

/**
 * Type pour un message
 */
export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

/**
 * Type pour un événement de calendrier (format Supabase)
 * Note: Les colonnes sont start_time et end_time dans la BDD
 * pour éviter le conflit avec le mot réservé SQL "end"
 */
export type CalendarEventDB = {
  id: string;
  user_id: string;
  title: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  description: string | null;
  location: string | null;
  source: "voice" | "manual" | "ai" | null;
  meta: {
    groupId?: string;
  } | null;
  created_at: string;
};

/**
 * Type pour créer une conversation
 */
export type ConversationInsert = {
  user_id: string;
  title?: string | null;
};

/**
 * Type pour créer un message
 */
export type MessageInsert = {
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
};

/**
 * Type pour créer un événement
 */
export type CalendarEventInsert = {
  id?: string;
  user_id: string;
  title: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  description?: string | null;
  location?: string | null;
  source?: "voice" | "manual" | "ai" | null;
  meta?: {
    groupId?: string;
  } | null;
};

