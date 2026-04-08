# Atomic Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract inline sub-components and utilities from 3 oversized files into focused, single-responsibility modules without changing any external behaviour or public API.

**Architecture:** Pure mechanical extraction — move code verbatim into new files, replace originals with imports, verify each step with `npm run build`. No logic changes, no API surface changes, no new abstractions beyond what already exists in the files.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript, Zustand, Tailwind CSS v4, `npm run build` (Next.js + tsc) as the sole verification gate.

---

## File Map

### New files to create

| File | Responsibility |
|------|---------------|
| `src/lib/dateHelpers.ts` | Pure date utilities extracted from `useCalendarStore.ts` (`addHours`, `startOfDay`, `endOfDay`, `startOfWeek`, `endOfWeek`, `startOfMonth`, `endOfMonth`, `isWithin`, `formatTime`) |
| `src/lib/schedulingUtils.ts` | Pure scheduling functions extracted from store (`findFreeSlots`, `canFitEvent`) + `FreeSlot` type |
| `src/services/assistantApi.ts` | `callAssistantAPI` function extracted from `AiModal.tsx` |
| `src/components/chat/MessageBubble.tsx` | `MessageBubble` component + `formatTimestamp` helper |
| `src/components/chat/StatusIndicator.tsx` | `StatusIndicator` component |
| `src/components/chat/MicrophoneButton.tsx` | `MicrophoneButton` component |
| `src/components/chat/SuggestionChip.tsx` | `SuggestionChip` component |
| `src/components/calendar/EventCard.tsx` | `EventCard` component + positioning helpers |
| `src/components/calendar/DayEventsSummary.tsx` | Events sidebar component for desktop view |

### Files to modify

| File | Change |
|------|--------|
| `src/store/useCalendarStore.ts` | Import from `dateHelpers` + `schedulingUtils`; remove moved code |
| `src/components/AiModal.tsx` | Import from `services/assistantApi` + `chat/*`; remove moved code |
| `src/components/DailyCalendar.tsx` | Import from `calendar/EventCard` + `calendar/DayEventsSummary`; remove moved code |

---

## Task 1: Create `src/lib/dateHelpers.ts`

**Files:**
- Create: `src/lib/dateHelpers.ts`

- [ ] **Step 1: Create the file**

```ts
// src/lib/dateHelpers.ts

export const addHours = (date: Date, hours: number): Date => {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
};

export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const startOfWeek = (date: Date): Date => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
};

export const endOfWeek = (date: Date): Date => {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const startOfMonth = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfMonth = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const isWithin = (date: Date, start: Date, end: Date): boolean =>
  date >= start && date <= end;

/**
 * Formate une heure pour l'affichage (ex: "14:30")
 */
export const formatTime = (date: Date): string =>
  date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/madayev/Dev/vocal-assistant && npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```

Expected: no errors relating to `dateHelpers.ts`.

- [ ] **Step 3: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/lib/dateHelpers.ts
git commit -m "refactor: extract date helpers to src/lib/dateHelpers.ts"
```

---

## Task 2: Update `useCalendarStore.ts` to use `dateHelpers`

**Files:**
- Modify: `src/store/useCalendarStore.ts`

- [ ] **Step 1: Replace the top of `useCalendarStore.ts`**

Open `src/store/useCalendarStore.ts`. Replace lines 1–111 (everything before `const getDefaultEvents`) with:

```ts
/**
 * @file useCalendarStore.ts
 * @description Store Zustand pour la gestion globale des évènements de calendrier.
 *
 * Gère :
 * - Les évènements (CRUD)
 * - Le mode de vue (jour / semaine / mois)
 * - La date de référence actuelle
 *
 * Persistance via localStorage.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarEvent } from "@/types/message";
import {
  addHours,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithin,
} from "@/lib/dateHelpers";

type CalendarViewMode = "day" | "week" | "month" | "year";

/**
 * Représente un créneau libre dans le calendrier
 */
