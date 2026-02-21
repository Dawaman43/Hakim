# Hakim Health

Hakim is a healthcare queue management platform for Ethiopia. Patients can book queue tokens, receive real‑time updates, and get emergency guidance without standing in line.

## Features
- Digital token booking
- Real‑time queue status
- SMS‑friendly flows
- Emergency triage guidance
- Multi‑hospital discovery

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Drizzle ORM + Neon Postgres
- Upstash Redis (REST)

## Getting Started

Install dependencies:
```bash
bun install
```

Set environment variables in `.env`:
```bash
# Neon Postgres
DATABASE_URL=postgresql://...?

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://....upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

Run migrations:
```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

Seed hospitals (mock data):
```bash
bunx tsx src/scripts/seed-hospitals.ts
```

Start dev server:
```bash
bun run dev
```

Open http://localhost:3000

## API Notes
- `GET /api/hospitals` supports pagination and filters:
  - `page`, `limit`, `region`, `type`, `search`
- `GET /api/hospitals/[id]/departments` fetches departments for a hospital.

## License
Private. All rights reserved.
