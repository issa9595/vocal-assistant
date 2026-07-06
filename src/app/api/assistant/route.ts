/**
 * @file route.ts
 * @description API Route pour l'assistant IA connecté à Gemini 2.5 Flash.
 * 
 * Cette route reçoit les messages de l'utilisateur et utilise Gemini
 * avec function calling pour :
 * 1. Comprendre l'intention de l'utilisateur
 * 2. Générer une réponse en langage naturel
 * 3. Déclencher des actions sur l'agenda si nécessaire
 * 
 * Le function calling permet à Gemini d'appeler des "fonctions" définies
 * (add_task, complete_task, etc.) que nous interprétons côté client.
 */

import { NextResponse } from "next/server";
import { GoogleGenAI, type FunctionDeclaration } from "@google/genai";
import type { AssistantResponse, AssistantAction, GeminiRequestPayload } from "@/types/message";
import { getCurrentDateTimeEuropeParis } from "@/lib/date-utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Configuration de l'API Gemini
 * La clé API doit être définie dans les variables d'environnement
 */
const API_KEY = process.env.GEMINI_API_KEY;

/**
 * Initialisation du client Google Generative AI
 */
const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

/**
 * Définition des fonctions disponibles pour Gemini (function calling)
 * Utilise parametersJsonSchema avec des types JSON Schema standards
 */
const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "add_event",
    description: "Ajoute un évènement au calendrier (jour/semaine/mois).",
    parametersJsonSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Nom de l'évènement (ex: Rendez-vous client)",
        },
        start: {
          type: "string",
          description: "Date/heure de début (ISO ou texte ex: '2025-02-10T14:00' ou 'demain 14h')",
        },
        end: {
          type: "string",
          description: "Date/heure de fin (ISO). Si absent, +1h par défaut.",
        },
        description: {
          type: "string",
          description: "Description optionnelle",
        },
        location: {
          type: "string",
          description: "Lieu optionnel",
        },
      },
      required: ["title", "start"],
    },
  },
  {
    name: "update_event",
    description: "Met à jour un évènement existant (titre, horaire, description, lieu).",
    parametersJsonSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "Identifiant interne de l'évènement (si disponible).",
        },
        title: {
          type: "string",
          description: "Nouveau titre ou titre cible pour la recherche.",
        },
        start: {
          type: "string",
          description: "Nouvelle date/heure de début (ISO ou texte).",
        },
        end: {
          type: "string",
          description: "Nouvelle date/heure de fin (ISO).",
        },
        description: {
          type: "string",
          description: "Nouvelle description.",
        },
        location: {
          type: "string",
          description: "Nouveau lieu.",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "delete_event",
    description: "Supprime un évènement du calendrier.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "Identifiant de l'évènement (si disponible).",
        },
        title: {
          type: "string",
          description: "Titre ou partie du titre de l'évènement à supprimer.",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "list_events",
    description: "Liste les évènements du jour / de la semaine / du mois.",
    parametersJsonSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "create_plan",
    description: "Crée un plan structuré avec plusieurs événements de calendrier planifiés dans les créneaux libres. Utilise cette fonction quand l'utilisateur décrit une situation complexe nécessitant plusieurs étapes (ex: 'J'ai un dîner ce soir à 19h, je dois faire les courses, préparer le repas, etc.'). L'IA doit analyser la demande, identifier toutes les étapes nécessaires, estimer leurs durées, et créer des événements dans les créneaux libres du calendrier avant l'échéance. TOUS les items doivent être des événements avec date/heure de début et de fin. Utilise le champ groupId pour relier les événements d'un même plan.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        groupId: {
          type: "string",
          description: "Identifiant de groupe pour relier les événements d'un même plan (optionnel, généré automatiquement si absent)",
        },
        events: {
          type: "array",
          description: "Liste des événements à créer. Chaque événement DOIT avoir une date/heure de début et de fin. Les événements doivent être planifiés dans les créneaux libres avant l'échéance finale.",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Titre de l'événement (ex: 'Faire les courses', 'Préparer les lasagnes', 'Dîner lasagnes')",
              },
              start: {
                type: "string",
                description: "Date/heure de début au format ISO (REQUIS). Ex: '2025-12-10T15:00:00'. Doit être dans un créneau libre du calendrier.",
              },
              end: {
                type: "string",
                description: "Date/heure de fin au format ISO (REQUIS). Ex: '2025-12-10T16:00:00'. Doit être après start.",
              },
              description: {
                type: "string",
                description: "Description optionnelle de l'événement",
              },
              location: {
                type: "string",
                description: "Lieu optionnel de l'événement",
              },
            },
            required: ["title", "start", "end"],
          },
        },
      },
      required: ["events"],
    },
  },
];

