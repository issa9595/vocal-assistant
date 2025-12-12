/**
 * @file route.ts
 * @description API Route pour récupérer la conversation actuelle et ses messages
 * 
 * Endpoint:
 * - GET /api/conversations/current : Récupère la dernière conversation et ses messages
 */

import { NextResponse } from "next/server";
import { getOrCreateLatestConversation, getMessagesByConversationId } from "@/lib/supabase/conversations";
import type { Message as MessageType } from "@/types/message";

/**
 * GET /api/conversations/current
 * Récupère la dernière conversation et tous ses messages
 */
export async function GET() {
  try {
    // Récupérer ou créer la dernière conversation
    const conversation = await getOrCreateLatestConversation();
    
    // Récupérer tous les messages de cette conversation
    const messagesDB = await getMessagesByConversationId(conversation.id);
    
    // Convertir les messages DB en format Message de l'application
    const messages: MessageType[] = messagesDB.map((msg) => {
      const createdAt = new Date(msg.created_at);
      // Vérifier que la date est valide
      if (isNaN(createdAt.getTime())) {
        console.warn(`Date invalide pour le message ${msg.id}, utilisation de la date actuelle`);
        return {
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: new Date(),
        };
      }
      return {
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt,
      };
    });

    return NextResponse.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Erreur API conversations/current:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

