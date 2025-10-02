"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LeadFormProps {
  sheetCity?: string;
}

export function LeadForm({ sheetCity }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
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
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar lead");
      }

      setStatus("success");
      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-[#e7dccd] bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-[#4c3823]">Ganhe um cupom de desconto</h3>
          <p className="text-sm text-[#9a8263]">
            Cadastre-se para receber novidades e promoções exclusivas
            {sheetCity ? ` em ${sheetCity}` : ""}.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Seu e-mail"
            required
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Quero meu cupom"}
          </Button>
        </form>
      </div>
      {status === "success" ? (
        <p className="mt-4 text-sm font-medium text-[#4f3b27]">
          Obrigado! Em breve você receberá seu cupom especial.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 text-sm text-[#c76959]">
          Não foi possível cadastrar agora. Tente novamente em instantes.
        </p>
      ) : null}
    </section>
  );
}
