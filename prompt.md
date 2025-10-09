# Contexto & Objetivo

Você é um desenvolvedor sênior. Construa uma **página de cardápio online**

A aplicação deve:

* Ser feita em **Next.js (App Router)**, **React**, **TypeScript** e **Tailwind CSS**.

* Ler **duas abas** de uma planilha do Google Sheets publicada (uma para **Cardápio**, outra para **Config do Negócio**).

* Permitir **busca**, **filtro por categoria**, **quantidade**, **observações** e um **carrinho**.

* Enviar o pedido via **WhatsApp** do negócio com mensagem pré-preenchida.

* Exibir informações do restaurante (nome, endereço, redes sociais etc.).

## Fonte de dados (Google Sheets)

A planilha publicada está em:

[https://docs.google.com/spreadsheets/d/e/2PACX-1vSwp-Mk8wlQit_esq70VfSZDGcw_EtaWvxZoekmsvB2mocUtQT60HXRc4qWGTIAkjbl71h4LVMEUFQo/pubhtml](https://docs.google.com/spreadsheets/d/e/2PACX-1vSwp-Mk8wlQit_esq70VfSZDGcw_EtaWvxZoekmsvB2mocUtQT60HXRc4qWGTIAkjbl71h4LVMEUFQo/pubhtml)

> **Instrução**: consumir como **CSV** (mais simples) trocando `pubhtml` por `pub?output=csv`. Suponha duas abas:

* **Aba 1 — Cardápio (menu)** com colunas:

`ID, Nome, Categoria, Descrição, Preço, Imagem URL, Disponível`

* **Aba 2 — Config (business)** com colunas:

`Restaurante, CNPJ, Telefone, Whatsapp, Endereço, Bairro, Cidade, Estado, Instagram, Facebook`

Crie duas variáveis de ambiente para os CSVs:

* `MENU_CSV_URL`

* `BUSINESS_CSV_URL`

(Se for a **mesma planilha** com abas diferentes, permita passar dois links CSV distintos via env.)

## Requisitos Funcionais

1. **Home / Cardápio**

* Header com **logo genérico** (placeholder), **nome do restaurante** (da planilha) e subtítulo curto.

* **Busca** por nome/descrição.

* **Chips de categoria** (inclua “Todos”). As categorias são derivadas dinamicamente da coluna `Categoria`.

* Lista de itens **agrupados por categoria** (como na imagem), cada cartão mostrando:

* Imagem (ou placeholder), `Nome`, `Descrição` (máx. 2–3 linhas), `Preço` em **BRL**, status **Disponível**.

* Botões: **“Opções”** (abre modal para observações) e **“+ Adicionar”** (com controle de quantidade).

* Se `Disponível = FALSE` (ou “Não”), desabilite o botão e indique “Indisponível”.

* **Carrinho flutuante** (ícone) que abre painel lateral com itens, quantidades, subtotal e **“Enviar pelo WhatsApp”**.

* **Rodapé** com **captura de e-mail** (placeholder), endereço, cidade/estado, links de Instagram/Facebook (da planilha) e nota legal com **CNPJ**.

2. **Carrinho & Envio por WhatsApp**

* Carrinho persiste no **localStorage**.

* Ao clicar “Enviar pelo WhatsApp”, gerar link:

`https://wa.me/<whatsapp_limpo>?text=<mensagem_url_encoded>`

* **Mensagem** (PT-BR) no formato:

```

Olá, gostaria de fazer um pedido:

Itens:

- {Qtd}x {Nome} — {PreçoUnitário BRL} [obs: {Observações?}]

...

Subtotal: {BRL}

Dados do cliente:

Nome: {input obrigatório}

Endereço/Entrega: {input opcional}

Observações gerais: {input opcional}

Enviado pelo cardápio online.

```

* Antes de abrir o link do WhatsApp, exibir um **modal de confirmação** com campos:

* Nome (obrigatório)

* Endereço (opcional)

* Observações do pedido (opcional)

3. **Formatações & Regras**

* `Preço` vem como texto/numérico. Normalize para **Number** e formate com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

* Campo `Disponível`: trate strings como “Sim/Não”, “TRUE/FALSE” e “1/0”.

* Campo `Whatsapp`: limpar para dígitos antes de montar `wa.me` (remover `+`, espaços e pontuação).

* **Acessibilidade**: roles/aria nos botões, foco visível, textos alternativos.

* **Responsivo** mobile-first, mantendo estética clean como a imagem.

4. **Estado & Dados**

* Fetch de CSV no **server** via **Route Handlers** (`/api/menu` e `/api/business`) com **cache** e `revalidate` (300s).

* Client consome esses endpoints via SWR/React Query ou fetch simples.

* Tipos **TypeScript** para segurança.

## Requisitos Não Funcionais

* Next.js App Router + TypeScript + Tailwind configurados.

* Zero libs pesadas extras; para CSV use `papaparse` (ou parse manual).

* Lighthouse bom em performance e acessibilidade.

* Código limpo, componentizado e testável.

---

# Arquitetura Sugerida

```

/app

/(site)/page.tsx

/api/menu/route.ts

/api/business/route.ts

/components

Header.tsx

CategoryChips.tsx

SearchBar.tsx

MenuSection.tsx // agrupa por categoria

MenuItemCard.tsx

OptionsModal.tsx // observações + quantidade

CartButton.tsx // ícone flutuante

CartDrawer.tsx // painel lateral do carrinho

ConfirmOrderModal.tsx

Footer.tsx

/lib

csv.ts // downloader + parser com cache

format.ts // BRL, phone/whatsapp sanitizer

types.ts // Tipos TS

/styles

globals.css

```

## Tipos TS

```ts

export type MenuRow = {

ID: string;

Nome: string;

Categoria: string;

Descrição: string;

Preço: number; // convertido

"Imagem URL"?: string;

Disponível: boolean;

};

export type BusinessConfig = {

Restaurante: string;

CNPJ?: string;

Telefone?: string;

Whatsapp: string;

Endereço?: string;

Bairro?: string;

Cidade?: string;

Estado?: string;

Instagram?: string;

Facebook?: string;

};

export type CartItem = {

id: string;

name: string;

unitPrice: number;

qty: number;

notes?: string;

category?: string;

imageUrl?: string;

};

```

## Endpoints

* `GET /api/menu`

Lê `process.env.MENU_CSV_URL`, baixa CSV, parseia para `MenuRow[]`, normaliza campos, retorna JSON com:

```json

{ "menu": MenuRow[], "categories": string[] }

```

* `GET /api/business`

Lê `process.env.BUSINESS_CSV_URL` e retorna `BusinessConfig`.

> Use `fetch(url, { next: { revalidate: 300 } })` para revalidação; trate erros com status 500 amigável.

## UI/UX (Tailwind)

* Paleta neutra clara, tipografia clean, cartões com bordas arredondadas e sombras suaves.

* **SearchBar**: input + ícone; debounce 250ms; busca por `Nome` e `Descrição`.

* **CategoryChips**: “Todos” + categorias únicas; estado ativo com bg destacado.

* **MenuSection**: título da categoria; grid de cards (1 col mobile, 2 col tablet, 3 col desktop).

* **MenuItemCard**:

* Imagem quadrada (aspect-square), fallback via pattern/ícone.

* Nome (semibold), descrição (line-clamp-3), preço BRL, badges (ex.: “Chef”, se desejar extensível).

* Botões:

* **Opções** → `OptionsModal` com textarea “Observações” + stepper de quantidade (mín. 1).

* **+ Adicionar** (se indisponível → disabled com tooltip “Indisponível”).

* **CartButton**: badge com total de itens e subtotal.

* **CartDrawer**:

* Lista com +/− quantidade, remover item.

* Subtotal BRL e CTA **“Enviar pelo WhatsApp”**.

* **ConfirmOrderModal**: inputs (Nome obrigatório), gera mensagem e abre `window.open(waLink)`.

## Lógica do WhatsApp

* Sanitizar `Whatsapp` da `BusinessConfig` para dígitos.

* Montar texto:

```

Olá, gostaria de fazer um pedido:

Itens:

- 2x Esfiha Aberta de Carne — R$ 8,00 [obs: sem limão]

- 1x Beirute de Frango — R$ 36,00

Subtotal: R$ 52,00

Dados do cliente:

Nome: William

Endereço/Entrega: Rua Exemplo, 123 - Centro

Observações gerais: Deixar na portaria.

Enviado pelo cardápio online.

```

* `encodeURIComponent` em todo o texto.

* Abrir: `https://wa.me/${whatsSanitized}?text=${encoded}`.

## Tratamento de Dados da Planilha

* `Preço`: aceitar `8`, `8.00`, `R$ 8,00`, `8,00`. Normalize para `number`.

* `Disponível`: aceitar `Sim/Não`, `TRUE/FALSE`, `1/0`.

* Remover linhas sem `ID` ou `Nome`.

* Agrupar por `Categoria` **preservando** a ordem original de primeira aparição.

## Acessibilidade & Variações

* `aria-label`s nos botões, foco visível, `alt` nas imagens.

* Se `Imagem URL` quebrar, use fallback.

* Se planilha estiver fora do ar, mostre estado de erro e retry.

## Configuração & Build

* Criar projeto com `create-next-app` (TS) + Tailwind.

* Variáveis de ambiente:

* `MENU_CSV_URL="https://docs.google.com/.../pub?output=csv"`

* `BUSINESS_CSV_URL="https://docs.google.com/.../pub?output=csv"`

* Rodar `npm run dev`.

* Deploy (ex.: Vercel). Configure envs no projeto.

---

# Critérios de Aceite

* [ ] Busca e filtro por categoria funcionando (inclui “Todos”).

* [ ] Cards exibem nome, descrição, preço BRL, imagem/fallback e estado de disponibilidade.

* [ ] “Opções” abre modal para observações e quantidade.

* [ ] “+ Adicionar” coloca item no carrinho com qty e notes.

* [ ] Carrinho persiste no localStorage, mostra subtotal BRL e permite editar/remover.

* [ ] “Enviar pelo WhatsApp” abre conversa com mensagem formatada corretamente e número do negócio vindo da planilha.

* [ ] Header e footer exibem dados do restaurante (endereço, cidade/estado, CNPJ, redes).

* [ ] Tudo responsivo e acessível; Lighthouse ok.

---

# Extras (se couber tempo)

* Badge “Promo” se preço abaixo de um limiar.

* Indicador de “Aberto/Fechado” com base em horário fixo (config futura).

* Campo de cupom no rodapé (apenas UI).

> **Entregue o código completo**, pronto para rodar, com instruções rápidas no README sobre como preencher as envs com os links CSV das abas corretas da planilha.
