"use client";

import type { SpeechRecognitionStatus } from "@/types/message";

interface MicrophoneButtonProps {
  status: SpeechRecognitionStatus;
  isSupported: boolean;
  onClick: () => void;
}

export function MicrophoneButton({ status, isSupported, onClick }: MicrophoneButtonProps) {
  const isListening = status === "listening";
  const isDisabled = !isSupported || status === "processing";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-20 h-20 rounded-full
        flex items-center justify-center
        transition-all duration-300
        focus:outline-none focus:ring-4
        ${isListening
          ? "bg-[var(--color-brand-pink)] hover:bg-[#f4b4c8cc] focus:ring-[#f4b4c8]/50 scale-110"
          : "bg-[linear-gradient(135deg,#f4b4c8_0%,#fcecd3_100%)] hover:opacity-90 focus:ring-[#f4b4c8]/50"
        }
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${isListening ? "animate-pulse" : ""}
        shadow-lg
      `}
      aria-label={isListening ? "Arrêter l'écoute" : "Commencer l'écoute"}
      aria-pressed={isListening}
    >
      {isListening && (
        <>
          <span
            className="absolute w-20 h-20 rounded-full bg-[#f4b4c84d] animate-ping"
            aria-hidden="true"
          />
          <span
            className="absolute w-24 h-24 rounded-full border-2 border-[#f4b4c840] animate-ping"
            style={{ animationDelay: "150ms" }}
            aria-hidden="true"
          />
        </>
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
