import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getSiteConfig } from "@/lib/config-service";
import { cn } from "@/lib/utils";

import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultDescription =
  "Explore nosso cardápio digital com categorias, busca, carrinho e envio rápido pelo WhatsApp.";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const restaurantName = config.restaurantName || "Cardápio";

  return {
    metadataBase: new URL("https://cardapio.example.com"),
    title: {
      default: restaurantName,
      template: `%s · ${restaurantName}`,
    },
    description: defaultDescription,
    keywords: [
      "cardápio digital",
      restaurantName,
      "restaurante",
      "next.js",
      "tailwind",
      "whatsapp",
    ],
    authors: [{ name: restaurantName }],
    creator: restaurantName,
    openGraph: {
      title: restaurantName,
      description: defaultDescription,
      type: "website",
      locale: "pt_BR",
      url: "https://cardapio.example.com",
      siteName: restaurantName,
      images: [
        {
          url: "/og-cardapio.png",
          width: 1200,
          height: 630,
          alt: `Cardápio digital ${restaurantName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: restaurantName,
      description: defaultDescription,
      images: ["/og-cardapio.png"],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }, { media: "(prefers-color-scheme: light)", color: "#fafaf9" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-[#f9f3ea] text-[#4c3823] antialiased transition-colors duration-300 selection:bg-[#f0e1cb] selection:text-[#4c3823]",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <Providers config={config}>{children}</Providers>
      </body>
    </html>
  );
}
