"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";

import { CartItemRow } from "./cart-item-row";
import { useCart } from "./cart-provider";

export function CartSheet() {
  const {
    items,
    isOpen,
    itemCount,
    total,
    toggleCart,
    updateQuantity,
    removeItem,
    buildWhatsAppLink,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleCart(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, toggleCart]);

  if (!isOpen) {
    return null;
  }

  const whatsappLink = buildWhatsAppLink();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
      onClick={() => toggleCart(false)}
    >
      <div
        className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#e7dccd] bg-[#fdf7ef] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[#e7dccd] bg-[#f6ecde]/90 px-6 py-5 backdrop-blur">
          <div>
            <h2 className="text-xl font-semibold text-[#4c3823]">
              Tu pedido
            </h2>
            <p className="text-sm text-[#9a8263]">
              {itemCount} artículo{itemCount === 1 ? "" : "s"} en el carrito
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleCart(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#6a5336] shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="flex max-h-[50vh] flex-col gap-4 overflow-y-auto px-6 py-6">
          {items.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#e7dccd] bg-white/80 p-8 text-center text-[#9a8263]">
              Tu carrito está vacío. ¡Agrega deliciosos artículos a tu pedido!
            </div>
          )}

          {items.map((line) => (
            <CartItemRow
              key={line.item.id}
              line={line}
              onRemove={() => removeItem(line.item.id)}
              onQuantityChange={(quantity) => updateQuantity(line.item.id, quantity)}
            />
          ))}
        </div>

        <footer className="flex items-center justify-between border-t border-[#e7dccd] bg-[#f6ecde]/95 px-6 py-5 backdrop-blur-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#9a8263]">
              Total
            </span>
            <span className="text-2xl font-bold text-[#4c3823]">
              {formatCurrency(total)}
            </span>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 rounded-full bg-[#c08954] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#b37944] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]",
              !items.length && "pointer-events-none opacity-60",
            )}
          >
            Finalizar pedido
          </a>
        </footer>
      </div>
    </div>
  );
}
