/**
 * @file server.ts
 * @description Client Supabase pour les route handlers et server components.
 * Utilise createServerClient de @supabase/ssr pour lire/écrire la session via cookies.
 *
 * IMPORTANT : appeler createClient() à l'intérieur de chaque handler,
 * jamais en dehors — cookies() est contextuel à la requête.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Crée un client Supabase serveur lié aux cookies de la requête courante.
 * À appeler dans chaque route handler ou server component qui en a besoin.
 *
 * @example
 * const supabase = await createClient();
 * const { data: { user } } = await supabase.auth.getUser();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component — lecture seule, pas d'erreur à remonter.
          }
        },
      },
    }
  );
}

/**
 * Vérifie si les variables d'environnement Supabase sont configurées.
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
