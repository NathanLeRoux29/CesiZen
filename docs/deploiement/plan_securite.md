# Plan de Sécurité CesiZen

**Projet :** CesiZen Plateforme de bien-être mental  
**Version :** 0.2.0  
**Date :** 2026-05-20  
**Référentiel :** OWASP Top 10 (2021)

---

## 1. Architecture et périmètre analysé

### 1.1 Composants de l'application

```
[Utilisateur / Navigateur]
         │  HTTPS (production)
         ▼
    [nginx :80]  ← frontend Vue.js (port 80)
    [nginx :81]  ← backoffice Vue.js (port 81)
         │
         │  HTTP interne (réseau Docker)
         ▼
  [Backend Node.js :3001]  ← API Express + JWT
         │
         │  TCP interne (réseau Docker)
         ▼
    [MySQL :3306]  ← Base de données (non exposée)
```

**Fichiers clés analysés :**
- [backend/src/app.js](../../backend/src/app.js) Configuration Express, CORS, middlewares
- [backend/src/middleware/auth.js](../../backend/src/middleware/auth.js) JWT, RBAC admin
- [backend/src/utils/jwt.js](../../backend/src/utils/jwt.js) Génération et vérification des tokens
- [backend/src/routes/userRoutes.js](../../backend/src/routes/userRoutes.js) Authentification
- [backend/src/routes/adminRoutes.js](../../backend/src/routes/adminRoutes.js) Routes administration
- [frontend/nginx.conf](../../frontend/nginx.conf) Serveur web frontend
- [docker-compose.yml](../../docker-compose.yml) Orchestration des conteneurs

### 1.2 Données sensibles traitées

| Donnée | Localisation | Classification |
|--------|-------------|----------------|
| Email utilisateur | BDD MySQL, JWT payload | Personnelle (RGPD) |
| Mot de passe (hashé bcrypt) | BDD MySQL | Confidentielle |
| Token JWT | Côté client (localStorage/mémoire) | Confidentielle |
| `JWT_SECRET` | `.env` backend | Secrète |
| Credentials MySQL | `.env` backend | Secrète |
| Données bien-être (favoris, exercices) | BDD MySQL | Personnelle (RGPD) |

---

## 2. Analyse des menaces OWASP Top 10 (2025)

### A01 Broken Access Control (Contrôle d'accès défaillant)

