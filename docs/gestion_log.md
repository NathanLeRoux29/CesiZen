# Gestion des Logs - CesiZen Backend

## Overview

Le système de logging du backend utilise **Pino**, un logger haute performance pour Node.js. Chaque type de log est redirigé vers un fichier dédié dans le dossier `backend/logs/`.

## Structure des fichiers de log

```
backend/logs/
├── app.log      # Logs généraux (info)
├── error.log    # Erreurs applicatives
├── warning.log  # Avertissements
├── debug.log    # Logs de débogage
└── request.log  # Requêtes HTTP entrantes
```

## Niveaux de log

| Niveau | Méthode | Usage | Fichier |
|--------|---------|-------|---------|
| `INFO` | `logger.info()` | Actions réussies, démarrage | `app.log` |
| `ERROR` | `logger.error()` | Erreurs applicatives | `error.log` |
| `WARN` | `logger.warn()` | Avertissements (ex: ressource non trouvée) | `warning.log` |
| `DEBUG` | `logger.debug()` | Débogage détaillé | `debug.log` |
| `HTTP` | `logger.http()` | Requêtes HTTP (automatique) | `request.log` |

## Utilisation dans le code

### Import du logger

```js
const logger = require('../utils/logger');
```

### Méthodes disponibles

```js
// Log d'information (succès, démarrage)
logger.info('ModuleName', 'Message descriptif', { data: 'optionnelle' });

// Log d'erreur (avec objet Error optionnel)
logger.error('ModuleName', 'Message d\'erreur', error, { context: 'optionnel' });

// Log d'avertissement (ressource non trouvée, doublon, etc.)
logger.warn('ModuleName', 'Message d\'avertissement', { data: 'optionnel' });

// Log de débogage
logger.debug('ModuleName', 'Message de débogage', { data: 'optionnel' });
```

### Format des logs

Chaque entrée de log est au format JSON avec les champs suivants :

```json
{
  "level": "info",
  "module": "AdminController",
  "userId": 42,
  "time": "2026-04-22T10:30:00.000Z",
  "message": "Article créé"
}
```

Pour les erreurs :

```json
{
  "level": "error",
  "module": "UserController",
  "error": "Erreur de connexion",
  "stack": "Error: ...\n    at ...",
  "time": "2026-04-22T10:30:00.000Z",
  "message": "Erreur lors de la connexion"
}
```

## Integration dans les controllers

### Exemple - AdminController

```js
static async getUsers(req, res) {
    try {
        const users = await UserDAO.getAll();
        logger.info('AdminController', 'Récupération de tous les utilisateurs', { count: users.length });
        res.json(users);
    } catch (error) {
        logger.error('AdminController', 'Erreur lors de la récupération des utilisateurs', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
```

### Exemple - UserController (login)

```js
static async login(req, res) {
    try {
        const user = await UserDAO.getByEmail(email);
        if (!user) {
            logger.warn('UserController', 'Échec de connexion - utilisateur non trouvé', { email });
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        logger.info('UserController', 'Connexion réussie', { email });
        res.json({ message: 'Connexion réussie', user });
    } catch (error) {
        logger.error('UserController', 'Erreur lors de la connexion', error, { email });
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
}
```

## Logs HTTP automatiques

Un middleware est automatiquement appliqué dans `app.js` pour logger chaque requête HTTP :

```js
app.use((req, res, next) => {
    logger.logRequest(req);
    next();
});
```

Format généré :

```json
{
  "level": "info",
  "module": "HTTP",
  "method": "GET",
  "url": "/api/articles",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0 ...",
  "time": "2026-04-22T10:30:00.000Z",
  "message": "HTTP GET /api/articles"
}
```

## Arborescence d'intégration

```
server.js
├── logger.info() - Démarrage du serveur
└── logger.error() - Erreur de connexion BDD

app.js
└── logger.logRequest() - Middleware requêtes HTTP

controllers/
├── AdminController.js
├── ArticleController.js
├── BreathController.js
├── UserController.js
├── ArticleFavoriteController.js
└── BreathingFavoriteController.js
    ├── logger.info() - Opération réussie
    ├── logger.error() - Erreur
    └── logger.warn() - Ressource non trouvée / doublon
```

## Format des logs

**Console** — Les logs sont affichés en format lisible avec `pino-pretty` :
- Couleurs par niveau de log
- Timestamp formaté lisible
- Structure consolidée sur une ligne

**Fichiers** — Les fichiers de log gardent le format JSON structuré pour :
- L'archivage longue durée
- Le parsing automatisé 
- L'analyse post-mortem

Exemple  :
```
[10:30:00.000] INFO (AdminController): Récupération de tous les utilisateurs {"count": 15}
[10:30:01.234] WARN (UserController): Échec de connexion - utilisateur non trouvé {"email":"test@mail.com"}
[10:30:02.456] ERROR (UserController): Erreur lors de la connexion {"error":" ECONNREFUSED"}
```

## Développement

Le logger est configuré par défaut avec `pino-pretty` pour un output console lisible. Aucune commande supplémentaire nécessaire :

```bash
npm run dev
```

Les fichiers dans `logs/` restent en JSON pour permettre l'archivage et l'analyse.