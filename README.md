# CesiZen - Plateforme de Bien-être Mental

![CI](https://github.com/NathanLeRoux29/CesiZen/actions/workflows/ci.yml/badge.svg)
![Release](https://github.com/NathanLeRoux29/CesiZen/actions/workflows/release.yml/badge.svg)
![Version](https://img.shields.io/github/v/release/NathanLeRoux29/CesiZen?include_prereleases&label=version)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

CesiZen est une plateforme web de bien-être mental pensée pour les étudiants et salariés CESI.  
Face aux problématiques de stress et de surcharge mentale, elle offre des outils concrets et accessibles :

- **Exercices de respiration guidée** — techniques de cohérence cardiaque paramétrables (durée, rythme, son, vibration)
- **Articles bien-être** — contenu éditorial organisé par catégorie, avec système de favoris
- **Signalement de problèmes** — bouton permanent dans le footer, formulaire modal (catégorie, description, email, page), rate limiting anti-spam, liste dans le backoffice avec filtres et gestion de statut
- **Backoffice d'administration** — gestion complète des articles, des utilisateurs, des droits d'accès et des signalements

L'application repose sur une architecture **API REST / SPA** conteneurisée via Docker, avec une séparation stricte entre l'interface grand public (frontend), l'interface d'administration (backoffice) et le serveur (backend Node.js). Elle est déployable en production sur un simple VPS Ubuntu avec `docker compose up`.

---

## Architecture

```
┌──────────────┐    ┌──────────────────┐
│  Frontend    │    │   Backoffice     │
│  Vue.js 3    │    │   Vue.js 3       │
│  :5173       │    │   :5174          │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       └──────────┬──────────┘
                  │ /api
       ┌──────────▼──────────┐
       │  Backend             │
       │  Node.js / Express 5 │
       │  :3001               │
       └──────────┬──────────┘
                  │ réseau interne Docker
       ┌──────────▼──────────┐
       │  MySQL 8             │
       │  (non exposé)        │
       └─────────────────────┘
```

| Service | Technologie | Port |
|---------|-------------|------|
| Backend | Node.js 20 / Express 5 / JWT | 3001 |
| Frontend | Vue.js 3 / Vuetify 3 / Vite | 5173 |
| Backoffice | Vue.js 3 / Vuetify 4 / Vite | 5174 |
| Base de données | MySQL 8 | interne |
| Monitoring | Uptime Kuma | 3002 |

---

## Démarrage rapide

### Option 1 — Docker Compose (recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/NathanLeRoux29/CesiZen.git
cd CesiZen

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (DB_PASSWORD, JWT_SECRET, etc.)

# 3. Démarrer tous les services
docker compose up --build -d

# 4. Vérifier que tout tourne
docker compose ps
```

| URL | Service |
|-----|---------|
| http://localhost:5173 | Frontend |
| http://localhost:5174 | Backoffice |
| http://localhost:3001 | API Backend |
| http://localhost:3001/api-docs | Documentation Swagger |
| http://localhost:3002 | Monitoring Uptime Kuma |

### Option 2 — Mode développement (natif)

```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Frontend (nouveau terminal)
cd frontend && npm install && npm run dev

# Backoffice (nouveau terminal)
cd backoffice && npm install && npm run dev
```

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs :

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DB_ROOT_PASSWORD` | Mot de passe root MySQL | Oui |
| `DB_USER` | Utilisateur MySQL applicatif | Oui |
| `DB_PASSWORD` | Mot de passe MySQL applicatif | Oui |
| `DB_NAME` | Nom de la base de données | Oui |
| `JWT_SECRET` | Secret de signature JWT (min 32 chars) | Oui |
| `JWT_EXPIRES_IN` | Durée de vie des tokens (ex: `24h`) | Non (défaut: `24h`) |
| `NODE_ENV` | Environnement (`development` / `production`) | Oui |
| `VITE_API_URL` | URL de l'API vue du client | Oui |

Générer un `JWT_SECRET` fort :
```bash
openssl rand -hex 64
```

---

## CI/CD

Quatre workflows GitHub Actions automatisent le cycle de vie du code :

| Workflow | Déclencheur | Rôle |
|----------|-------------|------|
| `ci.yml` | PR vers dev/preprod/main | Tests Jest + build Vite + npm audit |
| `build-preprod.yml` | Push sur `preprod` | Build images Docker préprod |
| `build-main.yml` | Push sur `main` | Build images Docker production |
| `release.yml` | Push sur dev/preprod/main | Versioning SemVer automatique |

La CI doit être verte pour qu'une PR puisse être mergée.

---

## Stratégie de branches

```
feature/* ──┐
fix/*       ├──► dev ──► preprod ──► main
security/*  ┘
```

Convention de commits : [Conventional Commits](https://www.conventionalcommits.org/)  
Versioning : [semantic-release](https://github.com/semantic-release/semantic-release) — automatique à chaque merge

---

## Tests

```bash
cd backend
npm test               # Jest — tests unitaires
npm run test:coverage  # Avec couverture de code
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Plan de déploiement](docs/deploiement/plan_deploiement.md) | Architecture, environnements, CI/CD, rollback |
| [Plan de sécurité](docs/deploiement/plan_securite.md) | Analyse OWASP, RGPD, gestion de crise |
| [Veille technologique](docs/deploiement/veille_technologique.md) | Outils de surveillance, audit SAST/DAST |
| [Méthodologie ticketing](docs/deploiement/methodologie_ticketing.md) | Signalements in-app (client), GitHub Issues (développeur), workflow, Kanban |
| [Cahier de tests](docs/cahier_de_tests.md) | Tests unitaires et non-régression |
| [API Swagger](http://localhost:3001/api-docs) | Documentation interactive (backend en cours d'exécution) |

---

## Sécurité

Ce projet est analysé en continu par :
- **npm audit** — CVE dans les dépendances (à chaque PR)
- **Dependabot** — mises à jour hebdomadaires
- **CodeQL** — analyse statique SAST (à chaque push sur `dev`)
- **Secret Scanning** — détection de secrets exposés (continu)
- **OWASP ZAP** — test dynamique DAST (avant chaque déploiement)

Pour signaler une vulnérabilité, ouvrir une issue avec le label `security`.


## TEST CI Blip