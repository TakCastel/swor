import { RuleSection } from '../types';

export const RULES_DATA: RuleSection[] = [
  {
    id: 'general',
    title: 'Généralités',
    description: 'Les bases de la vie en communauté sur Swor.',
    rules: [
      {
        id: 'G1',
        title: 'Respect et Courtoisie',
        content: 'Le respect est la base de notre communauté. Toute insulte, harcèlement, discrimination ou comportement toxique envers un autre membre est strictement interdit. Soyez constructif et bienveillant dans vos échanges.'
      },
      {
        id: 'G2',
        title: 'Contenu des Messages',
        content: 'Évitez le spam, la publicité non sollicitée et le contenu inapproprié. Assurez-vous que vos messages sont lisibles, avec une orthographe et une grammaire correctes.'
      },
      {
        id: 'G3',
        title: 'Sanctions',
        content: 'Le non-respect des règles pourra entraîner des sanctions allant de l\'avertissement à la suppression de compte. L\'équipe de modération a le dernier mot en cas de litige.'
      }
    ]
  },
  {
    id: 'roleplay',
    title: 'Système de Roleplay',
    description: 'Comment jouer et interagir avec les autres joueurs.',
    rules: [
      {
        id: 'R1',
        title: 'Le Roleplay (IC vs OOC)',
        content: 'Restez dans votre personnage (In-Character, IC) dans les sections de jeu. Les discussions hors-jeu (Out-of-Character, OOC) doivent se faire dans les forums désignés ou en utilisant des balises spécifiques.'
      },
      {
        id: 'R2',
        title: 'Powergaming',
        content: 'Le Powergaming est interdit. Cela inclut forcer des actions sur le personnage d\'un autre joueur sans lui laisser de chance de réagir ou donner des capacités surpuissantes à votre personnage sans justification.'
      },
      {
        id: 'R3',
        title: 'Metagaming',
        content: 'Le Metagaming est strictement interdit. Cela consiste à utiliser des informations apprises hors-jeu (OOC) pour faire agir votre personnage en jeu (IC).'
      }
    ]
  },
  {
    id: 'characters',
    title: 'Gestion des Personnages',
    description: 'De la création à la destinée de vos héros.',
    rules: [
      {
        id: 'C1',
        title: 'Cohérence avec l\'Univers',
        content: 'Votre personnage doit être cohérent avec l\'univers de Star Wars et l\'époque choisie. Les personnages "Mary Sue" ou "Gary Stu" ne seront pas acceptés.'
      },
      {
        id: 'C2',
        title: 'Validation des Fiches',
        content: 'Avant de pouvoir jouer, votre fiche de personnage doit être validée par un membre de l\'équipe administrative.'
      },
      {
        id: 'C3',
        title: 'Double Compte',
        content: 'Les doubles comptes sont autorisés sous certaines conditions (activité régulière sur le premier compte, accord du staff).'
      }
    ]
  },
  {
    id: 'economy',
    title: 'Économie & Vaisseaux',
    description: 'La gestion des crédits galactiques et de votre flotte personnelle.',
    rules: [
      {
        id: 'E1',
        title: 'Système de Crédits',
        content: 'Chaque joueur dispose d\'un compte de crédits impériaux/républicains. Ces crédits sont gagnés via vos actions en RP (missions, travail, commerce) et permettent d\'acheter des équipements, des services ou des vaisseaux.'
      },
      {
        id: 'E2',
        title: 'Vaisseau Personnel',
        content: 'Chaque nouveau personnage commence son aventure avec un vaisseau de base (classe navette ou chasseur léger). Ce vaisseau est votre foyer mobile dans la galaxie.'
      },
      {
        id: 'E3',
        title: 'Customisation & Pièces',
        content: 'Vous pouvez améliorer votre vaisseau en achetant des pièces détachées (moteurs, boucliers, armement). La customisation doit être notée sur votre fiche technique et validée par un MJ pour être effective en jeu.'
      }
    ]
  }
];

