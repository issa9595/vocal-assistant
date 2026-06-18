"use client";

import { Reveal } from "./Reveal";
import { GraduationCapIcon, BriefcaseIcon, FeatherIcon } from "./Icons";

/**
 * Pour qui ? — triptyque éditorial avec grands numéros en filigrane.
 */
export default function ForWho() {
  const profiles = [
    {
      n: "01",
      Icon: GraduationCapIcon,
      title: "Étudiants & jeunes actifs",
      description: "Beaucoup de choses à gérer, peu de structure.",
    },
    {
      n: "02",
      Icon: BriefcaseIcon,
      title: "Salariés & managers",
      description: "Réunions, deadlines, vie perso… tout s'entremêle.",
    },
    {
      n: "03",
      Icon: FeatherIcon,
      title: "Ceux qui détestent planifier",
      description: "Pas envie de remplir des listes ou des tableaux.",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        <Reveal as="h2" className="
          text-3xl md:text-4xl lg:text-5xl
          font-bold text-(--color-brand-black) tracking-tight text-center
          mb-12 md:mb-16
        ">
          Pour qui est faite l&apos;app ?
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {profiles.map(({ n, Icon, title, description }, i) => (
            <Reveal key={n} delay={i * 130}>
              <div className="
                group relative overflow-hidden h-full
                glass glass-grain glass-highlight rounded-[1.75rem]
                p-7 md:p-9 pt-10
                flex flex-col gap-4
                transition-transform duration-300 hover:-translate-y-1.5
              ">
                {/* Grand numéro en filigrane */}
                <span
                  aria-hidden
                  className="absolute -top-4 -right-2 text-[7rem] leading-none font-bold landing-gradient-text opacity-25 select-none"
                >
                  {n}
                </span>

                <span className="relative w-12 h-12 rounded-2xl glass-pink glass-highlight flex items-center justify-center text-(--color-brand-black)">
                  <Icon size={24} />
                </span>
                <h3 className="relative text-xl md:text-2xl font-semibold text-(--color-brand-black)">
                  {title}
                </h3>
                <p className="relative text-base md:text-lg landing-muted leading-relaxed">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" delay={200} className="
          mt-12 md:mt-16
          text-lg md:text-xl lg:text-2xl text-(--color-brand-black)
          leading-relaxed font-light text-center max-w-3xl mx-auto
        ">
          Si vous avez l&apos;impression de toujours penser à ce que vous devez faire,{" "}
          <span className="landing-gradient-text font-normal">Lumia est fait pour vous.</span>
        </Reveal>
      </div>
    </section>
  );
}
