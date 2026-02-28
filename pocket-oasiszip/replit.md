# Pocket Oasis

A gamified, cyberpunk-themed life simulation app built with React and powered by xAI's Grok API.

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS (CDN)
- **Backend**: Express server (serves Vite in middleware mode)
- **Build Tool**: Vite
- **AI**: xAI Grok API via OpenAI SDK (`openai` package)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure
- `server/index.js` — Express server with API routes, serves Vite in middleware mode on port 5000
- `index.html` — HTML entry point
- `index.tsx` — React mount point
- `App.tsx` — Root component, state management, routing
- `components/` — UI components (Hub, ZoneView, AvatarCreator, etc.)
- `services/geminiService.ts` — AI service (uses Grok API despite the filename)
- `types.ts` — TypeScript type definitions
- `vite.config.ts` — Vite configuration

## API Routes
- `POST /api/verify-admin` — Server-side admin password verification for restricted usernames

## Environment Variables
- `XAI_API_KEY` — xAI API key for Grok (required, set as Replit secret)
- `VITE_ADMIN_PASSWORD` — Admin password for restricted name "General" (server-side only, never sent to browser)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key for payments
- `VITE_STRIPE_PRICE_ID` — Stripe price ID for Rook unlock
- `STRIPE_SECRET_KEY` — Stripe secret key

## Running
- `npm run dev` starts the Express server with Vite middleware on port 5000

## Notes
- Originally built for Google AI Studio with Gemini; migrated to xAI Grok API
- Text-to-speech feature (previously via Gemini) is not available with Grok — the functions are stubbed out
- Tailwind CSS is loaded via CDN, not as a build dependency
- The name "General" is admin-restricted; password check happens server-side for security
- AI companion personalities have detailed profiles in services/geminiService.ts
