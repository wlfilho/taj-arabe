import type { MenuItem } from "@/types/menu";

import { ProductCard } from "./product-card";

interface MenuSectionProps {
  title: string;
  description?: string;
  icon?: string;
  items: MenuItem[];
  onSelect?: (item: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void;
}

export function MenuSection({ title, description, icon, items, onSelect, onAddToCart }: MenuSectionProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      id={`categoria-${title}`}
      aria-labelledby={`heading-${title}`}
      className="scroll-mt-32 space-y-6"
      data-menu-section
      data-category={title}
    >
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon ? <span className="text-xl" aria-hidden>{icon}</span> : null}
            <h2
              id={`heading-${title}`}
              className="text-2xl font-semibold text-[#4c3823]"
            >
              {title}
            </h2>
          </div>
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#e9dcc9] px-2 text-xs font-bold text-[#7d6446]">
            {items.length} items
          </span>
        </div>
        {description ? (
          <p className="text-sm text-[#9a8263]">{description}</p>
        ) : null}
      </header>
      <div className="space-y-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onSelect={onSelect}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
