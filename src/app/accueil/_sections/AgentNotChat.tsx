"use client";

import { Reveal } from "./Reveal";
import { CalendarCheckIcon, ListIcon, BellIcon, PlugIcon, CheckIcon } from "./Icons";

const ACTIONS = [
  { Icon: CalendarCheckIcon, label: "Gère votre agenda" },
  { Icon: ListIcon, label: "Organise vos priorités" },
  { Icon: BellIcon, label: "Prépare vos rappels" },
  { Icon: PlugIcon, label: "Se connecte à vos outils" },
];

/**
 * Agent, pas un chat — contraste conceptuel.
 * Gauche : un chatbot terne qui « répond » (mur de texte grisé).
 * Droite : Lumia, vivante, qui « agit » (liste d'actions qui se cochent).
 */
export default function AgentNotChat() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        <Reveal as="h2" className="
          text-3xl md:text-4xl lg:text-5xl
          font-bold text-(--color-brand-black) tracking-tight text-center
          max-w-3xl mx-auto mb-12 md:mb-16
        ">
          Lumia ne répond pas. <span className="landing-gradient-text">Il agit.</span>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {/* ===== Le chat ordinaire (terne) ===== */}
          <Reveal>
            <div className="
              h-full glass glass-grain rounded-[1.75rem]
              p-7 md:p-9 flex flex-col gap-6
              opacity-80 grayscale-[35%]
            ">
              <span className="
                inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5
                bg-[rgba(61,61,61,0.06)] text-xs font-semibold uppercase tracking-wide text-[#636363]
              ">
                <span className="w-2 h-2 rounded-full bg-[#bdbdbd]" /> Un simple chat
              </span>

              {/* Mur de texte */}
              <div className="rounded-2xl rounded-tl-md bg-[rgba(61,61,61,0.05)] p-4 flex flex-col gap-2.5">
                {[100, 92, 96, 70].map((w) => (
                  <span key={w} className="h-2.5 rounded-full bg-[rgba(61,61,61,0.14)]" style={{ width: `${w}%` }} />
                ))}
              </div>

              <p className="text-base md:text-lg text-[#636363] leading-relaxed mt-auto">
                Il vous répond par un mur de texte.
                <br />
                <span className="line-through decoration-[#bdbdbd]">À vous de tout exécuter.</span>
              </p>
            </div>
          </Reveal>

          {/* ===== Lumia, l'agent (vivant) ===== */}
          <Reveal delay={120}>
            <div className="
              relative overflow-hidden h-full
              glass-pink glass-grain glass-highlight rounded-[1.75rem]
              p-7 md:p-9 flex flex-col gap-6
            ">
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden [transform:translateZ(0)]">
                <div className="landing-orb absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-2xl bg-[radial-gradient(circle,#f4b4c8_0%,transparent_70%)]" />
              </div>

              <span className="
                relative inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5
                glass glass-highlight text-xs font-semibold uppercase tracking-wide text-(--color-brand-black)
              ">
                <span className="w-2 h-2 rounded-full bg-(--color-brand-pink) animate-pulse" /> Lumia, l&apos;agent
              </span>

              {/* Actions qui se cochent */}
              <div className="relative flex flex-col gap-3">
                {ACTIONS.map(({ Icon, label }, i) => (
                  <Reveal key={label} delay={220 + i * 110}>
                    <div className="glass glass-highlight rounded-2xl px-4 py-3 flex items-center gap-3.5">
                      <span className="shrink-0 w-10 h-10 rounded-xl glass-pink glass-highlight flex items-center justify-center text-(--color-brand-black)">
                        <Icon size={20} />
                      </span>
                      <span className="flex-1 text-base md:text-lg font-medium text-(--color-brand-black)">{label}</span>
                      <span className="shrink-0 w-6 h-6 rounded-full bg-(--color-brand-black) text-(--color-brand-white) flex items-center justify-center">
                        <CheckIcon size={14} />
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>

              <p className="relative text-base md:text-lg text-(--color-brand-black) font-semibold leading-relaxed mt-auto">
                Vous parlez. Il organise votre journée.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
