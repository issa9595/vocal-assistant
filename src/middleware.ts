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
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
