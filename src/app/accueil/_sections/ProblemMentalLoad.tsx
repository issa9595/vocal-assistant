"use client";

/**
 * Section Problème : Charge mentale
 * Titre + texte + chiffres + exemples
 */
export default function ProblemMentalLoad() {
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
            max-w-3xl
            mx-auto
          ">
            La charge mentale fatigue plus que les tâches elles-mêmes.
          </h2>

          {/* Texte principal */}
          <div className="
            max-w-3xl
            mx-auto
            space-y-6
            text-center
          ">
            <p className="
              text-lg md:text-xl lg:text-2xl
              text-[#3D3D3D80]
              leading-relaxed
              font-light
            ">
              Ce n'est pas le fait de faire les choses qui épuise.
              <br />
              C'est le fait d'y penser tout le temps.
            </p>
            <p className="
              text-base md:text-lg
              text-[#3D3D3D80]
              leading-relaxed
            ">
              Comme quand votre téléphone a trop d'applications ouvertes :
              il chauffe, il ralentit, il bug.
              <br />
              Votre cerveau, c'est pareil.
            </p>
          </div>

          {/* Chiffres */}
          <div className="
            grid grid-cols-1 md:grid-cols-2
            gap-4 md:gap-6
            max-w-4xl
            mx-auto
          ">
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-2xl
              shadow-soft
              text-center
            ">
              <div className="
                text-2xl md:text-3xl lg:text-4xl
                font-bold
                text-[var(--color-brand-black)]
                mb-2
              ">
                88%
              </div>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
              ">
                des Français se disent affectés par la charge mentale
              </p>
            </div>
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-2xl
              shadow-soft
              text-center
            ">
              <div className="
                text-2xl md:text-3xl lg:text-4xl
                font-bold
                text-[var(--color-brand-black)]
                mb-2
              ">
                68% / 38%
              </div>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
              ">
                des femmes et 38% des hommes ont du mal à s'organiser
              </p>
            </div>
          </div>

          {/* Exemples */}
          <div className="
            max-w-3xl
            mx-auto
          ">
            <h3 className="
              text-lg md:text-xl
              font-semibold
              text-[var(--color-brand-black)]
              mb-4 md:mb-6
              text-center
            ">
              Exemples
            </h3>
            <ul className="
              grid grid-cols-1 md:grid-cols-2
              gap-3 md:gap-4
              list-disc list-inside
              text-base md:text-lg
              text-[#3D3D3D80]
            ">
              <li>Préparer la réunion de demain</li>
              <li>Relancer un client impayé</li>
              <li>Faire les courses</li>
              <li>Préparer le repas</li>
              <li className="md:col-span-2">Penser à tout… tout le temps</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

