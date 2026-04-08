"use client";

import { useState } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import { DailyCalendar } from "@/components/DailyCalendar";
import { WeekView } from "@/components/WeekView";
import { MonthView } from "@/components/MonthView";
import { YearView } from "@/components/YearView";
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
  const { viewMode } = useCalendarStore();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="
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
              text-[#3D3D3D80]
              mt-1
            ">
              Votre assistant vocal pour gérer votre calendrier
            </p>
          </div>

          {/* Sélecteur de vue */}
          <ViewSelector />
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
            {viewMode === "day" && <DailyCalendar />}
            {viewMode === "week" && <WeekView />}
            {viewMode === "month" && <MonthView />}
            {viewMode === "year" && <YearView />}
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

