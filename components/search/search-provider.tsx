"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SearchContextValue {
  search: string;
  setSearch: (value: string) => void;
  isSearchOpen: boolean;
  toggleSearch: (open?: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");

  const toggleSearch = (open?: boolean) => {
    setIsSearchOpen((prev) => (open !== undefined ? open : !prev));
  };

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        isSearchOpen,
        toggleSearch,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}

