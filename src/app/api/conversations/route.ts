/**
 * @file route.ts
 * @description API Route pour gérer les conversations et messages
 * 
 * Endpoints:
 * - GET /api/conversations : Liste les conversations
 * - POST /api/conversations : Crée une nouvelle conversation
 * - GET /api/conversations/[id]/messages : Récupère les messages d'une conversation
 * - POST /api/conversations/[id]/messages : Ajoute un message à une conversation
 */

import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";

const DEMO_USER_ID = "demo-user";

/**
 * GET /api/conversations
 * Liste les conversations de l'utilisateur
 */
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase n'est pas configuré. Veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local" },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des conversations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversations: data || [] });
  } catch (error) {
    console.error("Erreur API conversations:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Crée une nouvelle conversation
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
    const { title } = body;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: DEMO_USER_ID,
        title: title || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de la conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: data });
  } catch (error) {
    console.error("Erreur API conversations:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

