"use client";

/**
 * Section : Comment ça marche
 * Ancre #comment-ca-marche
 * 3 étapes + exemple
 */
export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Tu parles à l'assistant",
      description: "Ex : 'J'ai un dîner ce soir à 19h, je dois faire les courses.'",
    },
    {
      number: "2",
      title: "L'IA analyse et planifie",
      description: "Elle comprend qu'il y a les courses, la préparation, la cuisson, et place tout dans ton planning.",
    },
    {
      number: "3",
      title: "Le calendrier se met à jour",
      description: "Les blocs sont ajoutés au bon moment, sans chevauchements.",
    },
  ];

  return (
    <section
      id="comment-ca-marche"
      className="
        py-16 md:py-24
        bg-[var(--color-brand-white)]
      "
    >
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
            text-[var(--color-brand-black)]
            text-center
          ">
            Comment ça marche ?
          </h2>

          {/* 3 étapes */}
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-8 md:gap-10 lg:gap-12
          ">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="
                  w-16 h-16 md:w-20 md:h-20
                  mx-auto mb-6 md:mb-8
                  bg-[var(--color-brand-white)]
                  border border-[#3D3D3D0D]
                  rounded-full
                  flex items-center justify-center
                  text-2xl md:text-3xl
                  font-bold
                  text-[var(--color-brand-black)]
                  shadow-soft
                ">
                  {step.number}
                </div>
                <h3 className="
                  text-xl md:text-2xl
                  font-semibold
                  text-[var(--color-brand-black)]
                  mb-4 md:mb-6
                ">
                  {step.title}
                </h3>
                <p className="
                  text-base md:text-lg
                  text-[#3D3D3D80]
                  leading-relaxed
                ">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Exemple */}
          <div className="
            max-w-3xl
            mx-auto
            p-6 md:p-8 lg:p-10
            bg-[var(--color-brand-white)]
            border border-[#3D3D3D0D]
            rounded-2xl
            shadow-soft
          ">
            <h3 className="
              text-lg md:text-xl
              font-semibold
              text-[var(--color-brand-black)]
              mb-6 md:mb-8
            ">
              Exemple
            </h3>
            <div className="space-y-4 md:space-y-6">
              <div>
                <p className="
                  text-sm md:text-base
                  font-medium
                  text-[#3D3D3D80]
                  mb-2 md:mb-3
                ">
                  Phrase :
                </p>
                <div className="
                  p-4 md:p-5
                  bg-[var(--color-brand-blue)]
                  rounded-soft
                  text-base md:text-lg
                  text-[var(--color-brand-black)]
                  italic
                ">
                  J'ai un dîner ce soir à 19h…
                </div>
              </div>
              <div>
                <p className="
                  text-sm md:text-base
                  font-medium
                  text-[#3D3D3D80]
                  mb-2 md:mb-3
                ">
                  Résultat :
                </p>
                <div className="
                  p-4 md:p-5
                  bg-[var(--color-brand-white)]
                  border border-[#3D3D3D0D]
                  rounded-soft
                  text-base md:text-lg
                  text-[var(--color-brand-black)]
                ">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Courses 16:30</li>
                    <li>Préparation 17:45</li>
                    <li>Dîner 19:00</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

