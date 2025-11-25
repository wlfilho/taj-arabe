"use client";

import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";

import type { MenuItem } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, getImageSrc } from "@/lib/utils";

interface ProductCardProps {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void;
}

export function ProductCard({ item, onSelect, onAddToCart }: ProductCardProps) {
  const imageSrc = getImageSrc(item.imageUrl);
  const itemCode = item.id
    .replace(/[^0-9A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "0");

  return (
    <article
      className={cn(
        "group relative flex items-stretch gap-5 rounded-3xl border border-[#e7dccd] bg-white/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        !item.available && "opacity-60 grayscale",
      )}
    >
      <div className="relative h-28 w-28 overflow-hidden rounded-2xl">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          sizes="112px"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#4c3823]">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-[#8d7357] line-clamp-2">{item.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-[#b37944]">
            {formatCurrency(item.price)}
          </span>
          <Button
            className="h-10 px-4 rounded-md bg-[#e9dcc9] text-[#4f3b27]"
            onClick={() => onSelect?.(item)}
            disabled={!item.available}
            aria-label="Ver detalles del producto"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>
      {!item.available && (
        <span className="absolute right-4 top-4 rounded-full bg-[#d3a06f] px-3 py-1 text-xs font-semibold text-white">
          No disponible
        </span>
      )}
    </article>
  );
}
