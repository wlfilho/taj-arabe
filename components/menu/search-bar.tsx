"use client";

import { Search } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex items-center overflow-hidden rounded-[24px] border border-[#e7dccd] bg-white shadow-sm transition focus-within:border-[#d3a06f] focus-within:ring-2 focus-within:ring-[#f0e1cb]",
        className,
      )}
    >
      <Search className="ml-4 h-5 w-5 text-[#c2aa8b] transition group-focus-within:text-[#b37944]" aria-hidden />
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar platos..."
        className="border-none bg-transparent pl-3 pr-14 text-base text-[#6d5334] placeholder:text-[#b9a289] focus-visible:ring-0"
      />
      <span className="pointer-events-none absolute right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#d8c2a7] text-white">
        <Search className="h-4 w-4" aria-hidden />
      </span>
    </label>
  );
}
