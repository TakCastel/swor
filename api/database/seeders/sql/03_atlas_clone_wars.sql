-- =================================================================================
-- SEED 03 : ATLAS GALACTIQUE - GUERRE DES CLONES (REFONTE TOTALE)
-- =================================================================================

DO $$
DECLARE
    reg_id INTEGER;
    zone_id INTEGER;
BEGIN
    -- ==========================================
    -- 1. NOYAU GALACTIQUE (BASTION DE LA RÉPUBLIQUE)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (2, 'Noyau Galactique', 'Le centre de gravité de la civilisation, siège du pouvoir galactique et bastion inexpugnable de la République.', 'region', 1)
    RETURNING id INTO reg_id;

    -- ZONE : Le Centre Politique
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Le Centre Politique', 'Le cœur battant de la démocratie galactique, où les décisions qui forgent l''histoire sont prises sous le dôme du Sénat.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Coruscant', 'Cité-monde étincelante et capitale de la République, Coruscant est le centre névralgique de l''effort de guerre. Tandis que le Sénat Galactique résonne des débats passionnés sur la militarisation, le Temple Jedi surplombe la ville, servant de quartier général aux généraux Jedi qui coordonnent les armées de clones à travers la galaxie. Les niveaux supérieurs respirent l''opulence, mais l''ombre du conflit s''étend jusque dans les bas-fonds, où les espions séparatistes et les trafiquants profitent du chaos politique.', 'planet'),
    (2, zone_id, 'Alderaan', 'Perle de beauté et de culture, Alderaan demeure l''un des plus fermes soutiens diplomatiques de la République. Sous l''égide de la Maison Organa, la planète prône la paix et la résolution pacifique des conflits, bien que sa position stratégique dans le Noyau en fasse une cible de choix pour les intrigues politiques séparatistes. Ses paysages de montagnes enneigées et de plaines verdoyantes offrent un contraste frappant avec la violence qui ravage le reste de la galaxie.', 'planet');

    -- ZONE : Les Mondes Fondateurs
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Les Mondes Fondateurs', 'Bastions industriels et historiques produisant la puissance navale nécessaire à la défense du Noyau.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Corellia', 'Réputée pour ses chantiers navals orbitaux et ses pilotes intrépides, Corellia est la forge des vaisseaux de ligne de la République. La planète est un tourbillon d''activité industrielle où les ingénieurs travaillent sans relâche pour produire les croiseurs qui affronteront les flottes de la CSI. Bien que loyale, Corellia conserve un esprit d''indépendance farouche, et ses spatioports sont des nids de rumeurs et de contrebande.', 'planet'),
    (2, zone_id, 'Kuat', 'Dominée par les immenses anneaux de construction des Kuat Drive Yards, cette planète est le joyau industriel de la République. C''est ici que naissent les redoutables destroyers stellaires de classe Venator. La sécurité y est absolue, car la perte de Kuat signifierait la fin de la suprématie navale républicaine. L''aristocratie locale, immensément riche, tire les ficelles de l''économie de guerre avec une efficacité glaciale.', 'planet');

    -- ==========================================
    -- 2. BORDURES INTÉRIEURE & MÉDIANE (CHAMPS DE BATAILLE)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (2, 'Bordures Intérieure & Médiane', 'Zones de transition vitales, parsemées de mondes stratégiques servant de boucliers au Noyau.', 'region', 2)
    RETURNING id INTO reg_id;

    -- ZONE : Secteur de l''Expansion
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Secteur de l''Expansion', 'Région riche en ressources, disputée avec acharnement entre les deux factions.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Naboo', 'D''une beauté bucolique, Naboo est un symbole de résistance contre l''avidité des corporations. Bien que la planète ait été le théâtre de l''invasion par la Fédération du Commerce, elle reste un allié précieux de la République. Ses plaines et ses cités sous-marines sont protégées par les forces de sécurité royales et les Gungans, toujours prêts à repousser toute nouvelle incursion séparatiste.', 'planet'),
    (2, zone_id, 'Devaron', 'Monde de montagnes escarpées et de jungles denses, Devaron est une plaque tournante stratégique sur la route commerciale du Noyau. La planète est le siège d''une lutte politique intense entre les partisans de la neutralité et ceux qui souhaitent rejoindre la République, tandis que les forêts environnantes cachent souvent des avant-postes secrets et des camps d''entraînement pour les forces spéciales.', 'planet');

    -- ZONE : Théâtres de Siège
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Théâtres de Siège', 'Mondes devenus des symboles de la guerre d''usure où clones et droïdes s''affrontent sans fin.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Kashyyyk', 'Le monde forestier des Wookiees est un champ de bataille vertical. Les séparatistes convoitent les ressources et la position stratégique de la planète, menant des assauts massifs contre les cités dans les arbres. Les Wookiees, alliés naturels de la République, combattent avec une bravoure légendaire aux côtés des clones, transformant chaque niveau de la canopée en un piège mortel pour les droïdes de combat.', 'planet'),
    (2, zone_id, 'Christophsis', 'Cité de cristal étincelante, Christophsis est devenue le théâtre d''un siège mémorable. Ses ressources minérales et sa position sur les routes de la Bordure en font une cible prioritaire pour la CSI. Les combats de rue y sont acharnés, chaque bloc d''habitation cristallin pouvant devenir une forteresse. La population civile, prise entre deux feux, tente de survivre dans les ruines de ce qui fut autrefois l''une des plus belles villes de la galaxie.', 'planet');

    -- ==========================================
    -- 3. BORDURE EXTÉRIEURE (L''ENFER DE LA GUERRE)
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (2, 'Bordure Extérieure', 'Vaste étendue sauvage où la loi de la République s''efface devant la puissance des séparatistes et des cartels.', 'region', 3)
    RETURNING id INTO reg_id;

    -- ZONE : Les Bastions de la CSI
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Les Bastions de la CSI', 'Le cœur industriel et militaire de la Confédération des Systèmes Indépendants.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Geonosis', 'Planète de poussière et de roche, Geonosis est le berceau de la CSI. Ses usines souterraines massives produisent les légions de droïdes qui s''abattent sur la galaxie. C''est ici que la première bataille de la guerre a éclaté, et la planète reste un bastion lourdement défendu, hanté par le bourdonnement des Geonosiens et la chaleur des fonderies.', 'planet'),
    (2, zone_id, 'Mustafar', 'Enfer volcanique et monde minier, Mustafar abrite des installations secrètes de haute importance pour le Conseil Séparatiste. Les rivières de lave et les infrastructures flottantes créent un environnement hostile où seuls les plus désespérés ou les plus loyaux osent s''aventurer. C''est un lieu de retraite pour les leaders de la CSI, loin du regard de la République.', 'planet'),
    (2, zone_id, 'Utapau', 'Monde de gouffres et de cités troglodytes, Utapau tente de maintenir une neutralité fragile dans un conflit qui la dépasse. Cependant, ses vastes grottes offrent des cachettes idéales pour les flottes séparatistes en attente. La population locale, pacifique mais fière, observe avec inquiétude l''ombre des destroyers qui plane au-dessus de leurs puits vertigineux.', 'planet');

    -- ZONE : Mondes de Frontière
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Mondes de Frontière', 'Frontières sauvages où le destin de la galaxie se joue dans des batailles isolées.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Kamino', 'Monde océanique perpétuellement balayé par les tempêtes, Kamino est le secret le mieux gardé de la République. Dans les cités immaculées de Tipoca, les Kaminoans produisent et entraînent les millions de soldats clones qui constituent la Grande Armée de la République. La sécurité y est draconienne, car toute attaque contre Kamino menacerait directement le renouvellement des troupes républicaines.', 'planet'),
    (2, zone_id, 'Tatooine', 'Désert impitoyable dominé par les Hutts, Tatooine est une plaque tournante pour les mercenaires, les chasseurs de primes et les fugitifs. Bien qu''officiellement hors de la juridiction de la République, sa position sur les routes de la Bordure en fait un point de passage crucial. Les escarmouches entre les forces séparatistes et les intérêts locaux y sont fréquentes, tandis que les Jedi y mènent parfois des missions de reconnaissance discrètes.', 'planet'),
    (2, zone_id, 'Ryloth', 'Monde natal des Twi''leks, Ryloth est dévasté par l''occupation séparatiste qui cherche à s''emparer de ses ressources en Ryll. La résistance locale, menée par des guerriers intrépides, lutte pied à pied dans les canyons et les cavernes pour libérer leur peuple. La République envoie souvent des contingents de clones pour soutenir ces insurgés, transformant la planète en un symbole de lutte pour la liberté.', 'planet');

    -- ==========================================
    -- 4. ESPACE INCONNU & MONDES SECRETS
    -- ==========================================
    INSERT INTO public.forums (category_id, name, description, type, display_order)
    VALUES (2, 'Espace Inconnu & Mondes Secrets', 'Régions mystérieuses et oubliées où la Force et les secrets anciens dominent.', 'region', 4)
    RETURNING id INTO reg_id;

    -- ZONE : Mystères de la Force
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Mystères de la Force', 'Lieux de pouvoir et de légende, accessibles uniquement aux initiés ou par pur hasard.', 'region', 1)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Ilum', 'Planète glacée et secrète, Ilum est le lieu sacré où les Jedi viennent récolter les cristaux Kyber pour leurs sabres laser. Ses grottes cristallines sont imprégnées de la Force, offrant des visions et des défis à ceux qui cherchent la sagesse. En temps de guerre, la protection d''Ilum est devenue une priorité absolue pour l''Ordre Jedi, afin d''éviter que ses secrets ne tombent entre les mains des Sith.', 'planet'),
    (2, zone_id, 'Mortis', 'Un monolithe éthéré flottant dans l''espace, Mortis est un royaume qui défie les lois de la physique galactique. On dit qu''il est le foyer des "Élus" de la Force, des entités représentant l''Équilibre, le Côté Lumineux et le Côté Obscur. Peu ont trouvé le chemin de Mortis, et ceux qui en reviennent sont changés à jamais par les révélations sur la nature profonde de la Force.', 'planet');

    -- ZONE : Frontières de l''Ombre
    INSERT INTO public.forums (category_id, parent_id, name, description, type, display_order)
    VALUES (2, reg_id, 'Frontières de l''Ombre', 'Mondes hantés par des puissances anciennes et des cultures guerrières.', 'region', 2)
    RETURNING id INTO zone_id;

    INSERT INTO public.forums (category_id, parent_id, name, description, type) VALUES
    (2, zone_id, 'Dathomir', 'Monde de brumes rouges et de forêts de pierre, Dathomir est le domaine des Sœurs de la Nuit et des Frères de la Nuit. Imprégnée d''une magie obscure et ancienne, la planète est un lieu de danger constant. Les séparatistes ont tenté de forger des alliances avec ces clans puissants, mais la loyauté sur Dathomir est aussi changeante que les ombres qui hantent ses paysages désolés.', 'planet');

END $$;
