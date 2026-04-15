"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LumiaLogo from "@/components/LumiaLogo";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Header de la landing page — auth-aware.
 * - Non connecté : boutons "Se connecter" et "S'inscrire"
 * - Connecté : lien "Accéder à l'app" + bouton "Se déconnecter"
 */
export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Récupérer la session initiale
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Écouter les changements de session (connexion / déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <header className="
      sticky top-0 z-50
      w-full
      bg-(--color-brand-white)
      border-b border-(--border-subtle)
      backdrop-blur-sm bg-opacity-95
    ">
      <div className="
        max-w-6xl
        mx-auto
        px-4 md:px-8 lg:px-12
        py-4 md:py-5
        flex
        items-center
        justify-between
      ">
        {/* Logo */}
        <h1>
          <LumiaLogo height={28} />
        </h1>

        {/* CTA auth-aware */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/app"
                className="
                  px-4 md:px-6
                  py-2 md:py-2.5
                  bg-(--color-brand-white)
                  border border-(--border-subtle)
                  text-(--color-brand-black)
                  font-medium
                  text-sm md:text-base
                  rounded-full
                  shadow-soft
                  hover:shadow-medium
                  hover:bg-(--surface-soft)
                  transition-all duration-300
                "
              >
                Accéder à l&apos;app
              </Link>
              <button
                onClick={handleSignOut}
                className="
                  px-4 py-2
                  text-sm font-medium
                  text-[#3D3D3D80]
                  hover:text-(--color-brand-black)
                  transition-colors
                "
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="
                  px-4 py-2
                  text-sm font-medium
                  text-(--color-brand-black)
                  hover:opacity-70
                  transition-opacity
                "
              >
                Se connecter
              </Link>
              <Link
                href="/auth"
                className="
                  px-4 md:px-6
                  py-2 md:py-2.5
                  bg-(--color-brand-black)
                  text-(--color-brand-white)
                  font-medium
                  text-sm md:text-base
                  rounded-full
                  shadow-soft
                  hover:opacity-90
                  transition-all duration-300
                "
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
