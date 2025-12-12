/**
 * @file types.ts
 * @description Types TypeScript générés pour les tables Supabase
 * 
 * Ces types correspondent au schéma SQL défini dans Supabase.
 * Ils sont utilisés pour typer les requêtes et réponses Supabase.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: "user" | "assistant";
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      calendar_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          start_time: string; // ISO string (renommé de "start" car "end" est un mot réservé)
          end_time: string; // ISO string (renommé de "end" car "end" est un mot réservé)
          description: string | null;
          location: string | null;
          source: "voice" | "manual" | "ai" | null;
          meta: Json | null; // Pour stocker groupId et autres métadonnées
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          start_time: string;
          end_time: string;
          description?: string | null;
          location?: string | null;
          source?: "voice" | "manual" | "ai" | null;
          meta?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          start_time?: string;
          end_time?: string;
          description?: string | null;
          location?: string | null;
          source?: "voice" | "manual" | "ai" | null;
          meta?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

