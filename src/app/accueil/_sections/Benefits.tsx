"use client";

/**
 * Section : Bénéfices concrets
 * Titre + bullets + phrase de fin
 */
export default function Benefits() {
  const benefits = [
    "Moins de stress",
    "Moins de décisions à prendre",
    "Un planning clair et réaliste",
    "Plus de temps pour vous",
    "Moins d'oubli, moins de pression",
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
        <div className="
          max-w-4xl
          mx-auto
          space-y-8 md:space-y-12
        ">
          {/* Titre */}
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl
            font-bold
            text-(--color-brand-black)
            text-center
          ">
            Ce que ça change pour vous
          </h2>

          {/* Bullets */}
          <div className="
            p-6 md:p-8 lg:p-10
            landing-card
            rounded-2xl
            shadow-soft
          ">
            <ul className="
              space-y-4 md:space-y-5
              list-disc list-inside
              text-base md:text-lg lg:text-xl
              landing-muted
            ">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* Phrase de fin */}
          <p className="
            text-lg md:text-xl lg:text-2xl
            text-(--color-brand-black)
            leading-relaxed
            font-light
            text-center
            max-w-3xl
            mx-auto
          ">
            Vous ne gérez plus tout dans votre tête.
            <br />
            Votre organisation devient visible, simple, fluide.
          </p>
        </div>
      </div>
    </section>
  );
}

