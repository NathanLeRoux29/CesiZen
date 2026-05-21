---
name: security-audit
description: Use when you need to audit the security of the CesiZen codebase — scans routes, middleware, config, Docker, CI/CD and generates a dated audit report sorted from critical to low severity
---

# Security Audit — CesiZen

## Overview

Analyse le code source réel du projet et génère un rapport d'audit daté, classé par sévérité décroissante (Critique → Haute → Moyenne → Basse).

**Principe :** chaque finding doit pointer vers un fichier et une ligne réels. Aucune hypothèse — lire le code avant de conclure.

---

## Processus d'audit (à suivre dans l'ordre)

### Phase 1 — Cartographie du projet

```bash
# Structure backend
find backend/src -type f -name "*.js" | sort

# Routes déclarées
grep -rn "router\.\(get\|post\|put\|delete\|use\)" backend/src/routes/

# Middlewares appliqués
grep -rn "authMiddleware\|adminMiddleware\|optionalAuth" backend/src/

# Variables d'environnement utilisées
grep -rn "process\.env\." backend/src/ | grep -v node_modules
```

### Phase 2 — Vérifications par catégorie OWASP

Effectuer chaque vérification et noter : fichier, ligne, extrait de code, sévérité.

#### A01 — Contrôle d'accès

```bash
# Routes sans middleware d'auth
grep -n "router\.\(get\|post\|put\|delete\)" backend/src/routes/*.js

# Vérifier que les routes admin utilisent authMiddleware + adminMiddleware
grep -n "router.use\|authMiddleware\|adminMiddleware" backend/src/routes/adminRoutes.js

# Ownership : l'utilisateur peut-il modifier la ressource d'un autre ?
grep -rn "req\.params\.id\|req\.body\.id" backend/src/controllers/
```

#### A02 — Défaillances cryptographiques

```bash
# JWT secret : fallback en dur ?
grep -n "JWT_SECRET\|jwt\.sign\|jwt\.verify" backend/src/utils/jwt.js

# bcrypt : nombre de rounds
grep -rn "bcrypt\|saltRounds\|genSalt\|hash" backend/src/

# HTTPS configuré ?
grep -rn "https\|ssl\|tls" backend/src/ docker-compose.yml nginx.conf frontend/nginx.conf backoffice/nginx.conf
```

#### A03 — Injection

```bash
# SQL : concaténation dans les requêtes (chercher les requêtes dynamiques)
grep -rn "query\s*=\s*['\`].*\+" backend/src/dao/
grep -rn "\`SELECT.*\${" backend/src/dao/

# Prepared statements utilisés ?
grep -rn "\.query\|\.execute" backend/src/dao/

# XSS : v-html utilisé dans les templates Vue ?
grep -rn "v-html" frontend/src/ backoffice/src/
```

#### A04 — Conception non sécurisée

```bash
# Rate limiting présent ?
grep -rn "rate.limit\|rateLimit\|express-rate-limit" backend/src/ backend/package.json

# Validation des entrées utilisateur
grep -rn "req\.body\." backend/src/controllers/ | head -30

# Complexité mot de passe vérifiée ?
grep -rn "password\|motDePasse" backend/src/service/ backend/src/controllers/
```

#### A05 — Mauvaise configuration

```bash
# CORS : whitelist ou wildcard ?
grep -rn "cors()\|cors({" backend/src/app.js

# Helmet.js présent ?
grep -rn "helmet" backend/src/app.js backend/package.json

# Headers nginx de sécurité
cat frontend/nginx.conf backoffice/nginx.conf

# Swagger exposé sans condition ?
grep -rn "api-docs\|swaggerUi\|NODE_ENV" backend/src/app.js

# Ports exposés dans docker-compose
grep -n "ports:" docker-compose.yml -A2
```

#### A06 — Composants vulnérables

```bash
# Versions des dépendances critiques
grep -E "\"express\"|\"jsonwebtoken\"|\"bcrypt\"|\"mysql2\"|\"vue\"" backend/package.json frontend/package.json backoffice/package.json 2>/dev/null

# Versions des images Docker
grep -n "FROM" backend/Dockerfile frontend/Dockerfile backoffice/Dockerfile

# npm audit (lancer et noter les résultats)
cd backend && npm audit --audit-level=moderate 2>&1 | tail -5
cd ../frontend && npm audit --audit-level=moderate 2>&1 | tail -5
cd ../backoffice && npm audit --audit-level=moderate 2>&1 | tail -5
```

