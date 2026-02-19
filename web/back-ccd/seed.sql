-- Dataset example

-- Campagne
INSERT INTO Campaign (id_camp, date, max_weight, total_weight, min_price, max_price, total_price, status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', '2026-02-01 10:00:00', 50.0, 32.5, 5.00, 80.00, 245.50, 'IN_PROGRESS'),
    ('a0000000-0000-0000-0000-000000000002', '2026-01-15 09:00:00', 40.0, 40.0, 3.00, 60.00, 180.00, 'FINISHED'),
    ('a0000000-0000-0000-0000-000000000003', '2026-03-01 08:00:00', 60.0, 0.0, 2.00, 100.00, 0.00, 'VALIDATED');

-- Users
INSERT INTO "user" (id_user, name, family_name, email, role)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Alice', 'Dupont', 'alice.dupont@email.com', 'ADMIN'),
    ('b0000000-0000-0000-0000-000000000002', 'Bob', 'Martin', 'bob.martin@email.com', 'USER'),
    ('b0000000-0000-0000-0000-000000000003', 'Claire', 'Bernard', 'claire.bernard@email.com', 'USER'),
    ('b0000000-0000-0000-0000-000000000004', 'David', 'Petit', 'david.petit@email.com', 'USER'),
    ('b0000000-0000-0000-0000-000000000005', 'Emma', 'Leroy', 'emma.leroy@email.com', 'USER');

--Users2Child
INSERT INTO UserToChild (id_user, age_range, preference)
VALUES
    -- Bob a un bébé qui aime les jeux d'éveil
    ('b0000000-0000-0000-0000-000000000002', 'BB', ARRAY['EVL', 'FIG']),
    -- Bob a aussi un enfant de 6-10 ans qui aime les jeux de société et construction
    ('b0000000-0000-0000-0000-000000000002', 'EN', ARRAY['SOC', 'CON']),
    -- Claire a un enfant petite enfance
    ('b0000000-0000-0000-0000-000000000003', 'PE', ARRAY['FIG', 'LIV']),
    -- David a un ado
    ('b0000000-0000-0000-0000-000000000004', 'AD', ARRAY['SOC', 'EXT', 'LIV']),
    -- Emma a un bébé et un enfant petite enfance
    ('b0000000-0000-0000-0000-000000000005', 'BB', ARRAY['EVL']),
    ('b0000000-0000-0000-0000-000000000005', 'PE', ARRAY['FIG', 'CON', 'LIV']);

-- Box
INSERT INTO Box (id_box, id_camp, id_user, score_box, total_weight, total_price, validated)
VALUES
    -- Campagne 1 : boxes en cours
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 85, 8.5, 52.50, FALSE),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 72, 6.2, 38.00, FALSE),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 90, 10.3, 65.00, TRUE),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 60, 7.5, 45.00, FALSE),

    -- Campagne 2 : boxes terminées
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 95, 12.0, 70.00, TRUE),
    ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 78, 9.8, 55.00, TRUE);

