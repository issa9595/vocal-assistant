"use client";

/**
 * Section : Agent, pas un chat
 * Titre + texte + liste
 */
export default function AgentNotChat() {
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
            Lumia ne répond pas. Il agit.
          </h2>

          {/* Texte principal */}
          <div className="space-y-6">
            <p className="
              text-lg md:text-xl lg:text-2xl
              text-[#3D3D3D80]
              leading-relaxed
              font-light
              text-center
            ">
              Lumia n'est pas un simple chat qui vous écrit des paragraphes.
              <br />
              C'est un assistant de vie vocal, conversationnel et proactif.
            </p>
            <p className="
              text-base md:text-lg
              text-[var(--color-brand-black)]
              leading-relaxed
              text-center
              font-semibold
            ">
              Vous lui parlez.
              <br />
              Il organise votre journée.
            </p>
          </div>

          {/* Liste */}
          <div className="
            p-6 md:p-8
            bg-[var(--color-brand-white)]
            border border-[#3D3D3D0D]
            rounded-2xl
            shadow-soft
          ">
            <ul className="
              grid grid-cols-1 md:grid-cols-2
              gap-3 md:gap-4
              list-disc list-inside
              text-base md:text-lg
              text-[#3D3D3D80]
            ">
              <li>Gérer votre agenda</li>
              <li>Organiser vos priorités</li>
              <li>Préparer vos rappels</li>
              <li>Se connecter à vos outils du quotidien (agenda, listes, services…)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