/**
 * Prompt système pour guider le comportement de Gemini
 */
const SYSTEM_PROMPT = `Tu es un assistant vocal personnel intelligent pour un calendrier (jour / semaine / mois).

CAPACITÉS PRINCIPALES:
1. Analyse et anticipation : Quand l'utilisateur décrit une situation complexe, analyse toutes les étapes nécessaires.
2. Planification intelligente : Décompose les demandes en événements avec date/heure, et planifie-les dans les créneaux libres du calendrier.
3. Gestion des créneaux : Analyse les événements existants pour trouver les créneaux libres avant l'échéance.

RÈGLES CRITIQUES:
1. Réponds toujours en français, brièvement et clairement.
2. Analyse la demande au-delà de ce qui est explicitement formulé.
3. Anticipe les étapes nécessaires pour accomplir un objectif.
4. TOUS les items créés doivent être des ÉVÉNEMENTS avec date/heure de début et de fin. Plus de "tâches" abstraites.
5. Utilise create_plan quand l'utilisateur décrit une situation nécessitant plusieurs étapes.
6. Pour chaque étape, estime une durée raisonnable (ex: courses = 1h, préparation = 1h, cuisson = 45min).
7. Planifie les événements dans les CRÉNEAUX LIBRES du calendrier existant, en respectant l'ordre logique (courses avant préparation, etc.).
8. S'assure que tous les événements se terminent AVANT l'échéance finale (ex: dîner à 19h).
9. Si ce n'est pas possible (manque de créneaux libres), explique-le clairement dans ta réponse.
10. Utilise le champ groupId pour relier les événements d'un même plan.
11. Si la demande est simple (un seul événement), utilise add_event.
12. Si la demande est conversationnelle (bonjour, merci, etc.), réponds sans appeler de fonction.

EXEMPLES DE COMPORTEMENT:

Demande simple:
- "Ajoute un rendez-vous client demain à 14h" → add_event(start: demain 14h, end: 15h)

Demande complexe (utilise create_plan avec événements uniquement):
- "J'ai un dîner ce soir à 19h, je vais faire des lasagnes, j'ai pas encore fait les courses et rien n'est prêt."
  → Analyse: Il faut faire les courses, préparer les lasagnes, cuire, et dresser la table. Tout doit être fini avant 19h.
  → Estime les durées: courses (1h), préparation (1h), cuisson (45min), dressage table (15min).
  → Cherche les créneaux libres dans le calendrier avant 19h.
  → create_plan avec events (tous avec start/end):
     - "Faire les courses" (ex: 15h-16h si créneau libre)
     - "Préparation des lasagnes" (ex: 16h-17h si créneau libre)
     - "Cuisson des lasagnes" (ex: 17h30-18h15 si créneau libre)
     - "Dresser la table" (ex: 18h30-18h45 si créneau libre)
     - "Dîner lasagnes" (19h-20h30)
  → Tous les événements ont le même groupId pour les relier.

- "Je dois organiser une réunion demain à 10h avec l'équipe, préparer l'ordre du jour et envoyer les invitations"
  → Analyse: Il faut préparer l'ordre du jour et envoyer les invitations avant la réunion.
  → Estime les durées: préparation ordre du jour (30min), envoi invitations (15min).
  → Cherche les créneaux libres avant 10h demain.
  → create_plan avec events:
     - "Préparer l'ordre du jour" (ex: demain 9h-9h30 si créneau libre)
     - "Envoyer les invitations" (ex: demain 9h30-9h45 si créneau libre)
     - "Réunion équipe" (demain 10h-11h)

Autres actions:
- "Supprime le rendez-vous client de demain" → delete_event(title: rendez-vous client)
- "Déplace la réunion produit à jeudi 10h" → update_event(title: réunion produit, start: jeudi 10h)
- "Qu'ai-je cette semaine ?" → list_events

CONTEXTE ACTUEL:
Vue actuelle: {VIEW_MODE}
Date de référence: {REFERENCE_DATE}
Évènements existants (pour identifier les créneaux libres):
{EVENTS_CONTEXT}

Heure actuelle: {CURRENT_TIME}
Date/heure actuelle (ISO Europe/Paris): {NOW_ISO}

IMPORTANT - INTERPRÉTATION DES DATES RELATIVES :
La date/heure actuelle est : {NOW_ISO} (Europe/Paris).

Tu dois interpréter les expressions de dates relatives PAR RAPPORT À CETTE DATE ACTUELLE :

- "aujourd'hui" = le jour même de {NOW_ISO}
- "demain" = le jour suivant {NOW_ISO}
- "après-demain" = 2 jours après {NOW_ISO}
- "ce soir" = le soir du jour actuel (après 18h généralement)
- "ce matin" = le matin du jour actuel (avant 12h)
- "cet après-midi" = l'après-midi du jour actuel (entre 12h et 18h)
- "ce week-end" = le samedi et dimanche de la semaine actuelle
- "la semaine prochaine" = la semaine suivant la semaine actuelle
- "lundi prochain", "mardi prochain", etc. = le prochain jour de la semaine mentionné

Exemples :
- Si aujourd'hui est le 11 décembre 2025 à 14h00 :
  - "demain à 15h" = 12 décembre 2025 à 15:00:00 (Europe/Paris)
  - "ce soir à 20h" = 11 décembre 2025 à 20:00:00 (Europe/Paris)
  - "lundi prochain à 9h" = le prochain lundi à 09:00:00 (Europe/Paris)

Lorsque tu crées un événement avec une date relative, tu DOIS :
1. Calculer la date absolue en fonction de {NOW_ISO}
2. Convertir en ISO string avec timezone Europe/Paris (format : YYYY-MM-DDTHH:mm:ss+01:00 ou +02:00 selon DST)
3. Utiliser cette date ISO dans les champs start/end des événements

IMPORTANT: Analyse les événements existants pour trouver les créneaux libres. Si un créneau est occupé, cherche un autre créneau disponible.`;

