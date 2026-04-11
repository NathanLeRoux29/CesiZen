# CesiZen Backend

CesiZen est une application de bien-être développée pour le CESI. Ce dépôt contient l'API REST construite avec Node.js et Express.

## Technologies

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MariaDB / MySQL
- **Documentation** : Swagger / OpenAPI
- **Tests** : Jest & Supertest

## Prérequis

- [Node.js](https://nodejs.org/) (version 18+)
- Une base de données MariaDB ou MySQL en cours d'exécution.

## Installation

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Configurez les variables d'environnement :
   Copiez le fichier `.env.example` vers `.env` et ajustez les valeurs :
   ```bash
   cp .env.example .env
   ```

3. Initialisez la base de données :
   Importez le fichier `sql/cesizen.sql` dans votre serveur de base de données.

## Scripts Disponibles

- `npm start` : Lance le serveur en production.
- `npm run dev` : Lance le serveur en mode développement avec redémarrage automatique (watch mode).
- `npm run test` : Exécute la suite de tests unitaires et d'intégration.
- `npm run test:watch` : Exécute les tests en mode watch.

## Documentation de l'API

Une fois le serveur lancé, vous pouvez accéder à l'interface Swagger pour explorer les endpoints :
[http://localhost:3001/api-docs](http://localhost:3001/api-docs)
