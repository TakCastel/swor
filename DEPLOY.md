# Swor — déploiement VPS (Docker)

Guide pour remplacer l’ancienne app Laravel sur [swor.fr](https://swor.fr) par le stack Next.js + Supabase.

## Prérequis serveur

- Ubuntu 22.04+ (ou équivalent)
- Docker et Docker Compose v2
- Nginx (ou Caddy) pour le reverse proxy HTTPS
- Nom de domaine pointant vers le VPS (`swor.fr`, `api.swor.fr`)

## 1. Préparer le serveur

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Répertoire applicatif
sudo mkdir -p /opt/swor
sudo chown $USER:$USER /opt/swor
```

## 2. Copier le projet

Depuis votre machine locale :

```bash
./scripts/deploy.sh user@votre-vps /opt/swor
```

Ou manuellement :

```bash
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude docker/supabase/volumes/db/data \
  --exclude docker/supabase/volumes/storage \
  ./ user@votre-vps:/opt/swor/
```

## 3. Configurer l’environnement

Sur le VPS :

```bash
cd /opt/swor
cp .env.production.example .env.production
cp docker/supabase/env.example docker/supabase/.env
```

Éditez `.env.production` et `docker/supabase/.env` :

| Variable | Exemple | Rôle |
|----------|---------|------|
| `SITE_URL` | `https://swor.fr` | URL du front (auth Supabase) |
| `PUBLIC_SUPABASE_URL` | `https://api.swor.fr` | URL API exposée au navigateur |
| `JWT_SECRET` | 32+ caractères | Secret JWT Supabase |
| `ANON_KEY` / `SERVICE_ROLE_KEY` | JWT signés | Clés API (identiques dans les deux fichiers) |
| `POSTGRES_PASSWORD` | mot de passe fort | Base de données |

Générez des clés JWT cohérentes avec votre `JWT_SECRET` (ou réutilisez celles du dev en changeant le secret).

> **Important :** `PUBLIC_SUPABASE_URL` est injectée au **build** du front. Après modification, reconstruisez : `docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build`.

## 4. Lancer en production

```bash
cd /opt/swor
npm run docker:prod:up
```

Services :

| Service | Port interne | Accès recommandé |
|---------|--------------|------------------|
| Front Next.js | 3000 (localhost) | Via Nginx → `swor.fr` |
| Supabase API (Kong) | 54321 | Via Nginx → `api.swor.fr` |
| Supabase Studio | 54323 | Bloquer en prod ou VPN uniquement |
| PostgreSQL | 54322 | Localhost / jamais exposé |

## 5. Nginx (HTTPS)

Exemple dans `deploy/nginx/swor.conf.example` :

```bash
sudo cp deploy/nginx/swor.conf.example /etc/nginx/sites-available/swor
sudo ln -s /etc/nginx/sites-available/swor /etc/nginx/sites-enabled/
sudo certbot --nginx -d swor.fr -d www.swor.fr -d api.swor.fr
sudo nginx -t && sudo systemctl reload nginx
```

## 6. Mises à jour

```bash
./scripts/deploy.sh user@votre-vps /opt/swor
```

Le script synchronise les fichiers et relance `docker compose` avec rebuild.

## 7. Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Ne pas ouvrir les ports 54321, 54322, 54323 publiquement — Nginx fait le proxy.

## Dépannage

```bash
# Logs
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f front

# Rebuild complet
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build --force-recreate

# Reset BDD (destructif)
docker compose -f docker-compose.prod.yml --env-file .env.production down
rm -rf docker/supabase/volumes/db/data
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```