-- Articles :)
INSERT INTO Article (id_article, description, category, age_range, state, price, weight, id_box, picture)
VALUES
    -- ArticlesBox 1 (Bob camp1)
    ('d0000000-0000-0000-0000-000000000001',
     'Blanche Neige - Poupée princesse avec robe scintillante',
     'FIG', 'PE', 'TB', 12.50, 0.8,
     'c0000000-0000-0000-0000-000000000001', '1_blancheneige.png'),

    ('d0000000-0000-0000-0000-000000000002',
     'Rose Ballerine - Figurine danseuse articulée',
     'FIG', 'PE', 'N', 15.00, 0.6,
     'c0000000-0000-0000-0000-000000000001', '2_roseballerine.png'),

    ('d0000000-0000-0000-0000-000000000003',
     'Cendrillon - Poupée avec carrosse miniature',
     'FIG', 'EN', 'B', 25.00, 2.1,
     'c0000000-0000-0000-0000-000000000001', '3_cendrillon.png'),

    -- articles  Box 2 clairecampagne 1
    ('d0000000-0000-0000-0000-000000000004',
     'Juliette fait de la danse - Livre illustré jeunesse',
     'LIV', 'PE', 'N', 8.00, 0.3,
     'c0000000-0000-0000-0000-000000000002', '4_juliette.png'),

    ('d0000000-0000-0000-0000-000000000005',
     'Le corps humain - Jeu éducatif d''anatomie pour enfants',
     'EVL', 'EN', 'TB', 18.00, 1.5,
     'c0000000-0000-0000-0000-000000000002', '5_corps.png'),

    ('d0000000-0000-0000-0000-000000000006',
     'Le Loup qui voulait changer de couleur - Jeu de société',
     'SOC', 'PE', 'N', 12.00, 1.2,
     'c0000000-0000-0000-0000-000000000002', '6_loup.jpg'),

    -- Box 3,David, campagne 1) ──
    ('d0000000-0000-0000-0000-000000000007',
     'Lily Rock - Figurine rock star avec guitare et micro',
     'FIG', 'EN', 'TB', 20.00, 1.0,
     'c0000000-0000-0000-0000-000000000003', '7_lilyrock.jpg'),

    ('d0000000-0000-0000-0000-000000000008',
     'La couleur des émotions - Jeu de société éducatif',
     'SOC', 'PE', 'N', 22.00, 1.8,
     'c0000000-0000-0000-0000-000000000003', '8_couleur.jpg'),

    ('d0000000-0000-0000-0000-000000000009',
     'Little Pet Shop - Collection de figurines animaux',
     'FIG', 'EN', 'B', 23.00, 2.5,
     'c0000000-0000-0000-0000-000000000003', '9_littlepetshop.jpg'),

    -- Arts Box 4Emma,campagne1) ──
    ('d0000000-0000-0000-0000-000000000010',
     'Mon premier atlas en anglais - Livre éducatif bilingue',
     'LIV', 'EN', 'N', 14.00, 0.9,
     'c0000000-0000-0000-0000-000000000004', '10_englais.jpg'),

    ('d0000000-0000-0000-0000-000000000011',
     'Duplo Ma première ferme - Jeu de construction bébé',
     'CON', 'BB', 'TB', 18.50, 2.0,
     'c0000000-0000-0000-0000-000000000004', NULL),

    ('d0000000-0000-0000-0000-000000000012',
     'Tapis d''éveil musical - Sons et lumières',
     'EVL', 'BB', 'N', 12.50, 1.5,
     'c0000000-0000-0000-0000-000000000004', NULL),

    -- Articles dans Box 5Bob campagne 2 - terminé)
    ('d0000000-0000-0000-0000-000000000013',
     'Monopoly Junior - Jeu de société classique pour enfants',
     'SOC', 'EN', 'TB', 15.00, 1.8,
     'c0000000-0000-0000-0000-000000000005', NULL),

    ('d0000000-0000-0000-0000-000000000014',
     'Playmobil Caserne de pompiers - Set complet',
     'FIG', 'EN', 'N', 35.00, 3.5,
     'c0000000-0000-0000-0000-000000000005', NULL),

    ('d0000000-0000-0000-0000-000000000015',
     'LEGO City Camion de glaces - 200 pièces',
     'CON', 'EN', 'TB', 20.00, 1.2,
     'c0000000-0000-0000-0000-000000000005', NULL),

    -- dans Box 6 Emma campagne 2 terminée)
    ('d0000000-0000-0000-0000-000000000016',
     'Sophie la girafe - Jouet d''éveil en caoutchouc naturel',
     'EVL', 'BB', 'N', 12.00, 0.2,
     'c0000000-0000-0000-0000-000000000006', NULL),

    ('d0000000-0000-0000-0000-000000000017',
     'Livre tissu - Les animaux de la ferme',
     'LIV', 'BB', 'TB', 8.00, 0.3,
     'c0000000-0000-0000-0000-000000000006', NULL),

    ('d0000000-0000-0000-0000-000000000018',
     'Kapla - Boîte de 100 planchettes en bois',
     'CON', 'PE', 'N', 25.00, 2.8,
     'c0000000-0000-0000-0000-000000000006', NULL),

    ('d0000000-0000-0000-0000-000000000019',
     'Ballon sauteur - Jeu d''extérieur pour petits',
     'EXT', 'PE', 'B', 10.00, 0.8,
     'c0000000-0000-0000-0000-000000000006', NULL),

    -- arts non assignés à une box (, campagne 1) ──
    ('d0000000-0000-0000-0000-000000000020',
     'Uno - Jeu de cartes familial',
     'SOC', 'EN', 'N', 6.00, 0.2,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000021',
     'Cluedo Junior - Enquête pour enfants',
     'SOC', 'AD', 'TB', 18.00, 1.5,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000022',
     'Barbie Fashionista - Poupée avec accessoires',
     'FIG', 'EN', 'N', 14.00, 0.6,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000023',
     'LEGO Technic Voiture de course - 350 pièces',
     'CON', 'AD', 'N', 30.00, 2.0,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000024',
     'Trampoline enfant 140cm - Jeu d''extérieur',
     'EXT', 'EN', 'B', 45.00, 8.0,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000025',
     'Fisher-Price Pyramide arc-en-ciel - Jouet d''éveil',
     'EVL', 'BB', 'TB', 9.00, 0.5,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000026',
     'T''choupi va à l''école - Livre cartonné',
     'LIV', 'PE', 'N', 5.50, 0.3,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000027',
     'Dobble Kids - Jeu d''observation rapide',
     'SOC', 'PE', 'N', 10.00, 0.4,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000028',
     'Nerf Elite 2.0 - Pistolet à fléchettes mousse',
     'EXT', 'AD', 'TB', 22.00, 1.2,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000029',
     'Le Petit Prince - Édition illustrée jeunesse',
     'LIV', 'AD', 'N', 12.00, 0.4,
     NULL, NULL),

    ('d0000000-0000-0000-0000-000000000030',
     'Cubes empilables - Chiffres et animaux',
     'EVL', 'BB', 'N', 7.00, 0.6,
     NULL, NULL);
