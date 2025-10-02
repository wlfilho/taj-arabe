"use client";

import { useMemo, useState } from "react";

import { LeadForm } from "@/components/layout/lead-form";
import { SearchBar } from "@/components/menu/search-bar";
import { CategoryTabs, ALL_CATEGORY } from "@/components/menu/category-tabs";
import { MenuSection } from "@/components/menu/menu-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteConfigWithComputed } from "@/types/config";
import type { MenuData, MenuItem } from "@/types/menu";

import { ProductDetailDialog } from "./product-detail-dialog";
import { useCart } from "../cart/cart-provider";

const CATEGORY_DETAILS: Record<string, { icon: string; description: string }> = {
  Entradas: {
    icon: "🥗",
    description: "Sabores leves para abrir o apetite",
  },
  "Pratos Principais": {
    icon: "🍽️",
    description: "Receitas autorais preparadas na hora",
  },
  Sobremesas: {
    icon: "🍮",
    description: "Doces artesanais com afeto",
  },
  Bebidas: {
    icon: "🥤",
    description: "Bebidas especiais para acompanhar",
  },
};

interface MenuScreenProps {
  data: MenuData;
  config: SiteConfigWithComputed;
  onSelectItem?: (item: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function filterItems({ items }: MenuData, search: string, category: string) {
  const normalizedSearch = normalize(search.trim());
  const hasSearch = normalizedSearch.length > 0;

  return items.filter((item) => {
    if (category !== ALL_CATEGORY && item.category !== category) {
      return false;
    }

    if (!hasSearch) {
      return true;
    }

    const target = [item.name, item.description, item.category]
      .join(" ")
      .trim();
    const normalizedTarget = normalize(target);
    return normalizedTarget.includes(normalizedSearch);
  });
}

export function MenuScreen({ data, config, onSelectItem, onAddToCart }: MenuScreenProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { addItem, toggleCart } = useCart();

  const filteredItems = useMemo(
    () => filterItems(data, search, activeCategory),
    [data, search, activeCategory],
  );

  const categories = useMemo(
    () => data.categories.map((category) => category.name),
    [data.categories],
  );

  const groupedItems = useMemo(() => {
    if (activeCategory !== ALL_CATEGORY || search.trim()) {
      const group: Record<string, MenuItem[]> = {};

      filteredItems.forEach((item) => {
        const key = item.category;
        if (!group[key]) {
          group[key] = [];
        }
        group[key].push(item);
      });

      return Object.entries(group)
        .sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))
        .map(([name, items]) => ({
          name,
          items,
        }));
    }

    return data.categories;
  }, [filteredItems, data.categories, activeCategory, search]);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    onSelectItem?.(item);
  };

  const handleAddToCart = (item: MenuItem, quantity = 1) => {
    if (!item.available) {
      return;
    }
    addItem(item, quantity);
    toggleCart(true);
    onAddToCart?.(item);
  };

  const handleAddFromDialog = (item: MenuItem, quantity: number) => {
    handleAddToCart(item, quantity);
    setSelectedItem(null);
  };

  const handleScrollToMenu = () => {
    const section = document.querySelector("[data-menu-section]");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#e7dccd] bg-white/85 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#4c3823]">Encontre seu prato</h2>
          <p className="text-sm text-[#8f7454]">
            Busque por ingredientes, pratos ou bebidas e finalize seu pedido em segundos.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} className="min-w-[240px] flex-1" />
          <Button type="button" variant="secondary" onClick={handleScrollToMenu}>
            Ver cardápio completo
          </Button>
        </div>
      </div>

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {groupedItems.length ? (
        <div className={cn("flex flex-col gap-14")}
        >
          {groupedItems.map((group) => {
            const details = CATEGORY_DETAILS[group.name] ?? {
              icon: "🍽️",
              description: "Seleção especial do chef",
            };

            return (
              <MenuSection
                key={group.name}
                title={group.name}
                description={details.description}
                icon={details.icon}
                items={group.items}
                onSelect={handleSelectItem}
                onAddToCart={handleAddToCart}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#eadccb] bg-white/70 p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#4c3823]">Nenhum item encontrado</h2>
          <p className="mt-2 text-sm text-[#9a8263]">
            Ajuste os filtros ou limpe a busca para visualizar o cardápio completo.
          </p>
          <button
            type="button"
            className="mt-6 text-sm font-semibold text-[#b37944] hover:text-[#8f5827]"
            onClick={() => {
              setSearch("");
              setActiveCategory(ALL_CATEGORY);
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}

      <LeadForm sheetCity={config.city} />

      <ProductDetailDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddFromDialog}
      />
    </div>
  );
}
