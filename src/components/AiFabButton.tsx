/**
 * @file AiFabButton.tsx
 * @description Bouton flottant (FAB - Floating Action Button) pour ouvrir
 *              l'assistant vocal IA.
 * 
 * Ce composant affiche un bouton circulaire positionné en bas à droite
 * de l'écran sur mobile, permettant d'accéder rapidement à l'assistant.
 * 
 * Design inspiré des FAB Material Design mais avec une esthétique
 * plus moderne et minimaliste adaptée au thème sombre.
 */

"use client";

import { memo } from "react";

/**
 * Props du composant AiFabButton
 */
interface AiFabButtonProps {
  /** Callback appelé lors du clic sur le bouton */
  onClick: () => void;
  /** État de la modale (pour accessibilité) */
  isModalOpen?: boolean;
}

/**
 * Composant AiFabButton
 * 
 * Bouton flottant d'accès à l'assistant IA.
 * Positionné en position fixe en bas à droite de l'écran.
 * 
 * Caractéristiques:
 * - Position fixe pour rester visible au scroll
 * - Animation subtile au survol et au clic
 * - Icône IA stylisée avec effet de brillance
 * - Accessible avec aria-labels appropriés
 * 
 * @example
 * ```tsx
 * <AiFabButton 
 *   onClick={() => setIsModalOpen(true)} 
 *   isModalOpen={isModalOpen}
 * />
 * ```
 */
function AiFabButtonComponent({ onClick, isModalOpen = false }: AiFabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-40
        w-16 h-16 rounded-full
        bg-gradient-pink-yellow
        shadow-medium
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-lg
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-brand-pink/50
        group
      `}
      aria-label="Ouvrir l'assistant vocal"
      aria-expanded={isModalOpen}
      aria-haspopup="dialog"
    >
      {/* Cercle de fond avec effet de pulse */}
      <span
        className="
          absolute inset-0 rounded-full
          bg-[#F8C4C533]
          animate-pulse
        "
        aria-hidden="true"
      />

      {/* Icône IA personnalisée */}
      <svg
        className="w-7 h-7 text-[var(--color-brand-black)] relative z-10 transition-transform group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {/* Forme abstraite représentant l'IA - inspirée d'ondes sonores */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Effet de brillance au survol */}
      <span
        className="
          absolute inset-0 rounded-full
          bg-gradient-to-tr from-white/0 via-white/10 to-white/0
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
        aria-hidden="true"
      />

      {/* Badge indicateur (optionnel - pour notifications futures) */}
      {/* 
      <span className="
        absolute -top-1 -right-1 w-5 h-5
        bg-amber-500 rounded-full
        text-xs font-bold text-white
        flex items-center justify-center
        shadow-md
      ">
        3
      </span> 
      */}
    </button>
  );
}

/**
 * Export mémoïsé pour optimiser les re-renders
 * Le bouton ne change que si onClick ou isModalOpen changent
 */
export const AiFabButton = memo(AiFabButtonComponent);

