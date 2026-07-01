-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
DO $$ BEGIN
    CREATE TYPE public.item_type AS ENUM ('weapon', 'armor', 'consumable', 'tool', 'misc');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.item_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.economy_type AS ENUM ('income', 'expense');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.ship_module_type AS ENUM ('engine', 'shield', 'weapon', 'utility');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.ship_module_status AS ENUM ('active', 'damaged', 'offline');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.forum_type AS ENUM ('category', 'region', 'sector', 'planet', 'location', 'forum');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('user', 'moderator', 'admin', 'game_master');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================
-- TABLES
-- ============================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  title_hrp TEXT, -- Added for frontend compatibility
  role public.user_role DEFAULT 'user',
  active_character_id UUID,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', new.email), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FORUM CATEGORIES
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  era TEXT,
  required_role public.user_role,
  display_order INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FORUMS
CREATE TABLE IF NOT EXISTS public.forums (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES public.forum_categories(id) ON DELETE SET NULL,
  parent_id INTEGER REFERENCES public.forums(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type public.forum_type NOT NULL,
  coordinates JSONB,
  image_url TEXT,
  header_image_url TEXT,
  required_role public.user_role,
  display_order INTEGER DEFAULT 0,
  topics_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GROUPS (Système de factions)
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  era TEXT, -- Added for era-specific groups
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHARACTERS
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  class TEXT NOT NULL,
  faction TEXT NOT NULL,
  species TEXT DEFAULT 'Humain',
  era TEXT NOT NULL DEFAULT 'Guerre Civile',
  occupation_category TEXT DEFAULT 'Civil',
  avatar TEXT,
  credits INTEGER DEFAULT 2000,
  main_group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  current_location_id INTEGER REFERENCES public.forums(id),
  is_traveling BOOLEAN DEFAULT FALSE,
  travel_start_time TIMESTAMPTZ,
  travel_end_time TIMESTAMPTZ,
  travel_origin_id INTEGER REFERENCES public.forums(id),
  travel_destination_id INTEGER REFERENCES public.forums(id),
  physical_description TEXT,
  personality TEXT,
  background_history TEXT,
  likes TEXT,
  dislikes TEXT,
  skills TEXT[] DEFAULT '{}',
  starting_item TEXT,
  hrp_notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GROUP MEMBERS
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, character_id)
);

-- Foreign key for active character in profile
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_active_character_id_fkey 
FOREIGN KEY (active_character_id) REFERENCES public.characters(id) ON DELETE SET NULL;

-- TOPICS
CREATE TABLE IF NOT EXISTS public.topics (
  id SERIAL PRIMARY KEY,
  forum_id INTEGER NOT NULL REFERENCES public.forums(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  replies_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  last_post_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POSTS
CREATE TABLE IF NOT EXISTS public.posts (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHAT
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ECONOMY
CREATE TABLE IF NOT EXISTS public.items_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  weight DECIMAL(10, 2) NOT NULL,
  type public.item_type NOT NULL,
  rarity public.item_rarity NOT NULL,
  base_price INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.character_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items_catalog(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, item_id)
);

CREATE TABLE IF NOT EXISTS public.economy_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type public.economy_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHIPS
CREATE TABLE IF NOT EXISTS public.ships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID UNIQUE REFERENCES public.characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  cargo_capacity INTEGER NOT NULL,
  current_cargo_weight INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ship_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.ship_module_type NOT NULL,
  status public.ship_module_status DEFAULT 'active',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WIKI
CREATE TABLE IF NOT EXISTS public.wiki_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wiki_sub_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.wiki_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wiki_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_category_id UUID REFERENCES public.wiki_sub_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  category TEXT,
  image TEXT,
  related_articles UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Characters
CREATE POLICY "Characters are viewable by everyone" ON public.characters FOR SELECT USING (true);
CREATE POLICY "Users can insert own characters" ON public.characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own characters" ON public.characters FOR UPDATE USING (auth.uid() = user_id);

-- Forums
CREATE POLICY "Categories are viewable by everyone" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Forums are viewable by everyone" ON public.forums FOR SELECT USING (true);

-- Topics & Posts
CREATE POLICY "Topics are viewable by everyone" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Users can insert topics" ON public.topics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own topics" ON public.topics FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);

-- Chat
CREATE POLICY "Chat messages are viewable by everyone" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Groups
CREATE POLICY "Groups are viewable by everyone" ON public.groups FOR SELECT USING (true);

-- Group Members
CREATE POLICY "Group members are viewable by everyone" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Users can insert group members for their characters" ON public.group_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.characters 
    WHERE id = character_id AND user_id = auth.uid()
  )
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Updated At Update
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forums_updated_at BEFORE UPDATE ON public.forums FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON public.topics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Topic Counts Triggers (Recursive)
CREATE OR REPLACE FUNCTION public.update_forum_counts()
RETURNS TRIGGER AS $$
DECLARE
    current_forum_id INTEGER;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        current_forum_id := NEW.forum_id;
        WHILE current_forum_id IS NOT NULL LOOP
            UPDATE public.forums SET topics_count = topics_count + 1 WHERE id = current_forum_id;
            SELECT parent_id INTO current_forum_id FROM public.forums WHERE id = current_forum_id;
        END LOOP;
    ELSIF (TG_OP = 'DELETE') THEN
        current_forum_id := OLD.forum_id;
        WHILE current_forum_id IS NOT NULL LOOP
            UPDATE public.forums SET topics_count = topics_count - 1 WHERE id = current_forum_id;
            SELECT parent_id INTO current_forum_id FROM public.forums WHERE id = current_forum_id;
        END LOOP;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_topic_created_deleted
    AFTER INSERT OR DELETE ON public.topics
    FOR EACH ROW EXECUTE FUNCTION public.update_forum_counts();

