export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number;
  type: 'weapon' | 'armor' | 'consumable' | 'tool' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface EconomyEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface ShipModule {
  id: string;
  name: string;
  type: 'engine' | 'shield' | 'weapon' | 'utility';
  status: 'active' | 'damaged' | 'offline';
  stats: Record<string, number>;
}

export interface Ship {
  id: string;
  name: string;
  model: string;
  modules: ShipModule[];
  cargoCapacity: number;
  currentCargoWeight: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  color: string;
  era: string;
  is_official: boolean;
  icon?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  character_id: string;
  role: 'leader' | 'officer' | 'member';
  rank_name?: string;
  joined_at: string;
  group?: Group;
}

export interface CharacterProfile {
  id: string;
  user_id: string;
  name: string;
  title?: string;
  class: string; // Utilisé pour le nom précis du métier
  occupation_category: string; // Catégorie (Combat, Force, Social...)
  species: string;
  era: string;
  faction: string;
  avatar?: string;
  credits: number;
  is_active?: boolean;
  physical_description?: string;
  personality?: string;
  background_history?: string;
  likes?: string;
  dislikes?: string;
  skills: string[];
  starting_item?: string;
  main_group_id?: string;
  main_group?: Group;
  groups?: GroupMember[];
  inventory?: Item[];
  economyHistory?: EconomyEntry[];
  ship?: Ship;
  created_at: string;
}
