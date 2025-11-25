import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, locale = "pt-BR", currency = "BRL") {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/^/, "$ ");
}

export function isValidHttpUrl(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normaliza e valida o caminho/URL da imagem
 * - Aceita URLs HTTP/HTTPS (externas)
 * - Aceita caminhos relativos que começam com / (arquivos locais na pasta public)
 * - Remove /public do início se presente (normalização para Next.js)
 * - Retorna o caminho normalizado ou null se inválido
 */
export function normalizeImageSrc(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null;
  }

  const trimmed = imageUrl.trim();
  if (!trimmed) {
    return null;
  }

  // Se for uma URL HTTP/HTTPS válida, retorna como está
  const isHttpUrl = isValidHttpUrl(trimmed);
  if (isHttpUrl) {
    return trimmed;
  }

  // Se começar com /public, remove (normalização para Next.js)
  let normalized: string;
  if (trimmed.startsWith("/public")) {
    normalized = trimmed.replace(/^\/public/, "");
  } else {
    normalized = trimmed;
  }

  // Se for um caminho relativo válido (começa com /), retorna
  if (normalized.startsWith("/")) {
    return normalized;
  }

  // Se não começar com /, adiciona (assumindo que é um caminho relativo)
  if (!normalized.startsWith("http") && !normalized.startsWith("//")) {
    return `/${normalized}`;
  }

  // Caso contrário, retorna null (inválido)
  return null;
}

/**
 * Verifica se uma URL de imagem é local (arquivo estático na pasta public)
 */
export function isLocalImage(src: string): boolean {
  if (!src) return false;
  // Imagens locais começam com / e não são URLs HTTP/HTTPS
  return src.startsWith("/") && !src.startsWith("//") && !isValidHttpUrl(src);
}

/**
 * Retorna o src da imagem, usando placeholder como fallback
 */
export function getImageSrc(imageUrl: string | null | undefined, placeholder = "/images/placeholder-prato.svg"): string {
  const normalized = normalizeImageSrc(imageUrl);
  return normalized || placeholder;
}
