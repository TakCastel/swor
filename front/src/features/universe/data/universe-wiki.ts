import { WikiCategory } from '../types';

export const UNIVERSE_WIKI: WikiCategory[] = [
  {
    id: 'history',
    title: 'Histoire & Époques',
    subCategories: [
      {
        id: 'eras',
        title: 'Grandes Éres',
        articles: [
          {
            id: 'clone-wars',
            category: 'Époque',
            title: 'La Guerre des Clones',
            excerpt: 'Un conflit galactique majeur opposant la République Galactique à la CSI.',
            metadata: {
              'Période': '22 BBY – 19 BBY',
              'Lieu': 'Galaxie entière',
              'Issue': 'Chute de la République, Avènement de l\'Empire',
              'Belligérants': ['République Galactique', 'CSI']
            },
            content: `
## Origines

La Guerre des Clones a commencé sur **Géonosis** après une période de tensions croissantes entre le Sénat Galactique et le mouvement séparatiste dirigé par le **Comte Dooku**. L'enlèvement d'Obi-Wan Kenobi et la découverte d'une armée secrète de clones sur Kamino ont précipité la galaxie dans le chaos.

## Le Conflit

Pendant trois ans, les **Chevaliers Jedi** ont mené les clones au combat sur des milliers de mondes. Ce fut une guerre d'attrition qui a épuisé les ressources de la galaxie et centralisé le pouvoir entre les mains du Chancelier Suprême **Palpatine**.

### Batailles Majeures
* **Bataille de Géonosis** : Le début officiel du conflit.
* **Bataille de Coruscant** : Une attaque audacieuse au cœur de la République.
* **Sièges de la Bordure Extérieure** : La phase finale et la plus sanglante de la guerre.

## La Fin de la Guerre

Le conflit s'est terminé brutalement avec l'Exécution de l'**Ordre 66**, la purge des Jedi et la transformation de la République en **Empire Galactique**. La mort du Général Grievous et du Conseil Séparatiste a marqué la fin de la CSI.
            `
          },
          {
            id: 'galactic-civil-war',
            category: 'Époque',
            title: 'La Guerre Civile Galactique',
            excerpt: 'La lutte héroïque de l\'Alliance Rebelle contre la tyrannie de l\'Empire.',
            metadata: {
              'Période': '2 BBY – 4 ABY (Principale)',
              'Lieu': 'Galaxie entière',
              'Issue': 'Victoire Rebelle, Mort de l\'Empereur',
              'Belligérants': ['Empire Galactique', 'Alliance Rebelle']
            },
            content: `
## L'Étincelle de la Rébellion

Née de la fusion de plusieurs cellules de résistance (comme celle de Lothal ou de Dantooine), l'**Alliance pour la Restauration de la République** a commencé par des actions de guérilla avant de devenir une menace sérieuse pour l'Empire après la victoire de Yavin.

## Belles Batailles

De la victoire de Yavin à la défaite impériale sur Endor, le conflit a vu l'utilisation de super-armes comme l'**Étoile de la Mort**.

### Chronologie des Victoires
1. **Bataille de Scarif** : Récupération des plans de l'Étoile de la Mort.
2. **Bataille de Yavin** : Destruction de la première station de combat.
3. **Bataille d'Endor** : Mort de l'Empereur et chute de la Seconde Étoile de la Mort.
            `
          }
        ]
      }
    ]
  },
  {
    id: 'society',
    title: 'Société & Culture',
    subCategories: [
      {
        id: 'factions',
        title: 'Organisations Politiques',
        articles: [
          {
            id: 'jedi-order',
            category: 'Organisation',
            title: 'L\'Ordre Jedi',
            excerpt: 'Une ancienne organisation monastique dévouée à l\'étude et à l\'utilisation de la Force.',
            metadata: {
              'Siège': 'Temple Jedi, Coruscant',
              'Philosophie': 'Côté Lumineux de la Force',
              'Rangs': ['Initié', 'Padawan', 'Chevalier', 'Maître', 'Grand Maître']
            },
            content: `
## Le Code Jedi

> Il n'y a pas d'émotion, il y a la paix.  
> Il n'y a pas d'ignorance, il y a la connaissance.  
> Il n'y a pas de passion, il y a la sérénité.  
> Il n'y a pas de chaos, il y a l'harmonie.  
> Il n'y a pas de mort, il y a la Force.

## Histoire

Pendant des millénaires, les Jedi ont servi de gardiens de la paix et de la justice dans la République Galactique. Ils utilisent des **sabres laser** et leurs capacités de connexion à la **Force** pour protéger les innocents.

### Structure
L'Ordre est dirigé par le **Conseil Supérieur Jedi**, composé de 12 maîtres éminents qui se réunissent dans l'une des quatre tours du Temple de Coruscant.
            `
          }
        ]
      },
      {
        id: 'religions',
        title: 'Religions & Force',
        articles: [
          {
            id: 'the-force',
            category: 'Phénomène',
            title: 'La Force',
            excerpt: 'Un champ d\'énergie créé par tout ce qui vit.',
            metadata: {
              'Aspects': ['Côté Lumineux', 'Côté Obscur', 'Force Vivante', 'Force Cosmique'],
              'Utilisateurs': ['Jedi', 'Sith', 'Sœurs de la Nuit']
            },
            content: `
## Nature de la Force

"Elle entoure chaque être vivant, nous pénètre et lie la galaxie ensemble." — *Obi-Wan Kenobi*

La Force se divise traditionnellement en deux aspects :
* **Le Côté Lumineux** : Basé sur la compassion, le désintéressement et la guérison.
* **Le Côté Obscur** : Alimenté par la peur, la colère et la haine.

## Les Midichloriens

Bien que la Force soit mystique, elle possède un aspect biologique. Les **midichloriens** sont des formes de vie microscopiques résidant dans les cellules de tous les êtres vivants, agissant comme un pont entre l'entité et la Force.
            `
          }
        ]
      }
    ]
  },
  {
    id: 'geography',
    title: 'Géographie Galactique',
    subCategories: [
      {
        id: 'regions',
        title: 'Régions de la Galaxie',
        articles: [
          {
            id: 'core-worlds',
            category: 'Région',
            title: 'Les Mondes du Noyau',
            excerpt: 'Le centre culturel, économique et politique de la galaxie.',
            metadata: {
              'Planètes Clés': ['Coruscant', 'Alderaan', 'Hosnian Prime'],
              'Richesse': 'Très Élevée'
            },
            content: `
## Importance

Le Noyau abrite les planètes les plus anciennes et les plus influentes de la galaxie. C'est ici que sont nés la République et l'Empire.

### Caractéristiques
* **Économie** : Hub commercial majeur.
* **Culture** : Berceau des arts et de la diplomatie.
* **Politique** : Siège du Sénat Galactique pendant des générations.
            `
          }
        ]
      },
      {
        id: 'planets',
        title: 'Planètes',
        articles: [
          {
            id: 'coruscant',
            category: 'Planète',
            title: 'Coruscant',
            excerpt: 'Une planète-cité cosmopolite servant de capitale galactique.',
            metadata: {
              'Région': 'Noyau',
              'Secteur': 'Secteur Coruscant',
              'Climat': 'Contrôlé artificiellement',
              'Population': '1 billion+'
            },
            content: `
## Niveaux de la Cité

La surface de Coruscant est divisée en des milliers de niveaux. 

### Les Hauts Niveaux
Le **niveau 5127** est le sommet, abritant les gratte-ciels les plus luxueux, le Sénat et le Temple Jedi. Ici, l'air est pur et la lumière du soleil constante.

### Les Bas-Fonds
Les niveaux inférieurs sont plongés dans l'obscurité perpétuelle. Le **Niveau 1313** est tristement célèbre pour son taux de criminalité, ses bars louches et son absence totale de juridiction impériale ou républicaine.
            `
          }
        ]
      }
    ]
  },
  {
    id: 'science',
    title: 'Science & Technologie',
    subCategories: [
      {
        id: 'starships',
        title: 'Vaisseaux Spatiaux',
        articles: [
          {
            id: 'star-destroyer',
            category: 'Vaisseau',
            title: 'Destroyer Stellaire classe Imperial-I',
            excerpt: 'Le symbole de la puissance navale de l\'Empire Galactique.',
            metadata: {
              'Constructeur': 'Chantiers Navals de Kuat',
              'Longueur': '1 600 mètres',
              'Armement': '60 batteries de turbolasers lourds',
              'Complément': '72 chasseurs TIE'
            },
            content: `
## Rôle Tactique

Conçu pour imposer l'ordre par la peur, un seul **Destroyer Stellaire** peut soumettre un système planétaire entier. Sa simple présence suffit souvent à faire cesser toute rébellion locale.

### Caractéristiques Techniques
* **Coque** : Blindage renforcé capable de résister à des tirs de croiseurs.
* **Hangar** : Capacité d'emport massive de troupes de choc et de véhicules de débarquement.
* **Rayon Tracteur** : Puissantes installations pour capturer les vaisseaux en fuite.
            `
          }
        ]
      }
    ]
  }
];



