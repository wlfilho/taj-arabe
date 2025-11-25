"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import { CartButton } from "@/components/cart/cart-button";
import { SearchBarHeader } from "@/components/search/search-bar-header";
import { useSearch } from "@/components/search/search-provider";
import { getImageSrc } from "@/lib/utils";
import type { SiteConfigWithComputed } from "@/types/config";

import { CategoryTabs } from "@/components/menu/category-tabs";

interface SiteHeaderProps {
  config: SiteConfigWithComputed;
  categories?: string[];
}

export function SiteHeader({ config, categories = [] }: SiteHeaderProps) {
  const whatsappLink = config.whatsappLink;
  const { toggleSearch, activeCategory, setActiveCategory } = useSearch();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);

    if (category === "Todos") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(`categoria-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="z-40 bg-[#fdf7ef]">
        <div className="border-b border-[#f0e3d0] bg-[#f4e8d8]">
          <div className="container-responsive flex items-center justify-between py-2 text-sm text-[#7d6446]">
            <div className="flex items-center gap-2 rounded-full bg-[#e9dcc9] px-3 py-1 text-xs font-semibold text-[#4f3b27]">
              <span className="h-2 w-2 rounded-full bg-[#33c24d]" aria-hidden />
              Abierto hasta las 23h
            </div>
            <div className="flex items-center gap-2">
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white shadow-sm transition hover:bg-[#1ebe57]"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hablar por WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path
                      fill="currentColor"
                      d="M20.52 3.48A11.78 11.78 0 0 0 12.05 0 11.9 11.9 0 0 0 0 12a11.67 11.67 0 0 0 1.8 6.18L0 24l6.45-1.69A12 12 0 0 0 12 24h.05A11.9 11.9 0 0 0 24 12a11.77 11.77 0 0 0-3.48-8.52ZM12 21.9a9.94 9.94 0 0 1-5.07-1.4l-.36-.21-3.83 1 1.02-3.73-.24-.38A9.9 9.9 0 0 1 2.1 12 9.94 9.94 0 0 1 12 2.1 9.9 9.9 0 0 1 22 12c0 5.46-4.47 9.9-10 9.9Zm5.47-7.54c-.3-.15-1.7-.84-1.96-.94s-.45-.15-.64.15-.74.94-.91 1.13-.33.2-.62.05-1.23-.45-2.34-1.43a8.7 8.7 0 0 1-1.61-2c-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5a1 1 0 0 0 .29-.48c.1-.19.05-.36-.02-.51s-.64-1.54-.88-2.11c-.23-.55-.47-.48-.64-.49l-.56-.01c-.19 0-.5.07-.76.36s-1 1-1 2.43 1.02 2.82 1.16 3.01c.14.19 2 3.17 4.85 4.45a7.7 7.7 0 0 0 1.62.61 4.8 4.8 0 0 0 1.79.12c.55-.08 1.7-.69 1.94-1.36s.24-1.26.17-1.36-.26-.17-.55-.32Z"
                    />
                  </svg>
                </a>
              ) : null}
              <CartButton />
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#efe3d2] bg-[#fdf7ef]">

        <div className="container-responsive flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-4">
            {config.logoUrl && config.logoUrl.trim() ? (
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white">
                <img
                  src={config.logoUrl}
                  alt={config.restaurantName}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2debe] text-2xl">
                🍽️
              </span>
            )}
            <h1 className="text-2xl font-semibold text-[#4c3823]">
              {config.restaurantName || "Restaurante"}
            </h1>
          </Link>
        </div>

        <div className="container-responsive pb-2">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelect={handleCategoryClick}
            onSearchClick={() => toggleSearch()}
          />
        </div>

        <SearchBarHeader />
      </header>
    </>
  );
}
