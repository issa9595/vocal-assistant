"use client";

import type { SpeechRecognitionStatus } from "@/types/message";

interface StatusIndicatorProps {
  status: SpeechRecognitionStatus;
  isSupported: boolean;
}

export function StatusIndicator({ status, isSupported }: StatusIndicatorProps) {
  if (!isSupported) {
    return (
      <p className="text-sm text-amber-500 text-center">
        ⚠️ Reconnaissance vocale non disponible
      </p>
    );
  }

  const statusTexts: Record<SpeechRecognitionStatus, string> = {
    idle: "En attente...",
    listening: "🎙️ Écoute en cours...",
    processing: "⏳ Traitement...",
    error: "❌ Erreur",
  };

  return (
    <p
      className={`
        text-sm text-center
        ${status === "listening" ? "text-emerald-400" : "text-zinc-500"}
        ${status === "listening" ? "animate-pulse" : ""}
      `}
    >
      {statusTexts[status]}
    </p>
  );
}
