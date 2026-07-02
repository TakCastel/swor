# Swor — démarrage local (Laravel)

Monolithe Laravel + Inertia + React. Remplace progressivement `front/` et `back/`.

## Prérequis

- PHP 8.2+ et [Composer](https://getcomposer.org/)
- Node.js 20+ (voir `.nvmrc`)
- PostgreSQL accessible (via `docker:supabase:up` ou instance locale)

## Installation

```bash
npm run setup
```

Installe les dépendances PHP et npm, copie `.env.example` vers `.env` si absent.

Générer la clé d'application si besoin :

```bash
php artisan key:generate
```

## Base de données

Par défaut, `.env.example` pointe vers une base **`swor`** dédiée sur le Postgres Docker (port `54322`), **distincte** du schéma Supabase existant sur la base `postgres`.

```bash
# Créer la base (via Docker Supabase)
docker compose -f docker/supabase/docker-compose.yml exec db psql -U postgres -c "CREATE DATABASE swor;"

npm run docker:supabase:up
php artisan migrate:fresh --seed
```

Les migrations Laravel actuelles créent les tables système (users, sessions, cache, jobs). Le schéma métier Swor arrive en #31.

## Lancer l'app

Terminal unique (serveur PHP + Vite + queue + logs) :

```bash
composer dev
```

Ou séparément :

```bash
php artisan serve    # http://localhost:8000
npm run dev          # Vite HMR
```

Page d'accueil : [http://localhost:8000](http://localhost:8000)

## Qualité

```bash
./vendor/bin/pint          # Format PHP (Laravel Pint)
npm run lint               # ESLint (resources/js)
npm run format:check       # Prettier
php artisan test           # PHPUnit
```

## Structure frontend

```
resources/js/
├── pages/          # Pages Inertia (une par route)
├── components/     # Composants React réutilisables
│   └── ui/         # Design system (porté depuis front/)
├── layouts/        # Layouts Inertia
└── lib/            # Utilitaires (cn, etc.)
```

## Legacy

L'ancien stack Next.js reste disponible pendant la migration :

```bash
npm run dev:front    # front/ sur :3000
npm run dev:back     # back/ sur :3001
```

Voir [WORKFLOW.md](WORKFLOW.md) et [adr/0001-migration-laravel.md](adr/0001-migration-laravel.md).