**Menace :** Un utilisateur non autorisé accède à des ressources ou actions réservées (données d'autres utilisateurs, routes admin).

**Ce qui est en place :**
- `authMiddleware` : vérifie la présence et la validité du JWT sur toutes les routes protégées ([auth.js:8](../../backend/src/middleware/auth.js#L8))
- `adminMiddleware` : vérifie le flag `is_admin` dans le token avant d'accéder aux routes `/api/admin/*` ([auth.js:54](../../backend/src/middleware/auth.js#L54))
- Toutes les routes admin appliquent les deux middlewares en cascade ([adminRoutes.js:14](../../backend/src/routes/adminRoutes.js#L14))

**Vulnérabilités résiduelles :**

| ID | Risque | Sévérité | Statut |
|----|--------|----------|--------|
| V1 | Un utilisateur peut modifier le profil d'un autre utilisateur si l'ID n'est pas vérifié côté serveur | Haute | À vérifier dans `AuthController.updateProfile` |
| V2 | Pas de liste blanche sur les champs modifiables (`is_admin` pourrait être injecté via le body) | Haute | À corriger |

---

### A02 Cryptographic Failures (Défaillances cryptographiques)

**Menace :** Données sensibles transmises ou stockées sans protection suffisante (mots de passe en clair, tokens faibles, secrets exposés).

**Ce qui est en place :**
- Mots de passe hashés avec **bcrypt** (via `AuthService`) résistant aux rainbow tables
- JWT signé avec `JWT_SECRET` depuis `.env` secret non commité (`.gitignore`)
- Expiration des tokens configurée via `JWT_EXPIRES_IN` (défaut : `24h`)

**Vulnérabilités résiduelles :**

| ID | Risque | Sévérité | Statut |
|----|--------|----------|--------|
| V3 | Valeur de repli `'cesizen-secret-key-change-in-production'` si `JWT_SECRET` non défini ([jwt.js:3](../../backend/src/utils/jwt.js#L3)) | Critique | En production, le `.env` DOIT définir un secret fort |
| V4 | Pas de HTTPS en développement les tokens JWT transitent en clair | Haute | Obligatoire en production (Let's Encrypt) |
| V5 | Pas de mécanisme de révocation des tokens JWT (blacklist) | Moyenne | Amélioration future |

---

### A03 Injection

**Menace :** Injection de données malveillantes dans les requêtes SQL, les templates HTML (XSS), ou les commandes système.

**Ce qui est en place :**
- **Injection SQL** : mysql2 avec requêtes paramétrées (prepared statements) dans tous les DAO les entrées utilisateur ne sont jamais concaténées dans les requêtes SQL
- **XSS** : Vue.js échappe automatiquement les données affichées dans les templates (`{{ variable }}`)

**Vulnérabilités résiduelles :**

| ID | Risque | Sévérité | Statut |
|----|--------|----------|--------|
| V6 | Pas de sanitisation HTML côté backend si des champs texte libre sont affichés sans `v-html` | Moyenne | À vérifier sur les articles (contenu riche) |
| V7 | Pas de validation du format email côté serveur (vérification de structure uniquement) | Basse | Amélioration possible |

---

### A04 Insecure Design (Conception non sécurisée)

**Menace :** Absence de mécanismes de défense fondamentaux dans la conception de l'application.

**Ce qui est en place :**
- Séparation des rôles utilisateur/admin
- Logging des événements sensibles (connexions, erreurs) via `logger.js`
- Conteneurs Docker avec utilisateur non-root (`USER node`)

**Vulnérabilités résiduelles :**

| ID | Risque | Sévérité | Statut |
|----|--------|----------|--------|
| V8 | **Absence de rate limiting** sur tous les endpoints détectée par CodeQL (7 alertes High) | Haute | Planifié v0.2.0 `express-rate-limit` |
| V9 | Pas de validation de la complexité des mots de passe à l'inscription | Moyenne | Planifié v0.2.0 |
| V10 | Swagger UI exposé sur `/api-docs` sans authentification | Basse | À désactiver en production (`NODE_ENV`) |

---

### A05 Security Misconfiguration (Mauvaise configuration de sécurité)

**Menace :** Configuration par défaut non sécurisée, composants inutiles activés, headers de sécurité manquants.

**Ce qui est en place :**
- Port MySQL (3306) non exposé à l'extérieur du réseau Docker
- Ports applicatifs liés à `127.0.0.1` uniquement dans `docker-compose.yml`
- Images Docker avec version fixée (`nginx:1.27-alpine`, `node:20-alpine`)

**Vulnérabilités résiduelles :**

| ID | Risque | Sévérité | Statut |
|----|--------|----------|--------|
| V11 | CORS configuré avec `app.use(cors())` sans whitelist ([app.js:9](../../backend/src/app.js#L9)) accepte toutes les origines | Haute | À restreindre aux domaines de production |
| V12 | Headers de sécurité HTTP absents (CSP, X-Frame-Options, X-Content-Type-Options, HSTS) | Haute | À ajouter via `Helmet.js` |
| V13 | nginx sans headers de sécurité (X-Frame-Options, Content-Security-Policy) | Haute | À configurer dans `nginx.conf` |
| V18 | Sub Resource Integrity (SRI) absent sur les scripts tiers | Basse | À ajouter — attribut `integrity` sur les balises `<script>` |
| V19 | Header `Server: nginx/1.27` expose la version du serveur web | Basse | `server_tokens off;` dans `nginx.conf` |

**Confirmation DAST — OWASP ZAP (scan du 20 mai 2026) :**

Un scan dynamique DAST réalisé avec OWASP ZAP 2.17.0 sur `http://127.0.0.1:5173` a confirmé les vulnérabilités V12, V13 et détecté V18 et V19. Aucune alerte High n'a été remontée depuis l'extérieur — les vulnérabilités critiques (JWT_SECRET, IDOR, rate limiting) se trouvent dans le backend et ne sont pas exposées via le frontend.

| Alerte ZAP | Sévérité ZAP | Vulnérabilité correspondante |
|-----------|-------------|------------------------------|
| Content Security Policy Header Not Set | Moyen | V12 |
| Missing Anti-clickjacking Header | Moyen | V13 |
| Sub Resource Integrity Attribute Missing | Moyen | V18 (nouveau) |
| Server Leaks Version Information | Faible | V19 (nouveau) |
| X-Content-Type-Options Header Missing | Faible | V12 |

Rapport complet : [docs/deploiement/2026-05-20-ZAP-Report-.html](2026-05-20-ZAP-Report-.html)

---

### A06 Vulnerable and Outdated Components (Composants vulnérables ou obsolètes)

**Menace :** Utilisation de bibliothèques ou images Docker contenant des CVE connues.

**Ce qui est en place :**
- **npm audit** intégré dans la CI à chaque PR (backend, frontend, backoffice)
- **Dependabot** surveille et propose des mises à jour chaque lundi (npm, Docker, GitHub Actions)
- **CodeQL** analyse statique du code source à chaque push sur `dev`
- **Secret Scanning** GitHub analyse continue de l'historique Git

**État actuel :**

| Composant | Statut |
|-----------|--------|
| npm audit backend | ✅ Aucune vulnérabilité high/critical |
| npm audit frontend | ✅ Aucune vulnérabilité high/critical |
| npm audit backoffice | ✅ Aucune vulnérabilité high/critical |
| Dependabot | ✅ Actif exemple : PR `vite@8.x` refusée car incompatible avec `unplugin-fonts` |
| CodeQL | ⚠️ 7 alertes High (rate limiting) planifiées v0.2.0 |

---

### A07 Identification and Authentication Failures (Défaillances d'authentification)

**Menace :** Attaques par force brute, vol de session, contournement de l'authentification.

**Ce qui est en place :**
- JWT avec expiration 24h
- Rejet des tokens invalides ou expirés (HTTP 401)
- Vérification du header `Authorization: Bearer <token>` ([auth.js:11](../../backend/src/middleware/auth.js#L11))
- Logging des tentatives d'authentification échouées

**Vulnérabilités résiduelles :**

| ID | Risque | Sévérité | Statut |
|----|--------|----------|--------|
| V8 | Pas de rate limiting sur `POST /api/users/login` → brute force possible | Haute | Planifié v0.2.0 |
| V14 | Pas de mécanisme de verrouillage de compte après N échecs | Moyenne | Planifié v0.2.0 |
| V15 | Pas de refresh token le token de 24h reste valide même après déconnexion | Moyenne | Amélioration future |

---

### A08 Software and Data Integrity Failures (Défaillances d'intégrité)

**Menace :** Mise à jour de dépendances non vérifiées, pipeline CI/CD compromis.

**Ce qui est en place :**
- `package-lock.json` commité garantit des installations reproductibles (`npm ci`)
- `npm ci` utilisé dans la CI au lieu de `npm install` respecte strictement le lock file
- GitHub Actions avec des versions d'actions fixées (`actions/checkout@v4`)
- Semantic-release vérifie l'intégrité des commits avant de publier une release

---

### A09 Security Logging and Monitoring Failures (Défaillances de journalisation)

**Menace :** Absence de traces des événements suspects, empêchant la détection et la réponse aux incidents.

**Ce qui est en place :**
- `logger.js` : journalisation centralisée (INFO, WARN, ERROR) dans `logs/app.log`, `logs/warning.log`, `logs/error.log`
- Logging des : connexions réussies/échouées, erreurs 500, accès refusés (401/403), requêtes HTTP

**Vulnérabilités résiduelles :**

| ID | Risque | Sévérité | Statut |
|----|--------|----------|--------|
| V16 | Pas d'alerting automatique en cas d'erreurs critiques | Moyenne | Amélioration future (Sentry, webhook) |
| V17 | Logs stockés uniquement dans le conteneur Docker (perdus au redémarrage) | Haute | Volume Docker ou service de logs externe |

---

### A10 Server-Side Request Forgery (SSRF)

**Menace :** Le serveur effectue des requêtes vers des ressources internes à partir d'entrées utilisateur.

**Évaluation :** ✅ **Non applicable** le backend CesiZen ne fait pas de requêtes HTTP vers des ressources externes basées sur des entrées utilisateur.

---

## 3. Tableau de synthèse des risques

| ID | Vulnérabilité | OWASP | Sévérité | En place | Planifié |
|----|---------------|-------|----------|----------|---------|
| V3 | Fallback JWT secret faible | A02 | Critique | Valeur de repli définie | `.env` strict en prod |
| V4 | Pas de HTTPS | A02 | Haute | | Let's Encrypt (VPS) |
| V8 | Pas de rate limiting | A04/A07 | Haute | | v0.2.0 `express-rate-limit` |
| V11 | CORS sans whitelist | A05 | Haute | | À configurer en prod |
| V12 | Headers HTTP manquants | A05 | Haute | | `Helmet.js` v0.2.0 |
| V17 | Logs perdus au redémarrage | A09 | Haute | | Volume Docker |
| V1 | Pas de vérification ownership ressource | A01 | Haute | authMiddleware | À vérifier |
| V2 | Champs modifiables non filtrés | A01 | Haute | | À corriger |
| V9 | Complexité mot de passe | A04 | Moyenne | | v0.2.0 |
| V14 | Verrouillage compte | A07 | Moyenne | | v0.2.0 |
| V16 | Pas d'alerting | A09 | Moyenne | | Amélioration future |
| V6 | Sanitisation HTML articles | A03 | Moyenne | Vue.js escaping | À vérifier |
| V10 | Swagger exposé en prod | A05 | Basse | | À conditionner |
| V7 | Validation format email | A03 | Basse | Présence vérifiée | Amélioration |

---

## 4. Plan d'actions de sécurité

### 4.1 Actions v0.2.0 Sécurisation (priorité haute)

| Action | Fichier(s) | Effort | Impact |
|--------|-----------|--------|--------|
| Ajouter `express-rate-limit` sur `/login`, `/register` et routes admin | `app.js`, `userRoutes.js`, `adminRoutes.js` | 2h | Élimine V8, V14 |
| Ajouter `Helmet.js` pour les headers de sécurité HTTP | `app.js` | 30min | Élimine V12 |
| Restreindre CORS aux domaines de production | `app.js` | 30min | Élimine V11 |
| Valider la complexité des mots de passe (`/register`, `/password`) | `AuthController.js` | 1h | Élimine V9 |
| Désactiver Swagger en production (`NODE_ENV === 'production'`) | `app.js` | 15min | Élimine V10 |

### 4.2 Actions en production (avant déploiement VPS)

| Action | Description | Impact |
|--------|-------------|--------|
| `.env` avec `JWT_SECRET` fort | Générer avec `openssl rand -hex 64` | Élimine V3 |
| Activer HTTPS (Let's Encrypt) | Certificat SSL via `certbot` + nginx | Élimine V4 |
| Monter un volume Docker pour les logs | `- ./logs:/app/logs` dans `docker-compose.yml` | Élimine V17 |
| Configurer headers nginx | X-Frame-Options, CSP, X-Content-Type-Options | Élimine V13 |
| CORS whitelist | Domaines de prod dans la variable `CORS_ORIGIN` du `.env` | Élimine V11 |

---

## 5. Conformité RGPD

### 5.1 Données personnelles collectées

| Donnée | Base légale | Durée de conservation | Droit exercé |
|--------|------------|----------------------|--------------|
| Email | Contrat (inscription) | Durée du compte + 3 ans | Accès, rectification, suppression |
| Username | Contrat | Durée du compte | Rectification |
| Favoris, exercices de respiration | Intérêt légitime (fonctionnalité) | Durée du compte | Suppression |
| Logs de connexion | Intérêt légitime (sécurité) | 6 mois maximum | |

### 5.2 Droits des utilisateurs implémentation

| Droit RGPD | Endpoint | Statut |
|-----------|---------|--------|
| Droit d'accès | `GET /api/users/profile` | ✅ Implémenté |
| Droit de rectification | `PUT /api/users/profile` | ✅ Implémenté |
| Droit à l'effacement | `DELETE /api/users/account` | ✅ Implémenté |
| Droit à la portabilité | | ⚠️ Non implémenté (amélioration future) |
| Droit d'opposition | | N/A (pas de traitement à des fins de marketing) |

### 5.3 Mesures techniques RGPD

- **Minimisation des données** : seuls email, username et mot de passe hashé sont stockés à l'inscription
- **Pseudonymisation** : les logs utilisent l'ID utilisateur, pas le nom complet
- **Chiffrement** : mots de passe hashés bcrypt (irréversible)
- **Accès restreint** : seuls les administrateurs peuvent lister les utilisateurs (`GET /api/admin/users`)
- **Suppression effective** : `DELETE /api/users/account` supprime le compte et les données associées

---

## 6. Plan de gestion de crise (Incident Response)

### 6.1 Niveaux de gravité

| Niveau | Définition | Exemple | Délai de réponse |
|--------|-----------|---------|-----------------|
| P1 Critique | Application inaccessible ou données compromises | Intrusion BDD, fuite de tokens | < 1h |
| P2 Haute | Fonctionnalité majeure cassée, vulnérabilité exploitée | Brute force actif, erreurs 500 massives | < 4h |
| P3 Moyenne | Dégradation de performance, alerte sécurité non exploitée | Pic de requêtes anormal, CVE détectée | < 24h |
| P4 Basse | Anomalie mineure, alerte informationnelle | 404 inhabituels, dépendance obsolète | < 72h |

### 6.2 Procédure en cas d'incident

```
DÉTECTION (monitoring, alerte, signalement utilisateur)
         │
         ▼
QUALIFICATION (quel composant ? quelle sévérité ?)
         │
    ┌────┴─────────────────┐
  P1/P2                  P3/P4
    │                       │
ISOLATION                 ANALYSE
(stopper l'accès)         (logs, CodeQL, audit)
    │                       │
ANALYSE                   CORRECTIF
(logs, git blame,         (branche security/fix)
 forensique)                │
    │                     CI verte → merge → deploy
CORRECTIF URGENT          │
(hotfix → main)           Issue fermée
    │
COMMUNICATION
(utilisateurs si données impactées)
    │
POST-MORTEM
(rapport, mise à jour du plan de sécurité)
```

### 6.3 Procédure spécifique Fuite de credentials

Si un secret (JWT_SECRET, mot de passe BDD) est compromis ou accidentellement commité :

1. **Immédiatement** : changer le secret compromis dans le `.env` de production + redémarrer le backend
2. **Dans l'heure** : invalider tous les tokens JWT en circulation (changer `JWT_SECRET` invalide tous les tokens existants)
3. **Vérification** : `git log --all -S "secret_value"` pour confirmer que le secret n'est plus dans l'historique
4. Si dans l'historique Git : `git filter-branch` ou `BFG Repo Cleaner` + force-push + rotation de tous les secrets
5. **Communication** : notifier les utilisateurs si leurs données ont pu être exposées (obligation RGPD : 72h pour notifier la CNIL)

### 6.4 Contacts et escalade

| Rôle | Responsabilité |
|------|---------------|
| Développeur | Correction technique, analyse des logs |
| Administrateur | Accès serveur, redémarrage services |
| CNIL (si fuite de données personnelles) | Notification obligatoire sous 72h (Art. 33 RGPD) |

---

## 7. Suivi des actions Tableau de bord

| Action | Priorité | Version cible | Statut |
|--------|----------|---------------|--------|
| Rate limiting (`express-rate-limit`) | Critique | v0.2.0 |  Planifié |
| Helmet.js (headers HTTP) | Haute | v0.2.0 |  Planifié |
| CORS whitelist | Haute | v0.2.0 |  Planifié |
| Validation complexité mot de passe | Haute | v0.2.0 |  Planifié |
| HTTPS (Let's Encrypt) | Haute | Déploiement VPS |  Planifié |
| Volume Docker pour logs | Haute | Déploiement VPS |  Planifié |
| Headers nginx sécurité | Haute | Déploiement VPS |  Planifié |
| Désactiver Swagger en prod | Basse | v0.2.0 |  Planifié |
| Portabilité des données (RGPD) | Basse | v0.3.0 |  Planifié |
| Alerting automatique (Sentry) | Basse | v0.3.0 |  Planifié |


