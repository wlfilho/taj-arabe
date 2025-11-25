"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useSearch } from "./search-provider";

export function SearchBarHeader() {
  const { search, setSearch, isSearchOpen, toggleSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchOpen) {
        toggleSearch(false);
        setSearch("");
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSearchOpen && !target.closest("[data-search-bar]")) {
        toggleSearch(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, toggleSearch, setSearch]);

  if (!isSearchOpen) {
    return null;
  }

  return (
    <div
      data-search-bar
      className="animate-in slide-in-from-top-2 fade-in-0 border-b border-[#e7dccd] bg-[#f6ecde]/95 backdrop-blur-lg duration-200"
    >
      <div className="container-responsive py-4">
        <div className="relative flex items-center gap-3">
          <div className="relative flex flex-1 items-center overflow-hidden rounded-full border border-[#e7dccd] bg-white shadow-sm transition focus-within:border-[#d3a06f] focus-within:ring-2 focus-within:ring-[#f0e1cb]">
            <Search className="ml-4 h-5 w-5 text-[#c2aa8b]" aria-hidden />
            <Input
              ref={inputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar platos, ingredientes o bebidas..."
              className="border-none bg-transparent px-3 py-3 text-base text-[#6d5334] placeholder:text-[#b9a289] focus-visible:ring-0"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-[#c2aa8b] transition hover:bg-[#f0e1cb] hover:text-[#8f5827]"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              toggleSearch(false);
              setSearch("");
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7dccd] bg-white text-[#c2aa8b] transition hover:border-[#d3a06f] hover:text-[#8f5827]"
            aria-label="Cerrar búsqueda"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

