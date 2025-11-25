"use client";

import { useMemo, useState } from "react";

import { LeadForm } from "@/components/layout/lead-form";
import { CategoryTabs, ALL_CATEGORY } from "@/components/menu/category-tabs";
import { MenuSection } from "@/components/menu/menu-section";
import { useSearch } from "@/components/search/search-provider";
import { cn } from "@/lib/utils";
import type { SiteConfigWithComputed } from "@/types/config";
import type { MenuData, MenuItem } from "@/types/menu";

import { ProductDetailDialog } from "./product-detail-dialog";
import { useCart } from "../cart/cart-provider";

const CATEGORY_DETAILS: Record<string, { icon: string; description: string }> = {
  Entradas: {
    icon: "🥗",
    description: "Sabores ligeros para abrir el apetito",
  },
  "Pratos Principais": {
    icon: "🍽️",
    description: "Recetas originales preparadas al momento",
  },
  Sobremesas: {
    icon: "🍮",
    description: "Dulces artesanales con cariño",
  },
  Bebidas: {
    icon: "🥤",
    description: "Bebidas especiales para acompañar",
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
  const { search } = useSearch();
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

  return (
    <div className="flex flex-col gap-8">
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
              description: "Selección especial del chef",
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
          <h2 className="text-xl font-semibold text-[#4c3823]">Ningún artículo encontrado</h2>
          <p className="mt-2 text-sm text-[#9a8263]">
            Ajusta los filtros o limpia la búsqueda para visualizar el menú completo.
          </p>
        </div>
      )}

      {config.formularioCupom && <LeadForm sheetCity={config.city} />}

      <ProductDetailDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddFromDialog}
      />
    </div>
  );
}
