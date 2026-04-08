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
      <p role="alert" className="text-sm text-amber-500 text-center">
        ⚠️{" "}
        <span aria-label="Attention : reconnaissance vocale non disponible">
          Reconnaissance vocale non disponible
        </span>
      </p>
    );
  }

  const statusTexts: Record<SpeechRecognitionStatus, string> = {
    idle: "En attente",
    listening: "Écoute en cours",
    processing: "Traitement en cours",
    error: "Erreur de reconnaissance",
  };

  const statusEmoji: Record<SpeechRecognitionStatus, string> = {
    idle: "",
    listening: "🎙️",
    processing: "⏳",
    error: "❌",
  };

  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        text-sm text-center
        ${status === "listening" ? "text-emerald-400" : "text-zinc-500"}
        ${status === "listening" ? "animate-pulse" : ""}
      `}
    >
      <span aria-hidden="true">{statusEmoji[status] ? `${statusEmoji[status]} ` : ""}</span>
      {statusTexts[status]}
    </p>
  );
}
