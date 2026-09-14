# CH Nexus

Public website for the CH Nexus ecosystem — links out to **Nexus Services**
(`services.chnexus.net`), **Nexus Hosting** (`panel.chnexus.net`), and **MABU**
(the CH Nexus cyber security team) — plus an admin panel for the contact
inbox, site announcements, and homepage settings.

Stack: Next.js (App Router) + TypeScript + Tailwind, PostgreSQL via Prisma,
Redis for rate limiting, hand-rolled session auth with TOTP (MFA).

## One-shot VPS setup (recommended)

On a fresh Ubuntu Server 26.04 LTS box, with DNS for your domain already
pointed at the server's IP:

```bash
git clone https://github.com/chuddyofficial/chnexus.git
cd chnexus
chmod +x setup.sh
sudo ./setup.sh chnexus.net you@example.com
```

This single script:
1. Installs Docker Engine + Compose plugin (if missing)
2. Installs nginx + certbot (if missing)
3. Generates `.env` with fresh random secrets (if it doesn't already exist)
4. Builds and starts the app, Postgres, and Redis containers
5. Runs Prisma migrations
6. Seeds the first admin account — prompts for a password, prints a TOTP
   QR/otpauth URL to scan into an authenticator app immediately (it is not
   shown again)
7. Configures nginx as a reverse proxy on the domain
8. Requests a Let's Encrypt certificate via certbot

It's safe to re-run — every step skips itself if already done, so you can
also use it after a fresh `git pull` to pick up dependency/infra changes.

To just ship new code after that (no infra changes):

```bash
git pull
docker compose up -d --build
docker compose --profile tools run --rm migrator npx prisma migrate deploy
```

## Manual setup (if you don't want the script)

Requires Docker and the Docker Compose plugin installed on the server.

```bash
git clone https://github.com/chuddyofficial/chnexus.git
cd chnexus
cp .env.example .env
```

Edit `.env` and set real values:
- `POSTGRES_PASSWORD` — a strong random value (Compose uses this for both the Postgres container and the app's `DATABASE_URL`)
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `IP_HASH_SALT` — generate with `openssl rand -hex 16`
- `NEXTAUTH_URL` — your real domain, e.g. `https://chnexus.net`
- `RESEND_API_KEY` — from [resend.com](https://resend.com) after verifying your sending domain; required for admin replies in the contact inbox to actually email people (see "Email replies" below)

Start everything:

```bash
docker compose up -d --build
```

Run migrations and create the first admin account (via the dedicated
`migrator` image, which — unlike the slim `app` image — has the full Prisma
CLI):

```bash
docker compose --profile tools run --rm migrator npx prisma migrate deploy
docker compose --profile tools run --rm \
  -e SEED_ADMIN_EMAIL=you@example.com -e SEED_ADMIN_PASSWORD=changeme \
  migrator npm run db:seed
```

Sign in at `/admin/login`. Put this behind a reverse proxy (nginx/Caddy) with
TLS for the real domain — the app itself only listens on `127.0.0.1:3000`.

## Local development

Needs a local Postgres + Redis. Easiest with Docker:

```bash
docker compose up -d postgres redis
```

Then:

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Admin panel

- `/admin/login` — email + password, then a TOTP code
- `/admin` — overview stats
- `/admin/submissions` — contact form inbox
- `/admin/announcements` — site-wide banner messages
- `/admin/settings` — override service URLs and the homepage tagline without redeploying
- `/admin/admins` — **superadmin only**: create/deactivate admin accounts, reset another admin's MFA
- `/admin/audit-log` — **superadmin only**: the last 200 recorded admin actions (logins, MFA resets, setting changes, etc.)

The first admin account is seeded directly (`npm run db:seed`, or via
`setup.sh`) as a **superadmin** — there is no public sign-up. Additional
admin accounts (regular `ADMIN` or another `SUPERADMIN`) are created from
`/admin/admins` by an existing superadmin, who is shown a one-time TOTP QR
code for the new account.

## Email replies

Opening a submission in `/admin/submissions` and clicking **Reply** sends a
real email to the person who submitted the contact form, via
[Resend](https://resend.com):

1. Sign up at resend.com and add `chnexus.net` under **Domains** — it gives
   you DNS records (MX/TXT/CNAME) to add wherever you manage DNS for the
   domain. Verification can take a few minutes to a few hours.
2. Create an API key under **API Keys** (sending access is enough).
3. Add it to `.env` on the server as `RESEND_API_KEY="re_..."` and restart
   the app (`docker compose up -d --build app`).

Replies are sent from `support@chnexus.net`. Every reply attempt (success or
failure) is stored against the submission and shown in its reply thread in
the admin panel, and logged to the audit log. Without `RESEND_API_KEY` set,
replying fails with a clear error instead of pretending to send.
