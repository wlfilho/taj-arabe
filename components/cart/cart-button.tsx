"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCart } from "./cart-provider";

export function CartButton() {
  const { itemCount, toggleCart } = useCart();

  return (
    <Button
      variant="ghost"
      className="relative h-10 w-10 rounded-full border border-[#e7dccd] bg-white/90 p-0 text-[#6a5336] shadow-sm hover:border-[#d3a06f] hover:text-[#b37944]"
      onClick={() => toggleCart(true)}
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="h-5 w-5" aria-hidden />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c08954] px-1 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Button>
  );
}
