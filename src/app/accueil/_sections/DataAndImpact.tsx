"use client";

import { Reveal } from "./Reveal";
import { ShieldIcon, LeafIcon } from "./Icons";

/**
 * Données & Impact — split asymétrique : manifeste confiance + 2 engagements teal.
 */
export default function DataAndImpact() {
  const commitments = [
    {
      Icon: ShieldIcon,
      title: "Vos données sous votre contrôle",
      description: "Conçu pour garder vos données sous votre contrôle et éviter les traitements inutiles.",
    },
    {
      Icon: LeafIcon,
      title: "Un impact maîtrisé",
      description: "Pensé pour limiter son empreinte — protection des données, ressources, sobriété.",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {/* Manifeste */}
          <Reveal className="lg:col-span-2">
            <div className="
              relative overflow-hidden h-full
              glass glass-grain glass-highlight rounded-[2rem]
              p-8 md:p-10 flex flex-col justify-center gap-5
            ">
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden [transform:translateZ(0)]">
                <div className="landing-orb absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl bg-[radial-gradient(circle,#9dc0bc_0%,transparent_70%)]" />
              </div>
              <h2 className="relative text-3xl md:text-4xl font-bold text-(--color-brand-black) tracking-tight leading-tight">
                Une IA responsable, respectueuse de vos données
              </h2>
              <p className="relative text-base md:text-lg landing-muted leading-relaxed">
                Votre organisation vous appartient.
              </p>
            </div>
          </Reveal>

          {/* Engagements */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4 md:gap-6">
            {commitments.map(({ Icon, title, description }, i) => (
              <Reveal key={title} delay={120 + i * 120}>
                <div className="
                  h-full glass-teal glass-grain glass-highlight rounded-[1.75rem]
                  p-7 md:p-8 flex flex-col gap-4
                  transition-transform duration-300 hover:scale-[1.02]
                ">
                  <span className="w-12 h-12 rounded-2xl glass glass-highlight flex items-center justify-center text-(--color-brand-black)">
                    <Icon size={24} />
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-(--color-brand-black)">{title}</h3>
                  <p className="text-base md:text-lg landing-muted leading-relaxed">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
