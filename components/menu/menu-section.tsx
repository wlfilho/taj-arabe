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
      aria-labelledby={`categoria-${title}`}
      className="scroll-mt-28 space-y-6"
      data-menu-section
    >
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          {icon ? <span className="text-xl" aria-hidden>{icon}</span> : null}
          <h2
            id={`categoria-${title}`}
            className="text-2xl font-semibold text-[#4c3823]"
          >
            {title}
          </h2>
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c2aa8b]">
            {items.length} item{items.length > 1 ? "s" : ""}
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
