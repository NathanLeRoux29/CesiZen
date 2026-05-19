# Veille Technologique — CesiZen

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
Dependabot a proposé la mise à jour de `vite@7.x` → `vite@8.0.13`. La CI a détecté une incompatibilité avec `unplugin-fonts@1.4.0` qui ne supporte pas encore Vite 8. La PR a été fermée — la mise à jour sera faite quand `unplugin-fonts` aura ajouté le support Vite 8.

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

**Résultat :** ✅ Aucun secret détecté — le fichier `.env` est correctement ignoré via `.gitignore` et `.dockerignore`.

---

## 3. Veille manuelle — Sources suivies

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
