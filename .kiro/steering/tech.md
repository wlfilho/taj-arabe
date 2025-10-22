# Technology Stack

## Core Framework
- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Turbopack** for fast development and builds

## Styling & UI
- **Tailwind CSS 4** (preview) for styling
- **next-themes** for light/dark theme management
- **Lucide React** for icons
- **clsx** and **tailwind-merge** for conditional styling

## Data & Integration
- **Google Sheets API** via CSV export for content management
- **Google Service Account** for lead capture functionality
- **WhatsApp Web API** for order completion

## Development Tools
- **ESLint** with Next.js configuration
- **PostCSS** for CSS processing
- Strict TypeScript configuration

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

### Environment Setup
```bash
npm install          # Install dependencies
cp .env.example .env.local  # Setup environment variables
```

## Key Environment Variables
- `NEXT_PUBLIC_SHEET_ID`: Google Sheets document ID
- `NEXT_PUBLIC_SHEET_GID`: Sheet tab identifier for menu data
- `NEXT_PUBLIC_CONFIG_GID`: Sheet tab identifier for configuration
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number for orders
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account for Sheets API
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: Private key for authentication

## Performance Considerations
- Uses `unstable_cache` for menu data with 30-minute revalidation
- Image optimization configured for Google Drive and Unsplash
- Client-side cart persistence with localStorage
- Server-side rendering for SEO optimization