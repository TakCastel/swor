# ADR 0002 — Frontend et backend séparés (API Laravel + Next.js)

**Statut :** Accepté (2026-07-03)  
**Date :** 2026-07-03  
**Issue :** #29 (complète l’ADR 0001)  
**Remplace :** la partie frontend Inertia de [ADR 0001](0001-migration-laravel.md)

## Contexte

L’[ADR 0001](0001-migration-laravel.md) prévoyait un monolithe Laravel + Inertia remplaçant `front/` et `back/`. Le squelette Laravel (#30) a été initialisé avec Inertia (starter Breeze).

L’équipe souhaite conserver une **séparation front / back** :
- **Front joueur** : Next.js (`front/`), consommant une API JSON
- **Back serveur** : Laravel (API + logique métier + admin)
- **Back-office** : Filament dans Laravel (remplace `back/` Next.js)

Cette décision aligne la cible sur le monorepo existant tout en centralisant la logique métier côté Laravel.

## Décision

Architecture **découplée** en trois surfaces, adossée à **un backend Laravel unique** :

| Surface | Technologie | URL (prod) | Rôle |
|---------|-------------|------------|------|
| Front joueur | Next.js + React + TypeScript | `swor.fr` | Portail, forum, persos, chat (UI) |
| API | Laravel 12 (`routes/api.php`) | `api.swor.fr` ou `swor.fr/api` | JSON, auth, policies, jobs |
| Back-office | Filament 3 | `admin.swor.fr` ou `swor.fr/admin` | CRUD entités (forums, users, factions…) |

### Stack cible (complète ADR 0001)

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Framework backend | Laravel 12 | ORM, auth, policies, jobs, events |
| API | Routes `api/` + Resources/FormRequests | Contrat JSON pour le front Next.js |
| Front joueur | Next.js (`front/`) | UI joueur, SSR/RSC, Echo client |
| Back-office | Filament | Administration (#39, remplace `back/`) |
| Auth front ↔ API | Laravel Sanctum (SPA) | Cookie session sur domaine partagé |
| CSS | Tailwind | Thème noir et doré conservé |
| Base de données | PostgreSQL | Schéma porté en migrations Laravel (#31) |
| Temps réel | Laravel Reverb + Echo | Chat (#38) |
| Auth | Laravel Fortify + Sanctum | Inscription, connexion (#32) |
| Jobs | Queues Laravel (Redis) | Appels IA (#23), traitements différés |
| Tests backend | Pest | API, policies, modèles, services |
| Tests front | Vitest + Playwright | Parcours Next.js (#21 à mettre à jour) |
| Qualité | Laravel Pint + ESLint | Lint PHP et TS |

### Ce qu’on abandonne (par rapport à ADR 0001)

- **Inertia** comme frontend joueur (le squelette #30 est provisoire)
- **`back/` Next.js** — remplacé par Filament (#39, inchangé)
- Supabase Auth, Realtime, RLS (#41, inchangé)

### Ce qu’on conserve

- **`front/` Next.js** — adapté pour consommer l’API Laravel au lieu de Supabase
- PostgreSQL, modèle de données, identité visuelle
- Décision Laravel backend, Filament admin, Reverb, Fortify (ADR 0001)

## Architecture

```
┌─────────────────┐     HTTPS JSON      ┌──────────────────────────────┐
│  front/         │ ──────────────────► │  Laravel                     │
│  Next.js        │   /api/* + Sanctum  │  ├── routes/api.php          │
│  (swor.fr)      │                     │  ├── Models / Policies       │
└─────────────────┘                     │  ├── Jobs / Events           │
                                        │  └── Filament (/admin)       │
┌─────────────────┐     WebSocket       └──────────────┬───────────────┘
│  Echo client    │ ◄──────────────── Reverb          │
│  (dans front/)  │                                    ▼
└─────────────────┘                          PostgreSQL + Redis
```

### Auth Sanctum (SPA)

Front et API partagent le domaine parent (`swor.fr` + `api.swor.fr` avec `SANCTUM_STATEFUL_DOMAINS`) ou un reverse proxy unique. Le front Next.js envoie les requêtes API avec credentials (`credentials: 'include'`) et le cookie CSRF Laravel.

Alternative future : tokens Bearer pour clients mobiles ou tiers.

### Contrat API

- Versionnement : préfixe `/api/v1/` dès le premier endpoint public
- Format : JSON, ressources Laravel (`JsonResource`) ou équivalent cohérent
- Erreurs : codes HTTP standards + corps `{ message, errors }`
- Autorisation : Policies Laravel, jamais de logique métier dans le front

## Structure du repo cible (monorepo)

Deux applications **autonomes**, chacune dans son dossier. Rien de Laravel à la racine du repo (sauf orchestration : Docker, CI, docs).

```
swor/
├── api/                    # Backend Laravel (API + Filament + jobs)
│   ├── app/
│   ├── routes/
│   │   ├── api.php         # JSON pour front/
│   │   └── web.php         # Filament, healthcheck
│   ├── database/
│   ├── public/             # Point d’entrée HTTP (Nginx → api/public)
│   ├── composer.json
│   └── .env
├── front/                  # Frontend Next.js (joueur)
│   ├── app/                # App Router
│   ├── package.json
│   └── .env.local
├── docs/
├── docker/                 # Compose : api + front + postgres + redis
├── package.json            # Scripts racine (dev, docker, lint)
└── docker-compose.yml
```

### Rôles des dossiers

| Dossier | Stack | Dépendances | Déployé comme |
|---------|-------|-------------|---------------|
| `api/` | Laravel 12 + Filament | Composer (PHP) | Container `api` |
| `front/` | Next.js + React | npm (Node) | Container `front` |

**Filament** vit dans `api/` — pas de dossier admin séparé. L’ancien `back/` (Next.js admin) est supprimé en #41.

### État actuel vs cible

| | Aujourd’hui | Cible |
|--|-------------|-------|
| Laravel | **`api/`** | `api/` |
| Front joueur | `front/` | `front/` |
| Admin | `back/` (Next legacy) | Filament dans `api/` |

Le déplacement Laravel → `api/` est **fait** (anticipation de #40). Prochaine étape : Docker/CI alignés sur cette arborescence (#40).

### Monorepo npm

```json
{
  "workspaces": ["front"]
}
```

`api/` n’est **pas** un workspace npm — il a son propre `composer.json`. La racine orchestre :

```bash
npm run dev:front      # Next.js (:3000)
npm run dev:api        # php artisan serve dans api/ (:8000)
composer dev -d api    # ou équivalent
```

### Partage de code (optionnel, plus tard)

Types TypeScript du contrat API : package `packages/api-client/` ou génération OpenAPI → `front/lib/api/`. Pas requis pour démarrer.

### Docker / Nginx

- Build context Laravel : `./api`
- `DOCUMENT_ROOT` : `/var/www/html/public` (dans le container api)
- Build context Next : `./front`
- Aucun mélange de `node_modules` entre `api/` et `front/`

Le dossier `api/resources/js/` (Inertia, héritage #30) sera retiré avec Inertia en #41.

## Impact sur la séquence de livraison

```
#29 ADR + #30 Squelette Laravel (Inertia provisoire)
  → #31 Migrations + seeders
    → #32 Auth Fortify + Sanctum + endpoints API auth
      → #36 Forum API + pages Next.js (remplace « Forum Inertia »)
        → #37 Portail / persos / factions (API + front)
          → #38 Chat Reverb + Echo dans front/
            → #39 Filament
              → #40 Restructuration api/ + Docker / CI / déploiement
                → #41 Décommissionnement Supabase + retrait Inertia / back/
```

### Tickets impactés

| Ticket | Avant (ADR 0001) | Après (ADR 0002) |
|--------|------------------|------------------|
| #21 Tests | Pest seul | Pest (API) + Vitest/Playwright (front) |
| #32 Auth | Fortify + pages Inertia | Fortify + Sanctum + client auth dans `front/` |
| #36 Forum | Controllers Inertia | Controllers API + pages `front/` |
| #39 Filament | Inchangé | Inchangé |
| #40 Déploiement | 1 artefact Laravel | Laravel + Next.js sur VPS |
| #41 Décommissionnement | Supprime front/ + back/ | Supprime back/ + Inertia ; **conserve front/** |

## Déploiement VPS (#40)

| Service | Conteneur / processus | Port interne |
|---------|----------------------|--------------|
| Laravel (API + Filament + Reverb + worker) | `app` | 8000 |
| Next.js | `front` | 3000 |
| PostgreSQL | `postgres` | 5432 |
| Redis | `redis` | 6379 |

Nginx route :
- `swor.fr` → Next.js
- `api.swor.fr` → Laravel (`/api`)
- `admin.swor.fr` → Laravel (Filament)

## Conséquences

### Positives

- Front Next.js indépendant (SSR, RSC, écosystème existant)
- API réutilisable (mobile, outils, intégrations futures)
- Filament pour le back-office sans maintenir `back/`
- Réutilisation directe de `front/` et de son design system

### Négatives / risques

- Deux applications à déployer et tester (Laravel + Next)
- Auth Sanctum + CORS à configurer correctement
- Chaque feature = endpoints API + pages/composants front
- Le squelette Inertia (#30) dans `api/resources/js/` est une dette temporaire ; retrait en #41

### Mitigations

- API versionnée dès #32/#36
- Client API typé partagé dans `front/` (fetch wrapper + types)
- Pest pour l’API ; Playwright pour les parcours critiques front
- Retrait Inertia planifié en #41, pas avant branchement auth API

## Références

- [ADR 0001 — Migration Laravel](0001-migration-laravel.md) (backend, données, Filament)
- [LARAVEL.md](../LARAVEL.md) — démarrage local
- [WORKFLOW.md](../WORKFLOW.md) — branches et PR
- [data-model/README.md](../data-model/README.md) — entités
