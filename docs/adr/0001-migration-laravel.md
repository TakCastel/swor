# ADR 0001 — Migration vers un monolithe Laravel

**Statut :** Accepté (2026-07-03)  
**Date :** 2026-07-03  
**Issue :** #29

## Contexte

Swor est aujourd'hui un monorepo npm (`front/` Next.js + `back/` Next.js) adossé à Supabase auto-hébergé (Auth, Realtime, RLS, ~10 services Docker). La logique métier est dispersée entre le client React, les policies RLS Postgres et des triggers SQL.

Le produit va gagner en complexité côté serveur : règles de gameplay, jets de dés, évaluation IA, économie macro, compagnons, combat. Cette évolution rend le modèle actuel difficile à tester, à sécuriser et à faire évoluer.

## Décision

Migrer vers un **monolithe Laravel 12** unique qui remplace `front/` et `back/`, en conservant **PostgreSQL** et en réutilisant les composants **React + Tailwind** via **Inertia**.

### Stack cible

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Framework | Laravel 12 | Routing, ORM, auth, jobs, events |
| Frontend | Inertia + React + TypeScript | Réutilisation des composants UI existants |
| CSS | Tailwind | Thème noir et doré conservé |
| Base de données | PostgreSQL (image officielle) | Schéma existant porté en migrations Laravel |
| Temps réel | Laravel Reverb + Echo | Chat (#38, remplace Supabase Realtime) |
| Authentification | Laravel Fortify | Inscription, connexion, reset (#32) |
| Jobs asynchrones | Queues Laravel (Redis) | Appels IA (#23), traitements différés |
| Back-office | Filament | Administration (#39, remplace `back/` Next.js) |
| Tests | Pest | Unitaires, feature, browser (#21) |
| Qualité | Laravel Pint + ESLint | Lint PHP et TS |

### Ce qu'on abandonne

- Le monorepo `front/` + `back/` Next.js (décommissionnement #41)
- Supabase Auth, Realtime, RLS et la stack Docker Supabase (#41)
- Les policies RLS Postgres → remplacées par les **Policies Laravel** et la validation côté serveur
- Les triggers SQL de comptage → remplacés par des **observers Eloquent** ou des jobs (comportement à reproduire, voir `docs/data-model/forum.md`)

### Ce qu'on conserve

- PostgreSQL comme SGBD
- Le modèle de données existant (17 tables, voir `docs/data-model/README.md`)
- L'identité visuelle et les composants React/Tailwind
- Les seeds de contenu (forums, atlas, catégories)

## Motivation

1. **Logique serveur** — Gameplay, dés, combat et économie doivent vivre côté serveur, pas dans le client ni dans des triggers SQL opaques.
2. **Jobs asynchrones** — Les appels IA et les traitements lourds nécessitent une file de jobs native.
3. **Tests** — Pest permet de tester routes, policies, modèles et parcours Inertia de façon intégrée.
4. **Surface d'attaque** — 1 application à patcher au lieu de ~10 services Supabase auto-hébergés.
5. **Back-office** — Filament fournit CRUD, permissions et UI admin sans maintenir un second frontend Next.js.

## Schéma de données : source canonique

Deux fichiers SQL coexistent aujourd'hui et **divergent** :

| Fichier | Usage | Complétude |
|---------|-------|------------|
| `supabase/migrations/20240101000000_core_schema.sql` | Migrations Supabase CLI | Incomplet (pas de `group_members`, champs perso réduits) |
| `docker/supabase/volumes/db/init/01_core_schema.sql` | Environnement Docker réel | **Référence canonique** pour la migration Laravel |

**Décision :** la migration Laravel (#31) part du schéma Docker, réconcilié et documenté dans `docs/data-model/`. Les écarts à intégrer :

- Table `group_members` (appartenance multi-factions)
- Champs RP sur `characters` (`physical_description`, `personality`, `skills[]`, etc.)
- Champs `profiles.title_hrp`, `profiles.last_seen`
- Champ `groups.era`
- Compteurs forum récursifs (remontée `parent_id`)
- Fonctions RPC `get_global_stats()` et `increment_topic_views()` → services Laravel

## Impact sur les tickets existants

### Remplacés ou absorbés par l'épic Migration Laravel

| Ticket | Sujet | Devenir |
|--------|-------|---------|
| #1 | Chat Supabase Realtime | **Fermé sans implémentation** → #38 (Reverb) |
| #3 | Auth admin back-office Next.js | **Fermé sans implémentation** → #39 (Filament) + Policies |
| #4–#8 | Stories back-office (CRUD) | **Reportées** → Filament resources (#39) |
| #9, #10, #11 | Stories chat | **Fermées sans implémentation** → #38 |
| #19 | Déploiement back-office prod | **Absorbé** par #40 |
| #20 | CI back-office | **Absorbé** par #40 |
| #21 | Tests Vitest/Playwright | **Remplacé** par Pest (#21 à mettre à jour) |

### Inchangés dans l'intention, reportés post-migration

| Ticket | Sujet |
|--------|-------|
| #22–#28 | Dés, combat, compagnons, carte, économie macro |
| #18 | Seeds catalogue items |

### Séquence de livraison

```
#29 ADR (ce document)
  → #30 Squelette Laravel
    → #31 Migrations + seeders
      → #32 Auth Fortify
        → #36 Forum Inertia
          → #37 Portail / persos / factions
            → #38 Chat Reverb
              → #39 Filament
                → #40 Docker / CI / déploiement
                  → #41 Décommissionnement Supabase
```

## Authentification : migration des comptes

**Question ouverte (à trancher avant #32) :** existe-t-il des comptes joueurs réels en production via Supabase Auth ?

| Scénario | Action |
|----------|--------|
| Pas de comptes réels (pré-prod) | Fresh start Fortify, pas de migration auth |
| Comptes réels existants | Script de migration `auth.users` → `users` Laravel (hash bcrypt compatible) + `profiles` |

**Recommandation actuelle :** vérifier la base de prod avant de trancher. En l'absence de joueurs actifs, un fresh start simplifie fortement la migration.

## Structure du repo cible

```
swor/
├── app/                    # Laravel (Models, Policies, Controllers)
├── resources/js/           # Inertia + React (composants portés depuis front/)
├── database/migrations/    # Schéma Postgres
├── database/seeders/       # Contenu (forums, atlas…)
├── docs/
│   ├── adr/                # Décisions d'architecture
│   └── data-model/         # Modèle métier documenté
├── front/                  # (legacy, supprimé en #41)
├── back/                   # (legacy, supprimé en #41)
└── docker/                 # Stack simplifiée (app + postgres + redis)
```

Pendant la transition, `front/` et `back/` restent en place jusqu'à #41.

## Conséquences

### Positives

- Codebase unifiée, testable, déployable en un seul artefact
- Contrôle d'accès explicite (Policies) au lieu de RLS dispersées
- Back-office Filament sans effort de maintenance UI

### Négatives / risques

- Migration longue (plusieurs stories)
- Double maintenance temporaire (ancien + nouveau stack)
- Perte du Realtime Supabase → Reverb à configurer et tester
- Réécriture des requêtes Supabase client → controllers Inertia + Eloquent

### Mitigations

- Documentation du modèle de données **avant** le code (#29, `docs/data-model/`)
- Portage incrémental par domaine (forum d'abord, #36)
- Branche `develop` protégée, features isolées par ticket

### Frontend : SSR et RSC

Laravel + Inertia **ne supporte pas les React Server Components** (spécifiques à Next.js App Router). Le rendu React est côté client, alimenté par des props JSON depuis les controllers PHP.

Le **SSR classique reste possible** via [Inertia SSR](https://inertiajs.com/server-side-rendering) (`@inertiajs/server` + Node en production). Non activé en #30 ; à évaluer si le SEO des pages publiques (portail, règles, univers) devient prioritaire.

## Références

- [WORKFLOW.md](../WORKFLOW.md) — branches et PR
- [data-model/README.md](../data-model/README.md) — entités et relations
- Epic GitHub : *EPIC: Migration Laravel* (#29–#41)
