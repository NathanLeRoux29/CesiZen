# Documentation Technique - CesiZen

## 1. Présentation du Projet

CesiZen est une application web de bien-être développée avec Vue.js 3 et Vuetify 3. L'application est conçue pour être responsive et adaptable aux mobiles via Capacitor.

### Stack Technique
- **Frontend**: Vue.js 3 (Composition API)
- **UI Framework**: Vuetify 3
- **Backend**: Node.js / Express
- **Base de Données**: MySQL
- **Documentation API**: Swagger
- **Gestion d'état**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite

### Couleurs du Thème
| Nom | Code Hex | Utilisation |
|-----|----------|-------------|
| Primary | `#04FF92` | Accents, boutons, icônes |
| Background | `#1D1143` | Fond principal |
| Secondary | `#072392` | Éléments secondaires |
| Info | `#E2FBFF` | Textes, éléments d'info |

## 2. Structure des Fichiers

```
CesiZen/
├── backend/             # Partie API Node.js
│   ├── src/
│   │   ├── config/      # Configuration (DB, Swagger)
│   │   ├── controllers/ # Logique métier
│   │   ├── dao/         # Data Access Object (Requêtes SQL)
│   │   ├── models/      # Définition des objets
│   │   ├── routes/      # Points d'entrée API
│   │   ├── app.js       # Configuration Express
│   │   └── server.js    # Lancement du serveur
│   ├── sql/             # Scripts de création de la DB
│   └── .env             # Variables d'environnement
├── frontend/            # Partie Interface Vue.js
│   ├── src/
│   │   ├── assets/      
│   │   ├── components/  
│   │   ├── pages/       
│   │   ├── plugins/     
│   │   ├── router/      
│   │   ├── stores/      
│   │   └── App.vue
└── docs/                # Documentation projet
```

## 3. Pages Implémentées

### 3.1 Page d'Accueil (`/`)
- **Article du jour**: Affiche un article différent chaque jour basé sur la date
- **Articles suggérés**: 3 articles aléatoires (différents de l'article du jour)
- **Bouton vers le catalogue**: Navigation vers la page catalogue

### 3.2 Page de Connexion (`/connexion`)
- Formulaire avec validation email et mot de passe
- Gestion de l'état de connexion via le store Pinia
- Simulation de connexion avec données mockées

### 3.3 Page Catalogue (`/catalogue`)
- Liste des articles avec images et titres
- Filtres par catégorie
- Chargement dynamique (pagination)
- Affichage: 1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop

### 3.4 Page Utilisateur (`/compte`)
- **Statistiques**: Articles consultés, favoris, exercices de respiration
- **Modification du profil**: Dialog de modification
- **Accès aux diagnostics**: Bouton de navigation
- **Suppression de compte**: Confirmation et suppression

### 3.5 Page Respiration (`/respiration`)
- Configuration de la durée (1-30 minutes)
- Configuration des cycles (1-20)
- Choix de la technique de respiration
- Type d'exercice (relaxation, énergie, sommeil, concentration)
- Sons ambient et vibrations

## 4. Composants

### 4.1 AppBar
- Navigation principale avec logo
- Menu desktop avec onglets
- Menu mobile avec drawer
- Indicateur de connexion (icône compte)

### 4.2 ArticleCard
- Image avec overlay de catégorie
- Titre et description
- Mode normal ou grand (pour l'article du jour)
- Effets de hover

### 4.3 Title / SubTitle
- Composants de présentation textuelle
- Personnalisables via props

## 5. Stores Pinia

### 5.1 Store Utilisateur (`user.js`)
```javascript
// État
- isLoggedIn: boolean
- user: { id, name, email, avatar, stats }

// Actions
- login(userData): Connexion utilisateur
- logout(): Déconnexion
- updateUser(userData): Mise à jour du profil
- incrementArticlesViewed(): Incrémente le compteur
- incrementFavorites(): Incrémente les favoris
- deleteAccount(): Suppression du compte
```

## 6. Données Mockées

### Articles
12 articles mockés avec:
- ID unique
- Titre
- Image (Unsplash)
- Catégorie
- Description
- Contenu
- Date

### Fonctions utilitaires
- `getArticleOfTheDay()`: Retourne l'article du jour
- `getSuggestedArticles(excludeId)`: Retourne 3 articles aléatoires
- `getArticles(page, limit)`: Pagination des articles
- `getArticleById(id)`: Retourne un article par son ID

## 7. Routing

Les routes sont générées automatiquement via `vue-router/auto-routes`. Les fichiers dans `pages/` créent les routes correspondantes:

| Fichier | Route |
|---------|-------|
| index.vue | `/` |
| connexion.vue | `/connexion` |
| catalogue.vue | `/catalogue` |
| compte.vue | `/compte` |
| respiration.vue | `/respiration` |

## 8. Responsive Design

L'application utilise les breakpoints Vuetify:
- **xs** (< 600px): Mobile
- **sm** (600px - 960px): Tablette
- **md** (960px - 1280px): Petit desktop
- **lg** (1280px - 1920px): Desktop
- **xl** (> 1920px): Grand écran

## 9. Architecture Backend (API)

Le backend est structuré pour séparer la logique de routage de la logique d'accès aux données. Nous utilisons Express pour le serveur et `mysql2` pour la communication avec la base de données.

### 9.1 Organisation du Code
- **Routes** : Définissent les URLs disponibles (ex: `/api/articles`).
- **Controllers** : Reçoivent les requêtes, appellent les DAO et renvoient les réponses JSON.
- **DAO (Data Access Objects)** : Contiennent les requêtes SQL pures pour interagir avec la base.

### 9.2 Points d'Entrée Principaux
L'API est documentée via Swagger, accessible sur `/api-docs`.

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/articles` | GET | Récupère la liste des articles |
| `/api/articles/:id` | GET | Détails d'un article spécifique |
| `/api/users/login` | POST | Authentification utilisateur |
| `/api/breathing/exercises` | GET | Liste des techniques de respiration |

## 10. Base de Données

Nous avons choisi MySQL pour sa robustesse et sa facilité d'intégration dans un environnement académique.

### 10.1 Schéma Relationnel
Le schéma est composé de plusieurs tables clés :
- **users** : Stocke les informations des utilisateurs et les droits admin.
- **articles** : Contient le contenu, lié à une **category**.
- **breath_exercises** : Paramètres des techniques (inspire, expire, rétention).
- **breath_sessions** : Historique des sessions réalisées par les utilisateurs.
- **favorites** : Lien entre utilisateurs et articles favoris.

### 10.2 Script SQL
Le script complet de création et d'initialisation (avec données de test) se trouve dans `backend/sql/cesizen.sql`.

## 11. Installation et Lancement

### 11.1 Frontend
```bash
cd frontend
npm install
npm run dev
```

### 11.2 Backend
```bash
cd backend
npm install
# Configurer le fichier .env avec les accès DB
npm run dev
```

## 12. Perspectives d'Évolution

- [x] Ajout d'un backend API fonctionnel
- [x] Passage des données mockées vers une base MySQL
- [ ] Intégration complète avec Capacitor pour mobile
- [ ] Système d'authentification réel (JWT en cours)
- [ ] Tracker d'émotions avec historique
- [ ] Page de diagnostics complets