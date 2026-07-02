# Swor — workflow de développement

Comment on organise le travail : branches, releases, et suivi des epics / user stories / tickets.

## Branches

| Branche       | Rôle                                                        |
|---------------|---------------------------------------------------------------|
| `main`        | Toujours déployable. Releases uniquement, taguées (`v1.2.0`). |
| `develop`     | Intégration des features en cours, base des branches de travail. |
| `feature/...` | Une branche par ticket, créée depuis `develop`.                |

### Convention de nommage des branches

```
feature/<numéro-issue>-<slug-court>
```

Exemple : `feature/42-creation-personnage`

## 1. Travailler sur un ticket

```bash
git checkout develop
git pull
git checkout -b feature/42-creation-personnage
```

Développer, commiter, puis pousser :

```bash
git push -u origin feature/42-creation-personnage
```

Ouvrir une Pull Request **vers `develop`** en référençant le ticket (`Closes #42`) pour qu'il se ferme automatiquement à la fusion.

## 2. Revue et fusion

- Au moins une review avant merge (dès qu'il y a plusieurs contributeurs actifs).
- La CI (`.github/workflows/ci.yml`) doit passer.
- Merge dans `develop`, suppression de la branche `feature/...`.

## 3. Release

Quand `develop` est stable et prêt à partir en prod :

```bash
git checkout main
git pull
git merge --no-ff develop
git tag vX.Y.Z
git push origin main --tags
```

Le déploiement suit ensuite [`DEPLOY.md`](../DEPLOY.md).

## Suivi : epics, user stories, tickets

Tout le suivi est centralisé sur GitHub (pas de duplication en markdown) :

- **Epic** = un [Milestone](https://github.com/TakCastel/swor/milestones) (`EPIC: <nom>`), reprend les grandes fonctionnalités du produit (Forum RP, Personnages, Factions, Univers, Règles, Authentification, Chat, Back-office, Portail).
- **User story** = une issue créée avec le template *User Story* (label `type:story`), rattachée à un epic via le champ Milestone.
- **Ticket** = une issue créée avec le template *Ticket* (label `type:task`), tâche technique unitaire, référence sa story parente si besoin (`#123`).
- **Suivi visuel** = le [board du projet](https://github.com/users/TakCastel/projects/2) (`Swor Roadmap`), colonnes `Backlog → To do → In progress → Review → Done`.

### Créer une story ou un ticket

Nouvelle issue → choisir le template *User Story* ou *Ticket* → renseigner le Milestone (epic) → ajouter l'item au projet `Swor Roadmap`.

### Labels

| Label            | Usage                          |
|------------------|---------------------------------|
| `type:story`     | User story                      |
| `type:task`      | Ticket technique                |
| `priority:high`  | À traiter en priorité           |
| `priority:medium`| Priorité normale                |
| `priority:low`   | Peut attendre                   |