CREATE OR REPLACE FUNCTION public.update_post_counts()
RETURNS TRIGGER AS $$
DECLARE
    current_forum_id INTEGER;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.topics SET replies_count = replies_count + 1, updated_at = NOW() WHERE id = NEW.topic_id;
        SELECT forum_id INTO current_forum_id FROM public.topics WHERE id = NEW.topic_id;
        WHILE current_forum_id IS NOT NULL LOOP
            UPDATE public.forums SET posts_count = posts_count + 1 WHERE id = current_forum_id;
            SELECT parent_id INTO current_forum_id FROM public.forums WHERE id = current_forum_id;
        END LOOP;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.topics SET replies_count = replies_count - 1 WHERE id = OLD.topic_id;
        SELECT forum_id INTO current_forum_id FROM public.topics WHERE id = OLD.topic_id;
        WHILE current_forum_id IS NOT NULL LOOP
            UPDATE public.forums SET posts_count = posts_count - 1 WHERE id = current_forum_id;
            SELECT parent_id INTO current_forum_id FROM public.forums WHERE id = current_forum_id;
        END LOOP;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_created_deleted
    AFTER INSERT OR DELETE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_post_counts();



-- RPC: Get Global Stats for Footer
CREATE OR REPLACE FUNCTION public.get_global_stats()
RETURNS json AS $$
DECLARE
    total_posts bigint;
    total_topics bigint;
    total_users bigint;
    latest_user json;
    guests_count int := 2; -- Simulé
    factions_by_era json;
BEGIN
    SELECT count(*) INTO total_posts FROM public.posts;
    SELECT count(*) INTO total_topics FROM public.topics;
    SELECT count(*) INTO total_users FROM public.profiles;
    
    SELECT json_build_object('id', id, 'username', username)
    INTO latest_user
    FROM public.profiles
    ORDER BY created_at DESC
    LIMIT 1;

    -- Stats des factions par ère
    SELECT json_object_agg(era_group, faction_list) INTO factions_by_era
    FROM (
        SELECT COALESCE(era, 'Général') as era_group, 
               json_agg(json_build_object('id', id, 'name', name, 'color', color, 'member_count', 
                    (SELECT count(*) FROM public.characters WHERE main_group_id = g.id)
               )) as faction_list
        FROM public.groups g
        GROUP BY era
    ) t;

    RETURN json_build_object(
        'total_posts', total_posts,
        'total_topics', total_topics,
        'total_users', total_users,
        'latest_user', latest_user,
        'guests_count', guests_count,
        'online_record', json_build_object('count', total_users + guests_count, 'date', now()),
        'factions_by_era', factions_by_era,
        'birthdays_today', '[]'::json, -- Pour éviter les erreurs dans le front
        'birthdays_week', '[]'::json
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the RPC function
GRANT EXECUTE ON FUNCTION public.get_global_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_global_stats() TO authenticated;

-- RPC: Increment Topic Views
CREATE OR REPLACE FUNCTION public.increment_topic_views(topic_id integer)
RETURNS void AS $$
BEGIN
    UPDATE public.topics
    SET views_count = views_count + 1
    WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_topic_views(integer) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_topic_views(integer) TO authenticated;
