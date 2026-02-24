# Hakim Health

Hakim is a full‑stack healthcare queue management platform built for Ethiopia. Patients book digital queue tokens, track their position in real time, and get emergency triage guidance without waiting rooms. Hospitals and admins get dashboards, analytics, and operational visibility. A Telegram bot supports OTP, booking, and notifications.

Hakim uses AI in two places:
- **Emergency triage**: symptoms → severity + guidance (web + bot)
- **Smart AI Doctor**: general health questions with safe fallback guidance

## Quick Start (Local)
```bash
bun install
bunx drizzle-kit migrate
bun run dev
```
Open http://localhost:3000

## Product Highlights
- Digital token booking with real‑time queue updates
- Multi‑hospital discovery with nearby lookup and region filters
- Emergency triage and AI guidance (web + bot)
- OTP‑based onboarding via Telegram
- Role‑based portals: Patient, Hospital Admin, Super Admin
- Hospital approval workflow and staff management
- Admin analytics with charts + export
- Waitlist email capture (Gmail app password)
- Telegram notifications for booking + “your turn” events

## Tech Stack
- Next.js 16 (App Router) + React 19
- TypeScript + Tailwind CSS + shadcn/ui
- Drizzle ORM + Neon Postgres
- Redis (Upstash REST)
- Telegram Bot (grammY)
- Recharts for analytics

## Environment Variables

Required:
```bash
# Database
DATABASE_URL=postgresql://...
DATABASE_URL_DIRECT=postgresql://...   # optional but recommended for direct connections

# JWT
JWT_SECRET=your-secret

# Redis (rate limiting, etc.)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

Telegram Bot:
```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_BOT_USERNAME=Hakim_bet_bot
TELEGRAM_WEBHOOK_URL=https://your-domain.vercel.app/api/webhook/telegram
SUPER_ADMIN_TELEGRAM_IDS=12345,67890
```

AI:
```bash
GEMINI_API_KEY=...
OPENAI_API_KEY=...
```

Waitlist Email (Gmail app password):
```bash
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FROM_NAME=Hakim
```

## Telegram Bot Setup (Production)
1. Deploy to Vercel (or any HTTPS host).
2. Set `TELEGRAM_WEBHOOK_URL` in env.
3. Register webhook:
   - `https://your-domain.vercel.app/api/webhook/telegram?register=true`

To check bot status:
```
GET /api/webhook/telegram
```

## Core Flows

**Patients**
- Sign up with phone + password → open bot → receive OTP → verify.
- Sign in with phone/email + password.
- Book token, track queue, get Telegram updates when serving.

**Hospital Admin**
- Register hospital → await approval → manage departments, queues, staff.
- Dashboard with appointments, serving actions, analytics.

**Super Admin**
- Approve hospitals, manage users, review appointments and audit logs.
- Analytics with charts and CSV export.

## Useful Scripts
```bash
# Seed a super admin (uses env vars if set)
bun run seed:superadmin

# Start only the bot
bun run bot
```

## API Notes (Selected)
- `GET /api/hospitals` supports pagination + filters: `page`, `limit`, `region`, `type`, `search`
- `GET /api/hospitals/[id]/departments` loads departments for a hospital
- `POST /api/queue/book` books a token (sends Telegram notification if linked)
- `POST /api/emergency/report` runs triage and logs emergency reports
- `POST /api/auth/login` accepts `{ email|phone, password }`
- `POST /api/auth/verify-otp` completes registration (stores password)

## Deployment
- Use any HTTPS host. Vercel recommended.
- Ensure the Telegram webhook is registered after deploy.
- Set all env vars in your hosting provider.

## License
Private. All rights reserved.
