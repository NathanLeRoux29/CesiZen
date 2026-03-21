# Documentation Technique - CesiZen

## 1. Présentation du Projet

CesiZen est une application web de bien-être développée avec Vue.js 3 et Vuetify 3. L'application est conçue pour être responsive et adaptable aux mobiles via Capacitor.

### Stack Technique
- **Frontend**: Vue.js 3 (Composition API)
- **UI Framework**: Vuetify 3
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
frontend/src/
├── assets/              # Ressources statiques
│   └── logo.png
├── components/          # Composants réutilisables
│   ├── AppBar.vue       # Barre de navigation
│   ├── ArticleCard.vue  # Carte d'article
│   ├── SubTitle.vue     # Sous-titre
│   └── Title.vue        # Titre
├── data/                # Données mockées
│   └── articles.js      # Articles de bien-être
├── layouts/             # Layouts
│   └── default.vue
├── pages/               # Pages de l'application
│   ├── HomePage.vue     # Page d'accueil
│   ├── LoginPage.vue    # Page de connexion
│   ├── CataloguePage.vue# Catalogue d'articles
│   ├── UserPage.vue     # Page utilisateur
│   └── BreathingPage.vue# Configuration respiration
├── plugins/             # Plugins Vuetify
│   └── vuetify.js
├── router/              # Configuration du router
│   └── index.js
├── stores/              # Stores Pinia
│   ├── app.js
│   └── user.js          # Store utilisateur
├── styles/              # Styles globaux
│   └── settings.scss
├── App.vue              # Composant racine
└── main.js              # Point d'entrée
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

## 9. Installation et Lancement

```bash
# Installation des dépendances
cd frontend
npm install

# Lancement en mode développement
npm run dev

# Build pour la production
npm run build
```

## 10. Perspectives d'Évolution

- Ajout d'un backend API
- Intégration avec Capacitor pour mobile
- Page de détail des articles
- Système d'authentification réel
- Exercises de respiration fonctionnels
- Page de diagnostics
- Tracker d'émotions
- FAQ