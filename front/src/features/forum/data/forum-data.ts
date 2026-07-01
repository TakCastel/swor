import { Category, Forum, Topic, Post } from '../types';

const MOCK_POSTS: Post[] = [
  { 
    id: 101, 
    topic_id: 1,
    author_id: 'user-1',
    content: 'The initial briefing is complete. All knights and padawans are to report to the hangar bay at 0600. May the Force be with you.',
    created_at: new Date().toISOString(),
    author: { id: 'user-1', username: 'JediMasterValorum', role: 'user', avatar_url: 'https://picsum.photos/seed/jedivalorum/48/48' },
    character: { id: 'char-1', name: 'Valorum', class: 'Jedi Master', avatar: 'https://picsum.photos/seed/jedivalorum/48/48' }
  },
  { 
    id: 102, 
    topic_id: 1,
    author_id: 'user-2',
    content: 'Your pitiful Jedi defenses will crumble.',
    created_at: new Date().toISOString(),
    author: { id: 'user-2', username: 'SithLordDrakon', role: 'user', avatar_url: 'https://picsum.photos/seed/sithdrakon/48/48' },
    character: { id: 'char-2', name: 'Drakon', class: 'Sith Lord', avatar: 'https://picsum.photos/seed/sithdrakon/48/48' }
  }
];

const MOCK_TOPICS: Topic[] = [
  { 
    id: 1, 
    forum_id: 100111,
    author_id: 'user-1',
    title: '[Mission] Briefing on Christophsis', 
    replies_count: 25, 
    views_count: 1230, 
    is_pinned: false,
    is_locked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: { id: 'user-1', username: 'JediMasterValorum', role: 'user' },
    last_post: MOCK_POSTS[1]
  },
];

const MOCK_DATA: Category[] = [
  {
    id: 1,
    name: 'Holonews',
    description: 'Communications officielles et informations vitales.',
    forums: [
      { id: 101, category_id: 1, name: 'Annonces', description: 'Les dernières nouvelles du front.', type: 'location', topics_count: 5, posts_count: 20 },
      { id: 102, category_id: 1, name: 'Présentations', description: 'Faites-vous connaître.', type: 'location', topics_count: 10, posts_count: 50 },
      { id: 103, category_id: 1, name: 'Création de personnage', description: 'Lieu de naissance des légendes.', type: 'location', topics_count: 8, posts_count: 40 },
    ]
  },
  {
    id: 2,
    name: 'Guerre des Clones',
    era: 'CLONE_WARS',
    description: 'La galaxie est à feu et à sang, déchirée par un conflit d\'une ampleur inégalée depuis des millénaires. Les idéaux de la République sont mis à rude épreuve par la montée de la CSI.',
    forums: [
      { id: 201, category_id: 2, name: 'La Galaxie', description: 'Explorez l\'immensité de l\'espace durant la Guerre des Clones, entre armées de droïdes et légions de clones.', type: 'region', topics_count: 50, posts_count: 300, topics: MOCK_TOPICS },
    ]
  },
  {
    id: 3,
    name: 'Guerre Civile Galactique',
    era: 'GALACTIC_CIVIL_WAR',
    description: 'L\'ombre de l\'Empire Galactique s\'étend sur la galaxie, étouffant toute velléité de liberté sous une poigne de fer alors que la Rébellion s\'organise.',
    forums: [
      { id: 301, category_id: 3, name: 'La Galaxie', description: 'Explorez l\'immensité de l\'espace sous le joug impérial ou depuis les bases secrètes de l\'Alliance Rebelle.', type: 'region', topics_count: 85, posts_count: 450 },
    ]
  },
  {
    id: 4,
    name: 'Nouvelle République',
    era: 'NEW_REPUBLIC',
    description: 'La galaxie respire à nouveau, mais son souffle est encore court. Sur les ruines de l\'Empire, la Nouvelle République tente de tisser une toile d\'espoir.',
    forums: [
      { id: 401, category_id: 4, name: 'La Galaxie', description: 'Explorez l\'immensité d\'une galaxie qui cherche sa voie entre les éclats de verre des anciennes lunes et la lumière naissante.', type: 'region', topics_count: 30, posts_count: 120 },
    ]
  },
  {
    id: 5,
    name: 'Social',
    description: 'Echanges entre joueurs et support.',
    forums: [
      { id: 501, category_id: 5, name: 'Discussions', description: 'Parler de tout et de rien.', type: 'location', topics_count: 120, posts_count: 1500 },
      { id: 502, category_id: 5, name: 'Suggestions', description: 'Aidez-nous à améliorer le forum.', type: 'location', topics_count: 45, posts_count: 200 },
      { id: 503, category_id: 5, name: 'Signaler un bug', description: 'Rapportez les anomalies.', type: 'location', topics_count: 15, posts_count: 60 },
    ]
  },
  {
    id: 6,
    name: 'Administratif',
    description: 'Espaces réservés à l\'équipe.',
    forums: [
      { id: 601, category_id: 6, name: 'Modérateurs', description: 'Coordination modération.', type: 'location', topics_count: 10, posts_count: 100 },
      { id: 602, category_id: 6, name: 'Administrateurs', description: 'Gestion technique.', type: 'location', topics_count: 5, posts_count: 50 },
    ]
  }
];

export async function getCategories(): Promise<Category[]> {
  return MOCK_DATA;
}

export async function getForumById(id: number, current_sub_forums?: Forum[]): Promise<Forum | undefined> {
  const data = current_sub_forums || MOCK_DATA.flatMap(c => c.forums);
  
  for (const forum of data) {
    if (forum.id === id) return forum;
    if (forum.sub_forums) {
      const found = await getForumById(id, forum.sub_forums);
      if (found) return found;
    }
  }
  return undefined;
}

export async function getTopicById(id: number): Promise<Topic | undefined> {
  return MOCK_TOPICS.find(t => t.id === id);
}

export async function getTravelTime(originId: number, destId: number): Promise<number> {
  return 3600;
}