export interface FreeSlot {
  start: Date;
  end: Date;
  duration: number; // Durée en millisecondes
}
```

The `generateEventId` and `generateGroupId` helpers stay in the store (they are store-private). Keep them immediately after:

```ts
const generateEventId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const generateGroupId = () => `group_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
```

- [ ] **Step 2: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` (or equivalent). Zero TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/store/useCalendarStore.ts
git commit -m "refactor: useCalendarStore imports date helpers from lib"
```

---

## Task 3: Create `src/lib/schedulingUtils.ts` and wire it

**Files:**
- Create: `src/lib/schedulingUtils.ts`
- Modify: `src/store/useCalendarStore.ts`

- [ ] **Step 1: Create `src/lib/schedulingUtils.ts`**

```ts
// src/lib/schedulingUtils.ts
import type { CalendarEvent } from "@/types/message";

export interface FreeSlot {
  start: Date;
  end: Date;
  duration: number; // ms
}

/**
 * Finds free slots between startDate and endDate that are not occupied by events.
 */
export function findFreeSlots(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date,
  minDuration = 0
): FreeSlot[] {
  const sorted = events
    .filter((evt) => evt.start < endDate && evt.end > startDate)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const freeSlots: FreeSlot[] = [];
  let currentStart = new Date(startDate);

  for (const event of sorted) {
    if (event.start > currentStart) {
      const duration = event.start.getTime() - currentStart.getTime();
      if (duration >= minDuration) {
        freeSlots.push({ start: new Date(currentStart), end: new Date(event.start), duration });
      }
    }
    if (event.end > currentStart) {
      currentStart = new Date(event.end);
    }
  }

  if (currentStart < endDate) {
    const duration = endDate.getTime() - currentStart.getTime();
    if (duration >= minDuration) {
      freeSlots.push({ start: new Date(currentStart), end: new Date(endDate), duration });
    }
  }

  return freeSlots;
}

/**
 * Returns true if no existing event overlaps [start, end].
 */
export function canFitEvent(events: CalendarEvent[], start: Date, end: Date): boolean {
  return !events.some((evt) => evt.start < end && evt.end > start);
}
```

- [ ] **Step 2: Update `useCalendarStore.ts` — add import**

Add to the top-level imports in `useCalendarStore.ts` (after the existing imports):

```ts
import {
  findFreeSlots as findFreeSlotsUtil,
  canFitEvent as canFitEventUtil,
} from "@/lib/schedulingUtils";
```

Also remove the `FreeSlot` interface from `useCalendarStore.ts` and replace the export with a re-export:

```ts
export type { FreeSlot } from "@/lib/schedulingUtils";
```

- [ ] **Step 3: Replace `findFreeSlots` and `canFitEvent` in the store body**

Inside the `create(...)` call, replace the two method implementations (currently lines ~364–419 in the original file) with:

```ts
findFreeSlots: (startDate, endDate, minDuration = 0) => {
  return findFreeSlotsUtil(get().events, startDate, endDate, minDuration);
},

canFitEvent: (start, end) => {
  return canFitEventUtil(get().events, start, end);
},
```

- [ ] **Step 4: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. Zero errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/lib/schedulingUtils.ts src/store/useCalendarStore.ts
git commit -m "refactor: extract findFreeSlots/canFitEvent to lib/schedulingUtils"
```

---

## Task 4: Extract `callAssistantAPI` to `src/services/assistantApi.ts`

**Files:**
- Create: `src/services/assistantApi.ts`
- Modify: `src/components/AiModal.tsx`

- [ ] **Step 1: Create `src/services/assistantApi.ts`**

```ts
// src/services/assistantApi.ts
import type { AssistantResponse, GeminiRequestPayload } from "@/types/message";

/**
 * Appelle l'API assistant avec Gemini.
 */
