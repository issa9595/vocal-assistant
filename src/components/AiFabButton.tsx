"use client";

import { memo, type FC } from "react";

/**
 * Bouton flottant (FAB) ouvrant l'assistant vocal IA.
 * Positionné en bas à droite, mobile‑first, avec focus visible et libellé ARIA explicite.
 */
interface AiFabButtonProps {
  onClick: () => void;
  isModalOpen?: boolean;
}

const BUTTON_BASE_CLASSES =
  "fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full glass-pink overflow-hidden shadow-lg flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#f4b4c8]/50 group";

const AiFabButtonComponent: FC<AiFabButtonProps> = ({ onClick, isModalOpen = false }) => {
  return (
    <button
      onClick={onClick}
      className={BUTTON_BASE_CLASSES}
      aria-label="Ouvrir l'assistant vocal"
      aria-expanded={isModalOpen}
      aria-haspopup="dialog"
    >
      <span
        className="
          absolute inset-0 rounded-full
          bg-[#f4b4c833]
          animate-pulse
        "
        aria-hidden="true"
      />

      <svg
      className="w-7 h-7 text-(--color-brand-black) relative z-10 transition-transform group-hover:scale-110"
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
          bg-linear-to-tr from-white/0 via-white/10 to-white/0
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
        aria-hidden="true"
      />
    </button>
  );
};

export const AiFabButton = memo(AiFabButtonComponent);

