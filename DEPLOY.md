# Swor — déploiement VPS (Docker)

Stack production : front Next.js + API Laravel + PostgreSQL, derrière Nginx.

> ⚠️ La stack Docker de production (`api/Dockerfile`, `docker-compose.prod.yml`)
> a été réécrite lors de la migration Laravel et n'a pas encore été validée sur
> le VPS — à tester au prochain déploiement.

## Prérequis serveur

- Ubuntu 22.04+ (ou équivalent)
- Docker et Docker Compose v2
- Nginx pour le reverse proxy HTTPS
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

## 3. Configurer l'environnement

Sur le VPS :

```bash
cd /opt/swor
cp .env.production.example .env.production
```

Éditez `.env.production` :

| Variable | Exemple | Rôle |
|----------|---------|------|
| `SITE_URL` | `https://swor.fr` | URL publique du front |
| `API_URL` | `https://api.swor.fr` | URL publique de l'API (injectée au build du front) |
| `APP_KEY` | `base64:…` | Clé Laravel (`php artisan key:generate --show`) |
| `SANCTUM_STATEFUL_DOMAINS` | `swor.fr,www.swor.fr` | Domaines autorisés pour la session SPA |
| `SESSION_DOMAIN` | `.swor.fr` | Portée du cookie de session |
| `POSTGRES_PASSWORD` | mot de passe fort | Base de données |
| `SMTP_*` | — | Emails transactionnels |

> **Important :** `API_URL` est injectée au **build** du front. Après
> modification, reconstruisez : `npm run docker:prod:up`.

## 4. Lancer en production

```bash
cd /opt/swor
npm run docker:prod:up
```

Les migrations Laravel s'exécutent automatiquement au démarrage du conteneur API.

| Service | Port interne | Accès recommandé |
|---------|--------------|------------------|
| Front Next.js | 127.0.0.1:3000 | Via Nginx → `swor.fr` |
| API Laravel | 127.0.0.1:8080 | Via Nginx → `api.swor.fr` |
| PostgreSQL | interne Docker | Jamais exposé |

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

Ne pas ouvrir les ports 3000 et 8080 publiquement — Nginx fait le proxy.

## Dépannage

```bash
# Logs
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f api

# Rebuild complet
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build --force-recreate

# Console Laravel dans le conteneur
docker exec -it swor-api php artisan tinker
```
