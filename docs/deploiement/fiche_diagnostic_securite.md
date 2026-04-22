# Fiche de Diagnostic et Sécurisation - CesiZen

## Vue d'ensemble

Ce document recense les risques, erreurs possibles, mesures de sécurité et actions à effectuer avant toute mise en production de l'application CesiZen.

---

## 1. Risques identifiés

| ID | Risque | Criticité | Impact |
|----|--------|-----------|--------|
| R1 | **Injection SQL** | Élevée | Accès non autorisé aux données, suppression/modification de la BDD |
| R2 | **Exposition des credentials BDD** | Critique | Compromission complète de la base de données |
| R3 | **Mot de passe en clair ou mal hashé** | Élevée | Usurpation d'identité des utilisateurs |
| R4 | **CORS trop permissif** | Moyenne | Requêtes cross-origin non autorisées |
| R5 | **Absence de rate limiting** | Moyenne | Attaques par force brute sur /login et /register |
| R6 | **Stack traces en production** | Moyenne | Révélation d'informations sur l'infrastructure |
| R7 | **Variables d'environnement non configurées** | Élevée | Comportement imprévisible, erreurs de connexion |
| R8 | **Absence de validation des entrées** | Élevée | Données corrompues en BDD, comportements inattendus |
| R9 | **Tokens/sessions non sécurisés** | Élevée | Hijacking de session, connexion non autorisée |
| R10 | **Données sensibles dans les logs** | Moyenne | Fuite d'information via les fichiers de log |

---

## 2. Erreurs possibles

### Configuration

| Erreur | Conséquence |
|--------|-------------|
| `.env` manquant ou incomplet | Serveur ne démarre pas, erreurs de connexion DB |
| `DB_PASSWORD` faible ou par défaut | Accès facile à la base de données |
| Ports standard non bloqués (3306) | Exposition directe de MySQL |
| CORS configuré avec `*` en production | N'importe quel site peut interroger l'API |
| Debug mode activé en prod | Stack traces visibles, performances dégradées |

### Authentification / Autorisation

| Erreur | Conséquence |
|--------|-------------|
| Pas de validation email | Comptes avec des emails invalides |
| Pas de vérification force mot de passe | Mots de passe triviaux facilement crackables |
| Pas de limite sur les tentatives de login | Attaque par force brute possible |
| Token JWT manquant ou faible | Session facilement falsifiable |
| Password hashé avec peu d'itérations | Attaques par rainbow table |

### Base de données

| Erreur | Conséquence |
|--------|-------------|
| Connexion root MySQL utilisée | Permissions trop larges |
| Pas de backup régulier | Perte de données en cas d'incident |
| Requêtes SQL construites dynamiquement | Injection SQL |
| Pas d'index sur les colonnes critiques | Performances dégradées |

---

## 3. Réponses prévues

### Configuration

| Risque | Mesure de mitigation |
|--------|---------------------|
| Exposition credentials | Variables d'environnement uniquement, `.env` dans `.gitignore` |
| CORS trop permissif | Whitelist des domaines autorisés en prod |
| Stack traces | Mode `NODE_ENV=production`, erreurs génériques en réponse HTTP |
| Ports exposés | Firewall, pas d'exposition directe de MySQL (port 3306) |

### Authentification

| Risque | Mesure de mitigation |
|--------|---------------------|
| Force brute | Rate limiting sur `/api/users/login` et `/api/users/register` (ex: 5 req/min) |
| Mot de passe faible | Validation côté serveur (min 8 chars, majuscule, chiffre, special) |
| Hash insuffisant | bcrypt avec `saltRounds >= 12` |
| Session hijacking | JWT avec expiration, refresh token, HttpOnly cookies |

### Base de données

| Risque | Mesure de mitigation |
|--------|---------------------|
| Injection SQL | Requêtes paramétrées uniquement (prepared statements via mysql2) |
| Permissions trop larges | Utilisateur MySQL dédié avec principe du moindre privilège |
| Perte de données | Sauvegardes automatiques quotidiennes |
| Accès non autorisé | Firewall, pas d'exposition du port MySQL |

---

## 4. Informations à journaliser (Logging)

Le système de logging centralisé ([`backend/src/utils/logger.js`](backend/src/utils/logger.js)) doit capturer :

### À journaliser

| Événement | Niveau | Fichier | Données |
|-----------|--------|---------|---------|
| Démarrage/arrêt serveur | INFO | `app.log` | Port, timestamp |
| Connexion BDD réussie/échouée | INFO/ERROR | `app.log` / `error.log` | Host, timestamp |
| Tentative de login | WARN si échec | `warning.log` | email, IP, user-agent |
| Login réussi | INFO | `app.log` | email, IP |
| Inscription utilisateur | INFO | `app.log` | userId, email |
| Erreur serveur (500) | ERROR | `error.log` | module, stack trace, request |
| Requête HTTP suspecte | WARN | `warning.log` | méthode, URL, IP |
| Accès ressource non trouvée (404) | WARN | `warning.log` | ressource, IP |

