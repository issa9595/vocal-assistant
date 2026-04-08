"use client";

import Link from "next/link";

/**
 * Section CTA finale
 * Titre + texte + slogan + bouton
 * Background avec dégradé vert/bleu
 */
export default function FinalCTA() {
  return (
    <section className="
      py-16 md:py-24 lg:py-32
      bg-[linear-gradient(135deg,#f4b4c8_0%,#fcecd3_100%)]
    ">
      <div className="
        max-w-6xl
        mx-auto
        px-4 md:px-8 lg:px-12
      ">
        <div className="
          max-w-4xl
          mx-auto
          text-center
          space-y-8 md:space-y-12
        ">
          {/* Titre */}
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl xl:text-6xl
            font-bold
            text-(--color-brand-black)
          ">
            Lumia n'est pas qu'un assistant. C'est votre futur allié du quotidien.
          </h2>

          {/* Texte */}
          <p className="
            text-lg md:text-xl lg:text-2xl
            landing-muted
            leading-relaxed
            font-light
          ">
            Le repas est organisé. La réunion est prête. La facture est relancée. Vous respirez.
          </p>

          {/* Slogan */}
          <p className="
            text-xl md:text-2xl lg:text-3xl
            text-(--color-brand-black)
            font-semibold
          ">
            Arrêtez de penser votre vie.{" "}
            <span className="landing-gradient-text">
              Commencez à la vivre.
            </span>
          </p>

          {/* Bouton */}
          <div className="pt-4 md:pt-8">
            <Link
              href="/app"
              className="
                inline-block
                px-6 md:px-8 lg:px-10
                py-2.5 md:py-3 lg:py-3.5
                bg-(--color-brand-white)
                text-(--color-brand-black)
                font-semibold
                text-sm md:text-base lg:text-lg
                rounded-full
                shadow-soft
                hover:shadow-medium
                hover:bg-(--surface-soft)
                transition-all duration-300
                transform hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              Accéder à l'app
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

