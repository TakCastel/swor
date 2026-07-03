import { WikiCategory } from '../types';

export const UNIVERSE_WIKI: WikiCategory[] = [
  // =========================================================================
  // LE SERVEUR
  // =========================================================================
  {
    id: 'server',
    title: 'Le Serveur',
    subCategories: [
      {
        id: 'welcome',
        title: 'Bienvenue',
        articles: [
          {
            id: 'la-galaxie-swor',
            category: 'Le Serveur',
            title: 'La galaxie de Swor',
            excerpt: 'Un univers Star Wars persistant, écrit par ses joueurs, à travers trois grandes époques de la saga.',
            metadata: {
              'Type de jeu': 'RP narratif par forum',
              'Ères jouables': ['Guerre des Clones', 'Guerre Civile Galactique', 'Nouvelle République'],
              'Personnages': 'Jusqu\'à 6 par joueur',
            },
            content: `
Swor est un **jeu de rôle textuel** : ici, on ne clique pas sur des boutons pour gagner, on **écrit**. Chaque sujet du forum RP est une scène ; chaque réponse est un moment de l'histoire de votre personnage. La galaxie de Swor est persistante — ce que les joueurs y font laisse des traces : une planète peut changer de mains, une faction peut s'effondrer, et les grands événements joués entrent dans la chronologie du serveur.

## Trois époques, trois terrains de jeu

La galaxie de Swor se joue à travers **trois ères distinctes**, chacune avec son ambiance, ses conflits et ses factions. Chaque ère dispose de sa propre section du forum, avec ses planètes et ses lieux.

* **La Guerre des Clones** (22–19 BBY) — la République et les Jedi contre les Séparatistes. Guerre totale, héroïsme militaire, intrigues politiques et crépuscule d'un âge d'or.
* **La Guerre Civile Galactique** (2 BBY–4 ABY) — l'Empire écrase la galaxie, la Rébellion s'organise dans l'ombre. Résistance, contrebande, terreur impériale.
* **La Nouvelle République** (à partir de 5 ABY) — l'Empire est tombé, tout est à reconstruire. Diplomatie fragile, seigneurs de guerre impériaux, far west galactique.

Un personnage appartient à **une seule ère** : c'est son époque, il y vit et y meurt. Rien ne vous empêche en revanche de créer plusieurs personnages (jusqu'à six) répartis sur plusieurs ères, et de basculer de l'un à l'autre.

## Comment on joue

1. **Créez votre personnage** — son espèce, son métier, son passé, sa faction. C'est lui que vous incarnerez dans les forums de son ère.
2. **Rejoignez une scène ou ouvrez la vôtre** — chaque planète du forum est un lieu de RP. Un sujet = une scène, avec les personnages qui s'y trouvent.
3. **Écrivez à la troisième personne**, au passé ou au présent, en décrivant les actions et les paroles de votre personnage — jamais celles des autres.
4. **Vivez avec les conséquences** — vos crédits, votre inventaire, votre vaisseau et votre réputation évoluent au fil de vos aventures.

> L'univers raconte **ce qui se passe** ; le [règlement](/rules) explique **comment ça marche** (systèmes de jeu, économie, création de personnage). Les deux se complètent.

## Le canon de Swor

Swor s'appuie sur l'univers Star Wars que tout le monde connaît, mais **le canon du serveur prime** : les grands événements des films servent de toile de fond, et ce que les joueurs écrivent par-dessus devient l'histoire officielle de *notre* galaxie. Ne vous attendez pas à croiser Luke Skywalker au détour d'une cantina — les héros de cette galaxie, c'est vous.
            `,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // FONDAMENTAUX
  // =========================================================================
  {
    id: 'fundamentals',
    title: 'Fondamentaux',
    subCategories: [
      {
        id: 'cosmology',
        title: 'Cosmologie',
        articles: [
          {
            id: 'the-force',
            category: 'Fondamentaux',
            title: 'La Force',
            excerpt: 'Un champ d\'énergie créé par tout ce qui vit — et l\'enjeu invisible de tous les grands conflits de la galaxie.',
            metadata: {
              'Aspects': ['Côté Lumineux', 'Côté Obscur'],
              'Traditions': ['Jedi', 'Sith', 'Adeptes indépendants'],
              'En jeu': 'Classes FORCE à la création',
            },
            content: `
> « Elle entoure chaque être vivant, nous pénètre et lie la galaxie ensemble. » — *Obi-Wan Kenobi*

La Force est un champ d'énergie mystique généré par la vie elle-même. La plupart des habitants de la galaxie n'en perçoivent rien ; une infime minorité y est **sensible**, et une poignée seulement apprend à la manier. C'est cette poignée qui, de siècle en siècle, fait basculer l'histoire.

## Les deux visages

* **Le Côté Lumineux** — la sérénité, la compassion, le détachement. Il demande une discipline de fer : l'utilisateur sert la Force, jamais l'inverse. C'est la voie des Jedi.
* **Le Côté Obscur** — la passion, la colère, la peur transformées en puissance immédiate. Plus rapide, plus séduisant, et dévorant : le Côté Obscur finit toujours par consumer celui qui croit s'en servir. C'est la voie des Sith.

La frontière n'est pas un mur. Bien des utilisateurs de la Force naviguent dans le gris — gardiens de traditions oubliées, mystiques de mondes isolés, ou simples individus doués qui refusent les dogmes des grands ordres.

## Les sensibles à la Force sur Swor

Chaque ère traite les porteurs de ce don différemment, et c'est un des grands leviers dramatiques du serveur :

* **Guerre des Clones** — les Jedi sont au sommet de leur puissance et servent de généraux à la République. Être sensible à la Force, c'est être remarqué, recruté… ou caché par des parents méfiants.
* **Guerre Civile Galactique** — l'Ordre 66 est passé par là. Les survivants Jedi se terrent, les Inquisiteurs les traquent, et le simple mot « Force » se murmure. Jouer un sensible à la Force à cette époque, c'est jouer un fugitif.
* **Nouvelle République** — l'Empire est tombé, les traditions renaissent de leurs cendres. Les artefacts, les temples oubliés et les savoirs perdus attisent toutes les convoitises.

## En jeu

Les métiers de la catégorie **FORCE** (Jedi, Sith, Adepte) sont accessibles à la création de personnage. Un porteur de sabre laser n'est pas invincible pour autant : la puissance attire l'attention, et les récits les plus intéressants naissent des limites, pas de la toute-puissance. Le détail des compétences se trouve dans le [règlement des personnages](/rules/characters).
            `,
          },
          {
            id: 'galaxy-regions',
            category: 'Fondamentaux',
            title: 'La galaxie et ses régions',
            excerpt: 'Du Noyau scintillant à la Bordure Extérieure sans loi : la géographie qui façonne tous les récits.',
            metadata: {
              'Régions majeures': ['Noyau', 'Colonies', 'Bordure Intérieure', 'Bordure Extérieure'],
              'Capitale historique': 'Coruscant',
              'En jeu': 'Chaque planète = un forum',
            },
            content: `
La galaxie compte des centaines de milliards d'étoiles, mais son histoire s'écrit le long de quelques routes hyperspatiales. Comprendre sa géographie, c'est comprendre pourquoi les guerres éclatent où elles éclatent — et où votre personnage a ses chances de faire fortune ou de disparaître.

## Les Mondes du Noyau

Le cœur politique, économique et culturel de la galaxie. **Coruscant**, la planète-cité, y règne depuis des millénaires : c'est là que siègent le Sénat, les grandes banques et les ordres anciens. Les mondes du Noyau sont riches, policés, saturés de protocole — et c'est précisément là que les intrigues de couloir font le plus de dégâts.

## Les Colonies et la Bordure Intérieure

Les régions intermédiaires : industrielles, peuplées, loyales au pouvoir central tant qu'il paie. Les chantiers navals, les mondes agricoles et les carrefours commerciaux s'y concentrent. Quand la guerre éclate, c'est ici qu'on recrute les soldats et qu'on réquisitionne les usines.

## La Bordure Extérieure

Loin du Noyau, la loi s'arrête où commence le désert. La Bordure Extérieure, c'est **Tatooine**, **Géonosis**, les comptoirs Hutts, les mines oubliées et les colonies frontières. Le pouvoir central y est une rumeur ; les cartels, les chasseurs de primes et les contrebandiers y sont la réalité quotidienne. La plupart des grandes batailles de l'histoire récente s'y sont jouées — et la plupart des fortunes aussi.

## Les routes hyperspatiales

Voyager dans la galaxie ne se fait pas en ligne droite : on suit des **routes hyperspatiales** cartographiées de longue date (la Voie Corellienne, la Route Commerciale de Rimma, la Passe de Kessel…). Contrôler une route, c'est contrôler le commerce, les renforts et les taxes. Les stratèges le savent ; les contrebandiers encore mieux.

## En jeu

Sur Swor, la galaxie se parcourt à travers l'**atlas du forum** : chaque ère a ses régions, chaque région ses planètes, chaque planète ses lieux de RP. Votre personnage se trouve toujours quelque part — et le voyage entre deux mondes fait partie de l'histoire.
            `,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // GUERRE DES CLONES
  // =========================================================================
  {
    id: 'clone-wars',
    title: 'Guerre des Clones',
    subCategories: [
      {
        id: 'cw-era',
        title: 'L\'ère',
        articles: [
          {
            id: 'cw-context',
            category: 'Guerre des Clones',
            title: 'La République en guerre',
            excerpt: 'Trois ans de guerre totale entre la République Galactique et les Séparatistes — le crépuscule d\'un âge d\'or de mille ans.',
            metadata: {
              'Période': '22 BBY – 19 BBY',
              'Belligérants': ['République Galactique', 'Confédération (CSI)'],
              'Ambiance': 'Guerre héroïque, intrigues, fin d\'un monde',
            },
            content: `
Pendant mille ans, la République Galactique a maintenu la paix sans armée. Cet âge d'or s'achève sur **Géonosis**, quand le mouvement séparatiste du **Comte Dooku** révèle ses légions de droïdes — et que la République dévoile, comme par miracle, une armée de clones commandée par les Jedi. La galaxie bascule dans la première guerre totale de son histoire moderne.

## Le conflit

La guerre fait rage sur des milliers de mondes à la fois. Les **Chevaliers Jedi**, gardiens de la paix devenus généraux malgré eux, mènent les clones au front pendant que le Sénat s'enlise dans les manœuvres politiques et que le Chancelier **Palpatine** accumule, vote après vote, des pouvoirs d'exception qu'il ne rendra jamais.

### Les grandes phases

* **Géonosis (22 BBY)** — la bataille d'ouverture : les Jedi décimés dans l'arène, la guerre déclarée.
* **La guerre d'usure (22–20 BBY)** — offensives et contre-offensives le long des grandes routes hyperspatiales ; chaque monde devient un front.
* **Les Sièges de la Bordure Extérieure (19 BBY)** — la phase finale, la plus sanglante, qui éloigne les Jedi du Noyau… au moment précis où ils y seraient le plus utiles.

## L'envers du décor

Officiellement, c'est une guerre entre la démocratie et la sécession. En réalité, les deux camps dansent au bout des fils du même marionnettiste. Personne ne le sait encore — et c'est ce qui rend cette époque si vertigineuse à jouer : **les joueurs savent comment l'histoire finit, pas les personnages.**

## Ce qu'on y joue sur Swor

* **Soldats et officiers** de la Grande Armée : la fraternité du front, les ordres douteux, l'usure de la guerre.
* **Jedi** tiraillés entre leur code et leur rôle de général — et Padawans qui grandissent trop vite.
* **Sénateurs, diplomates et espions** qui se battent à coup de votes, de scandales et de renseignements.
* **Civils, marchands et contrebandiers** pour qui la guerre est une catastrophe… ou une opportunité en or.

C'est l'ère des grandes fresques militaires et des dilemmes moraux : l'héroïsme y est possible, mais le sol s'effrite sous les pieds de tout le monde.
            `,
          },
        ],
      },
      {
        id: 'cw-factions',
        title: 'Forces en présence',
        articles: [
          {
            id: 'cw-republic',
            category: 'Guerre des Clones',
            title: 'La République & la Grande Armée',
            excerpt: 'Une démocratie millénaire qui découvre la guerre — armée de soldats nés dans des cuves.',
            metadata: {
              'Capitale': 'Coruscant',
              'Dirigeant': 'Chancelier Suprême Palpatine',
              'Forces': ['Grande Armée (clones)', 'Flotte de la République', 'Ordre Jedi'],
            },
            content: `
La **République Galactique** est la plus vieille institution de la galaxie : un parlement de milliers de mondes, un droit commun, une monnaie, et jusqu'ici aucune armée. La guerre la transforme à toute vitesse en machine militaire — et cette transformation est précisément le piège qui se referme sur elle.

## La Grande Armée

Les **clones** sont nés sur Kamino, élevés pour servir, génétiquement identiques et pourtant tous différents. Chaque trooper a son numéro — et, très vite, un nom, des cicatrices, des frères perdus. Ce sont d'excellents soldats et des personnages formidables : loyaux par conception, humains par accident.

### Structure

* **Le Sénat** vote les crédits, les lois d'exception et les levées de troupes — chaque vote est une bataille en soi.
* **Le commandement Jedi** : les généraux de la République sont des moines-guerriers qui n'ont jamais voulu de ce rôle.
* **La flotte** : croiseurs *Venator*, canonnières LAAT, escadrilles de chasseurs — l'industrie de guerre tourne à plein régime.

## Jouer la République

Un clone qui se demande qui il serait sans la guerre ; un officier non-clone jaloux des Jedi ; un fonctionnaire du Sénat qui découvre une corruption trop grosse pour lui ; un sénateur idéaliste qui vote, la mort dans l'âme, des pouvoirs spéciaux « temporaires ». La République se joue comme un empire de bonnes intentions en train de pourrir de l'intérieur.
            `,
          },
          {
            id: 'cw-separatists',
            category: 'Guerre des Clones',
            title: 'La Confédération des Systèmes Indépendants',
            excerpt: 'Des milliers de mondes qui claquent la porte de la République — financés par les plus grandes corporations de la galaxie.',
            metadata: {
              'Capitale': 'Raxus (politique), Géonosis (industrielle)',
              'Dirigeant': 'Comte Dooku',
              'Forces': ['Armée droïde', 'Flotte confédérée', 'Acolytes du Comte'],
            },
            content: `
La **Confédération des Systèmes Indépendants** n'est pas née mauvaise. Elle est née de mondes de la Bordure épuisés par les taxes du Noyau, ignorés par le Sénat et saignés par des décennies de corruption. Quand le charismatique **Comte Dooku** — ancien Jedi, aristocrate, orateur redoutable — leur promet l'indépendance, des milliers de systèmes le suivent.

## L'armée qui ne dort jamais

La CSI compense son manque de soldats par l'industrie : les fonderies de **Géonosis** et les chantiers de la Fédération du Commerce produisent des **droïdes de combat** par milliards. Un droïde ne recule pas, ne se fatigue pas, ne pose pas de questions — et il est remplaçable à l'infini. Face à des clones élevés pour être des hommes, la Confédération aligne des machines conçues pour être des nombres.

### Les visages de la Confédération

* **Les idéalistes** — sénateurs et gouverneurs sécessionnistes qui croient sincèrement bâtir une union plus juste.
* **Les corporations** — Fédération du Commerce, Techno-Union, Clan Bancaire : la guerre est leur meilleur investissement.
* **Les exécuteurs** — le Général **Grievous** et les acolytes du Comte, pour qui l'idéal n'a jamais été qu'un prétexte.

## Jouer la Confédération

Un monde séparatiste n'est pas un repaire de méchants : c'est une planète ordinaire qui a cru à une promesse. Jouez un officier confédéré qui se bat pour son monde natal, un ingénieur de la Techno-Union qui ferme les yeux, une diplomate de Raxus qui voit l'idéal sécessionniste se faire dévorer par les corporations. La tragédie de la CSI, c'est que ses meilleurs éléments se battent pour une cause déjà vendue.
            `,
          },
          {
            id: 'jedi-order',
            category: 'Guerre des Clones',
            title: 'L\'Ordre Jedi',
            excerpt: 'Dix mille moines-guerriers, gardiens de la paix depuis mille générations — précipités dans une guerre qui les dévore.',
            metadata: {
              'Siège': 'Temple Jedi, Coruscant',
              'Philosophie': 'Côté Lumineux de la Force',
              'Rangs': ['Initié', 'Padawan', 'Chevalier', 'Maître'],
            },
            content: `
> Il n'y a pas d'émotion, il y a la paix.
> Il n'y a pas d'ignorance, il y a la connaissance.
> Il n'y a pas de passion, il y a la sérénité.
> Il n'y a pas de chaos, il y a l'harmonie.
> Il n'y a pas de mort, il y a la Force.

Pendant mille générations, les **Jedi** ont servi la République comme médiateurs, protecteurs et sages. Ils ne sont ni une armée ni une police : un ordre monastique d'environ dix mille membres, formés dès l'enfance au Temple de Coruscant, liés par un code austère et une confiance absolue dans la Force.

## L'Ordre en guerre

La Guerre des Clones brise cet équilibre. Du jour au lendemain, les gardiens de la paix deviennent **généraux** : ils commandent des légions, ordonnent des bombardements, envoient des hommes mourir. Chaque année de guerre éloigne l'Ordre de son code — et le Conseil le sait, sans pouvoir l'empêcher.

### Structure

* **Le Conseil Supérieur** — douze maîtres qui orientent l'Ordre depuis la plus haute tour du Temple.
* **Chevaliers et Maîtres** — déployés sur tous les fronts, souvent seuls avec leurs clones et leurs doutes.
* **Padawans** — des adolescents formés au sabre entre deux batailles, qui apprennent la guerre avant la sagesse.

## Jouer un Jedi

Un Jedi de cette ère se joue au bord du gouffre : le code interdit l'attachement, la guerre ne produit que ça. Les meilleurs récits Jedi de Swor ne sont pas des démonstrations de puissance — ce sont des histoires de fidélité mise à l'épreuve : à l'Ordre, à ses hommes, à ce qu'on croyait être.
            `,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // GUERRE CIVILE GALACTIQUE
  // =========================================================================
  {
    id: 'civil-war',
    title: 'Guerre Civile Galactique',
    subCategories: [
      {
        id: 'gcw-era',
        title: 'L\'ère',
        articles: [
          {
            id: 'gcw-context',
            category: 'Guerre Civile Galactique',
            title: 'L\'Empire contre la Rébellion',
            excerpt: 'La galaxie sous la botte impériale, et l\'étincelle de résistance qui refuse de s\'éteindre.',
            metadata: {
              'Période': '2 BBY – 4 ABY',
              'Belligérants': ['Empire Galactique', 'Alliance Rebelle'],
              'Ambiance': 'Résistance, clandestinité, terreur d\'État',
            },
            content: `
La République est morte sous les applaudissements. De ses cendres, le Chancelier Palpatine — désormais **Empereur** — a bâti un régime de fer : l'**Empire Galactique**. Les Jedi ont été exterminés par l'Ordre 66, le Sénat n'est plus qu'une chambre d'enregistrement, et une flotte de Destroyers Stellaires rappelle à chaque monde le prix de la désobéissance.

## La nuit impériale

Pendant près de vingt ans, l'Empire semble invincible. La délation est un devoir civique, les espèces non-humaines sont des citoyens de seconde zone, et les mondes récalcitrants découvrent ce que « pacification » veut dire. Pourtant, partout, des braises couvent : cellules de résistance isolées, sénateurs dissidents, déserteurs impériaux, mondes en grève.

### La guerre ouverte

* **La déclaration de la Rébellion (2 BBY)** — les cellules éparses s'unissent en une **Alliance pour la Restauration de la République**.
* **Scarif et Yavin (0 BBY)** — le vol des plans de l'Étoile de la Mort, puis sa destruction : la preuve que l'Empire peut saigner.
* **La traque (0–3 ABY)** — l'Empire riposte, chasse la flotte rebelle de base en base ; l'Alliance survit en fuyant.
* **Endor (4 ABY)** — la bataille qui décapite l'Empire : l'Empereur meurt, la seconde Étoile de la Mort brûle dans le ciel.

## Ce qu'on y joue sur Swor

* **Rebelles** — pilotes, saboteurs, agents de renseignement : la guerre depuis les soutes de cargos et les bases humides.
* **Impériaux** — officiers ambitieux, pilotes de TIE, bureaucrates zélés ou fonctionnaires qui commencent à douter.
* **La zone grise** — contrebandiers, informateurs, chasseurs de primes : ceux qui vendent aux deux camps et ne croient qu'aux crédits.
* **Civils** sous occupation, pour qui l'héroïsme consiste d'abord à survivre.

C'est l'ère du clair-obscur : la tyrannie est écrasante, les victoires se paient cher, et chaque choix — collaborer, résister, fuir — est un récit en soi.
            `,
          },
        ],
      },
      {
        id: 'gcw-factions',
        title: 'Forces en présence',
        articles: [
          {
            id: 'galactic-empire',
            category: 'Guerre Civile Galactique',
            title: 'L\'Empire Galactique',
            excerpt: 'Un ordre de fer imposé à un million de mondes — efficace, implacable, et pourri par sa propre peur.',
            metadata: {
              'Capitale': 'Coruscant (Centre Impérial)',
              'Dirigeant': 'L\'Empereur Palpatine',
              'Forces': ['Marine Impériale', 'Stormtroopers', 'ISB (Sécurité Impériale)'],
            },
            content: `
L'**Empire** n'a pas conquis la galaxie : il l'a héritée, par un vote, dans la liesse générale. C'est ce qui le rend si solide — et si effrayant. Des millions de fonctionnaires, d'officiers et de citoyens ordinaires font tourner la machine, convaincus de servir l'ordre et la stabilité.

## Les instruments du pouvoir

* **La Marine Impériale** — des milliers de Destroyers Stellaires quadrillent les routes hyperspatiales. Un seul suffit à soumettre un système.
* **Les Stormtroopers** — le poing blanc de l'Empire : casernés sur chaque monde qui compte, premiers débarqués sur chaque monde qui résiste.
* **L'ISB** — le Bureau de la Sécurité Impériale voit tout, fiche tout, et fait disparaître ce qui dépasse. La peur qu'il inspire fait la moitié de son travail.
* **Les Moffs et Grands Moffs** — gouverneurs de secteurs entiers, petits empereurs régionaux qui rivalisent d'ambition et de cruauté.

## L'envers de l'uniforme

L'Empire promeut au mérite — c'est sa force de séduction : un roturier doué peut y grimper plus vite que dans l'aristocratie de l'ancienne République (à condition d'être humain). Mais l'appareil dévore les siens : la rivalité y est un mode de gestion et l'échec un crime.

## Jouer l'Empire

Jouer impérial, ce n'est pas jouer « le méchant » : c'est jouer quelqu'un qui a de bonnes raisons — carrière, famille, foi sincère dans l'ordre — de servir une machine qui broie. Officier loyal qui découvre un massacre classé secret, jeune diplômé de l'académie confronté à sa première purge, agent de l'ISB trop doué pour son propre bien : les meilleurs personnages impériaux sont ceux qui ont quelque chose à perdre.
            `,
          },
          {
            id: 'rebel-alliance',
            category: 'Guerre Civile Galactique',
            title: 'L\'Alliance Rebelle',
            excerpt: 'Des cellules éparses devenues armée : la résistance qui a choisi l\'espoir contre la raison.',
            metadata: {
              'Base': 'Mobile (Yavin IV, Hoth, flotte)',
              'Dirigeants': 'Mon Mothma, Haut Commandement allié',
              'Forces': ['Escadrons de chasseurs', 'Cellules locales', 'Réseau d\'espionnage'],
            },
            content: `
L'**Alliance pour la Restauration de la République** est née de tout ce que l'Empire a écrasé : sénateurs déchus, mondes punis, soldats déserteurs, familles de disparus. Ce n'est pas une armée régulière — c'est une coalition de désespérés magnifiques, tenue par une conviction : la galaxie mérite mieux.

## Une guerre d'asymétrie

L'Alliance ne peut pas gagner une bataille rangée, alors elle n'en livre pas. Elle frappe et disparaît : convois pillés, relais de communication sabotés, prisonniers évadés, gouverneurs humiliés. Chaque victoire est d'abord un **symbole** — la preuve, diffusée de monde en monde, que l'Empire n'est pas invincible.

### L'organisation

* **Le Haut Commandement** — les rares figures politiques capables de tenir ensemble des factions qui se méfient les unes des autres.
* **Les escadrons** — pilotes de X-wing et de Y-wing, l'élite suicidaire de l'Alliance ; l'espérance de vie s'y compte en missions.
* **Les cellules locales** — sur chaque monde occupé, des poignées d'hommes et de femmes qui cachent des armes sous les planchers.
* **Le renseignement** — les héros invisibles : informateurs, faussaires, agents doubles. Beaucoup meurent sans que personne ne sache jamais leur nom.

## Jouer la Rébellion

La Rébellion se joue avec les mains sales et le cœur en écharpe : les ressources manquent toujours, les ordres sacrifient parfois des innocents, et la frontière entre combattant de la liberté et terroriste dépend du bulletin d'information qui en parle. C'est l'ère parfaite pour les personnages qui ont tout perdu — et qui décident que ça leur donne le droit de tout risquer.
            `,
          },
          {
            id: 'underworld',
            category: 'Guerre Civile Galactique',
            title: 'La pègre galactique',
            excerpt: 'Cartels Hutts, chasseurs de primes et contrebandiers : le troisième camp, celui qui gagne à tous les coups.',
            metadata: {
              'Territoires': ['Espace Hutt', 'Bordure Extérieure', 'Nal Hutta'],
              'Activités': ['Contrebande', 'Primes', 'Jeu, épices, armes'],
              'Devise': 'Aucune cause, que des contrats',
            },
            content: `
Pendant que l'Empire et la Rébellion se déchirent, un troisième pouvoir prospère : la **pègre**. L'Empire a besoin de main-d'œuvre et ferme les yeux sur les cartels qui la fournissent ; la Rébellion a besoin d'armes et paie les contrebandiers qui les livrent. La guerre est la meilleure chose qui soit arrivée au crime organisé depuis l'invention de l'hyperdrive.

## Les grands acteurs

* **Les cartels Hutts** — depuis leurs palais de Nal Hutta et de Tatooine, les Hutts règnent sur l'épice, le jeu et les esclaves. On ne traite pas avec un Hutt : on lui appartient, plus ou moins vite.
* **Les chasseurs de primes** — la Guilde encadre un métier vieux comme la galaxie. L'Empire est leur premier client ; les cibles rebelles paient bien, les cibles criminelles paient mieux.
* **Les contrebandiers** — cargos trafiqués, compartiments cachés, itinéraires que la Marine ne surveille pas. Le Passage de Kessel fait les légendes et les veuves.

## L'économie de l'ombre

Épice, armes, faux papiers, êtres vivants : tout ce que l'Empire interdit se vend plus cher que ce qu'il autorise. Les mondes de la Bordure vivent de cette économie parallèle — et bien des gouverneurs impériaux touchent leur part pour regarder ailleurs.

## Jouer la pègre

C'est le terrain de jeu le plus libre du serveur : pas de hiérarchie, pas d'idéal, que des dettes, des contrats et des réputations. Un contrebandier endetté auprès d'un Hutt, une chasseuse de primes qui découvre que sa cible est innocente, un lieutenant de cartel pris entre l'ISB et son patron : ici, la morale est une option — et c'est ce qui rend chaque choix intéressant.
            `,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // NOUVELLE RÉPUBLIQUE
  // =========================================================================
  {
    id: 'new-republic',
    title: 'Nouvelle République',
    subCategories: [
      {
        id: 'nr-era',
        title: 'L\'ère',
        articles: [
          {
            id: 'nr-context',
            category: 'Nouvelle République',
            title: 'Reconstruire la galaxie',
            excerpt: 'L\'Empereur est mort, l\'Empire s\'effondre — et gagner la paix se révèle plus dur que gagner la guerre.',
            metadata: {
              'Période': 'À partir de 5 ABY',
              'Pouvoirs': ['Nouvelle République', 'Vestiges impériaux', 'Mondes indépendants'],
              'Ambiance': 'Reconstruction, far west, guerre froide',
            },
            content: `
Endor n'a pas terminé la guerre : elle en a changé la nature. L'Empereur mort, l'Empire s'est fissuré en fiefs rivaux — amiraux devenus seigneurs de guerre, Moffs retranchés dans leurs secteurs, flottes entières évanouies dans les Régions Inconnues. Face à ce chaos, l'Alliance victorieuse se transforme en **Nouvelle République** et découvre un problème inédit : gouverner.

## Une paix qui n'en est pas une

La Nouvelle République libère des mondes plus vite qu'elle ne peut les administrer. Chaque semaine apporte son lot de crises : un secteur impérial qui refuse de capituler, une famine sur un monde « pacifié », un cartel qui remplit le vide laissé par les garnisons. La grande guerre est finie ; mille petites guerres commencent.

### Les lignes de front

* **La traque des vestiges** — les flottes républicaines pourchassent les seigneurs de guerre impériaux, secteur par secteur.
* **La bataille politique** — sur Chandrila puis Coruscant, le nouveau Sénat se déchire déjà : centralisation ou libre association ? Armée permanente ou démobilisation ?
* **La frontière** — dans la Bordure, ni la République ni l'Empire ne contrôlent grand-chose : c'est l'âge d'or des indépendants, des colons… et des crimes sans témoins.

## Ce qu'on y joue sur Swor

* **Bâtisseurs** — diplomates, administrateurs, officiers de la nouvelle flotte : ceux qui essaient de transformer une victoire militaire en civilisation.
* **Vestiges impériaux** — loyalistes du vieil ordre, entre baroud d'honneur et reconversion cynique.
* **Vétérans** des deux camps qui cherchent quoi faire d'une paix pour laquelle personne ne les a préparés.
* **Pionniers et opportunistes** — la frontière est ouverte, les règles restent à écrire.

C'est l'ère la plus ouverte du serveur : l'histoire n'y est pas encore écrite, et chaque personnage peut peser sur ce que deviendra la galaxie.
            `,
          },
        ],
      },
      {
        id: 'nr-factions',
        title: 'Forces en présence',
        articles: [
          {
            id: 'nr-government',
            category: 'Nouvelle République',
            title: 'La Nouvelle République',
            excerpt: 'La coalition victorieuse devenue gouvernement — idéaliste, débordée, et déterminée à ne pas répéter l\'histoire.',
            metadata: {
              'Capitale': 'Chandrila, puis Coruscant',
              'Institution': 'Sénat de la Nouvelle République',
              'Forces': ['Flotte de défense', 'Rangers', 'Corps diplomatique'],
            },
            content: `
La **Nouvelle République** est née d'une promesse : ne jamais redevenir ce qu'elle a combattu. Son Sénat limite volontairement ses propres pouvoirs, sa flotte démobilise à peine la guerre finie, et ses dirigeants gouvernent avec la hantise de créer un nouveau Palpatine.

## La noblesse du problème

Cette prudence est sa grandeur et sa faiblesse. Pendant que la République débat, les seigneurs de guerre impériaux pillent ; pendant qu'elle démobilise, les cartels s'arment. Ses fonctionnaires héritent de mondes ruinés par vingt ans d'exploitation impériale, avec des budgets de temps de paix et des problèmes de temps de guerre.

### Les visages de la République

* **Le Sénat** — des centaines de mondes fraîchement libérés, chacun avec ses comptes à régler et sa vision de l'avenir.
* **La flotte de défense** — réduite mais aguerrie : les vétérans d'Endor forment une génération d'officiers qu'on n'impressionne pas facilement.
* **Les commissions de reconstruction** — juges, ingénieurs, médecins dépêchés sur les mondes dévastés ; le vrai front de cette ère.

## Jouer la Nouvelle République

C'est le camp des idéalistes confrontés au réel : chaque compromis sauve des vies aujourd'hui et hypothèque demain. Une sénatrice qui négocie avec un ancien Moff pour éviter une famine, un officier qui doit désarmer les milices qu'il a lui-même armées pendant la guerre, une juge chargée d'instruire les crimes impériaux sans transformer la justice en vengeance — la matière dramatique est infinie.
            `,
          },
          {
            id: 'imperial-remnant',
            category: 'Nouvelle République',
            title: 'Les vestiges de l\'Empire',
            excerpt: 'L\'Empire est mort — personne ne l\'a dit à ses flottes. Seigneurs de guerre, loyalistes et fantômes du vieil ordre.',
            metadata: {
              'Territoires': 'Secteurs retranchés, Régions Inconnues',
              'Nature': 'Fiefs rivaux, sans commandement unifié',
              'Forces': ['Flottes dispersées', 'Garnisons loyalistes', 'Réseaux dormants'],
            },
            content: `
L'Empire ne s'est pas rendu : il s'est **morcelé**. Sans Empereur, la chaîne de commandement a volé en éclats, et chaque amiral, chaque Moff assez puissant s'est taillé son domaine. Certains rêvent de restauration ; d'autres ne rêvent plus de rien et règnent sur leurs secteurs comme des pirates en uniforme.

## Les héritiers du chaos

* **Les seigneurs de guerre** — les plus dangereux à court terme : des flottes entières aux mains d'officiers qui ne rendent plus de comptes à personne.
* **Les loyalistes** — garnisons et académies qui tiennent leurs positions « en attendant les ordres », dans une discipline d'autant plus rigide que tout s'effondre autour.
* **Les fantômes** — réseaux de renseignement dormants, caches d'armes, protocoles secrets de l'Empereur : la partie immergée de l'Empire n'a jamais été cartographiée.

## Une cause en ruine

Servir l'Empire après Endor, c'est choisir chaque matin pourquoi on continue : par fidélité à un serment, par peur de la justice républicaine, par conviction que la galaxie replongera dans le chaos sans la poigne impériale — ou simplement parce qu'on ne sait rien faire d'autre que la guerre.

## Jouer les vestiges

C'est le camp le plus tragique du serveur. Un officier qui maintient l'ordre impérial sur un monde que tout le monde a oublié, une pilote de TIE qui découvre que son escadre travaille désormais pour un cartel, un agent de l'ISB qui négocie sa reddition contre ses archives : les vestiges se jouent dans le crépuscule, entre l'honneur et le naufrage.
            `,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // ENCYCLOPÉDIE
  // =========================================================================
  {
    id: 'encyclopedia',
    title: 'Encyclopédie',
    subCategories: [
      {
        id: 'places',
        title: 'Lieux',
        articles: [
          {
            id: 'coruscant',
            category: 'Encyclopédie',
            title: 'Coruscant',
            excerpt: 'La planète-cité au cœur de la galaxie : capitale de la République, de l\'Empire, puis enjeu de tous les pouvoirs.',
            metadata: {
              'Région': 'Noyau',
              'Population': 'Plus de 1 000 milliards',
              'Statut': 'Capitale galactique à travers les trois ères',
            },
            content: `
**Coruscant** est une ville qui a dévoré sa planète : des milliers de niveaux d'urbanisation empilés sur des millénaires, du sommet baigné de lumière jusqu'aux profondeurs qui n'ont pas vu le soleil depuis des siècles. Qui tient Coruscant tient le symbole du pouvoir galactique — c'est pourquoi tout le monde a voulu la tenir.

## Les hauteurs

Les niveaux supérieurs concentrent tout ce que la galaxie compte d'important : le **Sénat** et son hémicycle de mille délégations, le **Temple Jedi** et ses cinq tours (devenu palais impérial après la purge), les tours des grandes banques et les ambassades de tous les mondes qui comptent. L'air y est filtré, la sécurité omniprésente, les conversations feutrées — et chaque sourire est une transaction.

## Les profondeurs

Plus on descend, plus la loi s'efface. Les **niveaux intermédiaires** abritent les milliards d'habitants ordinaires : ouvriers, employés, familles entassées dans des blocs sans fenêtres. En dessous commencent les **bas-fonds** — le niveau 1313 et ses semblables — où règnent les gangs, où la police ne descend qu'en force, et où l'on peut tout acheter, tout vendre et tout faire disparaître.

## Coruscant selon les ères

* **Guerre des Clones** — la ville vit la guerre à distance : parades militaires en surface, attentats séparatistes, et le Sénat qui vote la fin de la liberté dans l'indifférence générale.
* **Guerre Civile Galactique** — rebaptisée « Centre Impérial » : couvre-feux, patrouilles, délation. La résistance s'organise dans les profondeurs.
* **Nouvelle République** — libérée mais meurtrie, la ville redevient le trophée que tous les pouvoirs se disputent.

## En jeu

Coruscant est le décor idéal des intrigues urbaines : politique de couloir dans les hauteurs, enquêtes et marché noir dans les profondeurs — et mille étages de personnages entre les deux.
            `,
          },
        ],
      },
      {
        id: 'technology',
        title: 'Technologie',
        articles: [
          {
            id: 'hyperspace',
            category: 'Encyclopédie',
            title: 'L\'hyperespace et le voyage',
            excerpt: 'La dimension parallèle qui rend la galaxie traversable — et les routes invisibles qui décident des guerres.',
            metadata: {
              'Moyen': 'Hyperdrive (classe 0.5 à 15)',
              'Routes célèbres': ['Voie Corellienne', 'Passe de Kessel'],
              'Danger': 'Masses stellaires, interdicteurs',
            },
            content: `
Sans l'**hyperespace**, la galaxie serait une collection de solitudes : des milliers d'années sépareraient les étoiles. L'hyperdrive projette un vaisseau dans une dimension parallèle où les distances se contractent — un saut bien calculé traverse un secteur en heures.

## Les routes

On ne saute pas n'importe où : une masse stellaire sur la trajectoire, et le voyage s'arrête définitivement. Les **routes hyperspatiales** sont des couloirs sûrs, cartographiés sur des générations d'explorateurs. Les grandes routes — la Voie Corellienne, la Route de Rimma — sont les artères de la civilisation : le commerce les suit, les flottes les empruntent, les douanes les verrouillent.

### Ce que ça implique

* **Stratégie** — contrôler un carrefour hyperspatial vaut mieux que contrôler dix mondes. Les grandes batailles se livrent presque toujours sur des nœuds de route.
* **Contrebande** — les routes officielles sont surveillées ; les raccourcis dangereux (la Passe de Kessel…) font la réputation des pilotes assez fous pour les tenter.
* **Isolement** — un monde à l'écart des routes peut rester ignoré pendant des siècles. Certains en meurent, d'autres en font leur protection.

## En jeu

Sur Swor, le voyage fait partie du récit : votre personnage se déplace de planète en planète dans l'atlas du forum, et le trajet — escale douteuse, panne d'hyperdrive, contrôle impérial — est souvent une scène en soi. Un vaisseau n'est pas un simple moyen de transport : c'est un foyer, un gagne-pain et, souvent, le personnage secondaire le plus fidèle de votre histoire.
            `,
          },
          {
            id: 'star-destroyer',
            category: 'Encyclopédie',
            title: 'Le Destroyer Stellaire',
            excerpt: 'Seize cents mètres d\'acier impérial : l\'argument définitif de l\'Empire dans toutes les négociations.',
            metadata: {
              'Constructeur': 'Chantiers Navals de Kuat',
              'Longueur': '1 600 mètres',
              'Armement': '60 turbolasers lourds, 72 chasseurs TIE',
            },
            content: `
Le **Destroyer Stellaire de classe Imperial** n'est pas seulement un vaisseau de guerre : c'est un message. Sa silhouette en dague, reconnaissable depuis la surface d'une planète, dit à chaque monde qui la voit apparaître : *l'Empire est là, et la discussion est terminée.*

## Une ville de guerre

Quarante mille membres d'équipage, des hangars pour une aile complète de chasseurs TIE, des casernes pour une légion de stormtroopers, des baies de débarquement pour les blindés : un Destroyer ne patrouille pas, il **occupe**. Positionné en orbite, il peut soutenir un blocus, raser une ville ou administrer un système entier sans jamais se poser.

### Caractéristiques

* **Armement** — soixante batteries de turbolasers lourds : de quoi tenir tête à une flotte entière ou stériliser une surface planétaire.
* **Rayon tracteur** — les fuyards sont ramenés à bord, pas poursuivis.
* **Symbole** — un seul Destroyer en orbite fait plus pour l'ordre impérial que dix mille soldats au sol.

## Face au monstre

Pour la Rébellion, affronter un Destroyer de front est un suicide — alors on ruse : frappes éclair sur les générateurs de boucliers, sabotage en cale sèche, exploitation des angles morts. Chaque Destroyer détruit ou capturé par l'Alliance est devenu une légende, précisément parce que l'exploit semblait impossible.

## En jeu

Selon votre camp, le Destroyer est votre lieu de service, votre cauchemar tactique ou votre plus gros contrat de sabotage. À bord, c'est un décor de RP à part entière : coursives, passerelles, cellules et mess d'officiers — une ville entière sous discipline impériale.
            `,
          },
        ],
      },
    ],
  },
];
