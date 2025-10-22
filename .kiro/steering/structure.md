# Project Structure & Architecture

## Directory Organization

### `/app` - Next.js App Router
- `layout.tsx` - Root layout with providers and metadata
- `page.tsx` - Main menu page (server component)
- `loading.tsx` - Loading skeleton
- `error.tsx` - Error boundary
- `providers.tsx` - Client-side providers wrapper
- `globals.css` - Global styles and Tailwind imports
- `/api` - API routes for data fetching and lead capture

### `/components` - React Components
- `/cart` - Shopping cart functionality (provider, sheet, items)
- `/layout` - Site-wide layout components (header, footer)
- `/menu` - Menu display components (categories, products, search)
- `/theme` - Theme switching functionality
- `/ui` - Reusable UI components (buttons, inputs)

### `/lib` - Utility Libraries
- `menu-service.ts` - Google Sheets data fetching with caching
- `config-service.ts` - Restaurant configuration management
- `csv.ts` - CSV parsing utilities
- `utils.ts` - Common utilities (cn, formatCurrency, URL validation)

### `/types` - TypeScript Definitions
- `menu.ts` - Menu item and category types
- `cart.ts` - Shopping cart types
- `config.ts` - Restaurant configuration types

### `/data` - Static Data
- `fallback-menu.ts` - Fallback menu data
- `fallback-config.ts` - Fallback configuration

## Architecture Patterns

### Server/Client Component Strategy
- **Server Components**: Data fetching, layout, static content
- **Client Components**: Interactive features (cart, theme, forms)
- Clear separation with "use client" directive

### State Management
- **Cart State**: React Context + useReducer with localStorage persistence
- **Theme State**: next-themes provider
- **Server State**: Next.js caching with unstable_cache

### Data Flow
1. Google Sheets → CSV export → Server-side parsing → Cached data
2. Client requests → API routes → Cached responses
3. Cart actions → Context updates → localStorage sync

### Styling Conventions
- **Tailwind Classes**: Utility-first approach
- **Color Palette**: Warm browns/beiges (`#f9f3ea`, `#4c3823`, `#c08954`)
- **Component Variants**: Defined in UI components (primary, secondary, ghost, outline)
- **Responsive Design**: Mobile-first with `sm:`, `lg:` breakpoints
- **Custom Utilities**: `.container-responsive` for consistent spacing

### File Naming
- **Components**: PascalCase (e.g., `MenuScreen`, `CartProvider`)
- **Files**: kebab-case (e.g., `menu-service.ts`, `cart-button.tsx`)
- **Types**: PascalCase interfaces/types
- **Constants**: UPPER_SNAKE_CASE

### Import Conventions
- Use `@/` path alias for absolute imports
- Group imports: React → Next.js → External → Internal
- Type-only imports with `type` keyword when applicable