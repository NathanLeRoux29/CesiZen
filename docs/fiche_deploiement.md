# Fiche de déploiement

## 1) Composants du projet

- Frontend : application Vue.js 3 + Vite + Vuetify (client web)
- Backoffice : application Vue.js 3 + Vite + Vuetify (interface d'administration)
- Backend : API REST Express + Sequelize
- Données : base MySQL
- Mobile : application Capacitor (Android)

## 2) Schéma simple d'architecture

```text
[Navigateur]
    |
    | HTTP http://localhost:5173 (Frontend)
    | HTTP http://localhost:5174 (Backoffice)
    v
[Frontend Vue.js + Vite] [Backoffice Vue.js + Vite]
    |                           |
    | API HTTP http://localhost:3001/api
    v
[Backend Express + Sequelize]
    |
    | TCP 3306
    v
[MySQL : base cesi_zen]
```

## 3) Pré requis

- Node.js 18+
- npm 9+
- MySQL 8+

## 4) Variables d'environnement backend

Créer un fichier `backend/.env` à partir de cet exemple :

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cesi_zen
DB_USER=root
DB_PASSWORD=your_password_here
```

## 4b) Variables d'environnement Frontend et Backoffice

Créer un fichier `.env` (ou copier `.env.example`) dans chaque projet :

**frontend/.env**
```env
VITE_API_URL=http://localhost:3001
```

**backoffice/.env**
```env
VITE_API_URL=http://localhost:3001
```

En production, remplacez `http://localhost:3001` par l'URL de votre serveur backend.

## 5) Ports utilisés

- Frontend : `5173`
- Backoffice : `5174`
- Backend : `3000`
- MySQL : `3306`

## 6) Éléments sensibles à ne pas versionner

- `backend/.env`
- `frontend/.env`
- `backoffice/.env`
- dossiers `node_modules/` (backend, frontend, backoffice)
- dossiers `frontend/dist/`, `backoffice/dist/`
- dossier `android/` (généré par Capacitor)

## 7) Points de vigilance avant déploiement

- définir un mot de passe fort pour `DB_PASSWORD`
- vérifier la disponibilité des ports 3000, 5173, 5174 et 3306
- vérifier l'accès MySQL depuis le backend
- vérifier que les variables d'environnement sont présentes
- vérifier le build frontend (`npm run build`)
- vérifier que les variables d'environnement `VITE_API_URL` sont correctement configurées pour frontend et backoffice
- exécuter les migrations/seeders de la base de données

## 8) Déploiement en production

### A faire encore -> DB 

### Option 1 : Script de déploiement rapide

```bash
# Backend
cd backend
npm run deploy

# Frontend
cd frontend
npm run deploy

# Backoffice
cd backoffice
npm run deploy
```

### Option 2 : Build manuel

```bash
# Backend
cd backend
npm install && npm run start

# Frontend
cd frontend
npm install && npm run build
npx -y serve dist 

# Backoffice
cd backoffice
npm install && npm run build
npx -y serve dist
```

Les fichiers compilés seront dans `frontend/dist/` et `backoffice/dist/`.

## 9) Construction de l'application mobile

```bash
cd frontend
npm run mobile:build
npm run mobile:open
```

## 10) Distinction explicite

- Code backend : `backend/src/*.js`
- Code frontend : `frontend/src/*`
- Code backoffice : `backoffice/src/*`
- Configuration : `.env`, `.env.example`, scripts npm, README
- Données : enregistrements MySQL dans `cesi_zen`