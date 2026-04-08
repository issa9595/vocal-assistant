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
        bg-[#f4b4c830] text-[#3D3D3D99]
        text-xs
        border border-zinc-700/50
      "
    >
      &quot;{text}&quot;
    </span>
  );
}
