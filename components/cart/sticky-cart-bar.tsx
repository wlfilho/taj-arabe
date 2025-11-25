"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function StickyCartBar() {
    const { itemCount, total, toggleCart } = useCart();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e7dccd] bg-[#fdf7ef] px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="container-responsive flex items-center justify-between">
                <div className="flex flex-col">
                    {itemCount === 0 ? (
                        <span className="text-sm font-medium text-[#9a8263]">
                            Carrinho vazio
                        </span>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-xs text-[#9a8263]">Total</span>
                            <span className="text-lg font-bold text-[#4c3823]">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => toggleCart(true)}
                    className="flex items-center gap-2 rounded-full bg-[#c08954] px-4 py-2 text-white transition hover:bg-[#a37040] active:scale-95"
                    aria-label="Ver carrinho"
                >
                    <div className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <span className="text-sm font-medium">Ver carrinho</span>
                </button>
            </div>
        </div>
    );
}
