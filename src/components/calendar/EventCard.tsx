// src/components/calendar/EventCard.tsx
"use client";

import type { CalendarEvent } from "@/types/message";

const formatTime = (date: Date): string =>
  date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

export interface EventCardProps {
  event: CalendarEvent;
  position: number;
  height: number;
}

export function EventCard({ event, position, height }: EventCardProps) {
  return (
    <div
      className="
        absolute left-0 right-0
        bg-[linear-gradient(135deg,#f4b4c8_0%,#fcecd3_100%)]
        border-none
        rounded-medium
        p-3 md:p-3.5
        text-[var(--color-brand-black)]
        shadow-soft
        hover:shadow-medium hover:scale-[1.02]
        transition-all duration-200
        cursor-pointer
        overflow-hidden
        flex flex-col
        gap-1
      "
      style={{
        top: `${Math.max(0, Math.min(100 - height, position))}%`,
        height: `${height}%`,
        minHeight: "70px",
      }}
      title={`${event.title} - ${formatTime(event.start)} - ${formatTime(event.end)}`}
    >
      <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-semibold text-[#3D3D3DB3] uppercase tracking-wide leading-none">
        <span>{formatTime(event.start)}</span>
        {height > 5 && (
          <span className="text-[#3D3D3D80] font-medium normal-case">
            Jusqu'à {formatTime(event.end)}
          </span>
        )}
      </div>

      <div className="text-xs md:text-sm font-bold text-[var(--color-brand-black)] leading-tight flex-1 break-words">
        {event.title}
      </div>
    </div>
  );
}
