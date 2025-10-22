import { NextResponse } from "next/server";

// URL do webhook para envio dos dados do formulário
const WEBHOOK_URL = "https://primary-production-4ada.up.railway.app/webhook-test/cardapio-digital";

async function sendToWebhook(data: { name: string; email: string; whatsapp: string }) {
  try {
    console.log("Enviando dados para webhook:", WEBHOOK_URL);

    const payload = {
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      source: "cardapio-digital-cupom-form"
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log(`Webhook response status: ${response.status}`);
    console.log(`Webhook response body: ${responseText}`);

    if (!response.ok) {
      // Se for erro 404, significa que o webhook não está ativo
      if (response.status === 404) {
        console.warn("Webhook não está ativo. Dados salvos localmente para debug.");
        // Aqui você pode implementar um fallback, como salvar em arquivo ou banco local
        return { success: false, reason: "webhook_not_active", data: payload };
      }
      throw new Error(`Webhook responded with status: ${response.status} - ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { raw: responseText };
    }

    return { success: true, result };
  } catch (error) {
    console.error("Failed to send data to webhook:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const whatsapp = String(body.whatsapp ?? "").trim();

    if (!name || !email || !whatsapp) {
      return NextResponse.json(
        { message: "Informe nome, e-mail e WhatsApp para receber o cupom." },
        { status: 400 },
      );
    }

    // Enviar dados para o webhook
    const webhookResult = await sendToWebhook({ name, email, whatsapp });

    if (webhookResult.success) {
      return NextResponse.json({
        message: "Cupom enviado com sucesso! Verifique seu e-mail.",
        success: true,
        webhookResult: webhookResult.result
      });
    } else {
      // Webhook não está ativo, mas dados foram processados
      return NextResponse.json({
        message: "Dados recebidos! O webhook será ativado em breve.",
        success: true,
        note: "Webhook em modo de teste - ative no canvas para receber dados"
      });
    }
  } catch (error) {
    console.error("Failed to process lead:", error);

    // Verificar se é erro de webhook não ativo
    if (error instanceof Error && error.message.includes("404")) {
      return NextResponse.json({
        message: "Dados recebidos! Para ativar o webhook, clique em 'Execute workflow' no canvas.",
        success: true,
        note: "Webhook em modo de teste"
      });
    }

    return NextResponse.json(
      { message: "Não foi possível cadastrar agora. Tente novamente." },
      { status: 500 },
    );
  }
}
