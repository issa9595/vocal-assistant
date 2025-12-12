/**
 * @file message.ts
 * @description Définition des types TypeScript pour la gestion des messages,
 *              des tâches et des actions de l'assistant IA.
 * 
 * Ce fichier centralise tous les types liés aux messages échangés entre
 * l'utilisateur et l'assistant IA, conformément aux principes de Clean Architecture.
 */

/**
 * Rôle d'un message dans la conversation
 * - "user" : Message envoyé par l'utilisateur (transcription vocale)
 * - "assistant" : Réponse générée par l'IA
 */
export type MessageRole = "user" | "assistant";

/**
 * Structure d'un message dans l'historique de conversation
 * 
 * @property id - Identifiant unique du message (pour la clé React)
 * @property role - Rôle de l'émetteur (utilisateur ou assistant)
 * @property content - Contenu textuel du message
 * @property createdAt - Horodatage de création du message
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

/**
 * Structure d'un évènement de calendrier
 * 
 * @property id - Identifiant unique
 * @property title - Nom de l'évènement
 * @property start - Date/heure de début
 * @property end - Date/heure de fin
 * @property createdAt - Date de création
 * @property source - Origine (voix, manuel ou IA)
 * @property description - Description optionnelle
 * @property location - Lieu optionnel
 * @property meta - Métadonnées optionnelles (ex: groupId pour relier plusieurs événements)
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  createdAt: Date;
  source?: "voice" | "manual" | "ai";
  description?: string;
  location?: string;
  meta?: {
    groupId?: string; // Pour relier plusieurs événements à un même objectif (ex: "dîner lasagnes")
  };
}


/**
 * États possibles de la reconnaissance vocale
 * - "idle" : En attente, pas d'écoute
 * - "listening" : Écoute en cours
 * - "processing" : Traitement de la transcription
 * - "error" : Erreur survenue
 */
export type SpeechRecognitionStatus = "idle" | "listening" | "processing" | "error";

/**
 * Types d'actions que l'assistant IA peut déclencher
 * Ces actions sont utilisées via le function calling de Gemini
 */
export type AssistantActionType = 
  | "add_event"      // Ajouter un évènement
  | "update_event"   // Mettre à jour un évènement
  | "delete_event"   // Supprimer un évènement
  | "list_events"    // Lister les évènements
  | "create_plan"    // Créer un plan avec plusieurs événements dans les créneaux libres
  | "none";         // Pas d'action, juste une réponse conversationnelle

/**
 * Structure d'une action d'ajout d'évènement
 */
export interface AddEventAction {
  type: "add_event";
  event: {
    title: string;
    start: string; // ISO string
    end?: string;  // ISO string
    description?: string;
    location?: string;
  };
}

/**
 * Structure d'une action de mise à jour d'évènement
 */
export interface UpdateEventAction {
  type: "update_event";
  eventId?: string;
  title?: string;
  start?: string;
  end?: string;
  description?: string;
  location?: string;
}

/**
 * Structure d'une action de suppression d'évènement
 */
export interface DeleteEventAction {
  type: "delete_event";
  eventId?: string;
  title?: string;
}

/**
 * Structure d'une action de listage des évènements
 */
export interface ListEventsAction {
  type: "list_events";
}

/**
 * Structure d'une action de création de plan
 * 
 * Permet à l'IA de créer plusieurs événements de calendrier en une seule fois
 * pour décomposer une demande complexe. Les événements sont planifiés dans
 * les créneaux libres du calendrier avant l'échéance.
 */
export interface CreatePlanAction {
  type: "create_plan";
  plan: {
    groupId?: string; // Identifiant de groupe pour relier les événements
    events: Array<{
      title: string;
      start: string; // ISO string - date/heure de début
      end: string;   // ISO string - date/heure de fin
      description?: string;
      location?: string;
    }>;
  };
}

/**
 * Structure pour aucune action (réponse conversationnelle)
 */
export interface NoAction {
  type: "none";
}

/**
 * Union type pour toutes les actions possibles
 */
export type AssistantAction = 
  | AddEventAction 
  | UpdateEventAction 
  | DeleteEventAction 
  | ListEventsAction 
  | CreatePlanAction
  | NoAction;

/**
 * Réponse complète de l'assistant IA
 * Contient le message à afficher et l'action éventuelle à exécuter
 */
export interface AssistantResponse {
  message: string;
  action: AssistantAction;
}

/**
 * Payload envoyé à l'API Gemini
 */
export interface GeminiRequestPayload {
  userMessage: string;
  conversationHistory: Array<{
    role: MessageRole;
    content: string;
  }>;
  currentEvents: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
  }>;
  viewMode: "day" | "week" | "month" | "year";
  referenceDate: string; // ISO string
  now?: string; // ISO string de la date/heure actuelle en Europe/Paris (optionnel, calculé côté serveur si absent)
}