### Format de log recommandé

```json
{
  "level": "warn",
  "module": "UserController",
  "email": "user@example.com",
  "ip": "192.168.1.1",
  "time": "2026-04-22T10:30:00.000Z",
  "message": "Échec de connexion - utilisateur non trouvé"
}
```

### Détails à inclure

- **Timestamp** — pour tracer la chronologie
- **Module/Controller** — pour identifier la source
- **IP client** — pour détecter des attaques depuis une IP
- **User-Agent** — pour identifier le client
- **Identifiants anonymisés** — email (pas le password!), ID utilisateur
- **Stack trace** — pour le debugging (uniquement en ERROR)
- **Méthode et URL** — pour les requêtes HTTP

---

## 5. Informations à NE PAS exposer

### En production

| Information | Pourquoi | Où peut-elle fuiter |
|-------------|----------|---------------------|
| Mot de passe (hashé ou non) | Compromission de compte | Logs, réponses HTTP, BDD |
| Stack traces complètes | Révèle l'infrastructure | Réponses HTTP, logs |
| Structure de la BDD (noms tables, colonnes) | Facilite les attaques | Erreurs SQL, stack traces |
| Clés API / Tokens secrets | Accès non autorisé | Logs, variables d'environnement |
| Configuration interne (host, ports, credentials) | Cartographie de l'infra | Erreurs, stack traces |
| Adresse IP exacte du serveur | Scanning, attaque DDoS | Logs (utiliser des IPsmasquées) |
| Requêtes SQL complètes | Révèle la logique métier | Erreurs SQL |
| Contenu du `.env` | Contrôle total | Erreurs, logs |

### Règles à respecter

1. **Ne jamais** renvoyer le mot de passe dans les réponses API (même haché)
2. **Généraliser** les messages d'erreur en prod (`"Erreur serveur"` au lieu de détails)
3. **Censurer** les IPs dans les logs de production (partiellement : `192.168.x.x`)
4. **Ne jamais** faire `console.log` de données sensibles en prod
5. **Vérifier** que les fichiers `.log` ne sont pas accessibles via le serveur web

---

## 6. Actions restantes avant mise en production

### Priorité Critique

- [ ] **Créer le fichier `backend/.env`** avec des valeurs de production (ne pas utiliser les valeurs example)
- [ ] **Changer les credentials MySQL** — utiliser un utilisateur dédié, pas root
- [ ] **Configurer CORS** — remplacer `*` par les domaines autorisés
- [ ] **Activer le rate limiting** — implémenter un middleware sur les routes sensibles
- [ ] **Définir `NODE_ENV=production`** — désactive les stack traces

### Priorité Haute

- [ ] **Valider la force des mots de passe** — ajouter une validation (min 8 chars, complexifié)
- [ ] **Implémenter le JWT** — si ce n'est pas déjà fait, ajouter un vrai système de token
- [ ] **Configurer un firewall** — bloquer l'accès direct à MySQL (port 3306)
- [ ] **Mettre en place des sauvegardes BDD** — automatisées, quotidienne minimum
- [ ] **Supprimer `console.log` restants** — vérifier qu'aucun log de debug ne fuite en prod

### Priorité Moyenne

- [ ] **Ajouter unlogger de monitoring** — erreur tracking (Sentry, LogRocket)
- [ ] **Configurer la rotation des logs** — éviter que les fichiers `.log` saturent le disque
- [ ] **Activer HTTPS** — obligatoire en production (Let's Encrypt)
- [ ] **Ajouter des headers de sécurité** — Helmet.js (X-Content-Type-Options, CSP, etc.)
- [ ] **Vérifier les dépendances** — `npm audit` pour détecter les vulnérabilités

### Checklist finale

- [ ] backend/.env configuré avec secrets forts
- [ ] CORS limité aux domaines de production
- [ ] NODE_ENV=production
- [ ] Rate limiting actif sur /login et /register
- [ ] Validation mot de passe en place
- [ ] Logs configurés et fichiers non accessibles via web
- [ ] Stack traces désactivées en prod
- [ ] Firewall configuré
- [ ] Backup BDD automatique
- [ ] HTTPS activé
- [ ] npm audit passé sans vulnérabilités critiques
- [ ] Helmet.js ou équivalent pour les headers HTTP

---

## Résumé des risques par composant

| Composant | Risques principaux |
|-----------|-------------------|
| **Backend** | Injection SQL, credentials exposés, absence de rate limiting |
| **Frontend/Backoffice** | XSS, CORS, fuite de credentials dans les请求 |
| **Base de données** | Accès non autorisé, données sensibles, pas de backup |
| **Infrastructure** | Ports ouverts, pas de firewall, pas de HTTPS |

---

*Document à mettre à jour à chaque évolution significative de l'architecture ou des dépendances.*