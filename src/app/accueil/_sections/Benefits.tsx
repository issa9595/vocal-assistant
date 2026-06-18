"use client";

import { Reveal } from "./Reveal";
import { HeartIcon, BrainIcon, CalendarCheckIcon, ClockIcon, BellIcon } from "./Icons";

/**
 * Bénéfices concrets — bento éditorial.
 * Une grande tuile « manifeste » + 5 tuiles bénéfices de tailles variées,
 * pavage volontaire et équilibré.
 */
export default function Benefits() {
  const benefits = [
    { Icon: HeartIcon, label: "Moins de stress", span: "lg:col-span-1" },
    { Icon: ClockIcon, label: "Plus de temps pour vous", span: "lg:col-span-1" },
    { Icon: BrainIcon, label: "Moins de décisions à prendre", span: "lg:col-span-2" },
    { Icon: CalendarCheckIcon, label: "Un planning clair et réaliste", span: "lg:col-span-2" },
    { Icon: BellIcon, label: "Moins d'oubli, moins de pression", span: "lg:col-span-2" },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        <Reveal as="h2" className="
          text-3xl md:text-4xl lg:text-5xl
          font-bold text-(--color-brand-black) tracking-tight text-center
          mb-12 md:mb-16
        ">
          Ce que ça change pour vous
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(120px,1fr)]">
          {/* ===== Manifeste (grande tuile) ===== */}
          <Reveal className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <div className="
              relative overflow-hidden h-full
              glass-pink glass-grain glass-highlight rounded-[2rem]
              p-8 md:p-10 flex flex-col justify-center gap-4
            ">
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden [transform:translateZ(0)]">
                <div className="landing-orb absolute -bottom-16 -left-12 w-52 h-52 rounded-full blur-2xl bg-[radial-gradient(circle,#c5a6cf_0%,transparent_70%)]" />
              </div>
              <p className="relative text-2xl md:text-3xl lg:text-4xl font-bold text-(--color-brand-black) leading-tight">
                Vous ne gérez plus tout dans votre tête.
              </p>
              <p className="relative text-lg md:text-xl landing-muted leading-relaxed font-light">
                Votre organisation devient{" "}
                <span className="landing-gradient-text font-normal">visible, simple, fluide.</span>
              </p>
            </div>
          </Reveal>

          {/* ===== Tuiles bénéfices ===== */}
          {benefits.map(({ Icon, label, span }, i) => (
            <Reveal key={label} delay={120 + i * 90} className={span}>
              <div className="
                h-full glass glass-grain glass-highlight rounded-[1.5rem]
                p-6 md:p-7 flex items-center gap-4
                transition-transform duration-300 hover:scale-[1.02]
              ">
                <span className="shrink-0 w-12 h-12 rounded-2xl glass-pink glass-highlight flex items-center justify-center text-(--color-brand-black)">
                  <Icon size={24} />
                </span>
                <span className="text-lg md:text-xl font-semibold text-(--color-brand-black) leading-snug">
                  {label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
