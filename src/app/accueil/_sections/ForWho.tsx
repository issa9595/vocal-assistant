"use client";

/**
 * Section : Pour qui ?
 * 3 profils + conclusion
 */
export default function ForWho() {
  const profiles = [
    {
      title: "Étudiants & jeunes actifs",
      description: "Beaucoup de choses à gérer, peu de structure.",
    },
    {
      title: "Salariés & managers",
      description: "Réunions, deadlines, vie perso… tout s'entremêle.",
    },
    {
      title: "Ceux qui détestent planifier",
      description: "Pas envie de remplir des listes ou des tableaux.",
    },
  ];

  return (
    <section className="
      py-16 md:py-24
      bg-[var(--color-brand-white)]
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
            text-[var(--color-brand-black)]
            text-center
          ">
            Pour qui est faite l'app ?
          </h2>

          {/* Grid de profils */}
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-6 md:gap-8 lg:gap-10
          ">
            {profiles.map((profile, index) => (
              <div
                key={index}
                className="
                  p-6 md:p-8 lg:p-10
                  bg-[var(--color-brand-white)]
                  border border-[#3D3D3D0D]
                  rounded-2xl
                  shadow-soft
                  hover:shadow-medium
                  transition-all duration-300
                "
              >
                <h3 className="
                  text-xl md:text-2xl
                  font-semibold
                  text-[var(--color-brand-black)]
                  mb-4 md:mb-6
                ">
                  {profile.title}
                </h3>
                <p className="
                  text-base md:text-lg
                  text-[#3D3D3D80]
                  leading-relaxed
                ">
                  {profile.description}
                </p>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <p className="
            text-lg md:text-xl lg:text-2xl
            text-[var(--color-brand-black)]
            leading-relaxed
            font-light
            text-center
            max-w-3xl
            mx-auto
          ">
            Si vous avez l'impression de toujours penser à ce que vous devez faire,
            <br />
            Lumia est fait pour vous.
          </p>
        </div>
      </div>
    </section>
  );
}

