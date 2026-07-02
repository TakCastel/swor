# Forum RP — modèle de données

Le forum est le cœur de Swor : navigation galactique par ère, fils de discussion RP liés aux personnages, et espaces HRP/admin.

**Tables :** `forum_categories`, `forums`, `topics`, `posts`  
**Issue de portage :** #36

## Concept

Deux usages coexistent dans le même modèle :

| Usage | Catégories | Structure | Exemple |
|-------|------------|-----------|---------|
| **RP par ère** | `era` renseigné | Arbre géographique profond | Guerre des Clones → Noyau Galactique → Coruscant |
| **HRP / admin** | `era` null | Forums plats (`type = 'forum'`) | Holonews, Social, Administratif |

Un joueur ne voit les catégories RP que si son **personnage actif** est de la même ère (sauf admin qui voit tout).

## Hiérarchie des catégories

`forum_categories` est le premier niveau d'organisation. Ce ne sont pas des forums jouables : ce sont des **sections** de l'index.

### Catégories seedées

| id | name | era | required_role | Rôle |
|----|------|-----|---------------|------|
| 1 | Holonews | — | — | Annonces officielles (HRP) |
| 2 | Guerre des Clones | `Old Republic` | — | Atlas RP ère GDC |
| 3 | Guerre Civile Galactique | `Galactic Empire` | — | Atlas RP ère GCC |
| 4 | Nouvelle République | `New Republic` | — | Atlas RP ère NR |
| 5 | Social | — | — | HRP joueurs |
| 6 | Administratif | — | `moderator` | Staff uniquement |
| 7 | Archives | — | — | Contenu archivé |

### Champs

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant |
| `name` | TEXT | Nom affiché |
| `description` | TEXT | Texte d'introduction (souvent lore) |
| `era` | TEXT | Clé d'ère pour filtrage perso (`Old Republic`, `Galactic Empire`, `New Republic`) ou NULL si HRP |
| `required_role` | `user_role` | Rôle minimum pour voir la section |
| `display_order` | INTEGER | Tri dans l'index |
| `image_url` | TEXT | Visuel de la carte/section |

### Règle d'accès par ère

Implémentée côté client (`ForumIndex.tsx`), à porter en Policy Laravel :

1. Catégorie sans `era` → visible selon `required_role` seulement
2. Catégorie avec `era` + visiteur sans perso actif → visible en lecture (fallback catégories 2/3/4)
3. Catégorie avec `era` + perso actif → visible si `characters.era` correspond
4. Admin → toutes les ères

**Normalisation des ères** (legacy, à simplifier en Laravel) :

```
Old Republic / CLONE_WARS / GDC  →  Guerre des Clones (cat. 2)
Galactic Empire / GALACTIC_CIVIL_WAR / GCC  →  GCC (cat. 3)
New Republic / NEW_REPUBLIC / NR  →  NR (cat. 4)
```

## Arbre des forums (`forums`)

`forums` est une **table auto-référencée** (`parent_id`) : chaque nœud appartient à une catégorie et optionnellement à un parent.

### Types de nœuds (`forum_type`)

```
category → region → sector → planet → location → forum
```

| Type | Rôle dans l'atlas RP | Contient des sujets ? | Exemple |
|------|---------------------|----------------------|---------|
| `category` | Regroupement intermédiaire | Non (navigation) | Rarement utilisé dans les seeds |
| `region` | Grande zone galactique | Non | « Noyau Galactique », « Bordure Extérieure » |
| `sector` | Sous-zone | Non | Prévu dans l'enum, peu utilisé dans les seeds actuels |
| `planet` | Monde jouable | **Oui** (sujets directement sur la planète) | Coruscant, Tatooine |
| `location` | Lieu précis sur une planète | **Oui** | Prévu (cantinas, quartiers) — pas encore seedé |
| `forum` | Forum classique | **Oui** | Holonews, Présentations, Discussions HRP |

**Règle de navigation :** un nœud affiche ses **enfants** (`parent_id = id`) et/ou ses **sujets** (`topics.forum_id = id`). Les planètes et forums HRP sont des feuilles jouables ; les régions sont des hubs de navigation.

