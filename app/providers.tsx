"use client";

import { CartProvider } from "@/components/cart/cart-provider";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ThemeProvider } from "@/components/theme/theme-provider";
import type { SiteConfigWithComputed } from "@/types/config";
import type { PropsWithChildren } from "react";

type ProvidersProps = PropsWithChildren<{ config: SiteConfigWithComputed }>;

export function Providers({ children, config }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider whatsappNumber={config.whatsapp} restaurantName={config.restaurantName}>
        {children}
        <CartSheet />
      </CartProvider>
    </ThemeProvider>
  );
}
