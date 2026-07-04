import { describe, it, expect } from "vitest";
import { getCurrentDateTimeEuropeParis } from "@/lib/date-utils";

describe("getCurrentDateTimeEuropeParis", () => {
  it("retourne une ISO string avec offset +01:00 ou +02:00", () => {
    const iso = getCurrentDateTimeEuropeParis();
    expect(iso).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+0[12]:00$/
    );
  });

  it("retourne une date parsable proche de maintenant (< 5 s d'écart)", () => {
    const iso = getCurrentDateTimeEuropeParis();
    const parsed = new Date(iso);
    expect(Math.abs(parsed.getTime() - Date.now())).toBeLessThan(5000);
  });
});
