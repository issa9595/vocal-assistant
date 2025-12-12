/**
 * @file server.ts
 * @description Client Supabase pour le côté serveur (route handlers, server components)
 * 
 * Ce client est utilisé dans les API routes et server components.
 * Utilise NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * 
 * Note: Pour des opérations privilégiées, on pourrait utiliser SUPABASE_SERVICE_ROLE_KEY,
 * mais pour l'instant on reste sur l'anon key.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client Supabase pour le côté serveur
 * Utilise la clé anonyme (anon key) pour les opérations côté serveur
 * 
 * @example
 * ```ts
 * const { data, error } = await supabase
 *   .from('conversations')
 *   .select('*');
 * ```
 * 
 * Note: Les variables d'environnement doivent être configurées dans .env.local
 */
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
    },
  }
);

/**
 * Vérifie si Supabase est configuré
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

