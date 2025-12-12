"use client";

import Link from "next/link";

/**
 * Page d'accueil / Landing page de Helpiya
 * 
 * Landing page complète expliquant :
 * - Ce que fait l'application
 * - Comment elle fonctionne
 * - Les bénéfices concrets
 * - À qui elle s'adresse
 * 
 * Design minimaliste et moderne, cohérent avec le style de l'application.
 * Responsive : mobile-first, puis desktop.
 */
export default function AccueilPage() {
  return (
    <div className="
      min-h-screen
      bg-[var(--color-brand-white)]
      text-[var(--color-brand-black)]
      flex flex-col
    ">
      {/* ========== HEADER FIXE ========== */}
      <header className="
        sticky top-0 z-50
        w-full
        bg-[var(--color-brand-white)]
        border-b border-[#3D3D3D0D]
        px-4 md:px-8 lg:px-12
        py-4 md:py-6
        shadow-soft md:shadow-soft
      ">
        <div className="
          max-w-6xl
          mx-auto
          flex flex-col md:flex-row
          items-start md:items-center
          justify-between
          gap-4 md:gap-0
        ">
          {/* Logo */}
          <h1 className="
            text-xl md:text-2xl lg:text-3xl
            font-bold
            tracking-tight
          ">
            <span className="
              bg-gradient-to-r from-[#F8C4C5] to-[#FFF4C7]
              bg-clip-text
              text-transparent
            ">
              Helpiya
            </span>
          </h1>

          {/* Bouton Accéder à l'app */}
          <Link
            href="/app"
            className="
              inline-block
              px-6 md:px-8
              py-2.5 md:py-3
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              text-[var(--color-brand-black)]
              font-semibold
              text-sm md:text-base
              rounded-soft
              shadow-soft
              hover:shadow-medium
              hover:bg-gradient-to-r hover:from-[#F8C4C5] hover:to-[#FFF4C7]
              hover:text-white
              transition-all duration-500 ease-in-out
              transform hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            Accéder à l'app
          </Link>
        </div>
      </header>

      {/* ========== HERO PRINCIPAL ========== */}
      <section className="
        flex-1
        flex items-center justify-center
        px-4 md:px-8 lg:px-12
        py-12 md:py-16 lg:py-20
        min-h-[70vh]
      ">
        <div className="
          max-w-5xl
          mx-auto
          text-center
          space-y-6 md:space-y-8
        ">
          {/* Titre principal */}
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl xl:text-6xl
            font-bold
            text-[var(--color-brand-black)]
            tracking-tight
            leading-tight
          ">
            Organise ta journée,
            <br />
            juste avec ta voix.
          </h2>

          {/* Sous-titre */}
          <p className="
            text-base md:text-lg lg:text-xl
            text-[#3D3D3D80]
            max-w-2xl
            mx-auto
            leading-relaxed
          ">
            Tu parles, l'IA comprend. Elle ajoute tes rendez-vous au calendrier
            et prévoit même les étapes cachées : courses, préparation, déplacements.
            Tout se fait naturellement, sans effort.
          </p>

          {/* CTA */}
          <div className="
            flex flex-col sm:flex-row
            items-center justify-center
            gap-4 md:gap-6
            pt-4 md:pt-6
          ">
            {/* Bouton principal */}
            <Link
              href="/app"
              className="
                inline-block
                px-8 md:px-12 lg:px-16
                py-4 md:py-5 lg:py-6
                bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                text-[var(--color-brand-black)]
                font-semibold
                text-base md:text-lg lg:text-xl
                rounded-soft md:rounded-medium
                shadow-soft
                hover:shadow-medium
                transition-all duration-200
                transform hover:scale-105
                active:scale-95
              "
            >
              Accéder à l'app
            </Link>

            {/* Lien secondaire */}
            <a
              href="#comment-ca-marche"
              className="
                inline-block
                px-6 md:px-8
                py-3 md:py-4
                text-[var(--color-brand-black)]
                font-medium
                text-sm md:text-base
                underline
                underline-offset-4
                hover:text-[#3D3D3D80]
                transition-colors duration-200
              "
            >
              Voir comment ça marche
            </a>
          </div>
        </div>
      </section>

      {/* ========== CE QUE FAIT L'APP ========== */}
      <section className="
        px-4 md:px-8 lg:px-12
        py-12 md:py-16 lg:py-20
        bg-[var(--color-brand-white)]
      ">
        <div className="max-w-6xl mx-auto">
          {/* Titre de section */}
          <h3 className="
            text-2xl md:text-3xl lg:text-4xl
            font-bold
            text-[var(--color-brand-black)]
            text-center
            mb-8 md:mb-12 lg:mb-16
          ">
            Ce que l'app fait pour toi
          </h3>

          {/* Grid de 3 cards */}
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-6 md:gap-8 lg:gap-10
          ">
            {/* Card 1 : Parle, l'IA t'écoute */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
              hover:shadow-medium
              transition-all duration-200
            ">
              <div className="
                w-12 h-12 md:w-14 md:h-14
                mb-4 md:mb-6
                bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                rounded-soft
                flex items-center justify-center
                text-2xl md:text-3xl
              ">
                🎤
              </div>
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                Parle, l'IA t'écoute
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Tu donnes tes rendez-vous et tes contraintes à l'oral.
                Plus besoin de remplir des formulaires ou de cliquer partout.
                Dis simplement ce que tu veux planifier.
              </p>
            </div>

            {/* Card 2 : Le calendrier se remplit seul */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
              hover:shadow-medium
              transition-all duration-200
            ">
              <div className="
                w-12 h-12 md:w-14 md:h-14
                mb-4 md:mb-6
                bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                rounded-soft
                flex items-center justify-center
                text-2xl md:text-3xl
              ">
                📅
              </div>
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                Le calendrier se remplit seul
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                L'app crée les événements aux bonnes dates et heures.
                Tu visualises tout dans un calendrier clair : jour, semaine, mois ou année.
                Tout est organisé automatiquement.
              </p>
            </div>

            {/* Card 3 : Elle anticipe les étapes cachées */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
              hover:shadow-medium
              transition-all duration-200
            ">
              <div className="
                w-12 h-12 md:w-14 md:h-14
                mb-4 md:mb-6
                bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                rounded-soft
                flex items-center justify-center
                text-2xl md:text-3xl
              ">
                🧠
              </div>
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                Elle anticipe les étapes cachées
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                L'IA pense aux étapes que tu n'as pas mentionnées.
                Pour un dîner, elle prévoit les courses, la préparation, la cuisson.
                Plus besoin de tout lister manuellement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LES BÉNÉFICES CONCRETS ========== */}
      <section className="
        px-4 md:px-8 lg:px-12
        py-12 md:py-16 lg:py-20
        bg-[var(--color-brand-white)]
      ">
        <div className="max-w-6xl mx-auto">
          {/* Titre de section */}
          <h3 className="
            text-2xl md:text-3xl lg:text-4xl
            font-bold
            text-[var(--color-brand-black)]
            text-center
            mb-8 md:mb-12 lg:mb-16
          ">
            Pourquoi l'utiliser ?
          </h3>

          {/* Liste de bénéfices */}
          <div className="
            grid grid-cols-1 md:grid-cols-2
            gap-6 md:gap-8
            max-w-4xl
            mx-auto
          ">
            {/* Bénéfice 1 : Gagner du temps */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
            ">
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-2 md:mb-3
              ">
                ⏱️ Gagner du temps
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Moins de saisie manuelle, tout se fait à la voix.
                Tu dis ce que tu veux, l'app s'occupe du reste.
              </p>
            </div>

            {/* Bénéfice 2 : Moins de charge mentale */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
            ">
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-2 md:mb-3
              ">
                🧘 Moins de charge mentale
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                L'app pense aux étapes à ta place.
                Plus besoin de te rappeler de tout : courses, préparation, déplacements.
              </p>
            </div>

            {/* Bénéfice 3 : Une vue claire */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
            ">
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-2 md:mb-3
              ">
                👁️ Une vue claire de ta journée
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Tout est réuni dans un calendrier.
                Tu vois d'un coup d'œil ce qui t'attend, sans chercher dans plusieurs apps.
              </p>
            </div>

            {/* Bénéfice 4 : Toujours avec toi */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
            ">
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-2 md:mb-3
              ">
                📱 Toujours avec toi
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Web app accessible depuis ton navigateur.
                Pas besoin d'installer quoi que ce soit, ça fonctionne partout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMMENT ÇA MARCHE ========== */}
      <section
        id="comment-ca-marche"
        className="
          px-4 md:px-8 lg:px-12
          py-12 md:py-16 lg:py-20
          bg-[var(--color-brand-white)]
        "
      >
        <div className="max-w-6xl mx-auto">
          {/* Titre de section */}
          <h3 className="
            text-2xl md:text-3xl lg:text-4xl
            font-bold
            text-[var(--color-brand-black)]
            text-center
            mb-8 md:mb-12 lg:mb-16
          ">
            Comment ça marche ?
          </h3>

          {/* 3 étapes */}
          <div className="
            flex flex-col md:flex-row
            gap-8 md:gap-10 lg:gap-12
            mb-12 md:mb-16
          ">
            {/* Étape 1 */}
            <div className="flex-1 text-center">
              <div className="
                w-16 h-16 md:w-20 md:h-20
                mx-auto mb-4 md:mb-6
                bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                rounded-full
                flex items-center justify-center
                text-2xl md:text-3xl
                font-bold
                text-[var(--color-brand-black)]
              ">
                1
              </div>
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                Tu parles à l'assistant
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Exemple : "J'ai un dîner ce soir à 19h, je dois faire les courses".
              </p>
            </div>

            {/* Étape 2 */}
            <div className="flex-1 text-center">
              <div className="
                w-16 h-16 md:w-20 md:h-20
                mx-auto mb-4 md:mb-6
                bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                rounded-full
                flex items-center justify-center
                text-2xl md:text-3xl
                font-bold
                text-[var(--color-brand-black)]
              ">
                2
              </div>
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                L'IA analyse et planifie
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Elle comprend qu'il y a les courses, la préparation, la cuisson, etc.
                Elle trouve les créneaux libres dans ton calendrier.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="flex-1 text-center">
              <div className="
                w-16 h-16 md:w-20 md:h-20
                mx-auto mb-4 md:mb-6
                bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                rounded-full
                flex items-center justify-center
                text-2xl md:text-3xl
                font-bold
                text-[var(--color-brand-black)]
              ">
                3
              </div>
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                Le calendrier se met à jour
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Les blocs sont ajoutés au bon moment, sans chevauchements.
                Tu vois tout apparaître dans ton calendrier.
              </p>
            </div>
          </div>

          {/* Exemple concret */}
          <div className="
            max-w-3xl
            mx-auto
            p-6 md:p-8
            bg-[var(--color-brand-white)]
            border border-[#3D3D3D0D]
            rounded-soft md:rounded-medium
            shadow-soft
          ">
            <h4 className="
              text-base md:text-lg
              font-semibold
              text-[var(--color-brand-black)]
              mb-4 md:mb-6"            >
              Exemple concret
            </h4>
            <div className="space-y-4 md:space-y-6">
              {/* Ce que tu dis */}
              <div>
                <p className="
                  text-xs md:text-sm
                  font-medium
                  text-[#3D3D3D80]
                  mb-2
                ">
                  Ce que tu dis :
                </p>
                <div className="
                  p-4 md:p-5
                  bg-[var(--color-brand-blue)]
                  rounded-soft
                  text-sm md:text-base
                  text-[var(--color-brand-black)]
                  italic
                ">
                  &quot;J&apos;ai un dîner ce soir à 19h, je vais faire des lasagnes, j&apos;ai pas encore fait les courses et rien n&apos;est prêt.&quot;
                </div>
              </div>

              {/* Ce que l'app crée */}
              <div>
                <p className="
                  text-xs md:text-sm
                  font-medium
                  text-[#3D3D3D80]
                  mb-2
                ">
                  Ce que l'app crée dans ton calendrier :
                </p>
                <div className="
                  p-4 md:p-5
                  bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
                  rounded-soft
                  text-sm md:text-base
                  text-[var(--color-brand-black)]
                ">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>15h - 16h : Faire les courses</li>
                    <li>16h - 17h : Préparation des lasagnes</li>
                    <li>17h30 - 18h15 : Cuisson des lasagnes</li>
                    <li>18h30 - 18h45 : Dresser la table</li>
                    <li>19h - 20h30 : Dîner lasagnes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== POUR QUI ========== */}
      <section className="
        px-4 md:px-8 lg:px-12
        py-12 md:py-16 lg:py-20
        bg-[var(--color-brand-white)]
      ">
        <div className="max-w-6xl mx-auto">
          {/* Titre de section */}
          <h3 className="
            text-2xl md:text-3xl lg:text-4xl
            font-bold
            text-[var(--color-brand-black)]
            text-center
            mb-8 md:mb-12 lg:mb-16
          ">
            Pour qui est faite l'app ?
          </h3>

          {/* 3 profils */}
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-6 md:gap-8 lg:gap-10
          ">
            {/* Profil 1 : Étudiants / Freelances */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
            ">
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                👨‍🎓 Étudiants / Freelances
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Pour ceux qui gèrent beaucoup de choses seuls.
                Cours, projets, rendez-vous clients, deadlines.
                L'app t'aide à tout organiser sans te prendre la tête.
              </p>
            </div>

            {/* Profil 2 : Salariés débordés */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
            ">
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                💼 Salariés débordés
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Pour ceux qui veulent clarifier leur journée.
                Réunions, tâches, rendez-vous perso.
                Tout au même endroit, organisé automatiquement.
              </p>
            </div>

            {/* Profil 3 : Personnes qui n'aiment pas les apps compliquées */}
            <div className="
              p-6 md:p-8
              bg-[var(--color-brand-white)]
              border border-[#3D3D3D0D]
              rounded-soft md:rounded-medium
              shadow-soft
            ">
              <h4 className="
                text-lg md:text-xl
                font-semibold
                text-[var(--color-brand-black)]
                mb-3 md:mb-4
              ">
                🎯 Simplicité avant tout
              </h4>
              <p className="
                text-sm md:text-base
                text-[#3D3D3D80]
                leading-relaxed
              ">
                Pour ceux qui n'aiment pas les apps compliquées.
                Pas de menus cachés, pas de configurations à rallonge.
                Tu parles, ça marche. C'est tout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== APPEL À L'ACTION FINAL ========== */}
      <section className="
        px-4 md:px-8 lg:px-12
        py-12 md:py-16 lg:py-20
        bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]
      ">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="
            text-2xl md:text-3xl lg:text-4xl
            font-bold
            text-[var(--color-brand-black)]
            mb-4 md:mb-6
          ">
            Prêt à laisser ta voix planifier pour toi ?
          </h3>
          <p className="
            text-base md:text-lg
            text-[var(--color-brand-black)]
            mb-6 md:mb-8
            opacity-90
          ">
            Essaie{" "}
            <span className="
              bg-gradient-to-r from-[#F8C4C5] to-[#FFF4C7]
              bg-clip-text
              text-transparent
              font-bold
            ">
              Helpiya
            </span>{" "}
            maintenant. C'est gratuit et ça prend 30 secondes.
          </p>
          <Link
            href="/app"
            className="
              inline-block
              px-8 md:px-12 lg:px-16
              py-4 md:py-5 lg:py-6
              bg-[var(--color-brand-white)]
              text-[var(--color-brand-black)]
              font-semibold
              text-base md:text-lg lg:text-xl
              rounded-soft md:rounded-medium
              shadow-soft
              hover:shadow-medium
              hover:bg-gradient-to-r hover:from-[#F8C4C5] hover:to-[#FFF4C7]
              hover:text-white
              transition-all duration-500 ease-in-out
              transform hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            Accéder à l'app
          </Link>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="
        w-full
        px-4 md:px-8 lg:px-12
        py-6 md:py-8
        border-t border-[#3D3D3D0D]
        bg-[var(--color-brand-white)]
      ">
        <div className="
          max-w-6xl
          mx-auto
          text-center
          text-sm md:text-base
          text-[#3D3D3D80]
        ">
          <p>
            © 2025{" "}
            <span className="
              bg-gradient-to-r from-[#F8C4C5] to-[#FFF4C7]
              bg-clip-text
              text-transparent
              font-bold
            ">
              Helpiya
            </span>
            . Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
