import { createClient, isSupabaseConfigured } from "./server";
import type { Conversation, Message, ConversationInsert, MessageInsert } from "@/types/supabase";

async function getAuthUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");
  return user.id;
}

export async function getConversations(): Promise<Conversation[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase non configuré, retourne un tableau vide");
    return [];
  }

  const userId = await getAuthUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
    throw new Error("Erreur lors de la récupération des conversations");
  }

  return (data || []) as Conversation[];
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const userId = await getAuthUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la conversation:", error);
    return null;
  }

  return data as Conversation;
}

export async function createConversation(
  insert: ConversationInsert
): Promise<Conversation> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré");
  }

  const userId = await getAuthUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: insert.user_id || userId,
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

export async function getOrCreateLatestConversation(): Promise<Conversation> {
  const conversations = await getConversations();

  if (conversations.length > 0) {
    return conversations[0];
  }

  const userId = await getAuthUserId();
  return await createConversation({
    user_id: userId,
    title: null,
  });
}
