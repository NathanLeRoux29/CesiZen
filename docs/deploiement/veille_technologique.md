# Veille Technologique CesiZen

**Projet :** CesiZen — Plateforme de bien-être mental  
**Date :** 2026-05-19  

---

## 1. Objectifs de la veille

La veille technologique sur CesiZen couvre deux axes :

- **Sécurité** : détecter les vulnérabilités connues (CVE) dans les dépendances et le code, surveiller les secrets exposés
- **Évolutivité** : suivre les mises à jour des technologies utilisées (Node.js, Vue.js, Docker, nginx) pour maintenir la compatibilité et bénéficier des correctifs

---

## 2. Outils de veille automatisés

### 2.1 npm audit — Analyse des dépendances à chaque PR

**Intégré dans :** `.github/workflows/ci.yml`  
**Déclencheur :** Automatique à chaque Pull Request

`npm audit` analyse les dépendances npm installées et les compare à la base de données de vulnérabilités connues (CVE) de npm. Le flag `--audit-level=high` fait échouer la CI uniquement sur les vulnérabilités de sévérité **high** ou **critical**, évitant le bruit des vulnérabilités mineures.

**Couverture :**
- Backend (`/backend`)
- Frontend (`/frontend`)
- Backoffice (`/backoffice`)

**Comportement en cas de vulnérabilité détectée :**
1. La CI échoue → la PR est bloquée
2. Une issue GitHub est créée automatiquement avec le label `bug`
3. Le développeur corrige (`npm audit fix`) avant de pouvoir merger

---

### 2.2 Dependabot — Surveillance continue des dépendances

**Fichier de configuration :** `.github/dependabot.yml`  
**Fréquence :** Chaque lundi

Dependabot surveille en permanence les dépendances du projet et ouvre automatiquement des Pull Requests lorsqu'une mise à jour est disponible ou qu'une CVE est détectée.

**Écosystèmes surveillés :**

| Écosystème | Répertoires |
|------------|-------------|
| npm | `/backend`, `/frontend`, `/backoffice` |
| Docker | `/backend`, `/frontend`, `/backoffice` |
| GitHub Actions | `/` (workflows CI/CD) |

**Processus de traitement d'une PR Dependabot :**
1. Dependabot ouvre une PR avec la mise à jour proposée
2. La CI s'exécute automatiquement sur cette PR
3. Si la CI passe → review et merge possible
4. Si la CI échoue (incompatibilité) → la PR est fermée, la mise à jour est repoussée

**Exemple concret détecté :**  
Dependabot a proposé la mise à jour de `vite@7.x` → `vite@8.0.13`. La CI a détecté une incompatibilité avec `unplugin-fonts@1.4.0` qui ne supporte pas encore Vite 8. La PR a été fermée la mise à jour sera faite quand `unplugin-fonts` aura ajouté le support Vite 8.

---

### 2.3 CodeQL — Analyse statique du code source

**Outil :** GitHub CodeQL (intégré à GitHub Advanced Security)  
**Déclencheur :** Automatique à chaque push sur `dev`

CodeQL analyse le code source lui-même (pas seulement les dépendances) pour détecter des patterns de code vulnérables : injections, manque de validation, mauvaises pratiques de sécurité.

**Résultats obtenus sur la branche `dev` :**

| Alerte | Sévérité | Fichier | Description |
|--------|----------|---------|-------------|
| Missing rate limiting | High | `userRoutes.js:29, 83, 110, 126` | Endpoints sans limite de requêtes |
| Missing rate limiting | High | `breathingFavoriteRoutes.js:21` | Endpoint sans limite de requêtes |
| Missing rate limiting | High | `adminRoutes.js:14` | Endpoint admin sans limite de requêtes |
| Missing rate limiting | High | `articleFavoriteRoutes.js:14` | Endpoint sans limite de requêtes |
| Workflow permissions | Medium | `build-preprod.yml:13` | Permissions GITHUB_TOKEN trop larges |
| Workflow permissions | Medium | `build-main.yml:14` | Permissions GITHUB_TOKEN trop larges |

