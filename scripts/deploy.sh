#!/usr/bin/env bash
set -euo pipefail

REMOTE="${1:?Usage: ./scripts/deploy.sh user@host [/opt/swor]}"
DEST="${2:-/opt/swor}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "→ Sync vers $REMOTE:$DEST"
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude '*.local' \
  --exclude .env \
  --exclude api/vendor \
  --exclude api/storage/logs \
  "$ROOT/" "$REMOTE:$DEST/"

echo "→ Build et redémarrage Docker (production)"
ssh "$REMOTE" "cd '$DEST' && docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build"

echo "✓ Déploiement terminé"
