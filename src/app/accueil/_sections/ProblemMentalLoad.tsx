"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { BrainIcon } from "./Icons";

// Légères rotations / durées de dérive, déterministes (pas de Math.random → SSR stable)
const THOUGHT_ROT = [-3, 2.5, -2, 3, -1.5, 2.5, -2.5, 0];
const THOUGHT_DUR = [6.2, 7.1, 5.6, 6.7, 5.9, 7.3, 6.1, 6.8];

/**
 * Liste des « pensées » qui apparaissent une à une au scroll — la charge
 * mentale qui s'empile. Déclenché à l'entrée dans le viewport, avec stagger.
 * Robuste : repli visible si pas d'IntersectionObserver, et apparition
 * immédiate si l'utilisateur préfère réduire les animations.
 */
function ThoughtsReveal({ thoughts }: { thoughts: string[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Délais d'apparition qui s'accélèrent (les écarts se resserrent → ça s'emballe)
  const delays = useMemo(() => {
    const out: number[] = [];
    let d = 0;
    let gap = 180;
    for (let i = 0; i < thoughts.length; i++) {
      out.push(d);
      d += gap;
      gap = Math.max(55, gap * 0.78);
    }
    return out;
  }, [thoughts.length]);

  return (
    <ul ref={ref} className="flex flex-wrap justify-center gap-2.5 md:gap-3 max-w-2xl mx-auto">
      {thoughts.map((thought, i) => {
        const isLast = i === thoughts.length - 1;
        const reveal = delays[i];
        return (
          <li
            key={thought}
            className={`landing-thought ${visible ? "is-in" : ""}
              rounded-full px-4 py-2
              ${
                isLast
                  ? "glass-pink glass-highlight font-semibold text-base md:text-lg text-(--color-brand-black) shadow-[0_0_34px_rgba(244,180,200,0.55)]"
                  : "glass glass-highlight text-sm md:text-base landing-muted"
              }`}
            style={
              {
                transitionDelay: `${reveal}ms`,
                "--rot": `${isLast ? 0 : THOUGHT_ROT[i % THOUGHT_ROT.length]}deg`,
                "--dur": `${THOUGHT_DUR[i % THOUGHT_DUR.length]}s`,
                "--fdelay": `${reveal + 700}ms`,
              } as React.CSSProperties
            }
          >
            {thought}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Section Problème : Charge mentale
 * Titre + texte + chiffres (glass) + exemples sous forme de pensées flottantes
 */
export default function ProblemMentalLoad() {
  const stats = [
    { value: "88%", label: "des Français se disent affectés par la charge mentale" },
    { value: "68% / 38%", label: "des femmes / des hommes ont du mal à s'organiser" },
  ];

  const thoughts = [
    "Préparer la réunion de demain",
    "Relancer un client impayé",
    "Faire les courses",
    "Répondre aux messages",
    "Préparer le repas",
    "Prendre un rendez-vous",
    "Payer les factures",
    "Penser à tout… tout le temps",
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="space-y-12 md:space-y-16">
          {/* En-tête */}
          <Reveal className="flex flex-col items-center text-center gap-6">
            <span className="
              w-14 h-14 rounded-2xl glass-pink glass-highlight
              flex items-center justify-center text-(--color-brand-black)
            ">
              <BrainIcon size={26} />
            </span>
            <h2 className="
              text-3xl md:text-4xl lg:text-5xl
              font-bold text-(--color-brand-black) tracking-tight
              max-w-3xl
            ">
              La charge mentale fatigue plus que les tâches elles-mêmes.
            </h2>
          </Reveal>

          {/* Texte principal */}
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <p className="text-lg md:text-xl lg:text-2xl landing-muted leading-relaxed font-light">
              Ce n&apos;est pas le fait de faire les choses qui épuise.
              <br />
              C&apos;est le fait d&apos;y penser tout le temps.
            </p>
            <p className="text-base md:text-lg landing-muted leading-relaxed">
              Comme quand votre téléphone a trop d&apos;applications ouvertes :
              il chauffe, il ralentit, il bug.
              <br />
              Votre cerveau, c&apos;est pareil.
            </p>
          </div>

          {/* Chiffres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 120}>
                <div className="
                  h-full glass glass-grain glass-highlight rounded-2xl
                  p-7 md:p-9 text-center
                  hover:scale-[1.01] transition-transform duration-300
                ">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold landing-gradient-text mb-2 tabular-nums">
                    {stat.value}
                  </div>
                  <p className="text-sm md:text-base landing-subtle leading-relaxed">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Exemples — pensées qui s'accumulent */}
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#636363] mb-5">
              Tout ce qui tourne en boucle
            </h3>
            <ThoughtsReveal thoughts={thoughts} />
          </div>
        </div>
      </div>
    </section>
  );
}