**Actions prises :**
- Les alertes "Workflow permissions" ont été corrigées en ajoutant `permissions: contents: read` explicitement dans les workflows
- Les alertes "Missing rate limiting" sont planifiées pour `v0.2.0 — Sécurisation` (ajout de `express-rate-limit`)

---

### 2.4 Secret Scanning — Détection de secrets exposés

**Outil :** GitHub Secret Scanning  
**Déclencheur :** Continu, sur chaque push

Analyse tout le code et l'historique Git à la recherche de secrets accidentellement commités : clés API, tokens d'authentification, mots de passe, JWT secrets.

**Résultat :** Aucun secret détecté — le fichier `.env` est correctement ignoré via `.gitignore` et `.dockerignore`.

---

### 2.5 Audit de sécurité manuel périodique (OWASP)

**Outil :** Skill `/security-audit` (Claude Code)  
**Fréquence :** À chaque release majeure ou avant tout déploiement en production

Les outils automatisés (npm audit, CodeQL, Dependabot) couvrent les dépendances et les patterns statiques. L'audit manuel OWASP couvre ce qu'ils ne voient pas : la logique métier, les problèmes de contrôle d'accès (IDOR), la configuration applicative, les secrets exposés, et les CVE des images Docker.

**Périmètre de l'audit :**

| Catégorie OWASP | Vérifications effectuées |
|-----------------|--------------------------|
| A01 Contrôle d'accès | Routes sans middleware, vérification d'ownership sur chaque ressource |
| A02 Cryptographie | JWT secret, bcrypt rounds, HTTPS, exports de secrets |
| A03 Injection | SQL dynamique dans les DAO, v-html dans Vue.js |
| A04 Conception | Rate limiting, validation des entrées, complexité mot de passe |
| A05 Configuration | CORS, Helmet.js, Swagger en prod, headers nginx, ports exposés |
| A06 Composants | Versions Node.js/nginx/npm, CVE actives via endoflife.date et Snyk |
| A07 Authentification | Expiration JWT, refresh token, verrouillage compte |
| A08 Intégrité | npm ci, lock files, permissions GitHub Actions |
| A09 Journalisation | Logger actif, persistance des logs, données sensibles loggées |
| A10 SSRF | Requêtes HTTP basées sur des entrées utilisateur |

**Processus d'exécution :**

```
1. Lancer le skill dans Claude Code : /security-audit
2. Lecture de tous les fichiers sources (routes, controllers, DAO, middlewares, Dockerfiles)
3. Vérification CVE via sources officielles (endoflife.date, nginx.org, Snyk)
4. Génération du rapport daté : docs/deploiement/audit_securite_YYYY-MM-DD.md
5. Chaque finding → issue GitHub label: security + planification dans le milestone
```

**Dernier audit effectué :**

| Champ | Valeur |
|-------|--------|
| Date | 2026-05-20 |
| Version | v0.2.0-1-g140fb07 |
| Rapport | [audit_securite_2026-05-20.md](audit_securite_2026-05-20.md) |
| Findings | 1 Critique, 7 Hautes, 6 Moyennes, 3 Basses |

---

### 2.6 OWASP ZAP — Test dynamique de sécurité (DAST)

**Outil :** OWASP ZAP 2.17.0 (by Checkmarx)
**Type :** DAST *(Dynamic Application Security Testing)*
**Fréquence :** Avant chaque déploiement en production, sur l'environnement de pré-production

Contrairement aux outils SAST (CodeQL, audit OWASP) qui analysent le code source sans l'exécuter, ZAP attaque l'application **en cours d'exécution** depuis l'extérieur, comme le ferait un attaquant. Il envoie des requêtes et observe les réponses HTTP réelles pour détecter les configurations manquantes côté serveur.

**Dernier scan effectué :**

