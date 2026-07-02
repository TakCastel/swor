# Swor — démarrage local (API Laravel)

Backend Laravel dans **`api/`**. Le front joueur est dans **`front/`** (Next.js).

Voir [adr/0002-frontend-api-separes.md](adr/0002-frontend-api-separes.md) pour l’architecture cible.

## Prérequis

- PHP 8.2+ et [Composer](https://getcomposer.org/)
- Node.js 20+ (voir `.nvmrc`)
- PostgreSQL accessible (via `docker:supabase:up` ou instance locale)

## Installation

```bash
npm run setup
```

Installe les dépendances Composer (`api/`), npm (racine + workspaces) et copie les fichiers `.env` d’exemple.

Générer la clé d’application si besoin :

```bash
cd api && php artisan key:generate
```

## Base de données

Par défaut, `api/.env.example` pointe vers une base **`swor`** dédiée sur le Postgres Docker (port `54322`), **distincte** du schéma Supabase existant sur la base `postgres`.

```bash
# Créer la base (via Docker Supabase)
docker compose -f docker/supabase/docker-compose.yml exec db psql -U postgres -c "CREATE DATABASE swor;"

npm run docker:supabase:up
cd api && php artisan migrate:fresh --seed
```

## Lancer l’API

Terminal unique (serveur PHP + queue + logs + Vite Inertia legacy) :

```bash
npm run dev:api
```

Ou séparément :

```bash
cd api && php artisan serve    # http://localhost:8000
```

Endpoints : `http://localhost:8000/api/v1/...`

### Authentification (#32)

- Fortify + Sanctum (session SPA, cookies partagés avec `front/`)
- Endpoints : `POST /api/v1/auth/register`, `login`, `logout`, `forgot-password`, `reset-password`, `GET /api/v1/auth/user`, `DELETE /api/v1/auth/user`
- CSRF : `GET /sanctum/csrf-cookie` avant les requêtes mutantes depuis le front
- Variables `api/.env` : `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`
- Front : `NEXT_PUBLIC_API_URL=http://localhost:8000` dans `front/.env.local`

## Lancer le front joueur

Dans un second terminal :

```bash
npm run dev:front    # front/ sur :3000
```

Le front consomme l’API Laravel (Sanctum) pour l’authentification (#32). Les autres domaines (forum, profil…) restent sur Supabase jusqu’aux issues suivantes.

## Back-office

Filament arrive en #39 sur `/admin` (même app Laravel dans `api/`).

## Qualité

```bash
cd api && ./vendor/bin/pint          # Format PHP
cd api && php artisan test           # PHPUnit / Pest
npm run lint                         # ESLint (front/)
```

## Structure

```
api/
├── app/
│   ├── Http/Controllers/Api/
│   ├── Models/
│   └── Policies/
├── routes/
│   ├── api.php         # JSON pour front/
│   └── web.php         # Filament, healthcheck
├── database/
├── public/
└── composer.json

front/                  # Next.js — front joueur
```

## Legacy (dans api/)

- **`api/resources/js/`** — squelette Inertia (#30), provisoire ; retiré en #41
- **`back/`** — back-office Next.js, remplacé par Filament (#39)

```bash
npm run dev:back     # back/ sur :3001 (legacy)
```

Voir [WORKFLOW.md](WORKFLOW.md), [adr/0001-migration-laravel.md](adr/0001-migration-laravel.md) et [adr/0002-frontend-api-separes.md](adr/0002-frontend-api-separes.md).
