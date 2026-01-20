/**
 * @file useChatStore.ts
 * @description Store Zustand pour la gestion globale des conversations et messages.
 *
 * Gère :
 * - Les messages de la conversation courante
 * - L'ID de la conversation courante
 * - L'hydratation depuis Supabase
 *
 * Persistance via localStorage.
 * 
 * PATTERN ALIGNÉ AVEC LE CALENDRIER :
 * - Store Zustand avec persist (localStorage)
 * - Hydratation depuis Supabase via API route (/api/conversations/current)
 * - Synchronisation automatique lors des modifications (POST vers /api/conversations/[id]/messages)
 * - Utilise DEMO_USER_ID pour l'instant (comme le calendrier)
 * - Si pas de user → localStorage uniquement
 * - Si user connecté → Supabase + localStorage (cache)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "@/types/message";

interface ChatStore {
  messages: Message[];
  conversationId: string | null;
  isHydrated: boolean; // Indique si les données ont été chargées depuis Supabase

  // Méthodes pour les messages
  addMessage: (message: Omit<Message, "id" | "createdAt">) => string;
  addMessages: (messages: Array<Omit<Message, "id" | "createdAt"> | Message>) => string[];
  setMessages: (messages: Message[]) => void;
  clearConversation: () => void;

  // Méthodes pour la conversation
  setConversationId: (id: string | null) => void;

  // Méthodes pour l'hydratation depuis Supabase
  hydrateFromSupabase: () => Promise<void>;
}

const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      conversationId: null,
      isHydrated: false,

      addMessage: (messageInput) => {
        const id = generateMessageId();
        const newMessage: Message = {
          ...messageInput,
          id,
          createdAt: new Date(),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        // Synchroniser avec Supabase (comme pour le calendrier)
        // Si conversationId existe, on envoie le message à l'API
        const conversationId = get().conversationId;
        if (conversationId) {
          fetch(`/api/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: newMessage.role,
              content: newMessage.content,
            }),
          })
            .then(async (response) => {
              if (response.ok) {
                const data = await response.json();
                // Mettre à jour le message avec l'ID de Supabase si retourné
                if (data.message?.id) {
                  set((state) => ({
                    messages: state.messages.map((msg) =>
                      msg.id === id ? { ...msg, id: data.message.id } : msg
                    ),
                  }));
                }
              }
            })
            .catch((error) => {
              console.error("Erreur lors de la synchronisation avec Supabase:", error);
            });
        }

        return id;
      },

      addMessages: (messagesInput) => {
        const ids: string[] = [];
        const newMessages: Message[] = [];

        messagesInput.forEach((messageInput) => {
          // Si le message a déjà un ID (venant de Supabase), l'utiliser
          // Sinon, générer un nouvel ID (pour les messages créés localement)
          const hasId = "id" in messageInput && messageInput.id;
          const id = hasId ? messageInput.id : generateMessageId();
          const createdAt =
            "createdAt" in messageInput && messageInput.createdAt
              ? new Date(messageInput.createdAt)
              : new Date();

          newMessages.push({
            ...messageInput,
            id,
            createdAt,
          } as Message);
          ids.push(id);
        });

        set((state) => {
          // Filtrer les doublons (au cas où un message serait déjà présent)
          const existingIds = new Set(state.messages.map((m) => m.id));
          const uniqueNewMessages = newMessages.filter((m) => !existingIds.has(m.id));

          return {
            messages: [...state.messages, ...uniqueNewMessages].sort(
              (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
            ),
          };
        });

        return ids;
      },

      setMessages: (messages) => {
        set({
          messages: messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
          isHydrated: true,
        });
      },

      clearConversation: () => {
        set({
          messages: [],
          conversationId: null,
        });
      },

      setConversationId: (id) => {
        set({ conversationId: id });
      },

      // ========== MÉTHODES HYDRATATION SUPABASE ==========

      /**
       * Charge les messages depuis Supabase et hydrate le store
       * PATTERN ALIGNÉ : Même logique que hydrateFromSupabase() du calendrier
       */
      hydrateFromSupabase: async () => {
        if (get().isHydrated) {
          return; // Déjà hydraté
        }

        try {
          const response = await fetch("/api/conversations/current");
          if (!response.ok) {
            console.error("Erreur lors du chargement des messages depuis Supabase");
            // Fallback : laisser le store vide (pas de messages par défaut comme pour les événements)
            set({ messages: [], isHydrated: true });
            return;
          }

          const data = await response.json();
          const messages: Message[] = (data.messages || []).map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: new Date(msg.createdAt),
          }));

          set({
            messages: messages,
            conversationId: data.conversation?.id || null,
            isHydrated: true,
          });
        } catch (error) {
          console.error("Erreur lors de l'hydratation depuis Supabase:", error);
          // Fallback : laisser le store vide
          set({ messages: [], isHydrated: true });
        }
      },
    }),
    {
      name: "voice-planner-chat",
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          const parsed = JSON.parse(raw);

          // Fonction helper pour valider une date
          const isValidDate = (date: Date | string | undefined | null): boolean => {
            if (!date) return false;
            const d = date instanceof Date ? date : new Date(date);
            return !isNaN(d.getTime());
          };

          if (parsed.state?.messages) {
            parsed.state.messages = parsed.state.messages
              .map((msg: Message) => {
                const createdAt = new Date(msg.createdAt);

                // Filtrer les messages avec des dates invalides
                if (!isValidDate(createdAt)) {
                  return null;
                }

                return {
                  ...msg,
                  createdAt,
                };
              })
              .filter((msg: Message | null) => msg !== null);
          }

          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);




