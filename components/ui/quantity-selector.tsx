"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  className?: string;
}

export function QuantitySelector({
  quantity,
  min = 1,
  max = 99,
  onChange,
  className,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (quantity <= min) return;
    onChange(quantity - 1);
  };

  const increment = () => {
    if (quantity >= max) return;
    onChange(quantity + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#e7dccd] bg-white px-3 py-1 text-sm shadow-sm",
        className,
      )}
      role="group"
      aria-label="Cantidad"
    >
      <button
        type="button"
        onClick={decrement}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e7d6] text-[#9a8263] transition hover:bg-[#e8dcc7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f] disabled:opacity-50"
        aria-label="Disminuir cantidad"
        disabled={quantity <= min}
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <span className="min-w-[2ch] text-center text-base font-semibold text-[#4c3823]">
        {quantity}
      </span>
      <button
        type="button"
        onClick={increment}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c08954] text-white transition hover:bg-[#b37944] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f] disabled:opacity-50"
        aria-label="Aumentar cantidad"
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
