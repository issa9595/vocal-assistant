"use client";

/**
 * Section : Ce que fait Lumia
 * Titre + 3 cards features
 */
export default function WhatLumiaDoes() {
  const features = [
    {
      title: "Comprend vos vraies intentions",
      description: "Vous dites : 'J'ai un dîner ce soir, je n'ai rien préparé.' Lumia comprend qu'il faut : faire les courses, préparer le repas, prévoir le temps de cuisson, se préparer, accueillir votre invité.",
    },
    {
      title: "Planifie automatiquement",
      description: "Lumia place chaque étape au bon moment dans votre agenda, en respectant vos contraintes et votre temps personnel.",
    },
    {
      title: "Pense à votre place",
      description: "Lumia se souvient de vos habitudes, de vos préférences, et même des détails que vous oubliez.",
    },
  ];

  return (
    <section className="
      py-16 md:py-24
      bg-(--color-brand-white)
    ">
      <div className="
        max-w-6xl
        mx-auto
        px-4 md:px-8 lg:px-12
      ">
        <div className="space-y-12 md:space-y-16">
          {/* Titre */}
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl
            font-bold
            text-(--color-brand-black)
            text-center
            max-w-3xl
            mx-auto
          ">
            Une seule phrase. Lumia s'occupe du reste.
          </h2>

          {/* Grid de features */}
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-6 md:gap-8 lg:gap-10
          ">
            {features.map((feature, index) => (
              <div
                key={index}
                className="
                  p-6 md:p-8 lg:p-10
                  landing-card
                  rounded-2xl
                  shadow-soft
                  hover:shadow-medium
                  transition-all duration-300
                "
              >
                <h3 className="
                  text-xl md:text-2xl
                  font-semibold
                  text-(--color-brand-black)
                  mb-4 md:mb-6
                ">
                  {feature.title}
                </h3>
                <p className="
                  text-base md:text-lg
                  landing-muted
                  leading-relaxed
                ">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

