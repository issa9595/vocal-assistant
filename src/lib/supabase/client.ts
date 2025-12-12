/**
 * @file client.ts
 * @description Client Supabase pour le côté client (browser)
 * 
 * Ce client est utilisé dans les composants React côté client.
 * Utilise NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client Supabase pour le côté client
 * Utilise la clé anonyme (anon key) pour les opérations côté client
 * 
 * Note: Les variables d'environnement doivent être configurées dans .env.local
 */
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false, // On n'utilise pas l'auth pour l'instant
    },
  }
);

/**
 * Vérifie si Supabase est configuré
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

