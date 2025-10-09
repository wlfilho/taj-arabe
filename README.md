# Cardápio Digital Lilica

Aplicação completa de cardápio digital construída com Next.js 15 (App Router), React 19 e Tailwind CSS. O conteúdo é abastecido automaticamente a partir de uma planilha do Google Sheets, permitindo edição dinâmica dos itens sem necessidade de deploy.

## ✨ Funcionalidades
- Organização dos produtos por categorias com navegação rápida
- Busca em tempo real por nome, descrição ou categoria
- Cards responsivos com imagens otimizadas e estado de disponibilidade
- Visualização detalhada do produto com seleção de quantidade
- Carrinho persistente com ajuste de quantidades, remoção e cálculo automático do total
- Botão "Finalizar pedido" que gera mensagem formatada para WhatsApp
- Informações do restaurante (nome, contato, redes) carregadas da aba "Configurações"
- Destaque das categorias servidas diretamente da planilha
- Formulário de cupom que envia leads para a aba "Leads" no Google Sheets
- Tema claro/escuro com armazenamento de preferência
- Loading states, tratamento de erros e design mobile-first com animações sutis
- SEO básico (Open Graph/Twitter) e acessibilidade com ARIA labels

## 🛠️ Stack e integrações
- [Next.js 15](https://nextjs.org/) + App Router
- [React 19](https://react.dev/) com componentes server/client
- [Tailwind CSS 4 (preview)](https://tailwindcss.com/) para estilização
- [next-themes](https://github.com/pacocoursey/next-themes) para controle de tema
- Google Sheets como CMS via exportação CSV pública (`gviz/tq?tqx=out:csv`)

## 🚀 Execução local
1. **Instale as dependências**
   ```bash
   npm install
   ```
2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   Ajuste os valores conforme necessário:
   - `NEXT_PUBLIC_SHEET_ID`: ID da planilha (entre `/d/` e `/edit` na URL)
   - `NEXT_PUBLIC_SHEET_GID`: identificador da aba do cardápio (padrão `0`)
   - `NEXT_PUBLIC_CONFIG_GID`: identificador da aba "Configurações"
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: número com DDI no formato `5588999999999`
   - (Opcional) `NEXT_PUBLIC_SHEET_URL` / `NEXT_PUBLIC_CONFIG_URL` caso deseje informar o CSV completo

   Para salvar os leads diretamente na aba "Leads", configure também:

   - `GOOGLE_SHEETS_ID`: mesmo ID da planilha (ou deixe vazio para usar o valor acima)
   - `GOOGLE_LEADS_RANGE`: intervalo onde os dados serão gravados (ex.: `Leads!A:C`)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` e `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: credenciais da conta de serviço com permissão de edição na planilha

   > 💡 Compartilhe a planilha com o e-mail da conta de serviço para permitir a escrita.
3. **Rode o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

### Scripts úteis
- `npm run dev`: start em modo desenvolvimento (Turbopack)
- `npm run build`: build de produção
- `npm run start`: serve do build
- `npm run lint`: checagem de lint (ESLint + TypeScript)

## 🧱 Estrutura principal
```
app/
  layout.tsx        # Layout raiz com providers e metadados
  page.tsx          # Página do cardápio (server component)
  loading.tsx       # Skeleton de carregamento
  error.tsx         # Boundary de erro
  api/menu/route.ts # Endpoint cacheado com os dados do Google Sheets
  api/leads/route.ts# Endpoint para registrar leads na aba "Leads"
components/
  cart/             # Contexto, sheet e componentes do carrinho
  layout/           # Header, footer e formulário de cupom
  menu/             # Seções, cards, diálogo de detalhes e UI de busca/filtro
  theme/            # Controle de tema claro/escuro
  ui/               # Botões, inputs e utilidades compartilhadas
lib/
  config-service.ts # Fetch + parse da aba "Configurações"
  menu-service.ts   # Fetch + parse da planilha com cache
  utils.ts          # Helpers de classe e formatação monetária
  csv.ts            # Utilitários para parse de CSV
types/
  menu.ts           # Tipagens de itens/categorias
  cart.ts           # Tipagens do carrinho
  config.ts         # Tipagens das configurações do restaurante
```

## 🧾 Google Sheets
O serviço em `lib/menu-service.ts` busca os dados via CSV público da planilha. Espera-se a seguinte estrutura de colunas:

| Coluna        | Descrição                                            |
| ------------- | ---------------------------------------------------- |
| `ID`          | Identificador único do item (string)                 |
| `Nome`        | Nome amigável do produto                             |
| `Categoria`   | Categoria à qual o item pertence                     |
| `Descrição`   | Texto descritivo opcional                            |
| `Preço`       | Valor numérico (pode conter `R$`, `.` e `,`)        |
| `Imagem URL`  | URL absoluta para a imagem do produto                |
| `Disponível`  | `Sim/Não`, `True/False` ou `1/0` para disponibilidade |

Linhas sem `ID` terão um identificador gerado automaticamente. Valores vazios em `Disponível` são considerados disponíveis.

### Aba "Configurações"

| Coluna         | Descrição                              |
| -------------- | -------------------------------------- |
| `Restaurante`  | Nome exibido no cabeçalho e rodapé     |
| `CNPJ`         | Documento para referência              |
| `Telefone`     | Telefone fixo do estabelecimento       |
| `Whatsapp`     | Número usado no checkout e rodapé      |
| `Endereço`     | Logradouro                             |
| `Bairro`       | Bairro                                 |
| `Cidade`       | Cidade                                 |
| `Estado`       | UF                                     |
| `Instagram`    | URL do perfil                          |
| `Facebook`     | URL da página                          |

### Aba "Leads"

Configure a primeira linha da aba com pelo menos as colunas `Timestamp`, `Nome` e `Email`. O endpoint `POST /api/leads` adicionará automaticamente novas linhas com data ISO, nome e e-mail de cada visitante inscrito.


