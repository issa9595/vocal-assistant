"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LumiaLogo from "@/components/LumiaLogo";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ArrowRightIcon } from "./Icons";

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
    <header className="sticky top-0 z-50 w-full px-3 md:px-6 pt-3 md:pt-4">
      <div className="
        glass-panel glass-grain glass-highlight
        max-w-6xl mx-auto
        rounded-full
        px-4 md:px-6
        py-2.5 md:py-3
        flex items-center justify-between
        gap-3
      ">
        {/* Logo */}
        <Link href="/accueil" aria-label="Lumia — accueil" className="flex items-center cursor-pointer">
          <LumiaLogo height={28} />
        </Link>

        {/* CTA auth-aware */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {user ? (
            <>
              <button
                onClick={handleSignOut}
                className="
                  hidden sm:inline-flex items-center
                  rounded-full px-4 py-2
                  text-sm font-medium
                  text-[#515151]
                  hover:text-(--color-brand-black)
                  hover:bg-[rgba(255,255,255,0.55)]
                  transition-all duration-200
                  cursor-pointer
                "
              >
                Se déconnecter
              </button>
              <Link
                href="/app"
                className="
                  group inline-flex items-center gap-2 whitespace-nowrap
                  rounded-full px-4 md:px-5 py-2 md:py-2.5
                  text-sm font-semibold text-(--color-brand-white)
                  bg-(--color-brand-black)
                  shadow-[0_6px_18px_-6px_rgba(61,61,61,0.5)]
                  hover:shadow-[0_10px_26px_-8px_rgba(61,61,61,0.6)]
                  hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-300
                  cursor-pointer
                "
              >
                Accéder à l&apos;app
                <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="
                  hidden sm:inline-flex items-center whitespace-nowrap
                  rounded-full px-4 py-2
                  text-sm font-medium text-(--color-brand-black)
                  hover:bg-[rgba(255,255,255,0.55)]
                  transition-all duration-200
                  cursor-pointer
                "
              >
                Se connecter
              </Link>
              <Link
                href="/auth"
                className="
                  group inline-flex items-center gap-2 whitespace-nowrap
                  rounded-full px-4 md:px-5 py-2 md:py-2.5
                  text-sm font-semibold text-(--color-brand-white)
                  bg-(--color-brand-black)
                  shadow-[0_6px_18px_-6px_rgba(61,61,61,0.5)]
                  hover:shadow-[0_10px_26px_-8px_rgba(61,61,61,0.6)]
                  hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-300
                  cursor-pointer
                "
              >
                S&apos;inscrire
                <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
