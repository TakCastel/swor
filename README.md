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
- **Authentification** — inscription, connexion, réinitialisation et suppression de compte (Supabase Auth)
- **Chat** — messagerie intégrée
- **Back-office** — interface d’administration (en cours de développement)

## Architecture

Monorepo avec **deux applications autonomes** ([ADR 0002](docs/adr/0002-frontend-api-separes.md)) :

```
swor/
├── api/            # Backend Laravel (API JSON + Filament à venir)
├── front/          # Application joueur (Next.js, port 3000)
├── back/           # Back-office legacy (Next.js, port 3001 — remplacé par Filament)
├── supabase/       # Migrations SQL legacy
└── docker/         # Compose (Supabase, services)
```

| Service        | Port  | Description                          |
|----------------|-------|--------------------------------------|
| API Laravel    | 8000  | Auth, métier, JSON (`/api/v1/`)      |
| Front          | 3000  | Application utilisateur (Next.js)    |
| Back-office    | 3001  | Admin legacy (en cours de remplacement)|
| Supabase API   | 54321 | Kong legacy (migration en cours)     |
| PostgreSQL     | 54322 | Base de données                      |

Voir [docs/LARAVEL.md](docs/LARAVEL.md) pour le démarrage local API + front.

## Prérequis

- [Node.js](https://nodejs.org/) 20+ (voir `.nvmrc`)
- [Docker](https://www.docker.com/) et Docker Compose (pour l’environnement complet)
- npm (workspaces)

## Installation

```bash
git clone <url-du-repo> swor
cd swor
npm run setup
```

`npm run setup` installe les dépendances et copie les fichiers d’environnement d’exemple (sans écraser les fichiers existants).

## Configuration

Les fichiers d’exemple :

| Fichier | Destination | Usage |
|---------|-------------|-------|
| `.env.example` | `.env` | Docker Compose racine (Supabase legacy) |
| `api/.env.example` | `api/.env` | API Laravel |
| `docker/supabase/env.example` | `docker/supabase/.env` | Stack Supabase |
| `front/env.local.example` | `front/.env.local` | Application front |
| `back/env.local.example` | `back/.env.local` | Back-office |

Les clés `ANON_KEY` et `SERVICE_ROLE_KEY` doivent être identiques entre `.env`, `docker/supabase/.env` et les `.env.local` du front/back.

## Lancement

### Avec Docker

Depuis la racine du projet (Supabase + front) :

```bash
npm run setup:env   # si pas encore fait
npm run docker:up
```

- Front : [http://localhost:3000](http://localhost:3000)
- Supabase Studio : [http://localhost:54323](http://localhost:54323)

### En local (développement)

1. Démarrer Supabase seul :

```bash
npm run setup:env
npm run docker:supabase:up
```

2. Lancer le front :

```bash
npm run dev
# ou : npm run dev -w front
```

3. Lancer le back-office (optionnel) :

```bash
npm run dev:back
```

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run setup` | Installation + copie des `.env` d’exemple |
| `npm run dev` | Front en mode développement |
| `npm run dev:back` | Back-office en mode développement |
| `npm run build` | Build de production du front |
| `npm run lint` | Vérification TypeScript du front |
| `npm run docker:up` | Démarre Supabase + front (Docker) |
| `npm run docker:down` | Arrête tous les conteneurs |
| `npm run docker:supabase:up` | Démarre uniquement Supabase |
| `npm run docker:prod:up` | Build et démarre la stack production |
| `npm run simulate -w front` | Simulation d’interactions forum via IA |
| `npm run simulate:watch -w front` | Simulation en boucle |

La simulation IA nécessite `OPENAI_API_KEY` ou `GEMINI_API_KEY` dans `front/.env.local`, ainsi que `SUPABASE_SERVICE_ROLE_KEY`.

## Stack technique

**Front & Back**
- Next.js (App Router), React, TypeScript
- Tailwind CSS
- Lucide React

**Backend & données**
- Supabase (PostgreSQL, Auth, Realtime, Storage)
- Schéma : personnages, forums hiérarchiques, factions, inventaire, économie, vaisseaux

## Structure du front

```
front/src/
├── app/              # Routes Next.js
├── features/         # Modules métier (forum, profile, factions, rules, universe, chat…)
└── shared/           # Composants UI, contextes, utilitaires Supabase
```

## Base de données

Le projet utilise trois emplacements SQL, chacun avec un rôle distinct :

| Emplacement | Rôle | Quand c’est utilisé |
|-------------|------|---------------------|
| `supabase/migrations/` | **Schéma** — évolution de la structure (tables, enums, RLS) | Référence pour les changements de schéma ; compatible CLI Supabase |
| `supabase/seeds/` | **Données de démo** — catégories, atlas, forums HRP | Rechargement manuel ou via CLI |
| `docker/supabase/volumes/db/init/` | **Bootstrap Docker** — schéma + seeds + données dev | Exécuté **une seule fois** au premier démarrage du conteneur PostgreSQL |

### Règle de synchronisation

1. **Modifier le schéma** dans `supabase/migrations/`, puis recopier le SQL dans `docker/supabase/volumes/db/init/01_core_schema.sql` (ou le fichier init correspondant).
2. **Modifier les données de seed** dans `supabase/seeds/`, puis recopier dans les fichiers `docker/supabase/volumes/db/init/` homologues (`02_categories.sql`, `03_forums_hrp.sql`, etc.).
3. Les fichiers **uniquement dans `init/`** (`00_roles.sql`, `07_fakes.sql`, `08_ai_members.sql`) sont spécifiques à l’environnement Docker local et n’ont pas d’équivalent dans `seeds/`.

### Réinitialiser la base locale

Pour rejouer les scripts `init/`, supprimez le volume Postgres puis redémarrez :

```bash
npm run docker:supabase:down
rm -rf docker/supabase/volumes/db/data
npm run docker:supabase:up
```

> **Note :** `supabase/config.toml` cible la CLI Supabase officielle (Postgres 17). Le stack Docker custom utilise Postgres 15. En développement, privilégiez le Docker custom (`npm run docker:supabase:up`).

## Licence

Projet privé — tous droits réservés.

## Déploiement (production VPS)

Voir [DEPLOY.md](./DEPLOY.md) pour le déploiement Docker sur un VPS (Nginx, HTTPS, Supabase).
