"use client";

/**
 * Section : Données & Impact
 * Titre + texte sur l'IA responsable
 */
export default function DataAndImpact() {
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
        <div className="
          max-w-4xl
          mx-auto
          space-y-8 md:space-y-12
        ">
          {/* Titre */}
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl
            font-bold
            text-[var(--color-brand-black)]
            text-center
          ">
            Une IA responsable, respectueuse de vos données
          </h2>

          {/* Texte */}
          <div className="
            p-6 md:p-8 lg:p-10
            bg-[var(--color-brand-white)]
            border border-[#3D3D3D0D]
            rounded-2xl
            shadow-soft
            space-y-4 md:space-y-6
          ">
            <p className="
              text-base md:text-lg lg:text-xl
              text-[#3D3D3D80]
              leading-relaxed
            ">
              Nous savons que l'IA pose des questions importantes : protection des données, consommation de ressources.
            </p>
            <p className="
              text-base md:text-lg lg:text-xl
              text-[var(--color-brand-black)]
              leading-relaxed
            ">
              Lumia est conçu pour garder vos données sous votre contrôle, limiter son impact, et éviter les traitements inutiles.
              <br />
              Votre organisation vous appartient.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

