/**
 * @file useSpeechRecognition.ts
 * @description Hook personnalisé pour la gestion de la reconnaissance vocale
 *              via l'API Web Speech (SpeechRecognition).
 * 
 * Ce hook encapsule toute la logique de reconnaissance vocale et expose
 * une interface simple pour les composants qui l'utilisent.
 * 
 * IMPORTANT: L'API Web Speech n'est pas supportée par tous les navigateurs.
 * Ce hook gère gracieusement les cas où l'API n'est pas disponible.
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { SpeechRecognitionStatus } from "@/types/message";

/**
 * Interface pour les types de l'API Web Speech
 * Nécessaire car TypeScript ne connaît pas nativement ces types
 */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

/**
 * Interface de retour du hook useSpeechRecognition
 */
interface UseSpeechRecognitionReturn {
  /** Texte transcrit de la dernière reconnaissance */
  transcript: string;
  /** État actuel de la reconnaissance vocale */
  status: SpeechRecognitionStatus;
  /** Indique si l'API Web Speech est supportée */
  isSupported: boolean;
  /** Démarre l'écoute vocale */
  startListening: () => void;
  /** Arrête l'écoute vocale */
  stopListening: () => void;
  /** Bascule l'état d'écoute (start/stop) */
  toggleListening: () => void;
  /** Réinitialise le transcript */
  resetTranscript: () => void;
  /** Message d'erreur éventuel */
  errorMessage: string | null;
}

/**
 * Hook personnalisé pour la reconnaissance vocale
 * 
 * @param onResult - Callback appelé quand une phrase est reconnue avec succès
 * @returns Objet contenant l'état et les méthodes de contrôle
 * 
 * @example
 * ```tsx
 * const { transcript, status, toggleListening, isSupported } = useSpeechRecognition({
 *   onResult: (text) => console.log("Texte reconnu:", text)
 * });
 * ```
 */
export function useSpeechRecognition(
  onResult?: (transcript: string) => void
): UseSpeechRecognitionReturn {
  // État du texte transcrit
  const [transcript, setTranscript] = useState<string>("");
  
  // État de la reconnaissance vocale
  const [status, setStatus] = useState<SpeechRecognitionStatus>("idle");
  
  // Support de l'API
  const [isSupported, setIsSupported] = useState<boolean>(false);
  
  // Message d'erreur
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Référence vers l'instance SpeechRecognition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  
  // Référence pour suivre si une reconnaissance est en cours
  // Permet d'éviter les conflits de démarrage
  const isStartingRef = useRef<boolean>(false);

  /**
   * Initialisation de l'API Web Speech au montage du composant
   * Vérifie la disponibilité et configure l'instance
   */
  useEffect(() => {
    // Vérification côté client uniquement
    if (typeof window === "undefined") return;

    // Récupération de l'API (avec préfixe webkit pour Safari)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return;
    }

    setIsSupported(true);

    // Création et configuration de l'instance
    const recognition = new SpeechRecognition();
    
    // Configuration de la reconnaissance
    recognition.continuous = false;      // Une seule phrase à la fois
    recognition.interimResults = false;  // Uniquement les résultats finaux
    recognition.lang = "fr-FR";          // Langue française
    recognition.maxAlternatives = 1;     // Une seule alternative

    // Gestionnaire de résultat réussi
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const transcriptText = result[0].transcript;
      
      setTranscript(transcriptText);
      setStatus("processing");
      
      // Appel du callback avec le texte transcrit
      if (onResult) {
        onResult(transcriptText);
      }
      
      // Retour à l'état idle après traitement
      setTimeout(() => setStatus("idle"), 500);
    };

    // Gestionnaire de fin d'écoute
    recognition.onend = () => {
      // Réinitialisation du flag de démarrage
      isStartingRef.current = false;
      
      // Ne passe en idle que si on n'est pas en traitement
      setStatus((prev) => (prev === "processing" ? prev : "idle"));
    };

    // Gestionnaire d'erreur
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // L'erreur "aborted" est normale quand on démarre une nouvelle reconnaissance
      // ou qu'on arrête manuellement - on ne la traite pas comme une erreur critique
      if (event.error === "aborted") {
        // Réinitialisation silencieuse sans message d'erreur
        setStatus("idle");
        setErrorMessage(null);
        isStartingRef.current = false;
        return;
      }
      
      // Pour les autres erreurs, on affiche un message
      console.error("Erreur de reconnaissance vocale:", event.error);
      
      // Messages d'erreur personnalisés selon le type
      const errorMessages: Record<string, string> = {
        "not-allowed": "Accès au microphone refusé. Veuillez autoriser l'accès.",
        "no-speech": "Aucune parole détectée. Réessayez.",
        "audio-capture": "Aucun microphone détecté.",
        "network": "Erreur réseau. Vérifiez votre connexion.",
      };
      
      setErrorMessage(errorMessages[event.error] || `Erreur: ${event.error}`);
      setStatus("error");
      isStartingRef.current = false;
      
      // Retour à idle après 3 secondes
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage(null);
      }, 3000);
    };

    recognitionRef.current = recognition;

    // Cleanup au démontage
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onResult]);

  /**
   * Démarre l'écoute vocale
   */
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    // Évite les démarrages multiples simultanés
    if (status === "listening" || isStartingRef.current) {
      return;
    }
    
    // Si une reconnaissance est en cours, on l'arrête d'abord
    try {
      const currentState = recognitionRef.current.state;
      if (currentState && currentState !== "inactive") {
        // La reconnaissance est déjà active, on ne fait rien
        // ou on attend qu'elle se termine naturellement
        return;
      }
    } catch (e) {
      // Ignore les erreurs de vérification d'état
    }
    
    setErrorMessage(null);
    setTranscript("");
    isStartingRef.current = true;
    
    try {
      recognitionRef.current.start();
      setStatus("listening");
    } catch (error: unknown) {
      // L'erreur "InvalidStateError" est normale si on essaie de démarrer
      // alors qu'une reconnaissance est déjà en cours - on l'ignore
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("InvalidStateError") || errorMessage.includes("already started")) {
        // La reconnaissance est déjà en cours, on met juste à jour le statut
        setStatus("listening");
        isStartingRef.current = false;
        return;
      }
      
      console.error("Erreur au démarrage de l'écoute:", error);
      setErrorMessage("Impossible de démarrer l'écoute.");
      setStatus("error");
      isStartingRef.current = false;
    }
  }, [status]);

  /**
   * Arrête l'écoute vocale
   */
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    isStartingRef.current = false;
    
    // Arrête même si le statut n'est pas exactement "listening"
    // (peut être en transition)
    try {
      if (recognitionRef.current.state !== "inactive") {
        recognitionRef.current.stop();
      }
      setStatus("idle");
    } catch (error) {
      // Ignore les erreurs d'arrêt (peut être déjà arrêté)
      setStatus("idle");
    }
  }, []);

  /**
   * Bascule entre les états d'écoute
   */
  const toggleListening = useCallback(() => {
    if (status === "listening") {
      stopListening();
    } else {
      startListening();
    }
  }, [status, startListening, stopListening]);

  /**
   * Réinitialise le texte transcrit
   */
  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript,
    status,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    errorMessage,
  };
}

