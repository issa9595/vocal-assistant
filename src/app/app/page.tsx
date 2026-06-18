"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCalendarStore } from "@/store/useCalendarStore";
import { createClient } from "@/lib/supabase/client";
import { DailyCalendar } from "@/components/DailyCalendar";
import { WeekView } from "@/components/WeekView";
import { MonthView } from "@/components/MonthView";
import { ViewSelector } from "@/components/ViewSelector";
import { AiFabButton } from "@/components/AiFabButton";
import { AiModal } from "@/components/AiModal";
import LumiaLogo from "@/components/LumiaLogo";

/**
 * Page principale du dashboard Lumia
 * 
 * Layout responsive :
 * - Mobile : colonne unique, max-w-md, centré
 * - Desktop (md+) : layout 80/20 avec calendrier à gauche (80%) et panneau à droite (20%)
 */
export default function AppPage() {
  const { viewMode, setViewMode } = useCalendarStore();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const router = useRouter();

  // La vue « Année » a été retirée : on replie tout viewMode obsolète (ex. persisté
  // en localStorage) sur « Mois » pour garder le sélecteur et le contenu cohérents.
  useEffect(() => {
    if (viewMode !== "day" && viewMode !== "week" && viewMode !== "month") {
      setViewMode("month");
    }
  }, [viewMode, setViewMode]);

  // Vue effectivement rendue (évite tout écran blanc le temps de la migration ci-dessus)
  const view = viewMode === "day" || viewMode === "week" ? viewMode : "month";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/accueil");
  }

  return (
    <div className="
      app-shell
      min-h-screen
      aurora-bg
      text-[var(--color-brand-black)]
    ">
      {/* ========== HEADER PRINCIPAL ========== */}
      <header className="
        sticky top-0 z-20
        glass-panel glass-grain glass-highlight
        border-b border-[rgba(255,255,255,0.3)]
        px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20
        py-4 md:py-6 lg:py-8
      ">
        <div className="
          flex flex-col md:flex-row
          items-start md:items-center
          justify-between
          gap-4 md:gap-6 lg:gap-8
          max-w-7xl
          mx-auto
        ">
          {/* Titre */}
          <div>
            <h1>
              <LumiaLogo height={32} />
            </h1>
            <p className="
              text-xs md:text-sm
              text-[var(--text-secondary-accessible)]
              mt-1
            ">
              Votre assistant vocal pour gérer votre calendrier
            </p>
          </div>

          {/* Sélecteur de vue + déconnexion */}
          <div className="flex items-center gap-4">
            <ViewSelector />
            <button
              onClick={handleSignOut}
              title="Se déconnecter"
              aria-label="Se déconnecter"
              className="
                w-9 h-9
                flex items-center justify-center
                rounded-full
                cursor-pointer
                text-[var(--text-muted-accessible)]
                hover:text-[var(--color-brand-black)]
                hover:bg-[rgba(255,255,255,0.4)]
                transition-all duration-200
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <main className="
        flex flex-col
        px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20
        py-4 md:py-6 lg:py-8
        max-w-7xl
        mx-auto
      ">
        {/* 
          Layout responsive :
          MOBILE : colonne unique, calendrier pleine largeur
          DESKTOP (md+) : layout 80/20 avec calendrier à gauche (80%)
        */}
        <div className="
          flex flex-col md:flex-row
          gap-6 lg:gap-10
          w-full
        ">
          {/* Colonne principale : Calendrier (80% sur desktop) */}
          <div className="
            w-full
            md:w-full
            flex-1
          ">
            {view === "day" && <DailyCalendar />}
            {view === "week" && <WeekView />}
            {view === "month" && <MonthView />}
          </div>
        </div>
      </main>

      {/* ========== BOUTON FAB POUR L'IA ========== */}
      <AiFabButton 
        onClick={() => setIsAiModalOpen(true)}
        isModalOpen={isAiModalOpen}
      />

      {/* ========== MODALE ASSISTANT IA ========== */}
      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}

