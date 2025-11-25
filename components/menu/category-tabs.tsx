"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  onSearchClick?: () => void;
  className?: string;
}

const ALL_CATEGORY = "Todos";

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
  onSearchClick,
  className,
}: CategoryTabsProps) {
  const items = categories;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Função para verificar se precisa mostrar as setas
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Verificar ao montar e quando redimensionar
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  // Função para scroll suave
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300; // pixels para scrollar
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const itemsRef = useRef<Map<string, HTMLButtonElement> | null>(null);

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  useEffect(() => {
    const map = getMap();
    const node = map.get(activeCategory);

    if (node) {
      node.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  return (
    <div className="relative">
      {/* Seta Esquerda - apenas desktop */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#e7dccd] bg-white p-2 text-[#7b5f3d] shadow-md transition hover:border-[#d3a06f] hover:text-[#b37944] sm:block"
          aria-label="Rolar categorias para esquerda"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
      )}

      {/* Container de scroll */}
      <nav
        ref={scrollContainerRef}
        onScroll={checkScroll}
        aria-label="Categorias do cardápio"
        className={cn(
          "scrollbar-hide relative -mx-4 overflow-x-auto pb-2 sm:mx-0",
          className,
        )}
      >
        <div className="flex min-w-max items-center gap-2 px-4 sm:px-12">
          {/* Search Button */}
          {onSearchClick && (
            <button
              type="button"
              onClick={onSearchClick}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dccd] bg-white text-[#6a5336] shadow-sm transition hover:border-[#d3a06f] hover:text-[#b37944]"
              aria-label="Buscar en el menú"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          )}
          {items.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                ref={(node) => {
                  const map = getMap();
                  if (node) {
                    map.set(category, node);
                  } else {
                    map.delete(category);
                  }
                }}
                type="button"
                onClick={() => onSelect(category)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]",
                  isActive
                    ? "border-transparent bg-[#c08954] text-white shadow"
                    : "border-[#e7dccd] bg-[#f6ecde] text-[#7b5f3d] hover:border-[#d3a06f] hover:text-[#b37944]",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Seta Direita - apenas desktop */}
      {showRightArrow && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#e7dccd] bg-white p-2 text-[#7b5f3d] shadow-md transition hover:border-[#d3a06f] hover:text-[#b37944] sm:block"
          aria-label="Rolar categorias para direita"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  );
}

export { ALL_CATEGORY };