/**
 * Formate les évènements pour le contexte du prompt
 */
function formatEventsForContext(events: GeminiRequestPayload["currentEvents"]): string {
  if (events.length === 0) {
    return "Aucun évènement dans le calendrier.";
  }

  return events
    .map((e) => `- ${new Date(e.start).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} → ${new Date(e.end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} • ${e.title}`)
    .join("\n");
}


/**
 * Extrait l'action depuis la réponse de Gemini
 */
function extractAction(functionCall: { name: string; args: Record<string, unknown> } | null): AssistantAction {
  if (!functionCall) {
    return { type: "none" };
  }

  const { name, args } = functionCall;

  switch (name) {
    case "add_event":
      return {
        type: "add_event",
        event: {
          title: args.title as string,
          start: args.start as string,
          end: args.end as string | undefined,
          description: args.description as string | undefined,
          location: args.location as string | undefined,
        },
      };

    case "update_event":
      return {
        type: "update_event",
        eventId: args.eventId as string | undefined,
        title: args.title as string | undefined,
        start: args.start as string | undefined,
        end: args.end as string | undefined,
        description: args.description as string | undefined,
        location: args.location as string | undefined,
      };

    case "delete_event":
      return {
        type: "delete_event",
        eventId: args.eventId as string | undefined,
        title: args.title as string | undefined,
      };

    case "list_events":
      return {
        type: "list_events",
      };

    case "create_plan":
      return {
        type: "create_plan",
        plan: {
          groupId: (args.groupId as string | undefined) || undefined,
          events: (args.events as Array<{
            title: string;
            start: string;
            end: string;
            description?: string;
            location?: string;
          }>) || [],
        },
      };

    default:
      return { type: "none" };
  }
}

