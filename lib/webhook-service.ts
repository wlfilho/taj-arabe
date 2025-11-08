/**
 * Serviço para envio de dados para webhooks externos
 */

const WEBHOOK_URL = "https://primary-production-4ada.up.railway.app/webhook-test/cardapio-digital";

export interface WebhookData {
  name: string;
  email: string;
  whatsapp: string;
  timestamp?: string;
  source?: string;
  city?: string | null;
  [key: string]: unknown;
}

/**
 * Envia dados para o webhook externo
 * @param data Dados a serem enviados
 * @returns Promise com o resultado do envio
 */
export async function sendToWebhook(data: WebhookData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const payload = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Webhook failed with status ${response.status}:`, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