#### A07 — Authentification

```bash
# Expiration JWT configurée ?
grep -n "expiresIn\|JWT_EXPIRES_IN" backend/src/utils/jwt.js

# Token de rafraîchissement ?
grep -rn "refresh" backend/src/

# Verrouillage compte après échecs ?
grep -rn "attempts\|locked\|failCount" backend/src/
```

#### A08 — Intégrité logicielle

```bash
# npm ci utilisé (pas npm install) dans CI ?
grep -n "npm ci\|npm install" .github/workflows/ci.yml

# Lock files présents
ls backend/package-lock.json frontend/package-lock.json backoffice/package-lock.json

# Permissions GitHub Actions
grep -n "permissions:" .github/workflows/*.yml
```

#### A09 — Journalisation

```bash
# Logger présent et utilisé
ls backend/src/utils/logger.js 2>/dev/null
grep -rn "logger\." backend/src/controllers/ | wc -l

# Logs persistés hors conteneur ?
grep -n "volumes:" docker-compose.yml -A5

# Données sensibles dans les logs ?
grep -rn "logger.*password\|logger.*token\|logger.*secret" backend/src/
```

#### A10 — SSRF

```bash
# Requêtes HTTP vers des URLs issues du body/params ?
grep -rn "fetch\|axios\|http\.get\|https\.get" backend/src/ | grep -v "node_modules"
```

---

### Phase 2.5 — Vérification CVE (WebFetch)

Avant de rédiger le rapport, vérifier les vulnérabilités connues pour les technologies utilisées.

#### Étape 1 — Extraire les versions exactes (Bash)

```bash
# Versions des dépendances backend critiques
node -e "const p=require('./backend/package.json'); ['express','jsonwebtoken','bcrypt','bcryptjs','mysql2','cors','dotenv'].forEach(k => p.dependencies[k] && console.log(k+'@'+p.dependencies[k]))"

# Version Node.js dans les Dockerfiles
grep "FROM node:" backend/Dockerfile frontend/Dockerfile backoffice/Dockerfile

# Version nginx dans les Dockerfiles
grep "FROM nginx:" frontend/Dockerfile backoffice/Dockerfile

# Version des dépendances Vue
node -e "const p=require('./frontend/package.json'); ['vue','vite'].forEach(k => p.dependencies[k]||p.devDependencies[k] && console.log(k))" 2>/dev/null
```

#### Étape 2 — Vérification CVE par WebFetch

Pour chaque technologie, effectuer un WebFetch sur l'URL officielle et noter les CVE dont la version utilisée dans le projet est dans la plage affectée.

**Node.js — Fin de vie et vulnérabilités**

```
WebFetch: https://endoflife.date/api/nodejs.json
→ Vérifier que la version Node.js utilisée (ex: 20) est encore "maintenue" (eol: false)

WebFetch: https://nodejs.org/en/blog/vulnerability
→ Lister les vulnérabilités récentes, vérifier si la version du projet est affectée
```

**nginx — Avis de sécurité officiels**

```
WebFetch: https://nginx.org/en/security_advisories.html
→ Lister les CVE récentes, vérifier si nginx:1.27-alpine est affectée
```

**Express.js — Mises à jour de sécurité**

```
WebFetch: https://expressjs.com/en/advanced/security-updates.html
→ Lister les vulnérabilités connues d'Express, vérifier la version utilisée
```

**Packages npm critiques — GitHub Advisory Database**

Pour chaque package critique identifié à l'Étape 1, fetcher :

```
WebFetch: https://github.com/advisories?query=type%3Areviewed+ecosystem%3Anpm+package%3Ajsonwebtoken
WebFetch: https://github.com/advisories?query=type%3Areviewed+ecosystem%3Anpm+package%3Amysql2
WebFetch: https://github.com/advisories?query=type%3Areviewed+ecosystem%3Anpm+package%3Abcrypt
WebFetch: https://github.com/advisories?query=type%3Areviewed+ecosystem%3Anpm+package%3Aexpress
```

Pour chaque advisory trouvé :
- Récupérer le numéro CVE/GHSA, la sévérité, la plage de versions affectées
- Comparer avec la version installée dans le projet
- Si le projet est dans la plage affectée → ajouter comme finding de catégorie A06

