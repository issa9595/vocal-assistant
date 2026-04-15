/**
 * @file conversations.ts
 * @description Fonctions serveur pour gérer les conversations et messages
 *
 * Ces fonctions utilisent le client Supabase serveur et sont appelées
 * depuis les Server Components ou Server Actions.
 */

import { createClient, isSupabaseConfigured } from "./server";
import type { Conversation, Message, ConversationInsert, MessageInsert } from "@/types/supabase";

const DEMO_USER_ID = "demo-user";

/**
 * Récupère toutes les conversations de l'utilisateur
 */
export async function getConversations(): Promise<Conversation[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase non configuré, retourne un tableau vide");
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", DEMO_USER_ID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
    throw new Error("Erreur lors de la récupération des conversations");
  }

  return (data || []) as Conversation[];
}

/**
 * Récupère une conversation par son ID
 */
export async function getConversationById(id: string): Promise<Conversation | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .eq("user_id", DEMO_USER_ID)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la conversation:", error);
    return null;
  }

  return data as Conversation;
}

/**
 * Crée une nouvelle conversation
 */
export async function createConversation(
  insert: ConversationInsert
): Promise<Conversation> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: insert.user_id || DEMO_USER_ID,
      title: insert.title || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la conversation:", error);
    throw new Error("Erreur lors de la création de la conversation");
  }

  return data as Conversation;
}

/**
 * Récupère tous les messages d'une conversation
 */
export async function getMessagesByConversationId(
  conversationId: string
): Promise<Message[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return [];
  }

  return (data || []) as Message[];
}

/**
 * Crée un nouveau message
 */
export async function createMessage(insert: MessageInsert): Promise<Message> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: insert.conversation_id,
      role: insert.role,
      content: insert.content,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création du message:", error);
    throw new Error("Erreur lors de la création du message");
  }

  return data as Message;
}

/**
 * Récupère la dernière conversation de l'utilisateur
 * (ou crée une nouvelle si aucune n'existe)
 */
export async function getOrCreateLatestConversation(): Promise<Conversation> {
  const conversations = await getConversations();

  if (conversations.length > 0) {
    return conversations[0];
  }

  return await createConversation({
    user_id: DEMO_USER_ID,
    title: null,
  });
}
