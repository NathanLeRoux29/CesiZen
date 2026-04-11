CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `is_admin` boolean,
  `is_active` boolean,
  `created_at` datetime
);

CREATE TABLE `articles` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `summary` varchar(255),
  `content` text,
  `media_url` varchar(255),
  `author` varchar(255),
  `is_active` boolean,
  `created_at` datetime,
  `id_category` integer
);


CREATE TABLE `categories` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `label` varchar(255)
);

CREATE TABLE `favorites` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `article_id` integer,
  `activity_id` integer,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `breath_exercises` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `breath_in_time` integer,
  `breath_hold_time` integer,
  `breath_out_time` integer,
  `description` text
);

CREATE TABLE `breath_sessions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `duration_minutes` integer,
  `cycles_count` integer,
  `technique_id` varchar(255),
  `sound_type` varchar(255),
  `vibration_intensity` varchar(255),
  `created_at` datetime,
  `user_id` integer,
  `exercise_id` integer
);

CREATE TABLE `breathing_favorites` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `name` varchar(255),
  `breath_in` integer,
  `breath_hold` integer,
  `breath_out` integer,
  `duration` integer,
  `sound_type` varchar(255),
  `vibration_intensity` varchar(255),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `articles` ADD FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`);

ALTER TABLE `favorites` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `favorites` ADD FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`);

ALTER TABLE `breath_sessions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `breath_sessions` ADD FOREIGN KEY (`exercise_id`) REFERENCES `breath_exercises` (`id`);

ALTER TABLE `breathing_favorites` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);


-- 1. Catégories (Extraites des données mockées du frontend)
INSERT INTO `categories` (`id`, `label`) VALUES
(1, 'Méditation'),
(2, 'Yoga'),
(3, 'Respiration'),
(4, 'Sommeil'),
(5, 'Nutrition'),
(6, 'Nature'),
(7, 'Émotions'),
(8, 'Sport'),
(9, 'Maison'),
(10, 'Social'),
(11, 'Technologie'),
(12, 'Psychologie');

-- 2. Utilisateurs
INSERT INTO `users` (`id`, `username`, `email`, `password`, `is_admin`, `is_active`, `created_at`) VALUES
(1, 'admin', 'admin@cesizen.fr', '$2b$10$.FkELN6S1BpUYiVfbccz8uhhEV/814KrrAfjShsm9hknlhQfs3sj.', true, true, NOW()), -- admin123
(2, 'utilisateur', 'user@cesizen.fr', '$2b$10$vr6TBwrKgZGNZI.tH8PnoOmiWU6uI9DHxRnveTCtwOfJpp2DFS.zq', false, true, NOW()); -- user123

