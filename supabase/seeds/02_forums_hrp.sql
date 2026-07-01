-- =================================================================================
-- SEED 02 : FORUMS HORS-RP
-- =================================================================================

DO $$
BEGIN
    -- Annonces
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Annonces' AND category_id = 1) THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (1, 'Annonces', 'Les dernières nouvelles du front et du projet.', 'forum', 1);
    END IF;

    -- Présentations
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Présentations' AND category_id = 1) THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (1, 'Présentations', 'Faites-vous connaître de la galaxie.', 'forum', 2);
    END IF;

    -- Création de personnage
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Création de personnage' AND category_id = 1) THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (1, 'Création de personnage', 'Lieu de naissance des futures légendes.', 'forum', 3);
    END IF;

    -- Discussions
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Discussions' AND category_id = 5) THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (5, 'Discussions', 'Parler de tout et de rien (HRP).', 'forum', 1);
    END IF;

    -- Suggestions
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Suggestions' AND category_id = 5) THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (5, 'Suggestions', 'Aidez-nous à améliorer votre expérience.', 'forum', 2);
    END IF;

    -- Signaler un bug
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Signaler un bug' AND category_id = 5) THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (5, 'Signaler un bug', 'Rapportez les anomalies techniques ici.', 'forum', 3);
    END IF;

    -- Modérateurs
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Modérateurs' AND category_id = 6) THEN
        INSERT INTO public.forums (category_id, name, description, type, required_role, display_order)
        VALUES (6, 'Modérateurs', 'Coordination de la modération et des Smodos.', 'forum', 'moderator', 1);
    END IF;

    -- Administrateurs
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Administrateurs' AND category_id = 6) THEN
        INSERT INTO public.forums (category_id, name, description, type, required_role, display_order)
        VALUES (6, 'Administrateurs', 'Décisions de haut niveau et gestion technique.', 'forum', 'admin', 2);
    END IF;

    -- Archives Galactiques
    IF NOT EXISTS (SELECT 1 FROM public.forums WHERE name = 'Archives Galactiques' AND category_id = 7) THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (7, 'Archives Galactiques', 'Le passé de la galaxie, préservé pour l''éternité.', 'forum', 1);
    END IF;
END $$;
