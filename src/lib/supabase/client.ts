/**
 * @file client.ts
 * @description Client Supabase pour les composants client (browser)
 * Utilise createBrowserClient de @supabase/ssr pour gérer la session via cookies.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Crée un client Supabase pour les composants "use client".
 * Appelé à chaque rendu pour récupérer la session courante.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Instance partagée pour une utilisation simple côté client.
 * Pour les composants qui ont besoin d'un accès direct sans recréer le client.
 */
export const supabase = createClient();

/**
 * Vérifie si les variables d'environnement Supabase sont configurées.
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
