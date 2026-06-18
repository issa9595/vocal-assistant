"use client";

import { Reveal } from "./Reveal";
import { MicIcon, SparklesIcon, CalendarCheckIcon } from "./Icons";

/** Carte d'événement calquée sur l'EventCard de l'app (glass-pink) */
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

/**
 * Section : Comment ça marche (ancre #comment-ca-marche)
 * 3 étapes en verre + exemple voix → calendrier
 */
export default function HowItWorks() {
  const steps = [
    {
      Icon: MicIcon,
      number: "1",
      title: "Tu parles à l'assistant",
      description: "Ex : « J'ai un dîner ce soir à 19h, je dois faire les courses. »",
    },
    {
      Icon: SparklesIcon,
      number: "2",
      title: "L'IA analyse et planifie",
      description: "Elle comprend qu'il y a les courses, la préparation, la cuisson, et place tout dans ton planning.",
    },
    {
      Icon: CalendarCheckIcon,
      number: "3",
      title: "Le calendrier se met à jour",
      description: "Les blocs sont ajoutés au bon moment, sans chevauchements.",
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-16 md:py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="space-y-12 md:space-y-16">
          {/* Titre */}
          <Reveal as="h2" className="
            text-3xl md:text-4xl lg:text-5xl
            font-bold text-(--color-brand-black) tracking-tight text-center
          ">
            Comment ça marche ?
          </Reveal>

          {/* 3 étapes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map(({ Icon, number, title, description }, i) => (
              <Reveal
                key={number}
                delay={i * 120}
                className="
                  glass glass-grain glass-highlight rounded-[1.5rem]
                  p-7 md:p-8 flex flex-col gap-4
                  hover:scale-[1.015] transition-transform duration-300
                "
              >
                <div className="flex items-center gap-4">
                  <span className="
                    w-12 h-12 rounded-full glass-pink glass-highlight
                    flex items-center justify-center text-(--color-brand-black)
                  ">
                    <Icon size={22} />
                  </span>
                  <span className="text-4xl font-bold landing-gradient-text leading-none">{number}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-(--color-brand-black)">{title}</h3>
                <p className="text-base md:text-lg landing-muted leading-relaxed">{description}</p>
              </Reveal>
            ))}
          </div>

          {/* Exemple voix → calendrier */}
          <Reveal className="
            max-w-4xl mx-auto
            glass-panel glass-grain glass-highlight rounded-[1.75rem]
            p-6 md:p-8
          ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Phrase */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#636363]">Tu dis</span>
                <div className="glass-teal glass-highlight rounded-2xl rounded-bl-md p-4">
                  <p className="text-base md:text-lg text-(--color-brand-black) italic leading-relaxed">
                    « J&apos;ai un dîner ce soir à 19h, je dois faire les courses. »
                  </p>
                </div>
              </div>

              {/* Résultat */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#636363]">Ton planning</span>
                <div className="flex flex-col gap-2.5">
                  <EventChip time="16:30" end="17:15" title="Courses" />
                  <EventChip time="17:45" end="18:45" title="Préparation du dîner" />
                  <EventChip time="19:00" end="21:00" title="Dîner" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