/**
 * Génère une réponse de secours en cas d'erreur ou si l'API n'est pas configurée
 */
function getFallbackResponse(userMessage: string): AssistantResponse {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("ajoute") || lowerMessage.includes("crée") || lowerMessage.includes("programme")) {
    const timeMatch = lowerMessage.match(/(\d{1,2})[h:](\d{2})?/);
    const now = new Date();
    if (timeMatch) {
      now.setHours(Number(timeMatch[1]), Number(timeMatch[2] || 0), 0, 0);
    } else {
      now.setHours(9, 0, 0, 0);
    }
    const startIso = now.toISOString();
    const endIso = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

    const title = lowerMessage.replace(/(ajoute|crée|programme)/i, "").trim() || "Nouvel évènement";

    return {
      message: `J'ai ajouté "${title}" dans le calendrier.`,
      action: {
        type: "add_event",
        event: { title, start: startIso, end: endIso },
      },
    };
  }

  if (lowerMessage.includes("supprime")) {
    return {
      message: "Quel évènement dois-je supprimer ?",
      action: { type: "none" },
    };
  }

  if (lowerMessage.includes("agenda") || lowerMessage.includes("calendrier") || lowerMessage.includes("planning")) {
    return {
      message: "Voici vos évènements.",
      action: { type: "list_events" },
    };
  }

  return {
    message: "Je suis votre assistant calendrier. Vous pouvez me demander d'ajouter, modifier ou lister des évènements avec date et heure.",
    action: { type: "none" },
  };
}

/** Bornes de validation du payload (anti-abus : taille, nombre d'items). */
const LIMITS = {
  userMessage: 4_000,
  historyItems: 20,
  historyContent: 4_000,
  events: 200,
  eventField: 300,
} as const;

const VIEW_MODES = ["day", "week", "month", "year"] as const;

/** Date ISO valide et raisonnable (évite les valeurs absurdes injectées dans le prompt). */
function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 40) return false;
  const time = Date.parse(value);
  return !isNaN(time);
}

/**
 * Validation stricte du payload de /api/assistant, sans dépendance externe.
 * Tout ce qui est interpolé dans le prompt système est typé et borné.
 */