| Champ | Valeur |
|-------|--------|
| Date | 20 mai 2026, 14h52 |
| Cible | `http://127.0.0.1:5173` (frontend Vue.js + nginx) |
| Version ZAP | 2.17.0 |
| Rapport | [2026-05-20-ZAP-Report-.html](2026-05-20-ZAP-Report-.html) |

**Résultats :**

| Sévérité | Nombre | Alertes |
|----------|--------|---------|
| Haut | 0 | Aucune |
| Moyen | 3 | Content Security Policy absent, Anti-clickjacking header absent, Sub Resource Integrity manquant |
| Faible | 2 | Server header expose la version nginx, X-Content-Type-Options absent |
| Information | 2 | Commentaires suspects dans le JS, Application web moderne détectée |
| **Total** | **7** | |

**Analyse :** Les alertes Medium confirment les findings de l'audit SAST sur les headers de sécurité HTTP manquants — ZAP les détecte cette fois sur les réponses HTTP réelles. L'absence d'alertes High depuis l'extérieur s'explique par le fait que les vulnérabilités critiques (JWT_SECRET, IDOR, rate limiting) se trouvent dans le backend et ne sont pas exposées via le frontend seul.

| Alerte ZAP | OWASP | Statut |
|-----------|-------|--------|
| CSP Header Not Set | A05 | Planifié v0.3.1 — Helmet.js + nginx.conf |
| Missing Anti-clickjacking Header | A05 | Planifié v0.3.1 — X-Frame-Options nginx |
| Sub Resource Integrity Missing | A05 |  Planifié v0.3.1 — attributs integrity sur les scripts |
| Server leaks version (nginx/1.27) | A05 | Planifié v0.3.1 — `server_tokens off` dans nginx.conf |
| X-Content-Type-Options Missing | A05 |  Planifié v0.3.1 — Helmet.js |

---

## 3. Veille manuelle Sources suivies

| Source | Type | Fréquence |
|--------|------|-----------|
| [Node.js Security Blog](https://nodejs.org/en/blog/vulnerability) | CVE Node.js | À chaque release |
| [Vue.js Releases](https://github.com/vuejs/core/releases) | Mises à jour Vue.js | Hebdomadaire |
| [npmjs.com Advisories](https://www.npmjs.com/advisories) | CVE npm | Hebdomadaire |
| [Docker Hub](https://hub.docker.com/_/node) | Mises à jour images Docker | Mensuelle |
| [CVE Mitre](https://cve.mitre.org/) | Base CVE globale | À la demande |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | Bonnes pratiques sécurité | Annuelle |

---

## 4. Processus global de traitement des alertes

```
Alerte détectée (Dependabot / CodeQL / npm audit / Secret scanning)
         │
         ▼
  Évaluation de la sévérité
         │
    ┌────┴────────────┐
  Critical/High      Medium/Low
    │                    │
  Issue créée         Planifié dans
  label: security     le milestone suivant
    │
    ▼
  Branche security/nom créée depuis dev
    │
    ▼
  Correctif développé + tests
    │
    ▼
  PR → CI verte → Merge
    │
    ▼
  Alerte fermée
```

---

## 5. Tableau de bord de l'état actuel

| Outil | Statut | Dernière vérification |
|-------|--------|----------------------|
| npm audit (backend) | ✅ Aucune vulnérabilité high/critical | À chaque PR |
| npm audit (frontend) | ✅ Aucune vulnérabilité high/critical | À chaque PR |
| npm audit (backoffice) | ✅ Aucune vulnérabilité high/critical | À chaque PR |
| Dependabot | ✅ Actif — vérification hebdomadaire | Lundi |
| CodeQL | ⚠️ 7 alertes high (rate limiting) — planifiées v0.2.0 | En continu |
| Secret scanning | ✅ Aucun secret exposé | En continu |
| Audit OWASP manuel (SAST) | ⚠️ 1 Critique, 7 Hautes planifiées v0.3.0 | 2026-05-20 |
| OWASP ZAP (DAST) | ⚠️ 3 Medium, 2 Low — planifiées v0.3.1 | 2026-05-20 |
