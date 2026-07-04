import { describe, it, expect } from "vitest";
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

// Mercredi 15 avril 2026, 14:30
const ref = new Date(2026, 3, 15, 14, 30, 0);

describe("dateHelpers", () => {
  it("addHours ajoute des heures sans muter la date d'origine", () => {
    const result = addHours(ref, 3);
    expect(result.getHours()).toBe(17);
    expect(ref.getHours()).toBe(14); // pas de mutation
  });

  it("addHours gère le passage au jour suivant", () => {
    const result = addHours(ref, 12);
    expect(result.getDate()).toBe(16);
    expect(result.getHours()).toBe(2);
  });

  it("startOfDay retourne minuit", () => {
    const result = startOfDay(ref);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getDate()).toBe(15);
  });

  it("endOfDay retourne 23:59:59.999", () => {
    const result = endOfDay(ref);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });

  it("startOfWeek retourne le lundi (semaine française)", () => {
    const result = startOfWeek(ref); // mercredi 15 → lundi 13
    expect(result.getDay()).toBe(1);
    expect(result.getDate()).toBe(13);
  });

  it("startOfWeek gère le dimanche (retourne le lundi précédent)", () => {
    const sunday = new Date(2026, 3, 19); // dimanche 19 avril
    const result = startOfWeek(sunday);
    expect(result.getDay()).toBe(1);
    expect(result.getDate()).toBe(13);
  });

  it("endOfWeek retourne le dimanche soir", () => {
    const result = endOfWeek(ref);
    expect(result.getDay()).toBe(0);
    expect(result.getDate()).toBe(19);
    expect(result.getHours()).toBe(23);
  });

  it("startOfMonth / endOfMonth encadrent le mois", () => {
    expect(startOfMonth(ref).getDate()).toBe(1);
    expect(endOfMonth(ref).getDate()).toBe(30); // avril = 30 jours
  });

  it("isWithin détecte l'appartenance à un intervalle (bornes incluses)", () => {
    const start = startOfDay(ref);
    const end = endOfDay(ref);
    expect(isWithin(ref, start, end)).toBe(true);
    expect(isWithin(start, start, end)).toBe(true);
    expect(isWithin(new Date(2026, 3, 16), start, end)).toBe(false);
  });
});
