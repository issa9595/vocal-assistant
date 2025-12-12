/**
 * @file page.tsx
 * @description Page d'accueil / Dashboard principal de l'application.
 * 
 * Cette page est le point d'entrée de l'application mobile-first.
 * Elle affiche:
 * - Un header compact avec le titre et sous-titre
 * - Le composant Agenda au centre (liste de tâches du jour)
 * - Un bouton flottant IA (FAB) en bas à droite
 * - La modale de l'assistant vocal (contrôlée par état)
 * 
 * Architecture:
 * - Le composant est marqué "use client" car il gère l'état de la modale
 * - Les composants enfants sont séparés pour une meilleure maintenabilité
 * - Le layout mobile-first utilise max-w-md pour limiter la largeur
 */

"use client";

import { useState, useCallback } from "react";
import { DailyCalendar } from "@/components/DailyCalendar";
import { WeekView } from "@/components/WeekView";
import { MonthView } from "@/components/MonthView";
import { YearView } from "@/components/YearView";
import { ViewSelector } from "@/components/ViewSelector";
import { AiFabButton } from "@/components/AiFabButton";
import { AiModal } from "@/components/AiModal";
import { useCalendarStore } from "@/store/useCalendarStore";

/**
 * Composant Home (Page d'accueil)
 * 
 * Gère l'état d'ouverture de la modale IA et compose
 * les différents éléments du dashboard.
 */
export default function Home() {
  // État de la modale de l'assistant vocal
  // true = modale ouverte, false = modale fermée
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Récupérer la vue actuelle depuis le store
  const { viewMode } = useCalendarStore();

  /**
   * Ouvre la modale de l'assistant
   * Utilise useCallback pour éviter les re-renders inutiles
   */
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * Ferme la modale de l'assistant
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      {/* 
        Container principal avec layout mobile-first
        - min-h-screen : occupe toute la hauteur de l'écran
        - bg-brand-white : fond blanc minimaliste
        - overflow-x-hidden : empêche le scroll horizontal
      */}
      <div className="min-h-screen bg-[var(--color-brand-white)] overflow-x-hidden">
        {/* 
          Main centré avec largeur responsive
          MOBILE (base) : max-w-md (~448px) - layout colonne unique, centré
          DESKTOP (md+) : calendrier en pleine largeur (suppression du panneau "Événements du jour")
        */}
        <main className="
          max-w-md 
          md:max-w-7xl
          mx-auto 
          px-0 
          md:px-4 
          lg:px-8 
          xl:px-12 
          2xl:px-16
          py-0 
          pb-24 md:pb-6 lg:pb-8
          h-screen 
          flex flex-col 
          md:flex-row 
          md:gap-6 
          lg:gap-10
        ">
          {/* ========== COLONNE PRINCIPALE (CALENDRIER) PLEINE LARGEUR EN DESKTOP ========== */}
          <div className="
            flex-1 
            min-h-0 
            md:w-full
            flex flex-col
          ">
            {/* ========== HEADER DE L'APPLICATION ========== */}
            <header className="
              px-4 
              md:px-0
              pt-8 
              md:pt-6 
              lg:pt-8
              pb-6 
              md:pb-6
              lg:pb-8
              bg-[var(--color-brand-white)]
            ">
              {/* 
                Header responsive :
                MOBILE : titre et sélecteur empilés verticalement
                DESKTOP (md+) : titre à gauche, sélecteur à droite en ligne
              */}
              <div className="
                flex flex-col 
                md:flex-row 
                items-start 
                md:items-center 
                justify-between 
                gap-4 
                md:gap-6
                mb-6 
                md:mb-6 
                lg:mb-8
              ">
                {/* Titre principal */}
                <div>
                  <h1 className="
                    text-3xl md:text-4xl lg:text-5xl
                    font-bold 
                    text-[var(--color-brand-black)] 
                    tracking-tight
                  ">
                    Helpiya
                  </h1>
                  <p className="
                    text-sm md:text-base lg:text-lg
                    text-[#3D3D3D80] 
                    mt-2 
                    font-medium
                  ">
                    Votre assistant personnel vocal
                  </p>
                </div>
                
                {/* Sélecteur de vue - aligné à droite sur desktop */}
                <div className="w-full md:w-auto">
                  <ViewSelector />
                </div>
              </div>

              {/* Ligne décorative subtile */}
              <div 
                className="
                  w-16 md:w-24 lg:w-32
                  h-1.5 
                  rounded-full
                  bg-gradient-green-blue
                  shadow-soft
                " 
                aria-hidden="true"
              />
            </header>

            {/* ========== SECTION CALENDRIER ========== */}
            <div className="flex-1 min-h-0">
              {viewMode === "day" && <DailyCalendar />}
              {viewMode === "week" && <WeekView />}
              {viewMode === "month" && <MonthView />}
              {viewMode === "year" && <YearView />}
            </div>
          </div>

        </main>
      </div>

      {/* ========== BOUTON FLOTTANT IA (FAB) ========== */}
      {/* 
        Mobile & Desktop : même FAB flottant en bas à droite
      */}
      {!isModalOpen && (
        <AiFabButton onClick={openModal} isModalOpen={isModalOpen} />
      )}

      {/* ========== MODALE ASSISTANT VOCAL ========== */}
      {/* 
        Modale plein écran sur mobile.
        Contient l'historique de conversation et le bouton micro.
        Contrôlée par l'état isModalOpen.
      */}
      <AiModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
