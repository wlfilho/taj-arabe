import { unstable_cache } from "next/cache";

import { fallbackMenuCsv } from "@/data/fallback-menu";
import { parseCsvLine, splitCsvRows } from "@/lib/csv";
import type { MenuCategory, MenuData, MenuItem } from "@/types/menu";

const DEFAULT_SHEET_ID = "1HSW04exyEjR9HdYQN5njz0k6Gssxb48l_7HWiPyXw6s";
const DEFAULT_SHEET_GID = "0";

const SHEET_ID =
  process.env.NEXT_PUBLIC_SHEET_ID ?? process.env.SHEET_ID ?? DEFAULT_SHEET_ID;
const SHEET_GID =
  process.env.NEXT_PUBLIC_SHEET_GID ?? process.env.SHEET_GID ?? DEFAULT_SHEET_GID;

const SHEET_URL =
  process.env.NEXT_PUBLIC_SHEET_URL ??
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

const CACHE_TAG = "menu-data";

async function fetchMenuCsv(): Promise<string> {
  const response = await fetch(SHEET_URL, {
    next: {
      revalidate: 60 * 30, // 30 minutes cache on the edge
      tags: [CACHE_TAG],
    },
  });

  if (!response.ok) {
    throw new Error(`Google Sheets request failed with ${response.status}`);
  }

  return response.text();
}
function sanitizePrice(rawPrice: string): number {
  const normalized = rawPrice
    .replace(/[R$\s]/gi, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  const price = Number.parseFloat(normalized);
  return Number.isFinite(price) ? price : 0;
}

function parseAvailability(raw: string): boolean {
  const normalized = raw.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return ["sim", "yes", "true", "1"].includes(normalized);
}

function buildMenuItems(csv: string): MenuItem[] {
  const [headerLineRaw, ...rowLines] = splitCsvRows(csv).filter((line) =>
    line.trim().length > 0,
  );

  const headerLine = headerLineRaw?.replace(/^\ufeff/, "");

  if (!headerLine) {
    return [];
  }

  const headers = parseCsvLine(headerLine).map((header) =>
    header
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim()
      .toLowerCase(),
  );

  const findIndex = (candidates: string[]) =>
    candidates.reduce<number>((found, candidate) => {
      if (found >= 0) {
        return found;
      }
      return headers.indexOf(candidate);
    }, -1);

  const indices = {
    id: findIndex(["id"]),
    name: findIndex(["nome", "name"]),
    category: findIndex(["categoria", "category"]),
    description: findIndex(["descricao", "descrição", "description"]),
    price: findIndex(["preco", "preço", "price"]),
    imageUrl: findIndex(["imagem url", "imagem", "image", "image url"]),
    availability: findIndex(["disponivel", "disponível", "available"]),
  };

  return rowLines
    .map((line) => parseCsvLine(line))
    .map((columns) => {
      const idValue = indices.id >= 0 ? columns[indices.id]?.trim() : "";
      const nameValue = indices.name >= 0 ? columns[indices.name]?.trim() : "";
      const categoryValue = indices.category >= 0 ? columns[indices.category]?.trim() : "";
      const descriptionValue =
        indices.description >= 0 ? columns[indices.description]?.trim() : "";
      const rawPrice =
        indices.price >= 0 ? columns[indices.price]?.trim() ?? "0" : "0";
      const price = sanitizePrice(rawPrice);
      const imageUrl =
        indices.imageUrl >= 0
          ? (columns[indices.imageUrl]?.trim() ?? "")
          : "";
      const available =
        indices.availability >= 0
          ? parseAvailability(columns[indices.availability] ?? "")
          : true;

      return {
        id: idValue || crypto.randomUUID(),
        name: nameValue || "Produto",
        category: categoryValue || "Outros",
        description: descriptionValue,
        price,
        imageUrl,
        available,
      } satisfies MenuItem;
    })
    .filter((item) => Boolean(item.name))
    .filter((item) => item.available)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

function groupByCategory(items: MenuItem[]): MenuCategory[] {
  const map = new Map<string, MenuItem[]>();

  items.forEach((item) => {
    const key = item.category || "Outros";
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
  });

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))
    .map(([name, groupedItems]) => ({
      name,
      items: groupedItems.sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    }));
}

async function loadMenuData(): Promise<MenuData> {
  try {
    const csv = await fetchMenuCsv();
    const items = buildMenuItems(csv);

    if (!items.length) {
      throw new Error("Menu CSV returned no items");
    }

    const categories = groupByCategory(items);
    return { items, categories } satisfies MenuData;
  } catch (error) {
    console.error("Falling back to local menu data", error);

    const items = buildMenuItems(fallbackMenuCsv);
    const categories = groupByCategory(items);

    return { items, categories } satisfies MenuData;
  }
}

export const getMenuData = unstable_cache(loadMenuData, [CACHE_TAG], {
  revalidate: 60 * 30,
});

export async function getMenuItemById(id: string) {
  const data = await getMenuData();
  return data.items.find((item) => item.id === id);
}

export const sheetConfig = {
  url: SHEET_URL,
  id: SHEET_ID,
  gid: SHEET_GID,
};
