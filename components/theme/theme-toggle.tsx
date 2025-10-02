"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7dccd] bg-white shadow-sm"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#e7dccd] bg-white text-[#6a5336] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]"
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform group-hover:rotate-6" aria-hidden />
      ) : (
        <Moon className="h-5 w-5 transition-transform group-hover:-rotate-6" aria-hidden />
      )}
    </button>
  );
}
