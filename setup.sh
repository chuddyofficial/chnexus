#!/usr/bin/env bash
#
# CH Nexus — one-shot VPS setup for Ubuntu Server 26.04 LTS.
#
# What this does:
#   1. Installs Docker Engine + Compose plugin (if missing)
#   2. Installs nginx + certbot (if missing)
#   3. Generates .env with real secrets (if missing)
#   4. Builds and starts the app via docker compose
#   5. Runs Prisma migrations
#   6. Seeds the first admin account (interactive, TOTP QR printed to terminal)
#   7. Configures nginx as a reverse proxy for the domain
#   8. Requests a Let's Encrypt TLS certificate via certbot
#
# Usage:
#   sudo ./setup.sh chnexus.net you@example.com
#
# Safe to re-run: steps that are already done are skipped.

set -euo pipefail

DOMAIN="${1:-}"
ADMIN_EMAIL="${2:-}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33mWARN:\033[0m %s\n' "$1"; }
die()  { printf '\033[1;31mERROR:\033[0m %s\n' "$1"; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run this with sudo: sudo ./setup.sh <domain> <admin-email>"
[ -n "$DOMAIN" ] || die "Usage: sudo ./setup.sh <domain> <admin-email>  (e.g. sudo ./setup.sh chnexus.net you@example.com)"
[ -n "$ADMIN_EMAIL" ] || die "Usage: sudo ./setup.sh <domain> <admin-email>  (e.g. sudo ./setup.sh chnexus.net you@example.com)"

# ---------------------------------------------------------------------------
log "Step 1/8: System packages"
# ---------------------------------------------------------------------------
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release openssl ufw

# ---------------------------------------------------------------------------
log "Step 2/8: Docker Engine + Compose plugin"
# ---------------------------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  ARCH="$(dpkg --print-architecture)"
  CODENAME="$(. /etc/os-release && echo "$VERSION_CODENAME")"
  echo "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker

  if [ -n "${SUDO_USER:-}" ]; then
    usermod -aG docker "$SUDO_USER" || true
    warn "Added $SUDO_USER to the docker group — log out and back in for this to take effect without sudo."
  fi
else
  log "Docker already installed — skipping."
fi

# ---------------------------------------------------------------------------
log "Step 3/8: nginx + certbot"
# ---------------------------------------------------------------------------
if ! command -v nginx >/dev/null 2>&1; then
  apt-get install -y nginx
  systemctl enable --now nginx
else
  log "nginx already installed — skipping."
fi

if ! command -v certbot >/dev/null 2>&1; then
  apt-get install -y certbot python3-certbot-nginx
else
  log "certbot already installed — skipping."
fi

ufw allow "OpenSSH" || true
ufw allow "Nginx Full" || true
ufw --force enable || true

# ---------------------------------------------------------------------------
log "Step 4/8: Environment configuration (.env)"
# ---------------------------------------------------------------------------
cd "$APP_DIR"

if [ ! -f .env ]; then
  DB_PASSWORD="$(openssl rand -hex 16)"
  AUTH_SECRET="$(openssl rand -base64 32)"
  IP_HASH_SALT="$(openssl rand -hex 16)"

  cat > .env <<EOF
DATABASE_URL="postgresql://chnexus:${DB_PASSWORD}@postgres:5432/chnexus?schema=public"
REDIS_URL="redis://redis:6379"
AUTH_SECRET="${AUTH_SECRET}"
NEXTAUTH_URL="https://${DOMAIN}"
IP_HASH_SALT="${IP_HASH_SALT}"
POSTGRES_PASSWORD="${DB_PASSWORD}"
EOF

  chmod 600 .env
  log "Generated .env with fresh secrets (chmod 600)."
else
  log ".env already exists — leaving it untouched."
fi

POSTGRES_PASSWORD="$(grep -E '^POSTGRES_PASSWORD=' .env | tail -n1 | cut -d'=' -f2- | tr -d '"')"

# ---------------------------------------------------------------------------
log "Step 5/8: Build and start containers"
# ---------------------------------------------------------------------------
docker compose pull --ignore-pull-failures 2>/dev/null || true
docker compose up -d --build

log "Waiting for the database to be ready..."
for i in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U chnexus >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

# ---------------------------------------------------------------------------
log "Step 6/8: Run database migrations"
# ---------------------------------------------------------------------------
docker compose --profile tools build migrator
docker compose --profile tools run --rm migrator npx prisma migrate deploy

# ---------------------------------------------------------------------------
log "Step 7/8: Seed the first admin account"
# ---------------------------------------------------------------------------
EXISTING_ADMIN_COUNT="$(docker compose exec -T -e PGPASSWORD="${POSTGRES_PASSWORD:-changeme}" postgres \
  psql -U chnexus -d chnexus -tAc "SELECT count(*) FROM \"AdminUser\";" 2>/dev/null | tr -d '[:space:]' || echo 0)"

if [ "${EXISTING_ADMIN_COUNT:-0}" = "0" ]; then
  echo
  read -r -s -p "Set a password for the admin account (${ADMIN_EMAIL}): " ADMIN_PASSWORD
  echo
  [ -n "$ADMIN_PASSWORD" ] || die "Password cannot be empty."

  docker compose --profile tools run --rm \
    -e SEED_ADMIN_EMAIL="$ADMIN_EMAIL" \
    -e SEED_ADMIN_PASSWORD="$ADMIN_PASSWORD" \
    migrator npm run db:seed

  warn "Scan the QR/otpauth URL above into your authenticator app right now — it will not be shown again."
else
  log "Admin account(s) already exist — skipping seed."
fi

# ---------------------------------------------------------------------------
log "Step 8/8: nginx reverse proxy + TLS"
# ---------------------------------------------------------------------------
NGINX_CONF="/etc/nginx/sites-available/chnexus"

cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/chnexus
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

if certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
  log "Certificate for $DOMAIN already exists — skipping certbot request."
else
  log "Requesting Let's Encrypt certificate for $DOMAIN (make sure DNS already points here)..."
  certbot --nginx -d "$DOMAIN" -m "$ADMIN_EMAIL" --agree-tos --redirect --non-interactive \
    || warn "certbot failed — check DNS is pointed at this server, then re-run: certbot --nginx -d $DOMAIN"
fi

log "Done."
echo
echo "  Site:        https://${DOMAIN}"
echo "  Admin login: https://${DOMAIN}/admin/login"
echo "  Logs:        docker compose logs -f app"
echo "  Restart:     docker compose restart app"
echo "  Update code: git pull && docker compose up -d --build"
echo