function parseAssistantPayload(
  raw: unknown
): { ok: true; payload: GeminiRequestPayload } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Body JSON invalide" };
  }
  const b = raw as Record<string, unknown>;

  if (typeof b.userMessage !== "string" || !b.userMessage.trim()) {
    return { ok: false, error: "Message utilisateur requis" };
  }
  if (b.userMessage.length > LIMITS.userMessage) {
    return { ok: false, error: `Message trop long (max ${LIMITS.userMessage} caractères)` };
  }

  if (!Array.isArray(b.conversationHistory)) {
    return { ok: false, error: "conversationHistory doit être un tableau" };
  }
  // On ne garde que les N derniers messages : borne le coût Gemini
  // et la surface d'injection de prompt.
  const history = b.conversationHistory.slice(-LIMITS.historyItems);
  for (const msg of history) {
    const m = msg as Record<string, unknown>;
    if (
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length > LIMITS.historyContent
    ) {
      return { ok: false, error: "conversationHistory contient un message invalide" };
    }
  }

  if (!Array.isArray(b.currentEvents) || b.currentEvents.length > LIMITS.events) {
    return { ok: false, error: `currentEvents invalide (max ${LIMITS.events} évènements)` };
  }
  for (const ev of b.currentEvents) {
    const e = ev as Record<string, unknown>;
    if (
      typeof e.id !== "string" ||
      typeof e.title !== "string" ||
      e.id.length > LIMITS.eventField ||
      e.title.length > LIMITS.eventField ||
      !isValidIsoDate(e.start) ||
      !isValidIsoDate(e.end)
    ) {
      return { ok: false, error: "currentEvents contient un évènement invalide" };
    }
  }

  if (!VIEW_MODES.includes(b.viewMode as (typeof VIEW_MODES)[number])) {
    return { ok: false, error: "viewMode invalide" };
  }
  if (!isValidIsoDate(b.referenceDate)) {
    return { ok: false, error: "referenceDate invalide" };
  }

  return {
    ok: true,
    payload: {
      userMessage: b.userMessage,
      conversationHistory: history as GeminiRequestPayload["conversationHistory"],
      currentEvents: b.currentEvents as GeminiRequestPayload["currentEvents"],
      viewMode: b.viewMode as GeminiRequestPayload["viewMode"],
      referenceDate: b.referenceDate as string,
    },
  };
}

/**
 * Route POST pour traiter les messages de l'utilisateur
 */
