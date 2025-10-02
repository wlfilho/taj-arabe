"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Erro na página do cardápio", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9f3ea] px-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-[#4c3823]">
          Tivemos um problema ao carregar o cardápio
        </h1>
        <p className="text-sm text-[#9a8263]">
          Não se preocupe, o time já foi notificado. Tente recarregar a página ou volte em instantes.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>Tentar novamente</Button>
          <Button
            variant="outline"
            onClick={() => window.location.assign("mailto:contato@restaurante-lilica.com")}
          >
            Falar com o suporte
          </Button>
        </div>
      </div>
    </div>
  );
}
