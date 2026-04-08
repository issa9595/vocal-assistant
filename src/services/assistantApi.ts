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