export async function POST(request: Request) {
  try {
    // --- Authentification : cette route consomme la clé Gemini (coûteuse),
    // elle est donc réservée aux utilisateurs connectés. ---
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase n'est pas configuré." },
        { status: 503 }
      );
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // --- Rate limiting : protège le quota Gemini (par utilisateur) ---
    const rate = checkRateLimit(`assistant:${user.id}`, {
      limit: 10,
      windowMs: 60_000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes, réessayez dans quelques instants." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    // Parse et validation stricte du body (types, tailles, bornes)
    const parsed = parseAssistantPayload(await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const body: GeminiRequestPayload = parsed.payload;
    const { userMessage, conversationHistory, currentEvents, viewMode, referenceDate } = body;

    // Date/heure de référence : TOUJOURS calculée côté serveur
    // (le client ne doit pas pouvoir falsifier "maintenant").
    const now = getCurrentDateTimeEuropeParis();

    // Si l'API Gemini n'est pas configurée, utilise le fallback
    if (!genAI || !API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY non configurée, utilisation du mode fallback");
      const fallbackResponse = getFallbackResponse(userMessage);
      return NextResponse.json(fallbackResponse);
    }

    // Préparation du contexte système
    const currentTime = new Date(now).toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "long",
      timeStyle: "short",
    });

    const systemPrompt = SYSTEM_PROMPT
      .replace("{EVENTS_CONTEXT}", formatEventsForContext(currentEvents))
      .replace("{VIEW_MODE}", viewMode)
      .replace("{REFERENCE_DATE}", referenceDate)
      .replace("{CURRENT_TIME}", currentTime)
      .replace("{NOW_ISO}", now);

    // Construction du contenu avec historique et message actuel
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Compris ! Je suis prêt à aider l'utilisateur avec son calendrier." }],
      },
      // Ajout de l'historique de conversation
      ...conversationHistory.map((msg) => ({
        role: (msg.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: msg.content }],
      })),
      // Message actuel de l'utilisateur
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    // Appel à l'API Gemini avec function calling
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        tools: [{ functionDeclarations }],
      },
    });

    // Extraction du texte et des appels de fonction
    const responseText = response.text || "";
    const functionCalls = response.functionCalls || [];

    // Construction de la réponse
    let action: AssistantAction = { type: "none" };
    let message = responseText;

    // Si Gemini a appelé une fonction
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0];
      action = extractAction({
        name: functionCall.name || "",
        args: (functionCall.args || {}) as Record<string, unknown>,
      });

      // Si le modèle n'a pas généré de texte, on en génère un
      if (!message || message.trim() === "") {
        switch (action.type) {
          case "add_event":
            message = `Parfait ! J'ai ajouté "${action.event.title}" à ${action.event.start}.`;
            break;
          case "update_event":
            message = `J'ai mis à jour l'évènement "${action.title ?? action.eventId ?? ""}".`;
            break;
          case "delete_event":
            message = `J'ai supprimé l'évènement "${action.title ?? action.eventId ?? ""}".`;
            break;
          case "list_events":
            message = "Voici vos évènements.";
            break;
          case "create_plan":
            const eventCount = action.plan.events.length;
            message = `J'ai créé un plan avec ${eventCount} événement${eventCount > 1 ? "s" : ""} planifié${eventCount > 1 ? "s" : ""} dans les créneaux libres.`;
            break;
          default:
            message = "C'est noté !";
        }
      }
    }

    const assistantResponse: AssistantResponse = {
      message,
      action,
    };

    return NextResponse.json(assistantResponse);

  } catch (error: unknown) {
    console.error("Erreur API assistant:", error);
    
    // Gestion spécifique des erreurs de quota (429) et service surchargé (503)
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status?: number; message?: string; error?: { code?: number; status?: string; message?: string } };
      
      // Erreur de quota dépassé (429)
      if (apiError.status === 429 || apiError.error?.code === 429) {
        const quotaMessage = "⚠️ Le quota quotidien de l'API Gemini a été atteint (20 requêtes/jour en version gratuite). Veuillez réessayer demain ou passer à un plan payant. Pour plus d'informations : https://ai.google.dev/gemini-api/docs/rate-limits";
        
        return NextResponse.json(
          {
            message: quotaMessage,
            action: { type: "none" },
            error: "QUOTA_EXCEEDED",
          } as AssistantResponse & { error?: string },
          { status: 429 }
        );
      }
      
      // Erreur de service surchargé (503)
      if (apiError.status === 503 || apiError.error?.code === 503 || apiError.error?.status === "UNAVAILABLE") {
        const unavailableMessage = "⚠️ Le service Gemini est temporairement surchargé. Veuillez réessayer dans quelques instants.";
        
        return NextResponse.json(
          {
            message: unavailableMessage,
            action: { type: "none" },
            error: "SERVICE_UNAVAILABLE",
          } as AssistantResponse & { error?: string },
          { status: 503 }
        );
      }
    }
    
    // Vérifier si c'est une erreur ApiError de @google/genai
    if (error instanceof Error) {
      const errorMessage = error.message || "Une erreur s'est produite";
      
      // Détecter les erreurs de quota dans le message
      if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        return NextResponse.json(
          {
            message: "⚠️ Le quota quotidien de l'API Gemini a été atteint. Veuillez réessayer demain ou passer à un plan payant.",
            action: { type: "none" },
            error: "QUOTA_EXCEEDED",
          } as AssistantResponse & { error?: string },
          { status: 429 }
        );
      }
      
      // Détecter les erreurs de service surchargé dans le message
      if (errorMessage.includes("overloaded") || errorMessage.includes("503") || errorMessage.includes("UNAVAILABLE")) {
        return NextResponse.json(
          {
            message: "⚠️ Le service Gemini est temporairement surchargé. Veuillez réessayer dans quelques instants.",
            action: { type: "none" },
            error: "SERVICE_UNAVAILABLE",
          } as AssistantResponse & { error?: string },
          { status: 503 }
        );
      }
    }

    // Retourne une réponse d'erreur gracieuse pour les autres erreurs
    return NextResponse.json(
      {
        message: "Désolé, j'ai rencontré une erreur. Pouvez-vous reformuler votre demande ?",
        action: { type: "none" },
      } as AssistantResponse,
      { status: 200 } // On retourne 200 pour éviter de casser le front
    );
  }
}

