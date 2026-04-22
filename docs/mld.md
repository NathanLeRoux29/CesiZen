# Modèle Logique de Données (MLD) - CesiZen

Ce document détaille la structure relationnelle de la base de données MySQL utilisée par CesiZen.

## 1. Tables et Attributs

### Table : USERS
- **id** (INT, PK, AI) : Identifiant unique.
- **name** (VARCHAR 100) : Nom d'affichage.
- **email** (VARCHAR 150, Unique) : Adresse de connexion.
- **password** (VARCHAR 255) : Mot de passe haché.
- **role** (ENUM: 'user', 'admin') : Droits d'accès.
- **avatar** (VARCHAR 255) : Chemin vers l'image.

### Table : CATEGORIES
- **id** (INT, PK, AI) : Identifiant unique.
- **label** (VARCHAR 50) : Nom de la catégorie (Méditation, Sport, etc.).

### Table : ARTICLES
- **id** (INT, PK, AI) : Identifiant unique.
- **title** (VARCHAR 200) : Titre de l'article.
- **content** (TEXT) : Corps du texte.
- **image** (VARCHAR 255) : URL de l'image.
- **category_id** (INT, FK) : Lien vers la table CATEGORIES.
- **created_at** (DATETIME) : Date de publication.

### Table : FAVORITES
- **user_id** (INT, PK, FK) : Lien vers USERS.
- **article_id** (INT, PK, FK) : Lien vers ARTICLES.

### Table : BREATH_EXERCISES
- **id** (INT, PK, AI) : Identifiant unique.
- **label** (VARCHAR 100) : Nom de la technique.
- **inhale_time** (INT) : Secondes d'inspiration.
- **retention_time** (INT) : Secondes de rétention.
- **exhale_time** (INT) : Secondes d'expiration.

### Table : BREATH_SESSIONS
- **id** (INT, PK, AI) : Identifiant unique.
- **user_id** (INT, FK) : Lien vers USERS.
- **exercise_id** (INT, FK) : Lien vers BREATH_EXERCISES.
- **duration** (INT) : Temps total en minutes.
- **date** (DATETIME) : Date de la séance.

## 2. Relations Principales
- Un **Article** appartient à une seule **Catégorie**.
- Un **Utilisateur** peut avoir plusieurs **Articles** favoris (Relation n,n via FAVORITES).
- Un **Utilisateur** peut réaliser plusieurs **Sessions** de respiration.