export async function callAssistantAPI(payload: GeminiRequestPayload): Promise<AssistantResponse> {
  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 429 || response.status === 503) {
      return {
        message: data.message || "Une erreur s'est produite",
        action: { type: "none" },
      };
    }

    const error = new Error(data.message || `Erreur API: ${response.status}`) as Error & {
      status?: number;
      error?: string;
    };
    error.status = response.status;
    if (data.error) error.error = data.error;
    throw error;
  }

  return data;
}
```

- [ ] **Step 2: Update `AiModal.tsx` imports**

At the top of `src/components/AiModal.tsx`, add:

```ts
import { callAssistantAPI } from "@/services/assistantApi";
```

Then delete the entire `callAssistantAPI` function definition from `AiModal.tsx` (lines ~69–104 in the original file).

- [ ] **Step 3: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/services/assistantApi.ts src/components/AiModal.tsx
git commit -m "refactor: extract callAssistantAPI to src/services/assistantApi.ts"
```

---

## Task 5: Extract `MessageBubble` to `src/components/chat/MessageBubble.tsx`

**Files:**
- Create: `src/components/chat/MessageBubble.tsx`
- Modify: `src/components/AiModal.tsx`

- [ ] **Step 1: Create `src/components/chat/MessageBubble.tsx`**

