"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn, formatCurrency, getImageSrc } from "@/lib/utils";
import type { CartLine } from "@/types/cart";

interface CartItemRowProps {
  line: CartLine;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
  className?: string;
}

export function CartItemRow({ line, onRemove, onQuantityChange, className }: CartItemRowProps) {
  const imageSrc = getImageSrc(line.item.imageUrl);
  const subtotal = line.item.price * line.quantity;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl border border-[#e7dccd] bg-white/80 p-3 shadow-sm",
        className,
      )}
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
        <Image
          src={imageSrc}
          alt={line.item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#4c3823]">
            {line.item.name}
          </h3>
          {line.item.description && (
            <p className="text-xs text-[#9a8263] line-clamp-2">
              {line.item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <QuantitySelector quantity={line.quantity} onChange={onQuantityChange} />
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#b37944]">
              {formatCurrency(subtotal)}
            </span>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full border border-transparent text-[#c2aa8b] hover:border-[#e7dccd] hover:text-[#8f5827]"
              onClick={onRemove}
              aria-label={`Eliminar ${line.item.name}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
