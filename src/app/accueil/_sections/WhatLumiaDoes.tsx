"use client";

import { Reveal } from "./Reveal";
import { SparklesIcon, CalendarCheckIcon, BrainIcon, ArrowRightIcon } from "./Icons";

/** Mini-pastille de tâche (langage EventCard de l'app) */
function MiniTask({ time, title }: { time: string; title: string }) {
  return (
    <div className="glass-pink glass-highlight rounded-xl px-3 py-2 flex items-center gap-2.5">
      <span className="text-[10px] font-bold text-[#3D3D3DB3] tabular-nums">{time}</span>
      <span className="text-xs md:text-sm font-semibold text-(--color-brand-black)">{title}</span>
    </div>
  );
}

/**
 * Ce que fait Lumia — bento éditorial asymétrique.
 * Une grande tuile « phare » (orbe vivant + mini-démo voix → tâches) +
 * deux tuiles d'appui alignées en hauteur.
 */
export default function WhatLumiaDoes() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        <Reveal as="h2" className="
          text-3xl md:text-4xl lg:text-5xl
          font-bold text-(--color-brand-black) tracking-tight
          text-center max-w-3xl mx-auto mb-12 md:mb-16
        ">
          Une seule phrase. <span className="landing-gradient-text">Lumia s&apos;occupe du reste.</span>
        </Reveal>

        <div className="grid gap-4 md:gap-5 lg:grid-cols-5 items-stretch">
          {/* ===== Tuile phare ===== */}
          <Reveal className="lg:col-span-3">
            <div className="
              relative overflow-hidden h-full
              glass glass-grain glass-highlight rounded-[2rem]
              p-7 md:p-10
              flex flex-col justify-between gap-8
              min-h-[360px]
            ">
              {/* Orbe vivant + halo conique (enfermés dans une couche de clip arrondie) */}
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden [transform:translateZ(0)]">
                <div className="absolute -top-24 -right-24 w-72 h-72 landing-spin-slow opacity-70">
                  <div className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,#f4b4c8,#c5a6cf,#96b6dd,#9dc0bc,#fcecd3,#f4b4c8)] blur-2xl" />
                </div>
                <div className="landing-orb absolute -top-10 -right-10 w-44 h-44 rounded-full blur-xl bg-[radial-gradient(circle_at_30%_30%,#f4b4c8_0%,#c5a6cf_55%,transparent_75%)]" />
              </div>

              <div className="relative">
                <span className="
                  inline-flex items-center gap-2 rounded-full px-3 py-1.5
                  glass-pink glass-highlight text-xs font-semibold uppercase tracking-wide text-(--color-brand-black)
                ">
                  <SparklesIcon size={15} /> L&apos;intelligence Lumia
                </span>
                <h3 className="mt-5 text-2xl md:text-3xl font-bold text-(--color-brand-black) max-w-md leading-tight">
                  Comprend vos vraies intentions
                </h3>
                <p className="mt-4 text-base md:text-lg landing-muted leading-relaxed max-w-md">
                  Vous dites : « J&apos;ai un dîner ce soir, je n&apos;ai rien préparé. »
                  Lumia déduit tout ce qu&apos;il y a derrière.
                </p>
              </div>

              {/* Mini-démo : intention → étapes */}
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="glass-teal glass-highlight rounded-2xl rounded-bl-md px-4 py-3 text-sm md:text-base text-(--color-brand-black) italic shrink-0 sm:max-w-[46%]">
                  « Un dîner ce soir… »
                </div>
                <ArrowRightIcon size={20} className="text-(--color-brand-lavender) rotate-90 sm:rotate-0 self-center" />
                <div className="flex flex-col gap-2 flex-1">
                  <MiniTask time="16:30" title="Courses" />
                  <MiniTask time="17:45" title="Préparation" />
                  <MiniTask time="19:00" title="Dîner" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* ===== Tuiles d'appui ===== */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 md:gap-5">
            <Reveal delay={120}>
              <div className="
                h-full glass glass-grain glass-highlight rounded-[1.75rem]
                p-7 md:p-8 flex flex-col gap-4 justify-center
              ">
                <span className="w-12 h-12 rounded-2xl glass-pink glass-highlight flex items-center justify-center text-(--color-brand-black)">
                  <CalendarCheckIcon size={24} />
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-(--color-brand-black)">
                  Planifie automatiquement
                </h3>
                <p className="text-base landing-muted leading-relaxed">
                  Chaque étape posée au bon moment, en respectant vos contraintes et votre temps.
                </p>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="
                h-full glass glass-grain glass-highlight rounded-[1.75rem]
                p-7 md:p-8 flex flex-col gap-4 justify-center
              ">
                <span className="w-12 h-12 rounded-2xl glass-teal glass-highlight flex items-center justify-center text-(--color-brand-black)">
                  <BrainIcon size={24} />
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-(--color-brand-black)">
                  Pense à votre place
                </h3>
                <p className="text-base landing-muted leading-relaxed">
                  Se souvient de vos habitudes, vos préférences, et des détails que vous oubliez.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
