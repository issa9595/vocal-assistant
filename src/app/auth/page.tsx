/**
 * @file page.tsx
 * @description Page d'authentification Lumia — connexion et inscription.
 *
 * Modes :
 * - "signin" : email + mot de passe
 * - "signup" : email + mot de passe + confirmation
 * Providers : email/password, Google OAuth
 *
 * Après connexion réussie : redirect /app (géré par le middleware)
 * Après inscription : message de confirmation par email
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LumiaLogo from "@/components/LumiaLogo";

type Mode = "signin" | "signup";

function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Afficher l'erreur callback OAuth si présente dans l'URL
  useEffect(() => {
    if (searchParams.get("error") === "callback") {
      setError("Une erreur est survenue lors de la connexion. Réessaie.");
    }
  }, [searchParams]);

  function switchMode(newMode: Mode) {
    setMode(newMode);
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signup") {
      if (password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes("already registered")) {
          setError("Cet email est déjà utilisé. Connecte-toi à la place.");
        } else {
          setError("Une erreur est survenue. Réessaie.");
        }
      } else {
        setMessage("Vérifie ta boîte mail pour confirmer ton compte.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Email ou mot de passe incorrect.");
      } else {
        router.push("/app");
        router.refresh();
      }
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="
      min-h-screen
      bg-[var(--color-brand-white)]
      flex flex-col items-center justify-center
      px-4
    ">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/accueil">
          <LumiaLogo height={32} />
        </Link>
      </div>

      {/* Card */}
      <div className="
        w-full max-w-sm
        border border-[var(--border-subtle)]
        rounded-2xl
        p-8
        shadow-soft
        bg-[var(--color-brand-white)]
      ">
        {/* Onglets */}
        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`
              flex-1 py-2 rounded-full text-sm font-medium transition-all
              ${mode === "signin"
                ? "bg-[var(--color-brand-black)] text-[var(--color-brand-white)]"
                : "text-[var(--color-brand-black)] hover:bg-[var(--surface-soft)]"
              }
            `}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`
              flex-1 py-2 rounded-full text-sm font-medium transition-all
              ${mode === "signup"
                ? "bg-[var(--color-brand-black)] text-[var(--color-brand-white)]"
                : "text-[var(--color-brand-black)] hover:bg-[var(--surface-soft)]"
              }
            `}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-brand-black)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="toi@exemple.com"
              className="
                w-full px-4 py-2.5
                border border-[var(--border-subtle)]
                rounded-xl text-sm
                bg-[var(--color-brand-white)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-black)]
              "
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[var(--color-brand-black)]">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="8 caractères minimum"
              className="
                w-full px-4 py-2.5
                border border-[var(--border-subtle)]
                rounded-xl text-sm
                bg-[var(--color-brand-white)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-black)]
              "
            />
          </div>

          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--color-brand-black)]">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Répète ton mot de passe"
                className="
                  w-full px-4 py-2.5
                  border border-[var(--border-subtle)]
                  rounded-xl text-sm
                  bg-[var(--color-brand-white)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-black)]
                "
              />
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          {/* Message de succès */}
          {message && (
            <p className="text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 mt-1
              bg-[var(--color-brand-black)]
              text-[var(--color-brand-white)]
              font-medium text-sm
              rounded-full
              hover:opacity-90
              disabled:opacity-50
              transition-all
            "
          >
            {loading
              ? "Chargement..."
              : mode === "signin"
              ? "Se connecter"
              : "Créer un compte"
            }
          </button>
        </form>

        {/* Séparateur */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span className="text-xs text-[#3D3D3D80]">ou</span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="
            w-full py-2.5
            border border-[var(--border-subtle)]
            rounded-full
            flex items-center justify-center gap-3
            text-sm font-medium
            text-[var(--color-brand-black)]
            hover:bg-[var(--surface-soft)]
            transition-all
          "
        >
          {/* Icône Google */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
