-- =================================================================================
-- SEED 08 : MEMBRES IA ET PERSONNAGES
-- =================================================================================

-- 1. INSERTION DES UTILISATEURS (AUTH.USERS)
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at)
VALUES 
('e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01', 'valkyrie@swor.ai', '{"username": "DarthValkyrie"}', NOW()),
('e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e02', 'starpilot@swor.ai', '{"username": "StarPilot88"}', NOW()),
('e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03', 'amidala@swor.ai', '{"username": "SenatorAmidala"}', NOW()),
('e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04', 'sithlord@swor.ai', '{"username": "SithLord99"}', NOW()),
('e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05', 'rebelscum@swor.ai', '{"username": "RebelScum"}', NOW()),
('e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e06', 'commander@swor.ai', '{"username": "CloneCommander"}', NOW());

-- Les profils sont créés automatiquement par le trigger handle_new_user()
-- On met à jour les rôles si besoin
UPDATE public.profiles SET role = 'moderator' WHERE id = 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01';

-- 2. INSERTION DES PERSONNAGES
INSERT INTO public.characters (id, user_id, name, title, class, faction, main_group_id, era, species)
VALUES 
-- DarthValkyrie
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01', 'Lyra Vance', 'Chevalier Jedi', 'Jedi', 'Nouvelle République', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e41', 'NR', 'Humain'),
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e02', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01', 'Vaxen Sol', 'Chasseur de Primes', 'Mercenaire', 'Indépendant', NULL, 'GCG', 'Zabrak'),

-- StarPilot88
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e02', 'Jaxen Rek', 'Contrebandier', 'Pilote', 'Indépendant', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e34', 'GCG', 'Humain'),

-- SenatorAmidala
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03', 'Elara Tyree', 'Sénatrice', 'Politicien', 'Nouvelle République', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e41', 'NR', 'Humain'),

-- SithLord99
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04', 'Malakor', 'Acolyte Sith', 'Sith', 'Empire Galactique', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e33', 'GCG', 'Sith pur-sang'),
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e06', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04', 'Capitaine Hax', 'Officier Impérial', 'Militaire', 'Empire Galactique', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e32', 'GCG', 'Humain'),

-- RebelScum
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e07', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05', 'Garret Thorne', 'Éclaireur', 'Soldat', 'Alliance Rebelle', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e31', 'GCG', 'Humain'),
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e08', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05', 'Sela Sun', 'Mécanicienne', 'Ingénieur', 'Alliance Rebelle', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e31', 'GCG', 'Twi''lek'),

-- CloneCommander
('c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e09', 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e06', 'Blade', 'Commandant Clone', 'Soldat', 'République Galactique', 'a1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e21', 'GDC', 'Humain (Clone)');

-- On assigne les personnages actifs
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01' WHERE id = 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03' WHERE id = 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e02';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04' WHERE id = 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05' WHERE id = 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e07' WHERE id = 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05';
UPDATE public.profiles SET active_character_id = 'c1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e09' WHERE id = 'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e06';


