"use client";

import { useMemo, useState, useEffect } from "react";

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
  const { search, activeCategory } = useSearch();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { addItem, toggleCart } = useCart();

  const { setActiveCategory } = useSearch();

  const filteredItems = useMemo(
    () => filterItems(data, search, ALL_CATEGORY), // Always pass ALL_CATEGORY to disable category filtering here
    [data, search],
  );

  const groupedItems = useMemo(() => {
    // If searching, filter and group
    if (search.trim()) {
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

    // If not searching, show all categories in order
    return data.categories;
  }, [filteredItems, data.categories, search]);

  // Set initial active category
  useEffect(() => {
    if (!activeCategory && data.categories.length > 0) {
      setActiveCategory(data.categories[0].name);
    }
  }, [activeCategory, data.categories, setActiveCategory]);

  // Scroll Spy Implementation
  useEffect(() => {
    // Don't spy if searching
    if (search.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const visibleSection = entries.find((entry) => entry.isIntersecting);

        if (visibleSection) {
          const category = visibleSection.target.getAttribute("data-category");
          if (category) {
            setActiveCategory(category);
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is near the top
        threshold: 0,
      }
    );

    const sections = document.querySelectorAll("[data-menu-section]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [search, setActiveCategory]);


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
