"use client";

interface SuggestionChipProps {
  text: string;
}

export function SuggestionChip({ text }: SuggestionChipProps) {
  return (
    <span
      aria-label={`Exemple : ${text}`}
      className="
        px-3 py-1.5 rounded-full
        bg-[var(--color-brand-pink)]/20
        text-[var(--text-secondary-accessible)]
        text-xs
        border border-[rgba(244,180,200,0.40)]
      "
    >
      &quot;{text}&quot;
    </span>
  );
}
