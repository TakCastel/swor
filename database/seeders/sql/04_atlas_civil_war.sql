-- =================================================================================
-- SEED 04 : ATLAS GALACTIQUE - GUERRE CIVILE GALACTIQUE (REFONTE TOTALE)
-- =================================================================================

DO $$
DECLARE
    reg_id INTEGER;
    zone_id INTEGER;
BEGIN
    -- ==========================================
    -- 1. LE CENTRE IMPÉRIAL (L'ORDRE NOUVEAU)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (3, 'Le Centre Impérial', 'Le bastion de la puissance impériale, où la surveillance est absolue et la discipline de fer garantit la paix de l''Empereur.', 'region', 1)
    RETURNING id INTO reg_id;

    -- ZONE : Le Cœur de l''Empire
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (3, reg_id, 'Le Cœur de l''Empire', 'Le centre politique et industriel de la galaxie, entièrement dévoué à la gloire de l''Empire Galactique.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (3, zone_id, 'Coruscant', 'Ancienne capitale de la République, Coruscant est devenue le Centre Impérial. Le Palais de l''Empereur, autrefois le Temple Jedi, domine désormais une planète transformée par une bureaucratie étouffante et une surveillance constante du BSI. Les niveaux supérieurs sont réservés à l''élite impériale, tandis que les bas-fonds sont devenus des foyers de dissidence réprimés avec une brutalité implacable. Chaque bloc urbain est un rappel de l''Ordre Nouveau, où la peur a remplacé la démocratie.', 'planet'),
    (3, zone_id, 'Kuat', 'Les chantiers navals de Kuat Drive Yards sont le poumon militaire de l''Empire. Sous une occupation militaire stricte, les ouvriers produisent les Destroyers Stellaires qui patrouillent la galaxie. L''anneau orbital de Kuat est l''une des structures les mieux défendues au monde, un symbole de la puissance navale impériale. Toute trace de l''ancienne culture aristocratique a été mise au service de l''effort de guerre impérial.', 'planet');

    -- ZONE : Mondes de Discipline
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (3, reg_id, 'Mondes de Discipline', 'Bastions de formation et de propagande où les futurs officiers et soldats de l''Empire sont forgés.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (3, zone_id, 'Eriadu', 'Monde industriel et foyer de la famille Tarkin, Eriadu est le modèle de la discipline impériale en Bordure Extérieure. La planète est une cité-monde polluée mais efficace, où l''ordre est maintenu par une garnison massive. C''est un centre de commandement régional crucial pour la coordination des opérations anti-insurrectionnelles dans les secteurs périphériques.', 'planet'),
    (3, zone_id, 'Carida', 'Siège de l''Académie Impériale, Carida est la forge où sont formés les Stormtroopers et les officiers de l''élite. Ses environnements variés, des déserts brûlants aux pôles glacés, servent de terrains d''entraînement impitoyables. La planète est un bastion de loyauté inébranlable, où chaque citoyen est éduqué dans le culte de l''Empereur et la supériorité de l''Ordre Nouveau.', 'planet');

    -- ==========================================
    -- 2. BORDURES DE LA RÉBELLION (L'ÉTINCELLE DE L'ESPOIR)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (3, 'Bordures de la Rébellion', 'Zones de conflit et refuges pour ceux qui refusent de se plier à la tyrannie impériale.', 'region', 2)
    RETURNING id INTO reg_id;

    -- ZONE : Bases Clandestines
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (3, reg_id, 'Bases Clandestines', 'Lieux secrets où l''Alliance Rebelle regroupe ses forces et planifie ses frappes contre l''Empire.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (3, zone_id, 'Yavin IV', 'Lune forestière luxuriante abritant d''anciens temples Massassi, Yavin IV sert de base principale à l''Alliance Rebelle. Sous la canopée épaisse, les rebelles ont installé leurs hangars et leurs centres de communication, espérant que l''isolement de la lune les protégera des patrouilles impériales. C''est un lieu chargé d''histoire et d''espoir, où chaque pilote sait que la prochaine mission pourrait être la dernière.', 'planet'),
    (3, zone_id, 'Hoth', 'Monde de glace désolé aux confins de la Bordure Extérieure, Hoth est le dernier refuge de la Base Echo. Les rebelles y luttent contre des températures mortelles et une faune hostile pour maintenir leur présence secrète. L''isolement total de la planète est sa seule défense contre la puissance écrasante de la flotte impériale qui traque sans relâche l''étincelle de la révolte.', 'planet'),
    (3, zone_id, 'Dantooine', 'Ancienne base rebelle désormais abandonnée, Dantooine reste un monde agraire paisible mais marqué par le passage de l''Alliance. Les ruines des installations rebelles sont parfois fouillées par des patrouilles impériales, tandis que la population locale tente de rester neutre, craignant des représailles pour avoir autrefois hébergé les "traîtres" républicains.', 'planet');

    -- ZONE : Mondes en Révolte
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (3, reg_id, 'Mondes en Révolte', 'Systèmes courageux qui soutiennent ouvertement ou secrètement l''Alliance pour la Restauration de la République.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Mon Cala', 'Monde océanique dont les chantiers navals produisent les croiseurs stellaires de l''Alliance. Les Mon Calamaris et les Quarrens ont uni leurs forces après avoir été exploités par l''Empire, transformant leurs cités flottantes en bastions de résistance navale. La planète est en état de siège permanent, protégée par une flotte rebelle déterminée à défendre son principal centre de production.', 'planet'),
    (3, zone_id, 'Sullust', 'Monde volcanique dont l''industrie est contrôlée par la corporation SoroSuub, Sullust est un terrain de lutte entre les collaborateurs impériaux et les syndicats rebelles. Ses vastes réseaux de tunnels et ses usines géothermiques sont le théâtre de sabotages et de guérilla urbaine, alors que l''Alliance cherche à rallier ce monde industriel crucial à sa cause.', 'planet'),
    (3, zone_id, 'Chandrila', 'Foyer de Mon Mothma, Chandrila est un symbole de résistance diplomatique. Bien que sous surveillance impériale, la planète conserve ses traditions démocratiques et sert de lien secret entre les sénateurs dissidents et l''Alliance armée. Ses paysages sereins cachent une agitation politique intense et un réseau d''espionnage sophistiqué.', 'planet');

    -- ==========================================
    -- 3. LA BORDURE EXTÉRIEURE (ZONE DE NON-DROIT)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (3, 'La Bordure Extérieure', 'Vaste étendue sauvage où l''autorité impériale est contestée par les cartels criminels et la nature elle-même.', 'region', 3)
    RETURNING id INTO reg_id;

    -- ZONE : L''Espace Hutt & Crime
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (3, reg_id, 'L''Espace Hutt & Crime', 'Territoires dominés par les syndicats du crime, où tout s''achète et se vend, même la loyauté.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (3, zone_id, 'Tatooine', 'Désert impitoyable sous l''influence de Jabba le Hutt, Tatooine est le carrefour de la pègre galactique. L''Empire y maintient une présence symbolique à Mos Eisley, mais la véritable loi est celle des crédits et des blasters. C''est un refuge pour les contrebandiers, les chasseurs de primes et les agents rebelles en quête d''anonymat dans les sables mouvants de la Bordure.', 'planet'),
    (3, zone_id, 'Nal Hutta', 'Le "Joyau Glorieux" est le cœur de l''empire criminel des Hutts. Planète marécageuse et polluée, elle est le siège du Conseil des Hutts qui tire les ficelles de l''Underworld galactique. L''Empire évite une confrontation directe, préférant des accords pragmatiques pour assurer la stabilité des routes commerciales de la Bordure.', 'planet'),
    (3, zone_id, 'Kessel', 'Astéroïde minier infernal, Kessel est célèbre pour son épice et son "Raid de Kessel". L''Empire y exploite des prisonniers politiques et des esclaves dans des conditions inhumaines pour alimenter les marchés noirs et les besoins militaires. C''est un lieu de souffrance et de richesse rapide, protégé par des tempêtes ioniques permanentes.', 'planet');

    -- ZONE : Confins Sauvages
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (3, reg_id, 'Confins Sauvages', 'Mondes isolés et mystérieux, souvent ignorés par les grandes puissances galactiques.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (3, zone_id, 'Bespin', 'Géante gazeuse abritant la Cité des Nuages, Bespin tente de maintenir une neutralité précaire grâce à son isolation. Ses mines de gaz Tibanna sont vitales pour l''armement, attirant l''attention de l''Empire et de l''Alliance. La cité flottante est un havre de luxe et de jeu, mais l''ombre du conflit galactique finit toujours par l''atteindre.', 'planet'),
    (3, zone_id, 'Endor', 'Lune forestière reculée, Endor est le foyer des Ewoks et le site top secret de la construction de la seconde Étoile de la Mort. Ses forêts denses et sa position isolée en font le théâtre final d''une confrontation qui décidera du sort de la galaxie. C''est un monde d''une beauté sauvage cachant une arme d''une destruction inimaginable.', 'planet'),
    (3, zone_id, 'Dagobah', 'Monde de marécages et de brumes, Dagobah est absent des cartes impériales. Imprégnée par la Force, la planète est le refuge secret du Maître Yoda. C''est un lieu de pure nature où le côté lumineux et le côté obscur se côtoient dans un équilibre primal, loin du vacarme de la guerre civile.', 'planet');

    -- ==========================================
    -- 4. LES SECRETS DE L'EMPEREUR
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (3, 'Les Secrets de l''Empereur', 'Zones interdites et mondes cachés abritant les projets les plus sombres de Palpatine.', 'region', 4)
    RETURNING id INTO reg_id;

    -- ZONE : L''Espace Inconnu
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (3, reg_id, 'L''Espace Inconnu', 'Régions non cartographiées protégées par des anomalies spatiales, où l''Empire prépare son futur ou cache son passé.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (3, zone_id, 'Exegol', 'Monde de ténèbres éternelles et d''éclairs, Exegol est le bastion caché des Sith. Loin des regards de la galaxie, des cultistes et des ingénieurs y travaillent sur des technologies de clonage et des flottes de guerre secrètes pour assurer la pérennité de l''Ordre Sith. C''est un lieu où la mort n''est qu''un obstacle temporaire pour l''Empereur.', 'planet'),
    (3, zone_id, 'Byss', 'Monde paradisiaque en apparence, Byss est en réalité une prison dorée imprégnée par le Côté Obscur. L''Empereur y a établi une retraite privée où il draine l''énergie vitale de la population pour prolonger sa propre existence. C''est un centre de recherches ésotériques et de sombres rituels, protégé par une sécurité impériale d''élite.', 'planet'),
    (3, zone_id, 'Jakku', 'Désert de poussière sans intérêt apparent, Jakku cache une installation secrète de l''Observatoire de l''Empereur. Ce monde est destiné à devenir le point de rassemblement final pour le plan de contingence de Palpatine en cas de défaite, transformant ce désert en un gigantesque piège pour les flottes galactiques.', 'planet');

END $$;
