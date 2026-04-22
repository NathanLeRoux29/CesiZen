# CesiZen Backoffice

CesiZen Backoffice est l'interface d'administration permettant de gérer le contenu de l'application (articles, utilisateurs, catégories).

## Technologies

- **Framework** : Vue 3
- **Outil de build** : Vite
- **UI library** : Vuetify 3
- **State management** : Pinia
- **HTTP Client** : Axios
- **Routing** : Vue Router

## Prérequis

- [Node.js](https://nodejs.org/) (version 18+)

## Installation

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

3. L'interface est accessible à l'adresse : [http://localhost:5173](http://localhost:5173) (ou le port indiqué par Vite).

## Authentification

Pour vous connecter au backoffice, utilisez un compte utilisateur ayant le flag `is_admin` à `1` dans la base de données.

## Configuration

L'application communique avec le backend via l'URL définie dans la variable d'environnement `VITE_API_URL`.

### Variables d'environnement

Créez un fichier `.env` à la racine du projet (ou copiez `.env.example`) :

```env
VITE_API_URL=http://localhost:3001
```

Pour une configuration en production :
```env
VITE_API_URL=https://votre-serveur.com
```

## Scripts Disponibles

- `npm run dev` : Lance l'application en mode développement.
- `npm run build` : Compile l'application pour la production.
- `npm run preview` : Prévisualise le build de production.