```tsx
// src/components/chat/MessageBubble.tsx
"use client";

import type { Message } from "@/types/message";

const formatTimestamp = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`
        flex items-end gap-2
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      <div
        className={`
          max-w-[85%] px-4 py-3 rounded-large
          ${isUser
            ? "bg-[var(--color-brand-pink)] text-[var(--color-brand-black)] rounded-br-md"
            : "bg-[#9dc0bc30] text-[var(--color-brand-black)] rounded-bl-md"
          }
        `}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span
          className={`
            text-xs mt-1 block
            ${isUser ? "text-[#3D3D3D99]" : "text-[#3D3D3D66]"}
          `}
        >
          {formatTimestamp(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `AiModal.tsx`**

Add import at the top of `AiModal.tsx`:

```ts
import { MessageBubble } from "@/components/chat/MessageBubble";
```

Delete the `formatTimestamp` function, `MessageBubbleProps` interface, and `MessageBubble` function from `AiModal.tsx`.

- [ ] **Step 3: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/components/chat/MessageBubble.tsx src/components/AiModal.tsx
git commit -m "refactor: extract MessageBubble to src/components/chat/"
```

---

## Task 6: Extract `StatusIndicator` and `SuggestionChip`

**Files:**
- Create: `src/components/chat/StatusIndicator.tsx`
- Create: `src/components/chat/SuggestionChip.tsx`
- Modify: `src/components/AiModal.tsx`

- [ ] **Step 1: Create `src/components/chat/StatusIndicator.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/chat/SuggestionChip.tsx`**

```tsx
// src/components/chat/SuggestionChip.tsx
"use client";

interface SuggestionChipProps {
  text: string;
}

export function SuggestionChip({ text }: SuggestionChipProps) {
  return (
    <span className="
      px-3 py-1.5 rounded-full
      bg-[#f4b4c830] text-[#3D3D3D99]
      text-xs
      border border-zinc-700/50
    ">
      &quot;{text}&quot;
    </span>
  );
}
```

- [ ] **Step 3: Update `AiModal.tsx` imports**

Add:

```ts
import { StatusIndicator } from "@/components/chat/StatusIndicator";
import { SuggestionChip } from "@/components/chat/SuggestionChip";
```

Delete `StatusIndicatorProps`, `StatusIndicator`, `SuggestionChipProps`, and `SuggestionChip` from `AiModal.tsx`.

- [ ] **Step 4: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/components/chat/StatusIndicator.tsx src/components/chat/SuggestionChip.tsx src/components/AiModal.tsx
git commit -m "refactor: extract StatusIndicator and SuggestionChip to src/components/chat/"
```

---

## Task 7: Extract `MicrophoneButton`

**Files:**
- Create: `src/components/chat/MicrophoneButton.tsx`
- Modify: `src/components/AiModal.tsx`

- [ ] **Step 1: Create `src/components/chat/MicrophoneButton.tsx`**

```tsx
// src/components/chat/MicrophoneButton.tsx
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
```

- [ ] **Step 2: Update `AiModal.tsx` imports**

Add:

```ts
import { MicrophoneButton } from "@/components/chat/MicrophoneButton";
```

Delete `MicrophoneButtonProps` interface and `MicrophoneButton` function from `AiModal.tsx`.

- [ ] **Step 3: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/components/chat/MicrophoneButton.tsx src/components/AiModal.tsx
git commit -m "refactor: extract MicrophoneButton to src/components/chat/"
```

---

## Task 8: Extract `EventCard` from `DailyCalendar.tsx`

**Files:**
- Create: `src/components/calendar/EventCard.tsx`
- Modify: `src/components/DailyCalendar.tsx`

- [ ] **Step 1: Create `src/components/calendar/EventCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `DailyCalendar.tsx` imports**

Add at top of `DailyCalendar.tsx`:

```ts
import { EventCard } from "@/components/calendar/EventCard";
```

Delete the `EventCardProps` interface, `EventCard` function, and local `formatTime` function from `DailyCalendar.tsx` (formatTime is used elsewhere in DailyCalendar so keep the one used in the main component — see next step).

**Important:** `DailyCalendar.tsx` has its own `formatTime` at line 86 used in the sidebar's event summary (in `<aside>`). Keep that local `formatTime` in `DailyCalendar.tsx` for now — it will be removed in Task 9 when the sidebar is extracted.

- [ ] **Step 3: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/components/calendar/EventCard.tsx src/components/DailyCalendar.tsx
git commit -m "refactor: extract EventCard to src/components/calendar/"
```

---

## Task 9: Extract `DayEventsSummary` sidebar from `DailyCalendar.tsx`

**Files:**
- Create: `src/components/calendar/DayEventsSummary.tsx`
- Modify: `src/components/DailyCalendar.tsx`

- [ ] **Step 1: Create `src/components/calendar/DayEventsSummary.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `DailyCalendar.tsx`**

Add import:

```ts
import { DayEventsSummary } from "@/components/calendar/DayEventsSummary";
```

Replace the entire `{dayEvents.length > 0 && (<aside>...</aside>)}` block (lines ~392–460 in the original file) with:

```tsx
<DayEventsSummary events={dayEvents} />
```

Delete the now-unused local `formatTime` function from `DailyCalendar.tsx`.

- [ ] **Step 3: Run build to verify**

```bash
cd /Users/madayev/Dev/vocal-assistant && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
cd /Users/madayev/Dev/vocal-assistant
git add src/components/calendar/DayEventsSummary.tsx src/components/DailyCalendar.tsx
git commit -m "refactor: extract DayEventsSummary sidebar to src/components/calendar/"
```

---

## Self-Review

**Spec coverage:**
- ✅ AiModal.tsx: `callAssistantAPI` → Task 4; `MessageBubble` → Task 5; `SuggestionChip` → Task 6; `StatusIndicator` → Task 6; `MicrophoneButton` → Task 7
- ✅ useCalendarStore.ts: date helpers → Tasks 1–2; scheduling utils → Task 3
- ✅ DailyCalendar.tsx: `EventCard` → Task 8; sidebar → Task 9
- ✅ Each task ends with `npm run build` verification
- ✅ No external API changes — public exports remain identical

**Placeholder scan:** None found. All steps contain exact code.

**Type consistency:**
- `FreeSlot` is defined in `schedulingUtils.ts` and re-exported from `useCalendarStore.ts` — any consumer already importing from the store continues to work
- `SpeechRecognitionStatus` is imported from `@/types/message` in both `StatusIndicator` and `MicrophoneButton` — consistent
- `CalendarEvent` imported from `@/types/message` in all calendar components — consistent
- `formatTime` is duplicated between `EventCard.tsx` and `DayEventsSummary.tsx` — intentional; both are tiny one-liners and the duplication is preferable to a shared dependency for such trivial helpers
