"use client";

import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  className?: string;
}

const ALL_CATEGORY = "Todos";

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
  className,
}: CategoryTabsProps) {
  const items = [ALL_CATEGORY, ...categories];

  return (
    <nav
      aria-label="Categorias do cardápio"
      className={cn(
        "relative -mx-4 overflow-x-auto pb-2 sm:mx-0",
        className,
      )}
    >
      <div className="flex min-w-max items-center gap-2 px-4 sm:px-0">
        {items.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]",
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
  );
}

export { ALL_CATEGORY };
