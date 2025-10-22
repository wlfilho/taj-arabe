import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID =
  process.env.GOOGLE_SHEETS_ID ??
  process.env.NEXT_PUBLIC_SHEET_ID ??
  process.env.SHEET_ID ??
  "";

const LEADS_RANGE = process.env.GOOGLE_LEADS_RANGE ?? "Leads!A:D";
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "";

if (!SHEET_ID) {
  console.warn("GOOGLE_SHEETS_ID or NEXT_PUBLIC_SHEET_ID is not configured for leads endpoint.");
}

let sheetsClient: ReturnType<typeof google.sheets> | null = null;

async function getSheetsClient() {
  if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_KEY) {
    throw new Error("Missing Google service account credentials");
  }

  if (sheetsClient) {
    return sheetsClient;
  }

  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

export async function POST(request: Request) {
  if (!SHEET_ID) {
    return NextResponse.json(
      { message: "Planilha não configurada para receber leads." },
      { status: 500 },
    );
  }

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

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: LEADS_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toISOString(), name, email, whatsapp]],
      },
    });

    return NextResponse.json({ message: "Lead cadastrado com sucesso" });
  } catch (error) {
    console.error("Failed to append lead", error);
    return NextResponse.json(
      { message: "Não foi possível cadastrar agora. Tente novamente." },
      { status: 500 },
    );
  }
}
