import { unstable_cache } from "next/cache";

import { fallbackConfigCsv } from "@/data/fallback-config";
import { parseCsvLine, splitCsvRows } from "@/lib/csv";
import type { SiteConfig, SiteConfigWithComputed } from "@/types/config";

const DEFAULT_SHEET_ID = "1HSW04exyEjR9HdYQN5njz0k6Gssxb48l_7HWiPyXw6s";
const DEFAULT_CONFIG_GID = "1";
const DEFAULT_FEATURE_CONFIG_GID = "1043160202";

// Try to extract sheet ID from published URL if available
function extractSheetIdFromUrl(url: string): string | null {
  try {
    // Match pattern: /spreadsheets/d/e/PUBLISHED_ID/
    const publishedMatch = url.match(/\/spreadsheets\/d\/e\/([\w-]+)\//);
    if (publishedMatch) {
      return publishedMatch[1];
    }
    // Match pattern: /spreadsheets/d/SHEET_ID/
    const directMatch = url.match(/\/spreadsheets\/d\/([\w-]+)\//);
    if (directMatch) {
      return directMatch[1];
    }
  } catch (error) {
    console.warn("Failed to extract sheet ID from URL", error);
  }
  return null;
}

const PUBLISHED_SHEET_URL = process.env.NEXT_PUBLIC_SHEET_URL ?? process.env.SHEET_URL;
const EXTRACTED_SHEET_ID = PUBLISHED_SHEET_URL ? extractSheetIdFromUrl(PUBLISHED_SHEET_URL) : null;

const SHEET_ID =
  process.env.NEXT_PUBLIC_SHEET_ID ??
  process.env.SHEET_ID ??
  EXTRACTED_SHEET_ID ??
  DEFAULT_SHEET_ID;

const CONFIG_GID =
  process.env.NEXT_PUBLIC_CONFIG_GID ??
  process.env.CONFIG_GID ??
  DEFAULT_CONFIG_GID;
const FEATURE_CONFIG_GID =
  process.env.NEXT_PUBLIC_FEATURE_CONFIG_GID ??
  process.env.FEATURE_CONFIG_GID ??
  DEFAULT_FEATURE_CONFIG_GID;

function buildConfigUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_CONFIG_URL ?? process.env.CONFIG_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  // If we have a published sheet URL, use it with the config GID
  if (PUBLISHED_SHEET_URL && CONFIG_GID) {
    try {
      const url = new URL(PUBLISHED_SHEET_URL);
      // Replace or add the gid parameter
      url.searchParams.set("gid", CONFIG_GID);
      // Ensure output is CSV
      url.searchParams.set("output", "csv");
      // Change from /pub to /pub/gviz if needed
      const modifiedUrl = url.toString().replace("/pub?", "/pub/gviz?");
      return modifiedUrl;
    } catch (error) {
      console.warn("Failed to build config URL from published sheet", error);
    }
  }

  // Fallback to direct sheet ID access
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${CONFIG_GID}`;
}

const CONFIG_URL = buildConfigUrl();

function buildFeatureConfigUrl() {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${FEATURE_CONFIG_GID}`;
}

const FEATURE_CONFIG_URL = buildFeatureConfigUrl();

const CACHE_TAG = "config-data";
const FEATURE_CONFIG_CACHE_TAG = "feature-config-data";

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

async function fetchFeatureConfigCsv(): Promise<string> {
  const response = await fetch(FEATURE_CONFIG_URL, {
    next: {
      revalidate: 60 * 60, // 1 hour
      tags: [FEATURE_CONFIG_CACHE_TAG],
    },
  });

  if (!response.ok) {
    throw new Error(`Google Sheets feature config request failed with ${response.status}`);
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
    logoUrl: getValue(["logo", "logourl", "logo url", "imagem"], ""),
    formularioCupom: false, // Será sobrescrito pela feature config se disponível
  };

  return config;
}

function parseFeatureConfig(csv: string): { formularioCupom: boolean } {
  const [headerLineRaw, ...rowLines] = splitCsvRows(csv).filter((line) =>
    line.trim().length > 0,
  );
  const headerLine = headerLineRaw?.replace(/^\ufeff/, "");

  if (!headerLine || !rowLines.length) {
    return { formularioCupom: false };
  }

  const headers = parseCsvLine(headerLine).map(normalizeHeader);

  // Procurar pela linha que contém "formulario cupom" ou "formulariocupom"
  for (const rowLine of rowLines) {
    const values = parseCsvLine(rowLine);
    const recursoIndex = headers.findIndex((h) =>
      h === "recurso" || h === "recursos" || h === "feature"
    );
    const statusIndex = headers.findIndex((h) =>
      h === "status" || h === "ativo" || h === "enabled"
    );

    if (recursoIndex >= 0 && statusIndex >= 0) {
      const recurso = normalizeHeader(values[recursoIndex] || "");
      const status = values[statusIndex]?.trim().toLowerCase() || "";

      // Verificar se é a linha do formulário de cupom
      if (
        recurso.includes("formulario") &&
        (recurso.includes("cupom") || recurso.includes("coupon"))
      ) {
        // Converter status para boolean (TRUE, true, 1, "true" = true, caso contrário false)
        const formularioCupom =
          status === "true" ||
          status === "1" ||
          status === "verdadeiro" ||
          status === "sim" ||
          status === "yes";

        return { formularioCupom };
      }
    }
  }

  return { formularioCupom: false };
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

    // Buscar configurações de features (formulario cupom, etc)
    let featureConfig = { formularioCupom: false };
    try {
      const featureCsv = await fetchFeatureConfigCsv();
      featureConfig = parseFeatureConfig(featureCsv);
    } catch (error) {
      console.warn("Failed to fetch feature config, using defaults", error);
    }

    const configWithFeatures: SiteConfig = {
      ...config,
      formularioCupom: featureConfig.formularioCupom,
    };

    return enrichConfig(configWithFeatures);
  } catch (error) {
    console.warn("Falling back to local config data", error);
    const fallbackConfig = buildConfig(fallbackConfigCsv);
    const configWithFeatures: SiteConfig = {
      ...fallbackConfig,
      formularioCupom: false,
    };
    return enrichConfig(configWithFeatures);
  }
}

export const getSiteConfig = unstable_cache(loadConfig, [CACHE_TAG, FEATURE_CONFIG_CACHE_TAG], {
  revalidate: 60 * 60,
});
