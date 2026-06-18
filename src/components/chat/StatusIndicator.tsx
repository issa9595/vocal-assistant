// src/components/chat/StatusIndicator.tsx
"use client";

import type { SpeechRecognitionStatus } from "@/types/message";

interface StatusIndicatorProps {
  status: SpeechRecognitionStatus;
  isSupported: boolean;
}

export function StatusIndicator({ status, isSupported }: StatusIndicatorProps) {
  if (!isSupported) {
    return (
      <p
        role="alert"
        className="flex items-center justify-center gap-2 text-sm text-[var(--color-error)]"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        Reconnaissance vocale non disponible
      </p>
    );
  }

  // Pastille colorée + libellé (pas d'emoji), couleurs issues de la charte.
  const statusConfig: Record<
    SpeechRecognitionStatus,
    { label: string; dot: string; text: string; pulse: boolean }
  > = {
    idle: {
      label: "En attente",
      dot: "bg-[var(--color-brand-lavender)]",
      text: "text-[var(--text-muted-accessible)]",
      pulse: false,
    },
    listening: {
      label: "Écoute en cours",
      dot: "bg-[var(--color-brand-pink)]",
      text: "text-[var(--color-brand-black)]",
      pulse: true,
    },
    processing: {
      label: "Traitement en cours",
      dot: "bg-[var(--color-brand-salmon)]",
      text: "text-[var(--text-secondary-accessible)]",
      pulse: true,
    },
    error: {
      label: "Erreur de reconnaissance",
      dot: "bg-[var(--color-error)]",
      text: "text-[var(--color-error)]",
      pulse: false,
    },
  };

  const { label, dot, text, pulse } = statusConfig[status];

  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`flex items-center justify-center gap-2 text-sm font-medium ${text}`}
    >
      <span
        aria-hidden="true"
        className={`w-2 h-2 rounded-full ${dot} ${pulse ? "animate-pulse-ring" : ""}`}
      />
      {label}
    </p>
  );
}
