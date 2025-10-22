"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LeadFormProps {
  sheetCity?: string;
}

export function LeadForm({ sheetCity }: LeadFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      setStatus("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus("idle");

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, whatsapp }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar lead");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setWhatsapp("");

      // Fechar o modal após 2 segundos
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="rounded-3xl border border-[#e7dccd] bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[#4c3823]">Ganhe um cupom de desconto</h3>
            <p className="text-sm text-[#9a8263]">
              Cadastre-se para receber novidades e promoções exclusivas
              {sheetCity ? ` em ${sheetCity}` : ""}.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full md:w-auto"
          >
            Quero meu cupom
          </Button>
        </div>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Formulário de cupom de desconto"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e7dccd] bg-[#fdf7ef] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#6a5336] shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a06f]"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <div className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-[#4c3823]">
                  Ganhe um cupom de desconto
                </h3>
                <p className="text-sm text-[#9a8263]">
                  Preencha seus dados para receber novidades e promoções exclusivas
                  {sheetCity ? ` em ${sheetCity}` : ""}.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#4c3823]">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#4c3823]">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="whatsapp" className="text-sm font-medium text-[#4c3823]">
                    WhatsApp
                  </label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                {status === "success" && (
                  <p className="text-sm font-medium text-green-700">
                    ✓ Obrigado! Em breve você receberá seu cupom especial.
                  </p>
                )}

                {status === "error" && (
                  <p className="text-sm text-[#c76959]">
                    Não foi possível cadastrar agora. Tente novamente em instantes.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 text-base"
                >
                  {isSubmitting ? "Enviando..." : "Cadastrar e ganhar cupom"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