**Vue.js — Avis de sécurité**

```
WebFetch: https://github.com/vuejs/core/security/advisories
→ Vérifier si des CVE touchent la version de Vue.js utilisée
```

#### Étape 3 — Synthèse CVE

Construire un tableau récapitulatif des CVE trouvées :

| Package | Version utilisée | CVE/GHSA | Sévérité | Plage affectée | Statut |
|---------|-----------------|----------|----------|----------------|--------|
| jsonwebtoken | x.x.x | GHSA-xxxx | Haute | < x.x.x | ✅ Hors plage / ⚠️ Affecté |
| nginx | 1.27 | CVE-xxxx | Moyenne | < 1.xx | ✅ Hors plage / ⚠️ Affecté |

Ajouter les CVE affectant le projet comme findings dans la section A06 du rapport final.

---

### Phase 3 — Génération du rapport

Créer le fichier `docs/deploiement/audit_securite_YYYY-MM-DD.md` avec la structure suivante :

```markdown
# Audit de Sécurité — CesiZen
**Date :** YYYY-MM-DD
**Version analysée :** [résultat de git describe --tags --always]
**Branches :** [branche courante]

---

## Résumé exécutif

| Sévérité | Nombre | Corrigés | Planifiés | Acceptés |
|----------|--------|----------|-----------|---------|
| Critique | X | X | X | X |
| Haute    | X | X | X | X |
| Moyenne  | X | X | X | X |
| Basse    | X | X | X | X |

---

## Findings (du plus critique au moins critique)

### [CRITIQUE] — Titre du finding

| Champ | Valeur |
|-------|--------|
| **Catégorie OWASP** | A0X — Nom |
| **Fichier** | `chemin/vers/fichier.js:ligne` |
| **Statut** | ⚠️ Non corrigé / ✅ Corrigé / 🔄 Planifié |

**Preuve :**
```code
extrait exact du code vulnérable
```

**Risque :** Description du risque si exploité.

**Remédiation :** Ce qu'il faut faire pour corriger.

---

[répéter pour chaque finding par sévérité décroissante]

---

## CVE détectées (A06 — Composants vulnérables)

### Sources consultées

| Source | URL | Statut |
|--------|-----|--------|
| Node.js EOL | https://endoflife.date/api/nodejs.json | Consulté |
| Node.js vulns | https://nodejs.org/en/blog/vulnerability | Consulté |
| nginx advisories | https://nginx.org/en/security_advisories.html | Consulté |
| Express security | https://expressjs.com/en/advanced/security-updates.html | Consulté |
| GitHub Advisory (jsonwebtoken) | https://github.com/advisories?query=...jsonwebtoken | Consulté |
| GitHub Advisory (mysql2) | https://github.com/advisories?query=...mysql2 | Consulté |

### Tableau des CVE

| Package | Version | CVE/GHSA | Sévérité | Affecté ? | Action |
|---------|---------|----------|----------|-----------|--------|
| ... | ... | ... | ... | ✅ Non / ⚠️ Oui | ... |

---

## Findings hors scope (non applicables)

| OWASP | Raison |
|-------|--------|
| A10 SSRF | Le backend ne fait pas de requêtes HTTP basées sur des entrées utilisateur |

---

## Plan d'actions prioritaires

| Priorité | Action | Effort | Version cible |
|----------|--------|--------|---------------|
| 1 | ... | Xh | vX.X.X |
```

---

## Règles de classification de sévérité

| Sévérité | Critères |
|----------|---------|
| **Critique** | Exploitation directe sans authentification, compromission totale (ex : injection SQL, secret en dur exposé, bypass auth) |
| **Haute** | Exploitation nécessite un compte, impact fort (ex : CORS wildcard, absence rate limiting sur login, JWT sans HTTPS) |
| **Moyenne** | Exploitation difficile ou impact limité (ex : headers manquants, Swagger exposé, validation incomplète) |
| **Basse** | Bonne pratique non respectée, risque théorique (ex : format email non validé, logs sans rotation) |

---

## Rappel : statuts des findings

- ✅ **Corrigé** — le code a été modifié, le risque est éliminé
- 🔄 **Planifié** — issue créée, correction dans une version future
- ⚠️ **Non corrigé** — risque accepté ou non traité (justifier)
- 🔍 **À vérifier** — besoin d'information supplémentaire
