-- =================================================================================
-- SEED 05 : ATLAS GALACTIQUE - NOUVELLE RÉPUBLIQUE (REFONTE TOTALE)
-- =================================================================================

DO $$
DECLARE
    reg_id INTEGER;
    zone_id INTEGER;
BEGIN
    -- ==========================================
    -- 1. LE NOYAU RESTAURÉ (LA NOUVELLE DÉMOCRATIE)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (4, 'Le Noyau Restauré', 'Le centre de la galaxie renaissante, où la Nouvelle République tente de rebâtir les fondations de la paix et de la justice.', 'region', 1)
    RETURNING id INTO reg_id;

    -- ZONE : Sièges du Pouvoir
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (4, reg_id, 'Sièges du Pouvoir', 'Les centres politiques tournants de la Nouvelle République, symbolisant le retour de la démocratie.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (4, zone_id, 'Chandrila', 'Premier siège du Sénat de la Nouvelle République, Chandrila est le symbole de la victoire de la diplomatie sur la tyrannie. Sous ses paysages sereins et ses jardins suspendus, la planète vibre d''une activité politique intense. C''est ici que Mon Mothma et les leaders républicains ont posé les bases d''une nouvelle ère, privilégiant la démocratie décentralisée et la réduction des forces militaires.', 'planet'),
    (4, zone_id, 'Hosnian Prime', 'Nouvelle capitale désignée de la République, Hosnian Prime est une métropole étincelante de verre et d''acier. Elle incarne l''ambition d''une galaxie unie et moderne, accueillant des délégués de milliers de mondes dans son immense rotonde sénatoriale. La sécurité y est assurée par une garde d''honneur républicaine, alors que la planète devient le cœur battant de la vie culturelle et politique galactique.', 'planet'),
    (4, zone_id, 'Coruscant', 'Ancien centre impérial, Coruscant est en pleine reconstruction. Bien qu''elle ne soit plus la capitale officielle, la cité-monde reste un pôle financier et historique incontournable. Les stigmates de l''occupation impériale s''effacent lentement, remplacés par des projets de rénovation urbaine et le retour des libertés civiles. C''est un monde en transition, cherchant sa place dans une galaxie qui n''est plus centrée uniquement sur son dôme.', 'planet');

    -- ZONE : Mondes Fondateurs Libérés
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (4, reg_id, 'Mondes Fondateurs Libérés', 'Anciens piliers de l''industrie impériale redevenus les moteurs économiques de la galaxie.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (4, zone_id, 'Kuat', 'Libérée de la poigne militaire de l''Empire, Kuat Drive Yards collabore désormais avec la Nouvelle République pour démanteler les restes de la marine impériale. Les chantiers produisent désormais des vaisseaux de transport et des croiseurs de défense, symbolisant la conversion de l''industrie de guerre vers une économie de paix. L''aristocratie de Kuat s''adapte avec prudence aux nouvelles régulations démocratiques.', 'planet'),
    (4, zone_id, 'Corellia', 'Les chantiers navals corelliens ont retrouvé leur gloire marchande. La planète est redevenue le centre de l''innovation technologique pour les moteurs hyperspatiaux et les vaisseaux civils. L''esprit d''indépendance corellien, autrefois étouffé par l''Empire, fleurit à nouveau dans les spatioports et les cantinas, alors que la planète redevient la porte d''entrée principale vers les routes commerciales.', 'planet');

    -- ==========================================
    -- 2. LA BORDURE EN RECONSTRUCTION (L'ÂGE DE L'ESPOIR)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (4, 'La Bordure en Reconstruction', 'Zones autrefois ravagées par la guerre civile, désormais engagées dans des programmes ambitieux de développement.', 'region', 2)
    RETURNING id INTO reg_id;

    -- ZONE : Territoires Libérés
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (4, reg_id, 'Territoires Libérés', 'Mondes qui ont activement participé à la Rébellion et célèbrent aujourd''hui leur liberté retrouvée.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (4, zone_id, 'Naboo', 'Joyau culturel et bucolique, Naboo est l''un des piliers de la Nouvelle République en Bordure Médiane. La planète a pansé ses plaies et sert désormais de modèle pour l''intégration des arts et de la diplomatie dans la vie publique. Ses cités sont des havres de paix où les anciennes traditions royales coexistent avec une vision moderne de la coopération galactique.', 'planet'),
    (4, zone_id, 'Lothal', 'Monde agraire qui fut le théâtre d''une résistance opiniâtre, Lothal est aujourd''hui en pleine renaissance industrielle. Ses plaines sont à nouveau verdoyantes, et la population célèbre les héros de sa libération. La Nouvelle République y a investi massivement pour en faire un centre de production alimentaire et technologique exemplaire pour les mondes de la bordure.', 'planet'),
    (4, zone_id, 'Mon Cala', 'Bastion naval de la République, Mon Cala continue de fournir l''élite de la flotte de défense. Les Mon Calamaris ont ouvert leurs cités sous-marines au commerce galactique, tout en maintenant une vigilance accrue face aux derniers vestiges impériaux. La planète est un symbole de courage et de persévérance, dont les navires protègent désormais les nouvelles routes de la paix.', 'planet');

    -- ZONE : Zones de Stabilité
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (4, reg_id, 'Zones de Stabilité', 'Secteurs sécurisés servant de points d''ancrage pour l''administration républicaine en expansion.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (4, zone_id, 'Onderon', 'Après des années de guerre civile et d''occupation, Onderon a retrouvé son unité sous une monarchie constitutionnelle alliée à la République. La cité d''Iziz est redevenue un pôle de stabilité, alors que les jungles environnantes sont lentement pacifiées. La planète sert de base de coordination pour les opérations de sécurité dans le secteur de l''Expansion.', 'planet'),
    (4, zone_id, 'Thyferra', 'La production de Bacta est désormais supervisée par une commission républicaine pour garantir une distribution équitable. Les tensions entre les corporations locales se sont apaisées, laissant place à une prospérité partagée. Thyferra est devenue le centre médical de la galaxie, fournissant les ressources nécessaires pour soigner les millions de victimes de la guerre passée.', 'planet');

    -- ==========================================
    -- 3. LA BORDURE EXTÉRIEURE (LA NOUVELLE FRONTIÈRE)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (4, 'La Bordure Extérieure', 'Régions sauvages où la Nouvelle République tente d''imposer l''ordre face aux seigneurs de guerre et aux cartels.', 'region', 3)
    RETURNING id INTO reg_id;

    -- ZONE : Zones de Conflit des Vestiges
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (4, reg_id, 'Zones de Conflit des Vestiges', 'Territoires instables où les débris de l''Empire et les syndicats criminels luttent pour le contrôle.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (4, zone_id, 'Nevarro', 'Ancien repaire de chasseurs de primes, Nevarro est devenue une cité marchande florissante sous la gouvernance du Haut Magistrat Greef Karga. Malgré les tentatives des vestiges impériaux de reprendre le contrôle, la ville reste un bastion de liberté en Bordure Extérieure, symbole de la capacité des mondes de frontière à se réinventer loin de l''influence des grandes puissances.', 'planet'),
    (4, zone_id, 'Jakku', 'Cimetière géant de vaisseaux impériaux et rebelles, Jakku est le domaine des ferrailleurs et des pillards d''épaves. La planète est un rappel constant de la violence de la guerre civile. Bien que désolée, ses débris cachent des technologies précieuses que la République tente de sécuriser avant qu''elles ne tombent entre de mauvaises mains.', 'planet'),
    (4, zone_id, 'Tatooine', 'Toujours dominée par les cartels après la chute de Jabba, Tatooine reste un défi pour la Nouvelle République. Des marshalls isolés tentent d''y faire régner une justice précaire, alors que la planète redevient un carrefour pour les réfugiés et les opportunistes cherchant une nouvelle vie loin du Noyau.', 'planet');

    -- ZONE : Mondes de Frontière
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (4, reg_id, 'Mondes de Frontière', 'Bastions de cultures fières et indépendantes cherchant leur voie dans la nouvelle galaxie.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (4, zone_id, 'Mandalore', 'En pleine reconstruction après des décennies de purge et d''occupation, Mandalore redevient le point de ralliement des clans dispersés. Les Mandaloriens travaillent à restaurer leur foyer ancestral et leur culture guerrière, tout en maintenant une neutralité vigilante vis-à-vis de la Nouvelle République. C''est un monde de résilience et de mystère.', 'planet'),
    (4, zone_id, 'Eriadu', 'L''ancienne cité impériale tente de se transformer en centre industriel ouvert au commerce républicain. Bien que les traditions militaires y soient encore fortes, une nouvelle génération de leaders cherche à intégrer la planète dans l''économie galactique, espérant effacer son image de bastion de l''Ordre Nouveau.', 'planet');

    -- ==========================================
    -- 4. LES RÉGIONS DE L'OMBRE
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (4, 'Les Régions de l''Ombre', 'Zones reculées et mystérieuses où les secrets anciens et les menaces futures se cachent.', 'region', 4)
    RETURNING id INTO reg_id;

    -- ZONE : Les Confins des Vestiges
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (4, reg_id, 'Les Confins des Vestiges', 'Mondes hantés par l''histoire des Jedi et les ombres résiduelles de l''Empire.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (4, zone_id, 'Ahch-To', 'Monde océanique oublié et refuge de Luke Skywalker, Ahch-To abrite les ruines du premier temple Jedi. La planète est un lieu de paix absolue et de connexion profonde avec la Force, protégé par son isolement total. Seuls quelques initiés connaissent son emplacement, en faisant un sanctuaire de sagesse ancienne dans une galaxie en mouvement.', 'planet'),
    (4, zone_id, 'Exegol', 'Surveillé par des sondes républicaines, Exegol reste un monde de cauchemar. Les rumeurs de rituels Sith et de flottes cachées persistent, bien que la planète semble stérile et abandonnée. C''est un rappel sombre que le mal peut s''enraciner dans les ténèbres les plus profondes de l''Espace Inconnu, attendant son heure.', 'planet'),
    (4, zone_id, 'Ajan Kloss', 'Monde forestier sauvage, Ajan Kloss sert de base d''entraînement secrète pour une nouvelle génération de voyageurs et de gardiens de la paix. Sous sa canopée dense, les idéaux de l''Alliance et les leçons des Jedi sont transmis, préparant la galaxie aux défis que le futur ne manquera pas de poser.', 'planet');

END $$;