-- 3. Articles mockés (Avec l'ID de catégorie correspondant)
INSERT INTO `articles` (`id`, `title`, `summary`, `content`, `media_url`, `author`, `is_active`, `created_at`, `id_category`) VALUES
(1, 'Les Bienfaits de la Méditation Quotidienne', 'Découvrez comment quelques minutes de méditation par jour peuvent transformer votre quotidien.', 'La méditation est une pratique ancienne qui offre de nombreux bénéfices pour la santé mentale et physique. En vous accordant seulement 10 minutes chaque jour, vous pouvez réduire considérablement votre niveau de stress et améliorer votre concentration...', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', 'Admin', true, '2024-01-15 10:00:00', 1),
(2, 'Guide Complet du Yoga du Matin', 'Une routine de yoga matinale pour démarrer votre journée du bon pied.', 'Le yoga matinal est excellent pour éveiller votre corps et votre esprit après une nuit de repos...', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 'Admin', true, '2024-01-14 10:00:00', 2),
(3, 'Techniques de Respiration pour Gérer le Stress', 'Apprenez les meilleures techniques de respiration pour calmer votre esprit.', 'La respiration est un outil puissant pour gérer le stress et l''anxiété car elle agit directement sur le système nerveux autonome...', 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800', 'Admin', true, '2024-01-13 10:00:00', 3),
(4, 'Comment Améliorer Votre Sommeil', 'Conseils et astuces pour retrouver un sommeil de qualité.', 'Un bon sommeil est essentiel pour votre bien-être général...', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800', 'Admin', true, '2024-01-12 10:00:00', 4),
(5, 'Alimentation Saine pour l''Équilibre Mental', 'Découvrez les aliments qui favorisent une bonne santé mentale.', 'Ce que vous mangez a un impact direct sur votre humeur et votre énergie...', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', 'Admin', true, '2024-01-11 10:00:00', 5),
(6, 'La Nature: Votre Alliée Bien-être', 'Passer du temps dans la nature peut considérablement améliorer votre bien-être.', 'Les études montrent que passer du temps en extérieur réduit le stress...', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'Admin', true, '2024-01-10 10:00:00', 6),
(7, 'Gestion des Émotions au Quotidien', 'Apprenez à identifier et gérer vos émotions pour une vie plus équilibrée.', 'La gestion des émotions est une compétence essentielle pour le bien-être...', 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800', 'Admin', true, '2024-01-09 10:00:00', 7),
(8, 'Les Bienfaits du Sport sur le Mental', 'Comment l''activité physique peut améliorer votre santé mentale.', 'Le sport libère des endorphines qui améliorent l''humeur...', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', 'Admin', true, '2024-01-08 10:00:00', 8),
(9, 'Créer un Espace de Détente chez Soi', 'Transformez votre intérieur en un sanctuaire de paix.', 'Un espace bien organisé et apaisant contribue à votre bien-être...', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'Admin', true, '2024-01-07 10:00:00', 9),
(10, 'L''Importance des Relations Sociales', 'Pourquoi les connections humaines sont essentielles à votre bien-être.', 'Les relations sociales jouent un rôle crucial dans notre santé mentale...', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', 'Admin', true, '2024-01-06 10:00:00', 10),
(11, 'Digital Detox: Déconnectez-vous pour mieux vous reconnecter', 'Apprenez à trouver l''équilibre avec la technologie.', 'Une pause numérique peut faire wonders pour votre esprit...', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', 'Admin', true, '2024-01-05 10:00:00', 11),
(12, 'Gratitude: La Clé du Bonheur', 'Cultivez la gratitude pour transformer votre vie.', 'La gratitude est associée à une meilleure santé mentale...', 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800', 'Admin', true, '2024-01-04 10:00:00', 12);

-- 4. Exercices de respiration (Basés sur ton interface UI de respiration)
INSERT INTO `breath_exercises` (`id`, `title`, `breath_in_time`, `breath_hold_time`, `breath_out_time`, `description`) VALUES
(1, 'Cohérence Cardiaque 5-5', 5, 0, 5, 'Idéal pour réduire le stress et l''anxiété. Inspirez 5 secondes, expirez 5 secondes.'),
(2, 'Respiration Relaxante 4-7-8', 4, 7, 8, 'Technique pour favoriser l''endormissement. Inspirez 4 secondes, retenez 7 secondes, expirez 8 secondes.'),
(3, 'Respiration 4-6', 4, 0, 6, 'Permet de se relaxer.'),
(4, 'Personnalisé', 4, 2, 4, 'Configuration libre de la respiration.');

-- 5. Sessions de respiration mockées
INSERT INTO `breath_sessions` (`id`, `duration_minutes`, `cycles_count`, `technique_id`, `sound_type`, `vibration_intensity`, `created_at`, `user_id`, `exercise_id`) VALUES
(1, 5, 30, 'coherence-cardiaque', 'nature', 'medium', NOW(), 1, 1),
(2, 10, 60, 'relaxante-4-7-8', 'ocean', 'low', NOW(), 2, 2);

-- 6. Favoris mockés
INSERT INTO `favorites` (`id`, `user_id`, `article_id`, `activity_id`, `created_at`) VALUES
(1, 1, 1, NULL, NOW()),
(2, 1, 3, NULL, NOW()),
(3, 2, 2, NULL, NOW());
