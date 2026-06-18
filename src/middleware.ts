/**
 * @file middleware.ts
 * @description Middleware Next.js — rafraîchit la session Supabase et protège les routes.
 *
 * Routes protégées : /app (et sous-routes)
 * - Non connecté → redirect /auth
 * Routes publiques : /accueil, /auth, /auth/callback
 * - Connecté sur /auth → redirect /app
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Anti-spam : on ne log l'erreur Supabase qu'une fois toutes les 30 s
 * (le middleware s'exécute sur chaque requête).
 */
let lastAuthErrorLog = 0;

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : utiliser getUser() et non getSession() — getUser() vérifie côté serveur Supabase.
  // Résilience : si Supabase est injoignable (réseau, projet en pause, URL invalide),
  // on ne plante pas — on traite l'utilisateur comme déconnecté (fail-closed).
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    const now = Date.now();
    if (now - lastAuthErrorLog > 30_000) {
      lastAuthErrorLog = now;
      console.warn(
        "[middleware] Session Supabase non rafraîchie : impossible de joindre Supabase " +
          `(supabase.auth.getUser sur ${request.nextUrl.pathname}). ` +
          "Cause probable : réseau/VPN, projet Supabase en pause, ou NEXT_PUBLIC_SUPABASE_URL invalide. " +
          "L'utilisateur est traité comme déconnecté. Détail : " +
          (error instanceof Error ? error.message : String(error))
      );
    }
    user = null;
  }

  const { pathname } = request.nextUrl;

  // Protéger /app : rediriger vers /auth si non connecté
  if (pathname.startsWith("/app") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Éviter que les utilisateurs connectés restent sur /auth
  if (pathname === "/auth" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Correspondre à toutes les routes sauf :
     * - _next/static (assets statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     * - fichiers avec extension (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
