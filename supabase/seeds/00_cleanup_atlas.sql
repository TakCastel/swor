-- =================================================================================
-- SCRIPT D'ARCHIVAGE ET NETTOYAGE DES ANCIENS FORUMS GALACTIQUES
-- =================================================================================

DO $$
DECLARE
    archive_forum_id INTEGER;
BEGIN
    -- 1. S'assurer que la catégorie Archives existe (au cas où 01 n'a pas encore tourné)
    INSERT INTO public.forum_categories (id, name, description, era, required_role, display_order)
    VALUES (7, 'Archives', 'Anciens messages et archives de la galaxie.', NULL, NULL, 150)
    ON CONFLICT (id) DO NOTHING;

    -- 2. Trouver l'ID du forum Archives Galactiques
    SELECT id INTO archive_forum_id FROM public.forums WHERE name = 'Archives Galactiques' LIMIT 1;

    -- Si le forum n'existe pas, on le crée dans la catégorie 7
    IF archive_forum_id IS NULL THEN
        INSERT INTO public.forums (category_id, name, description, type, display_order)
        VALUES (7, 'Archives Galactiques', 'Le passé de la galaxie, préservé pour l''éternité.', 'forum', 1)
        RETURNING id INTO archive_forum_id;
    END IF;

    -- 3. Déplacer tous les sujets des forums appartenant aux ères (catégories 2, 3, 4) vers les archives
    UPDATE public.topics
    SET forum_id = archive_forum_id
    WHERE forum_id IN (
        SELECT id FROM public.forums WHERE category_id IN (2, 3, 4)
    );

    -- 4. Supprimer tous les forums des ères pour repartir de zéro
    -- On ne supprime que ceux des catégories 2, 3, 4
    DELETE FROM public.forums WHERE category_id IN (2, 3, 4);

    RAISE NOTICE 'Archivage terminé et anciens forums supprimés.';
END $$;
