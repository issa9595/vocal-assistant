// src/components/calendar/DayEventsSummary.tsx
"use client";

import type { CalendarEvent } from "@/types/message";

const formatTime = (date: Date): string =>
  date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

interface DayEventsSummaryProps {
  events: CalendarEvent[];
}

export function DayEventsSummary({ events }: DayEventsSummaryProps) {
  if (events.length === 0) return null;

  return (
    <aside className="
      hidden md:flex
      md:flex-col
      md:w-64 lg:w-80
      md:border-l
      md:border-[#3D3D3D0D]
      md:px-4 lg:px-6
      md:py-4
      md:overflow-y-auto
      md:bg-[#fdf8f8f5]
    ">
      <h3 className="
        text-sm lg:text-base
        font-semibold
        text-[var(--color-brand-black)]
        mb-4
        sticky top-0
        bg-[#fdf8f8f5]
        pb-2
        border-b border-[#3D3D3D0D]
      ">
        {events.length} événement{events.length > 1 ? "s" : ""}
      </h3>
      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="
              p-3 lg:p-4
              rounded-medium
              bg-[linear-gradient(135deg,#f4b4c8_0%,#fcecd3_100%)]
              border-none
              shadow-soft
              hover:shadow-medium
              transition-all duration-200
            "
          >
            <div className="
              text-xs lg:text-sm
              font-semibold
              text-[#3D3D3DB3]
              mb-1.5
            ">
              {formatTime(event.start)} - {formatTime(event.end)}
            </div>
            <div className="
              text-sm lg:text-base
              font-bold
              text-[var(--color-brand-black)]
              line-clamp-2
            ">
              {event.title}
            </div>
            {event.description && (
              <div className="
                text-xs lg:text-sm
                text-[#3D3D3D80]
                mt-2
                line-clamp-2
              ">
                {event.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
