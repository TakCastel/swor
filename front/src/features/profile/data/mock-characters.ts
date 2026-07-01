import { CharacterProfile } from '../types';

export const mockCharacters: CharacterProfile[] = [
  {
    id: 'dax-valen',
    user_id: 'mock-user-1',
    name: 'Dax Valen',
    title: 'Veteran Roleplayer',
    class: 'Contrebandier',
    occupation_category: 'Contrebande',
    species: 'Humain',
    faction: 'Indépendant',
    era: 'Galactic Empire',
    avatar: 'https://picsum.photos/seed/dax/256/256',
    credits: 15400,
    skills: ['Pilotage', 'Blaster'],
    created_at: new Date().toISOString(),
    inventory: [
      { id: '1', name: 'Blaster DL-44', description: 'Le classique de Han Solo', quantity: 1, weight: 1.2, type: 'weapon', rarity: 'rare' },
      { id: '2', name: 'Pack de soins', description: 'Soigne les blessures légères', quantity: 5, weight: 0.5, type: 'consumable', rarity: 'common' },
    ],
    economyHistory: [
      { id: 'e1', date: '2024-12-20', description: 'Prime de transport', amount: 5000, type: 'income' },
      { id: 'e2', date: '2024-12-21', description: 'Carburant hyperdrive', amount: -600, type: 'expense' },
    ],
    ship: {
      id: 's1',
      name: 'Le Faucon Éreinté',
      model: 'YT-1300',
      cargoCapacity: 100,
      currentCargoWeight: 15,
      modules: [
        { id: 'm1', name: 'Hyperdrive Class 1.0', type: 'engine', status: 'active', stats: { speed: 10 } },
        { id: 'm2', name: 'Boucliers déflecteurs', type: 'shield', status: 'active', stats: { strength: 50 } },
      ]
    }
  },
  {
    id: 'kaelen-voss',
    user_id: 'mock-user-1',
    name: 'Kaelen Voss',
    title: 'Force Sensitive',
    class: 'Jedi en Exil',
    occupation_category: 'Force',
    species: 'Humain',
    faction: 'Nouvelle République',
    era: 'New Republic',
    avatar: 'https://picsum.photos/seed/kaelen/256/256',
    credits: 1200,
    skills: ['Force', 'Sabre Laser'],
    created_at: new Date().toISOString(),
    inventory: [
      { id: '3', name: 'Sabre laser (Bleu)', description: 'Une arme élégante...', quantity: 1, weight: 1, type: 'weapon', rarity: 'epic' },
    ],
    economyHistory: [
      { id: 'e3', date: '2024-12-22', description: 'Donation anonyme', amount: 200, type: 'income' },
    ]
  }
];

