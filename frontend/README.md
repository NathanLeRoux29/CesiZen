# CesiZen Frontend

CesiZen Frontend est l'interface utilisateur de l'application de bien-être, destinée aux étudiants et collaborateurs du CESI.

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

3. L'application est accessible à l'adresse : [http://localhost:5173](http://localhost:5173) (ou le port indiqué par Vite).

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

Assurez-vous que le backend est lancé et que l'URL de l'API est correcte pour une fonctionnalité complète.

## Scripts Disponibles

- `npm run dev` : Lance l'application en mode développement.
- `npm run build` : Compile l'application pour la production.
- `npm run preview` : Prévisualise le build de production.
- `npm run lint` : Vérifie le code avec ESLint.
- `npm run test` : Lance les tests fonctionnels Playwright.

## Application Mobile (Capacitor)

Le projet utilise Capacitor pour générer une application mobile.

### Pré-requis
- Android Studio (configuré dans `package.json`)

### Commandes Mobiles
- **Préparer le build** : `npm run mobile:build`
- **Ouvrir Android Studio** : `npm run mobile:open`

### Synchronisation
Pour synchroniser les changements du code web vers le projet natif :
```bash
npm run mobile:build
```
