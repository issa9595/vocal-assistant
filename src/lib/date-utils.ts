/**
 * @file date-utils.ts
 * @description Utilitaires pour la gestion des dates avec timezone Europe/Paris
 */

/**
 * Calcule la date/heure actuelle en Europe/Paris et la retourne en ISO string
 * 
 * @returns ISO string de la date/heure actuelle en Europe/Paris (format: YYYY-MM-DDTHH:mm:ss+01:00 ou +02:00)
 */
export function getCurrentDateTimeEuropeParis(): string {
  const now = new Date();
  
  // Utiliser toLocaleString pour obtenir la date/heure en Europe/Paris
  const parisDateString = now.toLocaleString("en-US", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  
  // Parser la date formatée (format MM/DD/YYYY, HH:MM:SS)
  const [datePart, timePart] = parisDateString.split(", ");
  const [monthStr, dayStr, yearStr] = datePart.split("/");
  const [hourStr, minuteStr, secondStr] = timePart.split(":");
  
  // Obtenir l'offset de timezone pour Europe/Paris
  // Créer une date en UTC et en Europe/Paris pour calculer l'offset
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const parisDateObj = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const offsetMs = parisDateObj.getTime() - utcDate.getTime();
  const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));
  const offsetSign = offsetHours >= 0 ? "+" : "-";
  const offsetStr = `${offsetSign}${Math.abs(offsetHours).toString().padStart(2, "0")}:00`;
  
  // Construire la date ISO avec l'offset correct
  const isoString = `${yearStr}-${monthStr.padStart(2, "0")}-${dayStr.padStart(2, "0")}T${hourStr.padStart(2, "0")}:${minuteStr.padStart(2, "0")}:${secondStr.padStart(2, "0")}${offsetStr}`;
  
  return isoString;
}

