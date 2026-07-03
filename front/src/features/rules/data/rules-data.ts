import { RuleSection } from '../types';

export const RULES_DATA: RuleSection[] = [
  {
    id: 'general',
    title: 'Généralités',
    description: 'Les bases pour bien vivre en communauté sur Swor.',
    content: `## Respect et courtoisie

Le respect est la base de notre communauté. Insultes, harcèlement, discrimination ou comportement toxique envers un autre membre sont interdits — en jeu comme hors jeu.

Les échanges sur le forum, le chat et les espaces réservés au staff doivent rester constructifs. En cas de conflit, privilégiez le dialogue ou contactez la modération plutôt que l'escalade publique.

## Votre compte

À l'inscription, vous choisissez un pseudo et créez votre profil. Un email de vérification vous est envoyé : validez-le pour profiter pleinement du site.

**Un compte = un joueur.** Les doubles comptes ne sont pas autorisés sans accord du staff. Vous pouvez supprimer votre compte à tout moment depuis les paramètres.

## Contenu des messages

Évitez le spam, la publicité non sollicitée et tout contenu illégal ou choquant. Des messages lisibles et soignés facilitent le jeu de tout le monde.

Pour votre avatar et vos images, utilisez les outils prévus sur le site.

## Sanctions

En cas de manquement aux règles, l'équipe (modérateurs, administrateurs, maîtres de jeu) peut verrouiller des sujets, restreindre l'accès à certains espaces ou appliquer des sanctions.

Celles-ci vont de l'avertissement à la suspension ou la suppression du compte. La décision du staff fait foi en cas de litige.`,
  },
  {
    id: 'roleplay',
    title: 'Système de Roleplay',
    description: 'Comment incarner votre personnage et jouer avec les autres.',
    content: `## En jeu et hors jeu

**En jeu (IC)** : vous écrivez au nom de votre personnage, à la troisième personne. Les scènes se déroulent dans les forums de votre ère — ouvrez un sujet pour lancer une scène, répondez pour la faire avancer.

**Hors jeu (OOC)** : pour parler en tant que joueur, utilisez les forums HRP ou signalez clairement un aparté. Ne mélangez jamais une information apprise hors jeu avec ce que votre personnage est censé savoir.

## Écrire sur le forum

Vous devez être connecté pour publier. Lorsque vous rédigez une scène, sélectionnez le **personnage** que vous incarnez : c'est lui qui apparaîtra comme auteur de vos actions. Réservez les messages sans personnage aux échanges hors jeu.

## Powergaming

Il est interdit de **forcer** une action sur le personnage d'un autre joueur sans lui laisser de marge de réaction, ou de vous attribuer des capacités que votre fiche ne justifie pas.

En cas de désaccord, parlez-en hors jeu ou faites appel à un maître de jeu.

## Metagaming

Votre personnage ne sait que ce qu'il a vécu ou entendu **en scène**. Utiliser Discord, des messages privés ou la lecture d'un sujet où il n'était pas présent pour le faire agir est interdit.

## Les trois ères

Swor propose trois périodes jouables : la Guerre des Clones, la Guerre Civile Galactique et la Nouvelle République. Chaque zone du forum correspond à une ère — jouez avec un personnage de la bonne période.

Vous pouvez avoir plusieurs personnages dans différentes ères, mais un seul est **actif** à la fois. Changez-le depuis votre profil avant de jouer ailleurs.`,
  },
  {
    id: 'characters',
    title: 'Gestion des Personnages',
    description: 'Créer et faire évoluer vos personnages.',
    content: `## Créer un personnage

Depuis votre profil, remplissez la fiche de création : **nom**, **espèce**, **métier**, **ère**, et éventuellement une **faction**.

Choisissez jusqu'à **trois compétences** et un **objet de départ** lié à votre métier. Vous débutez avec **2 000 crédits**. Votre nouveau personnage devient automatiquement celui avec lequel vous jouez.

## Une fiche crédible

Prenez le temps de décrire l'apparence, la personnalité et l'histoire de votre héros. Il doit être cohérent avec l'univers Star Wars et l'ère choisie.

Les personnages « parfaits » sans faille, ou incohérents avec la période, pourront être demandés en révision par le staff.

## Factions

À la création, vous pouvez rejoindre une faction proposée dans la liste. Votre affiliation est visible sur votre fiche.

Pour changer de camp en cours de partie, cela doit se **jouer en scène** — pas seulement en modifiant votre fiche.

## Plusieurs personnages

Vous pouvez en créer jusqu'à **six** par compte, répartis entre les trois ères. Un seul est actif à la fois : c'est celui proposé quand vous écrivez sur le forum.

## Modifier sa fiche

Vous pouvez mettre à jour votre avatar et vos textes descriptifs à tout moment. En revanche, l'ère, le métier et l'espèce sont fixés à la création. Pour un changement majeur, créez un nouveau personnage ou demandez l'avis du staff.`,
  },
  {
    id: 'economy',
    title: 'Économie & Équipement',
    description: 'Gérer vos crédits, votre équipement et votre vaisseau.',
    content: `## Vos crédits

Chaque personnage possède un portefeuille de **crédits**, visible sur sa fiche. Au départ, vous disposez de **2 000 crédits**.

Vous pouvez y indiquer vos revenus et dépenses habituels. Les gains et les dépenses en jeu se justifient par vos scènes — pas par magie hors RP.

## Inventaire

À la création, vous recevez un **objet de départ** adapté à votre métier. Votre inventaire complet est consultable sur la fiche personnage.

Pour obtenir de nouveaux objets en cours de partie, jouez-le en scène. Le staff peut valider les acquisitions importantes.

## Vaisseau

Si votre personnage en possède un, sa fiche détaille le modèle et les améliorations (moteur, boucliers, armement…).

Toute modification notable doit être cohérente avec vos crédits et vos aventures, et indiquée sur votre fiche pour que les autres joueurs en soient informés.

## Résolution des actions

Les combats et situations tendues se règlent pour l'instant **à l'écrit**, en négociant avec les autres joueurs. En cas de blocage, un maître de jeu peut arbitrer.`,
  },
];

export function getRuleSection(id: string): RuleSection | undefined {
  return RULES_DATA.find((section) => section.id === id);
}
