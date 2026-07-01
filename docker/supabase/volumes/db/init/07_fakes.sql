-- =================================================================================
-- SEED 07 : UTILISATEURS ET PERSONNAGES FICTIFS (V3)
-- =================================================================================

-- 1. INSERTION DE GROUPES (FACTIONS PAR ÈRE UNIQUEMENT)
INSERT INTO public.groups (id, name, color, era, is_official)
VALUES 
-- Guerre des Clones (GDC)
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e21', 'République Galactique', '#3498db', 'GDC', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e22', 'CSI', '#e67e22', 'GDC', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e23', 'Ordre Jedi', '#2ecc71', 'GDC', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e24', 'Cartel des Hutts', '#d35400', 'GDC', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e25', 'Civils', '#7f8c8d', 'GDC', true),

-- Guerre Civile Galactique (GCG)
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e31', 'Alliance Rebelle', '#e74c3c', 'GCG', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e32', 'Empire Galactique', '#95a5a6', 'GCG', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e33', 'Inquisiteurs', '#c0392b', 'GCG', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e34', 'Consortium de Zann', '#f1c40f', 'GCG', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e35', 'Soleil Noir', '#8e44ad', 'GCG', true),

-- Nouvelle République (NR)
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e41', 'Nouvelle République', '#1abc9c', 'NR', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e42', 'Premier Ordre', '#2c3e50', 'NR', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e43', 'Ascendance Chiss', '#34495e', 'NR', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e44', 'Syndicat Pyke', '#f39c12', 'NR', true),
('a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e45', 'Résistance', '#e67e22', 'NR', true);

-- 2. INSERTION D'UTILISATEURS FICTIFS (DANS AUTH.USERS)
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at)
VALUES 
('d1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11', 'anakin@jedi.org', '{"username": "AnakinSky"}', NOW()),
('d1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e12', 'obiwan@jedi.org', '{"username": "BenKenobi"}', NOW()),
('d1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e13', 'ahsoka@jedi.org', '{"username": "Fulcrum"}', NOW()),
('d1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e14', 'rex@clone.army', '{"username": "CT-7567"}', NOW()),
('d1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15', 'padme@senate.gov', '{"username": "Nabootiful"}', NOW());

-- Update profiles created by trigger
UPDATE public.profiles SET role = 'moderator', last_seen = NOW() - INTERVAL '5 minutes' WHERE id = 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e12';
UPDATE public.profiles SET role = 'admin', last_seen = NOW() - INTERVAL '2 minutes' WHERE id = 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15';
UPDATE public.profiles SET last_seen = NOW() - INTERVAL '10 minutes' WHERE id IN ('d1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11', 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e13', 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e14');

-- 3. INSERTION DE PERSONNAGES ET LIAISON AUX GROUPES
INSERT INTO public.characters (id, user_id, name, title, class, faction, main_group_id, era)
VALUES 
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11', 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11', 'Anakin Skywalker', 'Chevalier Jedi', 'Jedi', 'République Galactique', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e23', 'GDC'),
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e12', 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e12', 'Obi-Wan Kenobi', 'Maître Jedi', 'Jedi', 'République Galactique', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e23', 'GDC'),
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e13', 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e13', 'Ahsoka Tano', 'Padawan', 'Jedi', 'République Galactique', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e23', 'GDC'),
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e14', 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e14', 'Rex', 'Capitaine Clone', 'Soldat', 'Grande Armée de la République', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e21', 'GDC'),
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15', 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15', 'Padmé Amidala', 'Sénatrice', 'Politicien', 'République Galactique', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e21', 'GDC');

UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11' WHERE id = 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e12' WHERE id = 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e12';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e13' WHERE id = 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e13';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e14' WHERE id = 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e14';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15' WHERE id = 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15';

-- 4. MESSAGES FICTIFS
DO $$
DECLARE
    topic_id_1 INTEGER;
    topic_id_2 INTEGER;
    forum_annonces_id INTEGER;
    forum_planet_id INTEGER;
BEGIN
    -- Récupération dynamique des IDs
    SELECT id INTO forum_annonces_id FROM public.forums WHERE name = 'Annonces' LIMIT 1;
    -- On cherche un forum de type planète pour le second sujet
    SELECT id INTO forum_planet_id FROM public.forums WHERE type = 'planet' LIMIT 1;

    IF forum_annonces_id IS NOT NULL THEN
        INSERT INTO public.topics (forum_id, author_id, title)
        VALUES (forum_annonces_id, 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15', 'Bienvenue sur SWOR v2 !')
        RETURNING id INTO topic_id_1;

        INSERT INTO public.posts (topic_id, author_id, content)
        VALUES (topic_id_1, 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e15', 'C''est avec une grande joie que nous ouvrons les portes de cette nouvelle galaxie.');
    END IF;

    IF forum_planet_id IS NOT NULL THEN
        INSERT INTO public.topics (forum_id, author_id, title)
        VALUES (forum_planet_id, 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11', 'C''est quoi le plan pour la bordure ?')
        RETURNING id INTO topic_id_2;

        INSERT INTO public.posts (topic_id, author_id, content)
        VALUES (topic_id_2, 'd1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e11', 'On se fait harceler par les droïdes sur Saleucami, on a besoin de renforts.');
    END IF;
END $$;
