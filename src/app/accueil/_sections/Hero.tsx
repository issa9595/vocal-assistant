"use client";

import Link from "next/link";

/**
 * Section Hero principale
 * Format centré simple avec titre, sous-titre et CTA
 */
export default function Hero() {
  return (
    <section className="
      min-h-[85vh]
      flex items-center justify-center
      px-4 md:px-8 lg:px-12
      py-20 md:py-32
      bg-[var(--color-brand-white)]
    ">
      <div className="
        max-w-5xl
        mx-auto
        text-center
        space-y-8 md:space-y-12
      ">
        {/* Titre principal */}
        <h1 className="
          text-4xl md:text-5xl lg:text-6xl xl:text-7xl
          font-bold
          text-[var(--color-brand-black)]
          tracking-tight
          leading-[1.1]
        ">
          Organise ta journée,
          <br />
          <span className="
            bg-gradient-to-r from-[#F8C4C5] to-[#FFF4C7]
            bg-clip-text
            text-transparent
          ">
            juste avec ta voix.
          </span>
        </h1>

        {/* Sous-titre */}
        <p className="
          text-lg md:text-xl lg:text-2xl
          text-[#3D3D3D80]
          max-w-3xl
          mx-auto
          leading-relaxed
          font-light
        ">
          Tu parles, l'IA comprend. Elle ajoute tes rendez-vous au calendrier
          et prévoit même les étapes cachées : courses, préparation, déplacements.
          Tout se fait naturellement, sans effort.
        </p>

        {/* CTAs */}
        <div className="
          flex flex-col sm:flex-row
          items-center justify-center
          gap-4 md:gap-6
          pt-4 md:pt-8
        ">
          <Link
            href="/app"
            className="
              px-6 md:px-8 lg:px-10
              py-2.5 md:py-3 lg:py-3.5
              bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
              text-[var(--color-brand-black)]
              font-semibold
              text-sm md:text-base lg:text-lg
              rounded-full
              shadow-soft
              hover:shadow-medium
              transition-all duration-300
              transform hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            Accéder à l'app
          </Link>

          <a
            href="#comment-ca-marche"
            className="
              text-[var(--color-brand-black)]
              font-medium
              text-sm md:text-base lg:text-lg
              underline
              underline-offset-4
              decoration-2
              hover:text-[#3D3D3D80]
              transition-colors duration-300
            "
          >
            Voir comment ça marche
          </a>
        </div>
      </div>
    </section>
  );
}

