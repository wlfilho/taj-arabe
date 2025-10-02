"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    clearCart,
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
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Carrinho de compras"
      onClick={() => toggleCart(false)}
    >
      <aside
        className="h-full w-full max-w-md overflow-y-auto border-l border-[#e7dccd] bg-[#fdf7ef] shadow-2xl transition-transform"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 flex items-center justify-between border-b border-[#e7dccd] bg-[#f6ecde]/90 px-6 py-5 backdrop-blur">
          <div>
            <h2 className="text-xl font-semibold text-[#4c3823]">
              Seu pedido
            </h2>
            <p className="text-sm text-[#9a8263]">
              {itemCount} item{itemCount === 1 ? "" : "s"} no carrinho
            </p>
          </div>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full border border-transparent text-[#c2aa8b] hover:border-[#d3a06f] hover:text-[#8f5827]"
            onClick={() => toggleCart(false)}
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </header>

        <div className="flex flex-col gap-4 px-6 py-6">
          {items.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#e7dccd] bg-white/80 p-8 text-center text-[#9a8263]">
              Seu carrinho está vazio. Adicione itens deliciosos ao pedido!
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

        <footer className="sticky bottom-0 mt-auto flex flex-col gap-4 border-t border-[#e7dccd] bg-[#f6ecde]/95 px-6 py-5 backdrop-blur-lg">
          <div className="flex items-center justify-between text-base">
            <span className="font-semibold text-[#9a8263]">
              Total
            </span>
            <span className="text-xl font-bold text-[#4c3823]">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-full border border-[#e7dccd] bg-white text-[#7d6446] hover:border-[#d3a06f] hover:text-[#b37944] sm:hidden"
              onClick={() => toggleCart(false)}
            >
              Continuar comprando
            </Button>
            <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearCart}
                disabled={!items.length}
              >
                Limpar
              </Button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-full bg-[#c08954] px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#b37944] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]",
                  !items.length && "pointer-events-none opacity-60",
                )}
              >
                Finalizar pedido
              </a>
            </div>
          </div>
        </footer>
      </aside>
    </div>
  );
}
