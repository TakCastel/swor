# Swor

Plateforme de roleplay Star Wars — forum, personnages, factions, univers et règles du jeu, le tout dans une interface noire et dorée.

Site cible : [swor.fr](https://swor.fr)

## Fonctionnalités

- **Portail** — accueil avec statistiques, actualités et accès rapide aux sections
- **Forum RP** — catégories par ère (Guerre des Clones, Guerre Civile Galactique, Nouvelle République…), sujets et réponses
- **Personnages** — création et gestion (inventaire, économie, vaisseau)
- **Factions** — groupes officiels et communautaires
- **Univers** — wiki de la galaxie
- **Règles** — règlement général, roleplay, personnages, économie
- **Authentification** — inscription, connexion, réinitialisation et suppression de compte (Fortify + Sanctum)
- **Back-office** — Filament sur `/admin` (à venir, #39)

## Architecture

Monorepo avec **deux applications autonomes** ([ADR 0002](docs/adr/0002-frontend-api-separes.md)) :

```
swor/
├── api/            # Backend Laravel 12 (API JSON /api/v1, auth Sanctum)
├── front/          # Application joueur (Next.js, port 3000)
├── deploy/         # Config Nginx d'exemple
└── docs/           # ADR, modèle de données, workflow
```

| Service        | Port  | Description                          |
|----------------|-------|--------------------------------------|
| API Laravel    | 8000  | Auth, métier, JSON (`/api/v1/`)      |
| Front          | 3000  | Application utilisateur (Next.js)    |
| PostgreSQL     | 54322 | Base de données (Docker)             |

Voir [docs/LARAVEL.md](docs/LARAVEL.md) pour le démarrage local détaillé.

## Prérequis

- PHP 8.2+ et [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) 20+ (voir `.nvmrc`)
- [Docker](https://www.docker.com/) et Docker Compose (pour Postgres)

## Installation

```bash
git clone <url-du-repo> swor
cd swor
npm run setup        # composer install + npm install + copie des .env
npm run docker:up    # Postgres sur :54322
cd api && php artisan key:generate && php artisan migrate --seed
```

## Lancement

```bash
npm run dev:api     # API Laravel sur :8000 (serveur + queue + logs)
npm run dev:front   # Front Next.js sur :3000
```

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run setup` | Installation + copie des `.env` d'exemple |
| `npm run dev:api` | API Laravel en mode développement |
| `npm run dev:front` | Front en mode développement |
| `npm run lint` | Vérification TypeScript du front |
| `npm run test:api` | Tests PHPUnit de l'API |
| `npm run docker:up` | Démarre Postgres (Docker) |
| `npm run docker:prod:up` | Build et démarre la stack production |

## Stack technique

**Front**
- Next.js (App Router), React, TypeScript
- Tailwind CSS, Lucide React

**Backend & données**
- Laravel 12 (Fortify + Sanctum, sessions SPA par cookies)
- PostgreSQL
- Schéma : personnages, forums hiérarchiques, factions, inventaire, économie, vaisseaux

## Structure du front

```
front/src/
├── app/              # Routes Next.js
├── features/         # Modules métier (forum, profile, factions, rules, universe…)
└── shared/           # Composants UI, contextes, client API (shared/utils/api.ts)
```

## Base de données

Le schéma vit dans `api/database/migrations/`, les données de démo dans
`api/database/seeders/`.

```bash
cd api && php artisan migrate:fresh --seed   # réinitialiser la base locale
```

## Licence

Projet privé — tous droits réservés.

## Déploiement (production VPS)

Voir [DEPLOY.md](./DEPLOY.md) pour le déploiement Docker sur un VPS (Nginx, HTTPS).
