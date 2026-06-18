"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowRightIcon, WavesIcon } from "./Icons";

/**
 * CTA finale — grand panneau en verre rose, orbes vivants, sur l'aurore.
 */
export default function FinalCTA() {
  return (
    <section className="py-16 md:py-24 lg:py-28 px-4 md:px-8 lg:px-12">
      <Reveal className="max-w-5xl mx-auto">
        <div className="
          relative overflow-hidden
          glass-pink glass-grain glass-highlight
          rounded-[2rem] md:rounded-[2.5rem]
          px-6 md:px-12 lg:px-16
          py-16 md:py-24
          text-center
        ">
          {/* Orbes vivants (enfermés dans une couche de clip arrondie) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden [transform:translateZ(0)]">
            <div className="landing-orb absolute -top-20 -left-16 w-72 h-72 rounded-full blur-3xl bg-[radial-gradient(circle,#f4b4c8_0%,transparent_70%)]" />
            <div className="landing-orb absolute -bottom-24 -right-16 w-80 h-80 rounded-full blur-3xl bg-[radial-gradient(circle,#c5a6cf_0%,transparent_70%)]" style={{ animationDelay: "1.5s" }} />
          </div>

          <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-8 md:gap-10">
            <span className="w-16 h-16 rounded-2xl glass glass-highlight flex items-center justify-center text-(--color-brand-black)">
              <WavesIcon size={30} />
            </span>

            <h2 className="
              text-3xl md:text-5xl lg:text-6xl
              font-bold text-(--color-brand-black) tracking-tight leading-[1.05]
            ">
              Lumia n&apos;est pas qu&apos;un assistant.
              <br className="hidden md:block" />{" "}
              <span className="landing-gradient-text">Votre futur allié du quotidien.</span>
            </h2>

            <p className="text-lg md:text-xl landing-muted leading-relaxed font-light">
              Le repas est organisé. La réunion est prête. La facture est relancée. Vous respirez.
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl text-(--color-brand-black) font-semibold">
              Arrêtez de penser votre vie.{" "}
              <span className="landing-gradient-text">Commencez à la vivre.</span>
            </p>

            <Link
              href="/app"
              className="
                group inline-flex items-center gap-2.5
                px-8 py-4
                rounded-full
                bg-(--color-brand-black) text-(--color-brand-white)
                font-semibold text-base md:text-lg
                shadow-[0_12px_34px_-10px_rgba(61,61,61,0.65)]
                hover:shadow-[0_18px_44px_-12px_rgba(61,61,61,0.75)]
                hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-300
                cursor-pointer
              "
            >
              Accéder à l&apos;app
              <ArrowRightIcon size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
