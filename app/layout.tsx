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
  "Explora nuestro menú digital con categorías, búsqueda, carrito y envío rápido por WhatsApp.";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const restaurantName = config.restaurantName || "Menú";

  return {
    metadataBase: new URL("https://taj-arabe.vercel.app"),
    title: {
      default: restaurantName,
      template: `%s · ${restaurantName}`,
    },
    description: defaultDescription,
    keywords: [
      "menú digital",
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
      locale: "es_CO",
      url: "https://taj-arabe.vercel.app",
      siteName: restaurantName,
      images: [
        {
          url: "/images/logo-tajarabe.png",
          width: 1200,
          height: 630,
          alt: `Menú digital ${restaurantName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: restaurantName,
      description: defaultDescription,
      images: ["/images/logo-tajarabe.png"],
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
    <html lang="es-CO" suppressHydrationWarning>
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
