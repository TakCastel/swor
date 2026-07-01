-- =================================================================================
-- SEED 01 : CATÉGORIES DE BASE
-- =================================================================================

INSERT INTO public.forum_categories (id, name, description, era, required_role, display_order)
VALUES 
(1, 'Holonews', 'Communications officielles et informations vitales.', NULL, NULL, 1),
(2, 'Guerre des Clones', 'Un conflit galactique total opposant la République Galactique à la Confédération des Systèmes Indépendants (CSI).', 'Old Republic', NULL, 10),
(3, 'Guerre Civile Galactique', 'L''ombre de l''Empire Galactique s''étend sur la galaxie, étouffant toute velléité de liberté sous une poigne de fer.', 'Galactic Empire', NULL, 20),
(4, 'Nouvelle République', 'La galaxie respire à nouveau, mais son souffle est encore court. Sur les ruines de l''Empire Galactique, la Nouvelle République tente de tisser une toile d''espoir et de justice.', 'New Republic', NULL, 30),
(5, 'Social', 'Echanges entre joueurs et support.', NULL, NULL, 40),
(6, 'Administratif', 'Espaces réservés à l''équipe du forum.', NULL, 'moderator', 100),
(7, 'Archives', 'Anciens messages et archives de la galaxie.', NULL, NULL, 150)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    era = EXCLUDED.era,
    required_role = EXCLUDED.required_role,
    display_order = EXCLUDED.display_order;
