/**
 * @file AiModal.tsx
 * @description Modale plein écran pour l'assistant vocal IA connecté à Gemini.
 * 
 * Cette modale contient:
 * - Un header avec titre et bouton de fermeture
 * - Un historique de conversation (chat bubbles)
 * - Une barre de contrôle vocale avec bouton micro
 * 
 * La modale est connectée à:
 * - L'API Gemini pour les réponses intelligentes
 * - Le store Zustand pour les actions sur l'agenda
 */

"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useChatStore } from "@/store/useChatStore";
import { callAssistantAPI } from "@/services/assistantApi";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { StatusIndicator } from "@/components/chat/StatusIndicator";
import { SuggestionChip } from "@/components/chat/SuggestionChip";
import { MicrophoneButton } from "@/components/chat/MicrophoneButton";
import type {
  Message,
  SpeechRecognitionStatus,
  AssistantResponse,
  GeminiRequestPayload,
} from "@/types/message";

/**
 * Props du composant AiModal
 */
interface AiModalProps {
  /** Contrôle l'affichage de la modale */
  isOpen: boolean;
  /** Callback pour fermer la modale */
  onClose: () => void;
}

/**
 * Génère un ID unique pour les messages
 */
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};


/**
 * Composant AiModal
 * 
 * Modale plein écran (mobile) contenant l'interface de conversation vocale.
 * Connectée à Gemini 2.5 Flash pour les réponses intelligentes et
 * au store Zustand pour les actions sur l'agenda.
 */
