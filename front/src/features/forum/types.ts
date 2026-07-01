export interface Author {
  id: string;
  username: string;
  avatar_url?: string;
  role: string;
}

export interface CharacterAuthor {
  id: string;
  name: string;
  avatar?: string;
  class: string;
  group_name?: string;
  group_color?: string;
}

export interface Post {
  id: number;
  topic_id: number;
  author_id: string;
  character_id?: string;
  content: string;
  created_at: string;
  author?: Author;
  character?: CharacterAuthor;
}

export interface Topic {
  id: number;
  forum_id: number;
  author_id: string;
  character_id?: string;
  title: string;
  replies_count: number;
  views_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author?: Author;
  character?: CharacterAuthor;
  last_post?: Post;
}

export interface Forum {
  id: number;
  category_id: number;
  parent_id?: number;
  name: string;
  description: string;
  type: 'category' | 'region' | 'sector' | 'planet' | 'location';
  topics_count: number;
  posts_count: number;
  era?: string;
  image_url?: string;
  header_image_url?: string;
  required_role?: string;
  sub_forums?: Forum[];
  topics?: Topic[];
  last_post?: {
    topic_title: string;
    author_name: string;
    author_color?: string;
    created_at: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  era?: string;
  required_role?: string;
  forums: Forum[];
}
