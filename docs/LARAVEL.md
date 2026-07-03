# Swor — démarrage local (API Laravel)

Backend Laravel dans **`api/`**. Le front joueur est dans **`front/`** (Next.js).

Voir [adr/0002-frontend-api-separes.md](adr/0002-frontend-api-separes.md) pour l'architecture cible.

## Prérequis

- PHP 8.2+ et [Composer](https://getcomposer.org/)
- Node.js 20+ (voir `.nvmrc`)
- Docker (pour PostgreSQL)

## Installation

```bash
npm run setup
```

Installe les dépendances Composer (`api/`), npm (racine + front) et copie les fichiers `.env` d'exemple.

Générer la clé d'application si besoin :

```bash
cd api && php artisan key:generate
```

## Base de données

Postgres tourne dans Docker (base **`swor`**, port `54322`) :

```bash
npm run docker:up
cd api && php artisan migrate:fresh --seed
```

## Lancer l'API

Terminal unique (serveur PHP + queue + logs) :

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

### API de jeu

Le front consomme exclusivement l'API Laravel (`front/src/shared/utils/api.ts`) :

| Domaine | Endpoints principaux |
|---------|----------------------|
| Forum | `GET /forum/categories`, `GET /forums`, `GET /forums/{id}`, `GET /topics/{id}`, `POST /forums/{id}/topics`, `POST /topics/{id}/posts`, `POST /topics/{id}/views` |
| Portail / stats | `GET /stats`, `GET /portal`, `GET /staff`, `GET /online-users` |
| Profils | `GET /profiles/{id}`, `GET /profiles/{id}/characters`, `GET /me`, `PATCH /me/profile`, `PUT /me/active-character`, `POST /me/heartbeat` |
| Personnages | `GET/POST/PATCH /characters…`, `/inventory`, `/ship`, `/economy` |
| Factions | `GET /groups`, `GET /groups/{id}` |
| Admin | `POST/PATCH/DELETE /forums…`, `POST /uploads` (gate `admin`) |

Les compteurs de forums (`topics_count`, `posts_count`, `last_post_id`) sont
agrégés récursivement sur les ancêtres à chaque nouveau message
(`App\Services\ForumActivity`).

## Lancer le front joueur

Dans un second terminal :

```bash
npm run dev:front    # front/ sur :3000
```

## Back-office

Filament arrive en #39 sur `/admin` (même app Laravel dans `api/`).

## Qualité

```bash
cd api && ./vendor/bin/pint          # Format PHP
cd api && php artisan test           # PHPUnit
npm run lint                         # TypeScript (front/)
```

## Structure

```
api/
├── app/
│   ├── Http/Controllers/Api/V1/   # Auth, Forum, Characters, Groups, Stats…
│   ├── Models/
│   └── Services/
├── routes/
│   ├── api.php         # JSON pour front/
│   └── web.php         # Redirection racine, vérification email
├── database/
│   ├── migrations/     # Schéma canonique
│   └── seeders/        # Données de démo (catégories, atlas, forums HRP)
└── composer.json

front/                  # Next.js — front joueur
```

Voir [WORKFLOW.md](WORKFLOW.md), [adr/0001-migration-laravel.md](adr/0001-migration-laravel.md) et [adr/0002-frontend-api-separes.md](adr/0002-frontend-api-separes.md).
