import Link from "next/link";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

import type { SiteConfigWithComputed } from "@/types/config";

interface SiteFooterProps {
  config: SiteConfigWithComputed;
}

export function SiteFooter({ config }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    {
      href: config.whatsappLink,
      label: "WhatsApp",
      icon: MessageCircle,
    },
    {
      href: config.instagram,
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: config.facebook,
      label: "Facebook",
      icon: Facebook,
    },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="border-t border-[#efe3d2] bg-[#f6ecde] py-6 text-sm text-[#9a8263]">
      <div className="container-responsive flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-[#6d5334]">{config.restaurantName}</p>
          <p>{config.formattedAddress || "Dirección informada pronto"}</p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <div className="flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7dccd] bg-white text-[#7d6446] shadow-sm transition hover:border-[#d3a06f] hover:text-[#b37944]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </Link>
            ))}
          </div>
          <p>&copy; {year} {config.restaurantName}. Hecho para saborear buenos momentos.</p>
        </div>
      </div>
    </footer>
  );
}
