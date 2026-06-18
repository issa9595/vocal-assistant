"use client";

import type { SpeechRecognitionStatus } from "@/types/message";

interface MicrophoneButtonProps {
  status: SpeechRecognitionStatus;
  isSupported: boolean;
  onClick: () => void;
}

export function MicrophoneButton({ status, isSupported, onClick }: MicrophoneButtonProps) {
  const isListening = status === "listening";
  const isProcessing = status === "processing";
  const isDisabled = !isSupported || isProcessing;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative w-20 h-20 rounded-full
        flex items-center justify-center
        glass-pink glass-highlight overflow-hidden
        shadow-lg
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]
        ${isListening ? "scale-110" : "hover:scale-105"}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
      aria-label={isListening ? "Arrêter l'écoute" : "Commencer l'écoute"}
      aria-pressed={isListening}
    >
      {/* Halo d'écoute — feedback vocal animé (charte : animate-pulse-ring) */}
      {isListening && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-[var(--color-brand-pink)]/40 animate-pulse-ring"
            aria-hidden="true"
          />
          <span
            className="absolute -inset-2 rounded-full border-2 border-[var(--color-brand-pink)]/40 animate-pulse-ring"
            style={{ animationDelay: "200ms" }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Anneau de réflexion — état « traitement » */}
      {isProcessing && (
        <span
          className="absolute inset-1 rounded-full border-2 border-[var(--color-brand-pink)] border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}

      <svg
        className="w-8 h-8 text-[var(--color-brand-black)] relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {isListening ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        )}
      </svg>
    </button>
  );
}
