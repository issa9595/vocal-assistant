"use client";

import Link from "next/link";
import { MicIcon, WavesIcon, ArrowRightIcon, SparklesIcon, PlayIcon } from "./Icons";

/** Petite carte d'événement, calquée sur l'EventCard de l'app (glass-pink) */
function EventChip({ time, end, title }: { time: string; end: string; title: string }) {
  return (
    <div className="glass-pink glass-grain glass-highlight rounded-2xl p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#3D3D3DB3] uppercase tracking-wide leading-none">
        <span>{time}</span>
        <span className="text-[#3D3D3D80] font-medium normal-case">Jusqu&apos;à {end}</span>
      </div>
      <div className="text-sm font-bold text-(--color-brand-black) leading-tight">{title}</div>
    </div>
  );
}

/** Barres d'égaliseur animées — l'assistant à l'écoute */
function Equalizer() {
  const bars = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="flex items-center gap-1 h-6" aria-hidden="true">
      {bars.map((i) => (
        <span
          key={i}
          className="landing-wave-bar w-1 h-full rounded-full bg-[linear-gradient(180deg,#f4b4c8_0%,#c5a6cf_100%)]"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Hero — immersif, voice-first.
 * Titre + CTA + preview en verre (voix → calendrier) sur le champ aurore.
 */
export default function Hero() {
  return (
    <section className="
      relative
      flex flex-col items-center justify-center
      px-4 md:px-8 lg:px-12
      pt-28 md:pt-36 pb-16 md:pb-24
      min-h-[92vh]
    ">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow */}
        <span className="landing-eyebrow glass glass-highlight landing-rise" style={{ animationDelay: "0ms" }}>
          <WavesIcon size={16} className="text-(--color-brand-pink)" />
          Votre assistant vocal du quotidien
        </span>

        {/* Titre principal */}
        <h1
          className="
            mt-6 md:mt-8
            text-4xl md:text-5xl lg:text-6xl xl:text-7xl
            font-bold text-(--color-brand-black)
            tracking-tight leading-[1.1]
            landing-rise
          "
          style={{ animationDelay: "80ms" }}
        >
          Organise ta journée,
          <br />
          <span className="landing-gradient-text">juste avec ta voix.</span>
        </h1>

        {/* Sous-titre */}
        <p
          className="
            mt-6 md:mt-8
            text-lg md:text-xl lg:text-2xl
            landing-muted max-w-3xl mx-auto
            leading-relaxed font-light
            landing-rise
          "
          style={{ animationDelay: "160ms" }}
        >
          Tu parles, l&apos;IA comprend. Elle ajoute tes rendez-vous au calendrier
          et prévoit même les étapes cachées : courses, préparation, déplacements.
          Tout se fait naturellement, sans effort.
        </p>

        {/* CTAs */}
        <div
          className="
            mt-9 md:mt-11
            flex flex-col sm:flex-row items-center justify-center
            gap-4
            landing-rise
          "
          style={{ animationDelay: "240ms" }}
        >
          {/* Primaire — pilule sombre flottant sur un halo brand */}
          <div className="group/cta relative inline-flex">
            <span
              aria-hidden="true"
              className="
                absolute -inset-2 rounded-full
                bg-[linear-gradient(135deg,#f4b4c8_0%,#c5a6cf_50%,#fcecd3_100%)]
                opacity-50 blur-xl
                transition-opacity duration-300
                group-hover/cta:opacity-75
              "
            />
            <Link
              href="/app"
              className="
                relative inline-flex items-center gap-2.5
                px-7 md:px-8 py-3 md:py-3.5
                rounded-full
                bg-(--color-brand-black) text-(--color-brand-white)
                font-semibold text-base md:text-lg
                shadow-[0_10px_30px_-8px_rgba(61,61,61,0.5)]
                hover:shadow-[0_16px_40px_-10px_rgba(61,61,61,0.6)]
                hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-300
                cursor-pointer
              "
            >
              Accéder à l&apos;app
              <ArrowRightIcon size={18} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
            </Link>
          </div>

          {/* Secondaire — pilule en verre */}
          <a
            href="#comment-ca-marche"
            className="
              group/sec inline-flex items-center gap-2.5
              px-6 py-3 md:py-3.5
              rounded-full
              glass glass-highlight
              text-(--color-brand-black) font-medium text-base md:text-lg
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-300
              cursor-pointer
            "
          >
            <PlayIcon size={18} className="text-(--color-brand-pink) transition-transform duration-300 group-hover/sec:scale-110" />
            Voir comment ça marche
          </a>
        </div>
      </div>

      {/* Preview en verre — voix → calendrier (« show, don't tell ») */}
      <div
        className="
          w-full max-w-4xl mx-auto mt-14 md:mt-20
          glass-panel glass-grain glass-highlight
          rounded-[1.75rem]
          p-5 md:p-8
          landing-rise
        "
        style={{ animationDelay: "340ms" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-5 md:gap-6">
          {/* Tu dis */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#636363]">Tu dis</span>
            <div className="glass-teal glass-highlight rounded-2xl rounded-bl-md p-4 text-left">
              <p className="text-base md:text-lg text-(--color-brand-black) leading-relaxed">
                « J&apos;ai un dîner ce soir à 19h, je dois faire les courses. »
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="
                  w-9 h-9 rounded-full glass-pink glass-highlight
                  flex items-center justify-center text-(--color-brand-black)
                ">
                  <MicIcon size={18} />
                </span>
                <Equalizer />
              </div>
            </div>
          </div>

          {/* Transition */}
          <div className="flex md:flex-col items-center justify-center gap-2 text-(--color-brand-lavender)">
            <span className="
              w-10 h-10 rounded-full glass glass-highlight
              flex items-center justify-center
            ">
              <SparklesIcon size={18} className="text-(--color-brand-pink)" />
            </span>
            <ArrowRightIcon size={20} className="text-[#9b9b9b] rotate-90 md:rotate-0" />
          </div>

          {/* Lumia planifie */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#636363]">Lumia planifie</span>
            <div className="flex flex-col gap-2.5">
              <EventChip time="16:30" end="17:15" title="Courses" />
              <EventChip time="17:45" end="18:45" title="Préparation du dîner" />
              <EventChip time="19:00" end="21:00" title="Dîner" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
