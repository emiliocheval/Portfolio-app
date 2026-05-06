# Emil Conradsson — Portfolio

Personal portfolio and modular platform. Built with Next.js 16 App Router, React 19, and TypeScript. The site showcases projects, experience, and skills, and includes an embedded AI assistant module scoped to portfolio-relevant questions.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| Language | TypeScript 5 |
| Fonts | Geist Sans, Geist Mono |
| AI | Anthropic Claude (Haiku) via `@anthropic-ai/sdk` |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

## Getting started

```bash
npm install
npm run dev
Open http://localhost:3000.

Environment variables
Create a .env.local file at the project root:


ANTHROPIC_API_KEY=sk-ant-...
The key is only ever read server-side inside the Route Handler. It is never exposed to the browser.

Project structure

src/
├── app/                        # Next.js App Router
│   ├── api/
│   │   └── assistant/
│   │       └── route.ts        # POST /api/assistant — only Next.js boundary for the AI module
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── portfolio/              # Page section components (RSC by default)
│       ├── HeroSection.tsx
│       ├── FeaturedProjects.tsx
│       ├── SchoolProjects.tsx
│       ├── CoreSkills.tsx
│       ├── ExperienceSection.tsx
│       ├── ContactSection.tsx
│       ├── SiteHeader.tsx
│       ├── SiteFooter.tsx
│       └── ...
├── lib/
│   ├── portfolio-data.ts       # All portfolio content as typed data
│   └── tech-icons.tsx          # Icon map for tech tags
└── modules/
    └── assistant/              # Self-contained AI assistant module
        ├── service/            # Pure TypeScript — no Next.js, no React
        │   ├── types.ts
        │   ├── scope-config.ts
        │   ├── assistant-service.ts
        │   ├── guardrails/
        │   │   └── intent-filter.ts
        │   └── providers/
        │       └── anthropic.ts
        ├── components/         # Client Components for the chat UI
        │   ├── AssistantWidget.tsx
        │   ├── MessageBubble.tsx
        │   └── ChatInput.tsx
        └── hooks/
            └── useAssistant.ts
Module architecture
The project is structured as a modular platform. Each module is self-contained and follows the same pattern:


modules/<name>/
  service/      ← pure business logic, zero framework dependencies
  components/   ← React UI for this module only
  hooks/        ← React state and data-fetching hooks
The core app (app/, components/portfolio/) never imports directly from a module's service/ layer. The only integration point between a module and Next.js is a single Route Handler in app/api/.

This means:

The AI provider can be swapped without touching any UI code
Each module's logic is unit-testable in isolation
Future modules (blog, analytics, etc.) follow the same boundary rules
AI assistant data flow

AssistantWidget (Client Component)
  │  POST /api/assistant
  ▼
app/api/assistant/route.ts
  │
  ├── checkIntent()  →  403 if off-topic
  │
  └── AssistantService.chat()
        │
        └── LLMProvider.stream()  →  ReadableStream → Response
              │
              ▼
        useAssistant hook reads stream chunks
              │
              ▼
        Widget renders incrementally
The intent filter runs before any LLM call. Off-topic or blocked messages are rejected immediately with no API cost. The system prompt acts as a second guardrail inside the model itself.

Scripts

npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
Deployment
Deployed on Vercel. Set ANTHROPIC_API_KEY in your Vercel project environment variables under Settings → Environment Variables.
