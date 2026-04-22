# CesiZen - Projet de Bien-être CESI

CesiZen est une plateforme web modulaire dédiée au bien-être. Elle propose des articles, des exercices de cohérence cardiaque et un suivi des favoris.

## Structure du Projet

Le projet est divisé en trois parties principales :

- **[`backend/`](./backend)** : API REST Node.js/Express connectée à une base MySQL.
- **[`frontend/`](./frontend)** : Application client en Vue 3 destinée aux utilisateurs finaux.
- **[`backoffice/`](./backoffice)** : Interface d'administration en Vue 3 pour la gestion du contenu.

## Prérequis

- **Node.js** (v18.x ou supérieure)
- **NPM** (livré avec Node.js)
- **MariaDB** ou **MySQL**

## Configuration de la Base de Données

### 1. Créer la base et l'utilisateur

```sql
CREATE DATABASE IF NOT EXISTS cesizen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cesizen_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON cesizen.* TO 'cesizen_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Importer le schéma

```bash
mysql -u cesizen_user -p cesizen < backend/sql/cesizen.sql
```

Ou depuis MySQL/MariaDB :

```sql
USE cesizen;
SOURCE backend/sql/cesizen.sql;
```

## Installation Rapide

Pour installer et lancer le projet complet localement :

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env # Puis configurez vos accès DB
# Importez sql/cesizen.sql dans votre base de données
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Backoffice
```bash
cd backoffice
npm install
npm run dev
```

## Documentation

- Pour plus de détails sur chaque composant, référez-vous aux fichiers README dans chaque sous-répertoire.
- Documentation de l'API (Swagger) : [http://localhost:3001/api-docs](http://localhost:3001/api-docs) (lorsque le backend tourne).
- Cahier de tests : disponible dans [docs/cahier_de_tests.md](./docs/cahier_de_tests.md).
