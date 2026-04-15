/**
 * @file route.ts
 * @description Route handler GET pour le callback OAuth Supabase.
 *
 * Flux : Google OAuth → redirect ici avec ?code=xxx → échange code → session → /app
 * Aussi utilisé pour la confirmation d'email (même mécanisme PKCE).
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/app`);
    }
  }

  // Code absent ou erreur → retour sur /auth avec indicateur d'erreur
  return NextResponse.redirect(`${origin}/auth?error=callback`);
}
