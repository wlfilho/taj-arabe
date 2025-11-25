"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn, formatCurrency, getImageSrc } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

interface ProductDetailDialogProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function ProductDetailDialog({ item, onClose, onAddToCart }: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item?.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (item) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const imageSrc = getImageSrc(item.imageUrl);
  const subtotal = formatCurrency(item.price * quantity);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6 pt-10 sm:items-center sm:pb-16"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles del producto ${item.name}`}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#e7dccd] bg-[#fdf7ef] shadow-2xl transition-transform",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#6a5336] shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]"
          aria-label="Cerrar detalles"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            sizes="(min-width: 768px) 640px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center rounded-full bg-[#f0e1cb] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b08a5e]">
              {item.category}
            </span>
            <h3 className="text-2xl font-semibold text-[#4c3823]">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm leading-relaxed text-[#9a8263]">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-[#9a8263]">
                Subtotal
              </span>
              <span className="text-2xl font-semibold text-[#b37944]">
                {subtotal}
              </span>
            </div>
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
          </div>
          <Button
            className="h-12 text-base"
            onClick={() => onAddToCart(item, quantity)}
            disabled={!item.available}
          >
            {item.available ? "Agregar al pedido" : "Producto no disponible"}
          </Button>
        </div>
      </div>
    </div>
  );
}
