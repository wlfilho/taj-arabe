import { unstable_cache } from "next/cache";

import { fallbackConfigCsv } from "@/data/fallback-config";
import { parseCsvLine, splitCsvRows } from "@/lib/csv";
import type { SiteConfig, SiteConfigWithComputed } from "@/types/config";

const DEFAULT_SHEET_ID = "1HSW04exyEjR9HdYQN5njz0k6Gssxb48l_7HWiPyXw6s";
const DEFAULT_CONFIG_GID = "1";

const SHEET_ID =
  process.env.NEXT_PUBLIC_SHEET_ID ?? process.env.SHEET_ID ?? DEFAULT_SHEET_ID;
const CONFIG_GID =
  process.env.NEXT_PUBLIC_CONFIG_GID ??
  process.env.CONFIG_GID ??
  DEFAULT_CONFIG_GID;

function buildConfigUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_CONFIG_URL ?? process.env.CONFIG_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  const publishedSheetUrl = process.env.NEXT_PUBLIC_SHEET_URL ?? process.env.SHEET_URL;
  if (publishedSheetUrl) {
    try {
      const url = new URL(publishedSheetUrl);
      if (CONFIG_GID) {
        url.searchParams.set("gid", CONFIG_GID);
      }
      if (!url.searchParams.has("output")) {
        url.searchParams.set("output", "csv");
      }
      return url.toString();
    } catch (error) {
      console.warn("Failed to derive config URL from published sheet", error);
    }
  }

  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${CONFIG_GID}`;
}

const CONFIG_URL = buildConfigUrl();

const CACHE_TAG = "config-data";

async function fetchConfigCsv(): Promise<string> {
  const response = await fetch(CONFIG_URL, {
    next: {
      revalidate: 60 * 60, // 1 hour
      tags: [CACHE_TAG],
    },
  });

  if (!response.ok) {
    throw new Error(`Google Sheets config request failed with ${response.status}`);
  }

  return response.text();
}

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function buildConfig(csv: string): SiteConfig {
  const [headerLineRaw, ...rowLines] = splitCsvRows(csv).filter((line) =>
    line.trim().length > 0,
  );
  const headerLine = headerLineRaw?.replace(/^\ufeff/, "");

  if (!headerLine || !rowLines.length) {
    throw new Error("Config CSV without content");
  }

  const headers = parseCsvLine(headerLine).map(normalizeHeader);
  const values = parseCsvLine(rowLines[0] ?? "");

  const getValue = (candidates: string[], fallback = "") => {
    for (const candidate of candidates) {
      const index = headers.indexOf(candidate);
      if (index >= 0) {
        return values[index]?.trim() ?? fallback;
      }
    }
    return fallback;
  };

  const config: SiteConfig = {
    restaurantName: getValue(["restaurante", "nome"], "Restaurante Lilica"),
    cnpj: getValue(["cnpj"], ""),
    phone: getValue(["telefone", "phone"], ""),
    whatsapp: getValue(["whatsapp", "whats"], ""),
    address: getValue(["endereco", "endereco1"], ""),
    neighborhood: getValue(["bairro"], ""),
    city: getValue(["cidade", "city"], ""),
    state: getValue(["estado", "uf", "state"], ""),
    instagram: getValue(["instagram", "ig"], ""),
    facebook: getValue(["facebook", "fb"], ""),
  };

  return config;
}

function enrichConfig(config: SiteConfig): SiteConfigWithComputed {
  const trimmedWhatsapp = config.whatsapp.replace(/[^0-9]/g, "");
  const formattedAddressParts = [config.address, config.neighborhood]
    .filter(Boolean)
    .join(", ");
  const cityState = [config.city, config.state].filter(Boolean).join("/");
  const formattedAddress = [formattedAddressParts, cityState].filter(Boolean).join(" - ");

  return {
    ...config,
    formattedAddress,
    whatsappLink: trimmedWhatsapp
      ? `https://wa.me/${trimmedWhatsapp}`
      : "https://wa.me/",
  };
}

async function loadConfig(): Promise<SiteConfigWithComputed> {
  try {
    const csv = await fetchConfigCsv();
    const config = buildConfig(csv);
    return enrichConfig(config);
  } catch (error) {
    console.warn("Falling back to local config data", error);
    return enrichConfig(buildConfig(fallbackConfigCsv));
  }
}

export const getSiteConfig = unstable_cache(loadConfig, [CACHE_TAG], {
  revalidate: 60 * 60,
});
