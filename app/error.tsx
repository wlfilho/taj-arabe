"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Error en la página del menú", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9f3ea] px-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-[#4c3823]">
          Tuvimos un problema al cargar el menú
        </h1>
        <p className="text-sm text-[#9a8263]">
          No te preocupes, el equipo ya fue notificado. Intenta recargar la página o vuelve en unos momentos.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>Intentar nuevamente</Button>
          <Button
            variant="outline"
            onClick={() => window.location.assign("mailto:contato@restaurante-lilica.com")}
          >
            Hablar con soporte
          </Button>
        </div>
      </div>
    </div>
  );
}