export function AiModal({ isOpen, onClose }: AiModalProps) {
  // ========== ÉTATS ==========
  
  // État de chargement pendant l'envoi à l'assistant
  const [isLoading, setIsLoading] = useState(false);
  
  // État de chargement initial (hydratation depuis Supabase)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Référence pour le scroll automatique
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Référence sur la modale pour le focus trap
  const modalRef = useRef<HTMLDivElement>(null);

  // Référence sur l'élément focalisé avant l'ouverture (pour la restauration)
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ========== STORE ZUSTAND ==========
  const {
    events,
    addEvent,
    addEvents,
    updateEvent,
    deleteEvent,
    findEventByTitle,
    viewMode,
    referenceDate,
  } = useCalendarStore();

  // Store chat (aligné avec le pattern du calendrier)
  const {
    messages,
    conversationId: currentConversationId,
    isHydrated,
    addMessage,
    setMessages,
    setConversationId,
    hydrateFromSupabase,
  } = useChatStore();

  /**
   * Exécute une action retournée par l'assistant
   * Met à jour le store agenda en fonction du type d'action
   * 
   * IMPORTANT: Pour les créations d'événements, on appelle directement l'API
   * pour sauvegarder dans Supabase, puis on met à jour le store avec les
   * événements retournés (qui ont les vrais IDs de Supabase).
   */
  const executeAction = useCallback(async (response: AssistantResponse) => {
    const { action } = response;

    switch (action.type) {
      case "add_event": {
        const start = action.event.start ? new Date(action.event.start) : new Date();
        const end = action.event.end ? new Date(action.event.end) : new Date(start.getTime() + 60 * 60 * 1000);
        
        // Appeler directement l'API pour sauvegarder dans Supabase
        try {
          const apiResponse = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              events: [{
                title: action.event.title,
                start: start.toISOString(),
                end: end.toISOString(),
                description: action.event.description,
                location: action.event.location,
                source: "ai",
              }],
            }),
          });

          if (apiResponse.ok) {
            const data = await apiResponse.json();
            const createdEvents = data.events || [];
            
            // Mettre à jour le store avec les événements créés (avec leurs IDs Supabase)
            if (createdEvents.length > 0) {
              const eventsToAdd = createdEvents.map((evt: any) => ({
                id: evt.id,
                title: evt.title,
                start: new Date(evt.start),
                end: new Date(evt.end),
                createdAt: new Date(evt.createdAt),
                source: evt.source || "ai",
                description: evt.description,
                location: evt.location,
                meta: evt.meta,
              }));
              
              // Utiliser addEvents qui accepte des événements complets
              addEvents(eventsToAdd);
            }
          } else {
            console.error("Erreur lors de la création de l'événement dans Supabase");
            // Fallback: ajouter quand même localement si l'API échoue
            addEvent({
              title: action.event.title,
              start,
              end,
              description: action.event.description,
              location: action.event.location,
              source: "ai",
            });
          }
        } catch (error) {
          console.error("Erreur lors de l'appel API:", error);
          // Fallback: ajouter quand même localement si l'API échoue
          addEvent({
            title: action.event.title,
            start,
            end,
            description: action.event.description,
            location: action.event.location,
            source: "ai",
          });
        }
        break;
      }
      case "update_event": {
        if (action.eventId) {
          updateEvent(action.eventId, {
            title: action.title,
            start: action.start ? new Date(action.start) : undefined,
            end: action.end ? new Date(action.end) : undefined,
            description: action.description,
            location: action.location,
            source: "voice",
          });
        }
        break;
      }
      case "delete_event": {
        if (action.eventId) {
          deleteEvent(action.eventId);
        } else if (action.title) {
          const evt = findEventByTitle(action.title);
          if (evt) deleteEvent(evt.id);
        }
        break;
      }
      case "list_events":
        // rien côté store
        break;
      case "create_plan": {
        // Crée plusieurs événements en une seule fois avec un groupId commun
        const groupId = action.plan.groupId || `group_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        
        const eventsToCreate = action.plan.events.map((eventInput) => ({
          title: eventInput.title,
          start: new Date(eventInput.start).toISOString(),
          end: new Date(eventInput.end).toISOString(),
          description: eventInput.description,
          location: eventInput.location,
          source: "ai" as const,
          meta: {
            groupId,
          },
        }));

        // Appeler directement l'API pour sauvegarder dans Supabase
        try {
          const apiResponse = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ events: eventsToCreate }),
          });

          if (apiResponse.ok) {
            const data = await apiResponse.json();
            const createdEvents = data.events || [];
            
            // Mettre à jour le store avec les événements créés (avec leurs IDs Supabase)
            if (createdEvents.length > 0) {
              const eventsToAdd = createdEvents.map((evt: any) => ({
                id: evt.id,
                title: evt.title,
                start: new Date(evt.start),
                end: new Date(evt.end),
                createdAt: new Date(evt.createdAt),
                source: evt.source || "ai",
                description: evt.description,
                location: evt.location,
                meta: evt.meta,
              }));
              
              // Utiliser addEvents qui accepte des événements complets
              addEvents(eventsToAdd);
            }
          } else {
            console.error("Erreur lors de la création des événements dans Supabase");
            // Fallback: ajouter quand même localement si l'API échoue
            const fallbackEvents = action.plan.events.map((eventInput) => ({
              title: eventInput.title,
              start: new Date(eventInput.start),
              end: new Date(eventInput.end),
              description: eventInput.description,
              location: eventInput.location,
              source: "ai" as const,
              meta: {
                groupId,
              },
            }));
            addEvents(fallbackEvents);
          }
        } catch (error) {
          console.error("Erreur lors de l'appel API:", error);
          // Fallback: ajouter quand même localement si l'API échoue
          const fallbackEvents = action.plan.events.map((eventInput) => ({
            title: eventInput.title,
            start: new Date(eventInput.start),
            end: new Date(eventInput.end),
            description: eventInput.description,
            location: eventInput.location,
            source: "ai" as const,
            meta: {
              groupId,
            },
          }));
          addEvents(fallbackEvents);
        }
        break;
      }
      case "none":
      default:
        break;
    }
  }, [addEvent, addEvents, updateEvent, deleteEvent, findEventByTitle]);

  /**
   * Callback appelé quand la reconnaissance vocale produit un résultat
   * Envoie le message à l'API Gemini et exécute les actions retournées
   */
  const handleSpeechResult = useCallback(async (transcript: string) => {
    // S'assurer qu'on a une conversation
    let conversationId = currentConversationId;
    if (!conversationId) {
      // Créer une nouvelle conversation si nécessaire
      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: null }),
        });
        if (response.ok) {
          const data = await response.json();
          conversationId = data.conversation.id;
          setConversationId(conversationId);
        }
      } catch (error) {
        console.error("Erreur lors de la création de la conversation:", error);
      }
    }

    // Ajout du message utilisateur via le store (qui synchronise automatiquement avec Supabase)
    // Le store vérifie conversationId et synchronise si présent
    addMessage({
      role: "user",
      content: transcript,
    });
    setIsLoading(true);

    try {
      // Fonction helper pour valider une date
      const isValidDate = (date: Date | undefined | null): date is Date => {
        return date instanceof Date && !isNaN(date.getTime());
      };

      // Préparation du payload pour l'API
      // Note: `now` sera calculé côté serveur si non fourni, mais on peut aussi l'envoyer côté client
      // Utiliser les messages du store (qui sont déjà à jour)
      const currentMessages = messages;
      const payload: GeminiRequestPayload = {
        userMessage: transcript,
        conversationHistory: currentMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        // Filtrer les événements avec des dates valides uniquement
        currentEvents: events
          .filter((evt) => isValidDate(evt.start) && isValidDate(evt.end))
          .map((evt) => ({
            id: evt.id,
            title: evt.title,
            start: evt.start.toISOString(),
            end: evt.end.toISOString(),
          })),
        viewMode,
        referenceDate: isValidDate(referenceDate) ? referenceDate.toISOString() : new Date().toISOString(),
        // `now` sera calculé côté serveur, mais on peut l'omettre ici
        // Le serveur utilisera getCurrentDateTimeEuropeParis() si `now` n'est pas fourni
      };

      // Appel à l'API Gemini
      const response = await callAssistantAPI(payload);

      // Vérifier si c'est une erreur gérée (429, 503) - dans ce cas, on ne log pas d'erreur console
      const isHandledError = response.message.includes("⚠️");
      
      // Exécution de l'action si présente (seulement si ce n'est pas une erreur gérée)
      // Note: executeAction est maintenant async pour gérer les appels API
      if (!isHandledError) {
        await executeAction(response);
      }

      // Ajout de la réponse de l'assistant via le store (qui synchronise automatiquement avec Supabase)
      addMessage({
        role: "assistant",
        content: response.message,
      });

    } catch (error) {
      // Ne log l'erreur que si ce n'est pas une erreur gérée (429, 503)
      // Ces erreurs sont déjà gérées dans callAssistantAPI et retournées comme réponse normale
      const isHandledError = error && typeof error === "object" && 
        ("status" in error && ((error as { status?: number }).status === 429 || (error as { status?: number }).status === 503));
      
      if (!isHandledError) {
        console.error("Erreur lors de l'appel à l'assistant:", error);
      }
      
      // Déterminer le message d'erreur approprié
      let errorContent = "Désolé, une erreur s'est produite. Veuillez réessayer.";
      
      // Vérifier le type d'erreur pour afficher un message approprié
      if (error && typeof error === "object") {
        const errorObj = error as { status?: number; message?: string; error?: string };
        
        // Erreur de quota (429)
        if (errorObj.status === 429 || errorObj.error === "QUOTA_EXCEEDED") {
          errorContent = "⚠️ Le quota quotidien de l'API Gemini a été atteint (20 requêtes/jour en version gratuite). Veuillez réessayer demain ou passer à un plan payant. Pour plus d'informations : https://ai.google.dev/gemini-api/docs/rate-limits";
        }
        // Erreur de service surchargé (503)
        else if (errorObj.status === 503 || errorObj.error === "SERVICE_UNAVAILABLE") {
          errorContent = "⚠️ Le service Gemini est temporairement surchargé. Veuillez réessayer dans quelques instants.";
        }
        // Si l'API a retourné un message d'erreur structuré, l'utiliser
        else if (errorObj.message) {
          errorContent = errorObj.message;
        }
      }
      
      // Essayer de récupérer le message depuis la réponse API si disponible
      try {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { json?: () => Promise<{ message?: string }> } };
          if (apiError.response?.json) {
            const errorData = await apiError.response.json();
            if (errorData.message) {
              errorContent = errorData.message;
            }
          }
        }
      } catch {
        // Ignorer les erreurs de parsing
      }
      
      // Message d'erreur via le store
      addMessage({
        role: "assistant",
        content: errorContent,
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, events, viewMode, referenceDate, executeAction, currentConversationId, addMessage, setConversationId]);

  // ========== CHARGEMENT INITIAL DEPUIS SUPABASE ==========
  
  /**
   * Charge la conversation actuelle et ses messages depuis Supabase
   * PATTERN ALIGNÉ : Même logique que pour le calendrier (hydrateFromSupabase)
   */
  useEffect(() => {
    if (!isOpen) return; // Ne charger que quand la modale est ouverte
    
    const loadConversation = async () => {
      setIsLoadingInitial(true);
      try {
        // Utiliser la méthode d'hydratation du store (comme pour le calendrier)
        await hydrateFromSupabase();
      } catch (error) {
        console.error("Erreur lors du chargement de la conversation:", error);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    
    loadConversation();
  }, [isOpen, hydrateFromSupabase]);

  // ========== HOOK RECONNAISSANCE VOCALE ==========
  
  const {
    status,
    isSupported,
    toggleListening,
    errorMessage,
  } = useSpeechRecognition(handleSpeechResult);

  // ========== EFFETS ==========

  /**
   * Scroll automatique vers le bas quand de nouveaux messages arrivent
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  /**
   * Focus trap + Escape pour fermer la modale
   * Sauvegarde le focus précédent et le restaure à la fermeture
   */
  useEffect(() => {
    if (!isOpen) {
      previousFocusRef.current?.focus();
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus sur le premier élément interactif de la modale
    const focusable = modalRef.current?.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const modal = modalRef.current;
      if (!modal) return;
      const elements = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  /**
   * Empêche le scroll du body quand la modale est ouverte
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Ne rien rendre si la modale est fermée
  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="
        fixed inset-0 z-50
        bg-[#fdf8f8f2] backdrop-blur-sm
        flex flex-col
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* ========== HEADER DE LA MODALE ========== */}
      <header className="
        flex items-center justify-between
        px-4 py-4
        border-b border-[#3D3D3D1A]
        bg-[var(--color-brand-white)]
      ">
        <div>
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-brand-black)]">
            Assistant vocal
          </h2>
          <p id="modal-description" className="text-xs text-[#3D3D3D99] mt-0.5">
            Propulsé par Gemini • Parlez pour interagir
          </p>
        </div>

        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="
            w-10 h-10 rounded-full
            flex items-center justify-center
            text-zinc-400 hover:text-zinc-200
            hover:bg-zinc-800
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-violet-500
          "
          aria-label="Fermer l'assistant"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      {/* ========== ZONE DE CONVERSATION ========== */}
      <main className="flex-1 overflow-y-auto p-4" aria-label="Conversation" aria-busy={isLoadingInitial || isLoading}>
        {/* Indicateur de chargement initial */}
        {isLoadingInitial && (
          <div className="flex flex-col items-center justify-center h-full" role="status" aria-label="Chargement de l'historique">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-2" aria-hidden="true" />
            <p className="text-sm text-[#3D3D3D99]">Chargement de l'historique...</p>
          </div>
        )}
        
        {/* Message d'accueil si pas encore de messages (et pas en chargement) */}
        {!isLoadingInitial && messages.length === 0 && (
          <div className="
            flex flex-col items-center justify-center
            h-full text-center px-6
          ">
            <div className="
              w-20 h-20 rounded-full
              bg-[linear-gradient(135deg,#f4b4c830_0%,#fcecd330_100%)]
              flex items-center justify-center
              mb-4
            ">
              <svg
                className="w-10 h-10 text-[var(--color-brand-pink)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--color-brand-black)] mb-2">
              Bonjour ! Je suis votre assistant.
            </h3>
            <p className="text-sm text-[#3D3D3D99] max-w-xs mb-4">
              Appuyez sur le bouton micro et parlez pour commencer.
            </p>
            
            {/* Suggestions d'actions */}
            <p className="sr-only" id="suggestions-label">Exemples de commandes vocales</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2" aria-labelledby="suggestions-label">
              <SuggestionChip text="Ajoute une réunion à 14h" />
              <SuggestionChip text="Qu'est-ce que j'ai aujourd'hui ?" />
              <SuggestionChip text="Marque la réunion comme terminée" />
            </div>
          </div>
        )}

        {/* Liste des messages */}
        <div role="log" aria-live="polite" aria-label="Messages de la conversation" className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Indicateur de chargement de la réponse */}
          {isLoading && (
            <div className="flex items-start gap-2 max-w-[85%]" role="status" aria-label="L'assistant réfléchit…">
              <div className="
                px-4 py-3 rounded-2xl rounded-bl-md
                bg-[var(--color-brand-white)] border border-[#3D3D3D1A] text-[var(--color-brand-black)]
              ">
                <div className="flex gap-1" aria-hidden="true">
                  <span className="w-2 h-2 bg-[var(--color-brand-pink)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[var(--color-brand-pink)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[var(--color-brand-pink)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Élément invisible pour le scroll automatique */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      </main>

      {/* ========== BARRE DE CONTRÔLE VOCALE ========== */}
      <footer className="
        px-4 py-6
        border-t border-[#3D3D3D1A]
        bg-[var(--color-brand-white)]
      ">
        {/* Affichage de l'erreur si présente */}
        {errorMessage && (
          <p role="alert" className="text-sm text-red-400 text-center mb-3">
            {errorMessage}
          </p>
        )}

        {/* Indicateur de statut */}
        <StatusIndicator status={status} isSupported={isSupported} />

        {/* Bouton micro */}
        <div className="flex justify-center mt-4">
          <MicrophoneButton
            status={status}
            isSupported={isSupported}
            onClick={toggleListening}
          />
        </div>

        {/* Aide contextuelle */}
        <p className="text-xs text-[#3D3D3D0D]0 text-center mt-4">
          {isSupported 
            ? "Appuyez pour parler • Appuyez à nouveau pour arrêter"
            : "Votre navigateur ne supporte pas la reconnaissance vocale"
          }
        </p>
      </footer>
    </div>
  );
}


