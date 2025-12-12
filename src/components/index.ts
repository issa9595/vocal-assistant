/**
 * @file index.ts
 * @description Barrel file pour l'export centralisé des composants.
 * 
 * Permet d'importer tous les composants depuis un seul point d'entrée :
 * import { Agenda, AiFabButton, AiModal } from "@/components";
 */

export { AiFabButton } from "./AiFabButton";
export { AiModal } from "./AiModal";
export { CalendarView } from "./CalendarView";
export { DailyCalendar } from "./DailyCalendar";
export { WeekView } from "./WeekView";
export { MonthView } from "./MonthView";
export { YearView } from "./YearView";
export { ViewSelector } from "./ViewSelector";