### Exemple d'arbre (Guerre des Clones)

```
forum_categories[2] Guerre des Clones
└── forums[region] Noyau Galactique
    ├── forums[region] Le Centre Politique
    │   ├── forums[planet] Coruscant          ← sujets RP ici
    │   └── forums[planet] Alderaan
    └── forums[region] Les Mondes Fondateurs
        ├── forums[planet] Corellia
        └── forums[planet] Kuat
```

Les seeds atlas (`03_atlas_clone_wars.sql`, `04_atlas_civil_war.sql`, `05_atlas_new_republic.sql`) construisent cet arbre via des blocs PL/pgSQL avec `RETURNING id INTO`.

### Champs

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant (utilisé dans les URLs `/forum/{id}`) |
| `category_id` | INTEGER FK | Catégorie parente (dénormalisé sur tout l'arbre pour requêtes simples) |
| `parent_id` | INTEGER FK self | Parent dans l'arbre, NULL = racine de la catégorie |
| `name` | TEXT | Nom du lieu ou du forum |
| `description` | TEXT | Lore / description (souvent longue sur les planètes) |
| `type` | `forum_type` | Niveau dans la hiérarchie |
| `coordinates` | JSONB | Position sur la carte galactique (futur #27), non peuplé actuellement |
| `image_url` | TEXT | Vignette |
| `header_image_url` | TEXT | Bannière |
| `required_role` | `user_role` | Accès restreint (ex. forum Modérateurs) |
| `display_order` | INTEGER | Tri parmi les frères |
| `topics_count` | INTEGER | Dénormalisé, compteur récursif |
| `posts_count` | INTEGER | Dénormalisé, compteur récursif |
| `created_at` / `updated_at` | TIMESTAMPTZ | Horodatage |

### Compteurs récursifs

Quand un sujet est créé dans Coruscant, les compteurs `topics_count` remontent :

```
Coruscant → Le Centre Politique → Noyau Galactique
```

Idem pour `posts_count` à chaque réponse. Version Docker (canonique) :

```sql
-- Remontée WHILE parent_id IS NOT NULL
UPDATE forums SET topics_count = topics_count + 1 WHERE id = current_forum_id;
SELECT parent_id INTO current_forum_id FROM forums WHERE id = current_forum_id;
```

**Migration Laravel :** reproduire via un `ForumObserver` ou un service `ForumStatsService` appelé à la création/suppression de topics/posts.

## Sujets (`topics`)

Un sujet est un fil de discussion dans un forum feuille.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant (`/topic/{id}`) |
| `forum_id` | INTEGER FK | Forum où le sujet est posté |
| `author_id` | UUID FK → `profiles` | Compte joueur auteur |
| `character_id` | UUID FK → `characters` | Personnage RP (optionnel, HRP si null) |
| `title` | TEXT | Titre du sujet |
| `replies_count` | INTEGER | Nombre de réponses (hors message initial) |
| `views_count` | INTEGER | Vues (incrémenté via RPC/service) |
| `is_pinned` | BOOLEAN | Épinglé en tête de liste |
| `is_locked` | BOOLEAN | Fermé aux nouvelles réponses |
| `last_post_id` | INTEGER | Dernier message (agrégation UI) |
| `created_at` / `updated_at` | TIMESTAMPTZ | Horodatage |

### Règles métier

- **RP :** `character_id` renseigné → le nom/couleur faction du perso s'affiche à la place du username
- **HRP :** `character_id` null → affichage du `profiles.username`
- Tri par défaut : épinglés d'abord, puis `updated_at` desc
- Modération : `is_locked` / `is_pinned` réservés aux rôles staff (Policy à écrire)

## Messages (`posts`)

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant |
| `topic_id` | INTEGER FK | Sujet parent |
| `author_id` | UUID FK → `profiles` | Compte auteur |
| `character_id` | UUID FK → `characters` | Personnage RP (optionnel) |
| `content` | TEXT | Corps du message (markdown ou HTML — à figer en #36) |
| `created_at` / `updated_at` | TIMESTAMPTZ | Horodatage |

### Évolutions prévues (hors schéma actuel)

| Issue | Extension |
|-------|-----------|
| #22 | Colonne ou table `dice_rolls` liée au post |
| #23 | Métadonnées d'évaluation IA sur le contenu |

À la création, `TopicForm` insère d'abord le `topic` (titre seul), puis le **premier `post`** avec le contenu. Le sujet ne porte pas de corps : le message initial est un post comme les autres.

## Relation avec les personnages

`characters` référence `forums` pour la **géolocalisation RP** :

| Colonne `characters` | FK | Usage |
|---------------------|-----|-------|
| `current_location_id` | `forums.id` | Position actuelle (planète/lieu) |
| `travel_origin_id` | `forums.id` | Départ du voyage |
| `travel_destination_id` | `forums.id` | Destination |
| `is_traveling` | BOOLEAN | En transit |
| `travel_start_time` / `travel_end_time` | TIMESTAMPTZ | Fenêtre de voyage |

Les forums géographiques ne sont pas qu'une UI : ils ancrent la position des personnages dans le monde.

## Forums HRP (seeds)

`02_forums_hrp.sql` — forums plats sous catégories non-ère :

| Catégorie | Forums |
|-----------|--------|
| Holonews (1) | Annonces, Présentations, Création de personnage |
| Social (5) | Discussions, Suggestions, Signaler un bug |
| Administratif (6) | Modérateurs (`moderator`), Administrateurs (`admin`) |

## Contrôle d'accès (cible Laravel)

| Ressource | Lecture | Écriture | Modération |
|-----------|---------|----------|------------|
| `forum_categories` | Tous | Admin Filament | Admin |
| `forums` | Selon `required_role` + ère | Admin Filament | Admin |
| `topics` | Tous | Utilisateur connecté | Auteur (edit) + staff (lock/pin) |
| `posts` | Tous | Utilisateur connecté | Auteur (edit) + staff |

Les policies RLS Postgres actuelles sont minimales (lecture publique, écriture si connecté). Laravel devra **renforcer** : vérification d'ère, forum verrouillé, rôle staff.

## Services à porter depuis les RPC Postgres

| RPC actuelle | Remplacement Laravel |
|--------------|---------------------|
| `get_global_stats()` | `PortalStatsService` (compte posts, topics, users, factions par ère) |
| `increment_topic_views(topic_id)` | `Topic::increment('views_count')` ou route dédiée |

## Index et performances

Requêtes fréquentes à optimiser en #36 :

- Forums par `category_id` + `parent_id IS NULL` (index racines)
- Enfants par `parent_id` (index)
- Topics par `forum_id` ORDER BY `is_pinned`, `updated_at`
- Posts par `topic_id` ORDER BY `created_at`

## Seeds Laravel (#31)

Ordre de chargement :

1. `ForumCategorySeeder` ← `01_categories.sql`
2. `ForumHrpSeeder` ← `02_forums_hrp.sql`
3. `ForumAtlasCloneWarsSeeder` ← `03_atlas_clone_wars.sql`
4. `ForumAtlasCivilWarSeeder` ← `04_atlas_civil_war.sql`
5. `ForumAtlasNewRepublicSeeder` ← `05_atlas_new_republic.sql`

Les blocs PL/pgSQL devront être convertis en code PHP (création séquentielle avec conservation des IDs ou mapping par nom).

## Modèles Eloquent envisagés

```php
ForumCategory hasMany Forum
Forum belongsTo ForumCategory
Forum belongsTo Forum (parent)
Forum hasMany Forum (children)
Forum hasMany Topic
Topic belongsTo Forum
Topic belongsTo Profile (author)
Topic belongsTo Character (nullable)
Topic hasMany Post
Post belongsTo Topic
Post belongsTo Profile (author)
Post belongsTo Character (nullable)
Character belongsTo Forum (currentLocation) // et travel fields
```

## Points à trancher en #36

1. **Format du contenu** — markdown, HTML sanitized, BBCode ?
2. **`last_post_id`** — maintenu par observer ou calculé à la volée ?
3. **Type `sector`** — utilisé ou supprimé de l'enum si jamais seedé ?
