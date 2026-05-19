# Plan de Déploiement — CesiZen

**Version :** 0.1.0  
**Date :** 2026-05-18  
**Projet :** CesiZen — Plateforme de bien-être mental  

---

## 1. Présentation de l'application

CesiZen est une application web de bien-être mental composée de trois services applicatifs :

| Service | Technologie | Rôle |
|---------|-------------|------|
| **Backend** | Node.js 20 / Express 5 | API REST, authentification JWT, accès base de données |
| **Frontend** | Vue.js 3 / Vuetify 3 / Vite | Interface utilisateur grand public |
| **Backoffice** | Vue.js 3 / Vuetify 4 / Vite | Interface d'administration |

Ces trois services communiquent avec une base de données **MySQL 8** et sont supervisés par **Uptime Kuma** pour le monitoring de disponibilité.

---

## 2. Architecture de déploiement

### 2.1 Schéma global

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                          │
└────────┬────────────────────────┬───────────────────────────┘
         │ :5173                  │ :5174
         ▼                        ▼
┌─────────────────┐    ┌──────────────────────┐
│  Frontend       │    │  Backoffice           │
│  Vue.js + Nginx │    │  Vue.js + Nginx       │
│  (port 80)      │    │  (port 80)            │
└────────┬────────┘    └──────────┬────────────┘
         │                        │
         │       :3001/api        │
         └───────────┬────────────┘
                     ▼
         ┌───────────────────────┐
         │  Backend              │
         │  Express / Node.js    │
         │  (port 3001)          │
         └───────────┬───────────┘
                     │ réseau interne Docker
                     ▼
         ┌───────────────────────┐
         │  MySQL 8              │
         │  (port 3306 interne)  │
         └───────────────────────┘

         ┌───────────────────────┐
         │  Uptime Kuma          │  ──► surveille tous les services
         │  (port 3002)          │
         └───────────────────────┘
```

### 2.2 Réseaux Docker

| Réseau | Services | Accès externe |
|--------|----------|--------------|
| `backend-network` | backend, mysql | Non |
| `public-network` | backend, frontend, backoffice, uptime-kuma | Oui (via ports) |

MySQL n'est **jamais exposé** directement à l'extérieur — il ne communique qu'avec le backend via le réseau interne Docker.

### 2.3 Volumes persistants

| Volume | Service | Contenu |
|--------|---------|---------|
| `mysql_data` | MySQL | Données de la base |
| `uptime_kuma_data` | Uptime Kuma | Configuration des monitors |

---

## 3. Environnements

Le projet distingue trois environnements correspondant à trois branches Git :

### 3.1 Environnement de développement (branche `dev`)

| Paramètre | Valeur |
|-----------|--------|
| Objectif | Développement et intégration des fonctionnalités |
| Infrastructure | Machine locale du développeur |
| Démarrage | `npm run dev` dans chaque sous-projet |
| Base de données | MySQL local ou Docker |
| URL frontend | `http://localhost:3000` |
| URL backoffice | `http://localhost:5173` |
| URL backend | `http://localhost:3001` |

Toute nouvelle fonctionnalité ou correction est développée sur une branche dédiée (`feature/*`, `fix/*`, `security/*`) puis intégrée à `dev` via Pull Request.

### 3.2 Environnement de pré-production (branche `preprod`)

| Paramètre | Valeur |
|-----------|--------|
| Objectif | Validation finale avant mise en production |
| Infrastructure | Docker Compose (local ou serveur de test) |
| Démarrage | `docker compose up --build` |
| Base de données | MySQL dans conteneur Docker (données de test) |
| URL frontend | `http://localhost:5173` |
| URL backoffice | `http://localhost:5174` |
| URL backend | `http://localhost:3001` |
| URL monitoring | `http://localhost:3002` |

La pré-production est identique à la production sur le plan technique. Seules les variables d'environnement diffèrent (credentials, secrets).

### 3.3 Environnement de production (branche `main`)

| Paramètre | Valeur |
|-----------|--------|
| Objectif | Service aux utilisateurs finaux |
| Infrastructure | Docker Compose sur VPS Ubuntu 22.04 |
| Démarrage | `docker compose up -d` |
| Base de données | MySQL dans conteneur Docker (données réelles) |
| Ressources minimales | 2 vCPU, 2 Go RAM, 20 Go SSD |
| HTTPS | Obligatoire via Let's Encrypt / reverse proxy |

---

## 4. Stratégie de versioning

### 4.1 Outils

**Git + GitHub** — hébergement du code source, gestion des branches et des Pull Requests.

**semantic-release** — outil de versioning automatique intégré via GitHub Actions (`.github/workflows/release.yml`). Il se déclenche automatiquement à chaque merge vers `dev`, `preprod` ou `main`, analyse les messages de commits depuis le dernier tag, calcule la prochaine version SemVer et crée le tag Git + la GitHub Release sans intervention manuelle.

### 4.2 Stratégie de branches (Gitflow simplifié)

```
feature/* / fix/* / security/* / docs/* / chore/* -> dev -> preprod -> main
```

| Branche | Protection | Règle de merge |
|---------|------------|----------------|
| `main` | Protégée | PR obligatoire + CI valide |
| `preprod` | Protégée | PR obligatoire + CI valide |
| `dev` | Protégée | PR obligatoire + CI valide |
| `feature/*` | Libre | Créée depuis `dev` |
| `fix/*` | Libre | Créée depuis `dev` |
| `security/*` | Libre | Créée depuis `dev` |
| `docs/*` | Libre | Créée depuis `dev` |
| `chore/*` | Libre | Créée depuis `dev` |

### 4.3 Convention de nommage

- Branches : `feature/nom`, `fix/nom`, `security/nom`, `docs/nom`, `chore/nom`
- Commits : Convention Conventional Commits (`feat:`, `fix:`, `feat!:`, `chore:`, `docs:`)
- Tags de version : SemVer 
  - `v0.0.1` — Fix
  - `v0.1.0` — Mineur
  - `v1.0.0` — Majeur

### 4.4 Versioning automatique avec semantic-release

**Fichier :** `.github/workflows/release.yml`  
**Déclencheur :** Push sur `dev`, `preprod` ou `main` (= chaque merge de PR)

semantic-release analyse les messages de commits depuis le dernier tag et détermine automatiquement la prochaine version :

| Type de commit | Version impactée | Exemple |
|---|---|---|
| `fix:` | PATCH : `v0.1.0` → `v0.1.1` | `fix: correction bug connexion` |
| `feat:` | MINOR : `v0.1.0` → `v0.2.0` | `feat: ajout exercices de respiration` |
| `feat!:` | MAJOR : `v0.1.0` → `v1.0.0` | `feat!: refonte complète de l'API` |

**Tags créés automatiquement selon la branche :**

| Branche | Type de release | Exemple de tag |
|---------|----------------|----------------|
| `dev` | Pre-release alpha | `v0.2.0-alpha.1` |
| `preprod` | Pre-release beta | `v0.2.0-beta.1` |
| `main` | Release stable | `v0.2.0` |

**Processus automatique à chaque merge :**
1. Analyse des commits depuis le dernier tag
2. Calcul de la prochaine version SemVer
3. Création du tag Git
4. Création d'une GitHub Release avec les notes de version générées depuis les commits

Si aucun commit ne justifie une nouvelle version (ex: `chore:`, `docs:`), semantic-release ne crée rien.

---

## 5. Intégration continue et automatisation (CI/CD)

### 5.1 Outil

**GitHub Actions** — pipelines automatiques déclenchés par les événements Git.

### 5.2 Pipeline CI — Tests et vérifications automatiques

**Fichier :** `.github/workflows/ci.yml`  
**Déclencheur :** Pull Request vers `dev`, `preprod` ou `main` — ou manuellement via GitHub Actions  

Trois jobs s'exécutent **en parallèle** sur des machines Ubuntu fournies par GitHub :

**Job 1 — Tests backend (Jest)**

| Étape | Description |
|-------|-------------|
| 1 | Checkout du code |
| 2 | Installation Node.js 20 + dépendances |
| 3 | Tests unitaires Jest |
| 4 | Audit de sécurité (`npm audit --audit-level=high`) |

**Job 2 — Build frontend (Vite)**

| Étape | Description |
|-------|-------------|
| 1 | Checkout du code |
| 2 | Installation Node.js 20 + dépendances |
| 3 | Compilation Vite (`npm run build`) |
| 4 | Audit de sécurité (`npm audit --audit-level=high`) |

**Job 3 — Build backoffice (Vite)**

Identique au job 2, appliqué au backoffice.

Si un job échoue, la Pull Request est **bloquée** et ne peut pas être mergée. Une issue GitHub est automatiquement créée avec le label `bug`, le nom de la branche et un lien vers les logs du workflow.

### 5.3 Pipeline Build — Pré-production

**Fichier :** `.github/workflows/build-preprod.yml`  
**Déclencheur :** Push sur `preprod`

| Étape | Description |
|-------|-------------|
| 1 | Checkout du code |
| 2 | Build image Docker backend |
| 3 | Build image Docker frontend |
| 4 | Build image Docker backoffice |

### 5.4 Pipeline Build — Production

**Fichier :** `.github/workflows/build-main.yml`  
**Déclencheur :** Push sur `main`

Identique au pipeline preprod. Prévu pour intégrer un push vers un registry Docker (Docker Hub, GitHub Container Registry) lors d'une mise en production réelle.

---

## 6. Prérequis techniques

### 6.1 Machine développeur

- Node.js 20+
- npm 11+
- Git
- Docker + Docker Compose v2

### 6.2 Serveur de production (futur)

- Ubuntu 22.04 LTS
- Docker Engine 24+
- Docker Compose v2
- 2 vCPU minimum
- 2 Go RAM minimum (4 Go recommandés)
- 20 Go SSD
- Ports ouverts : 80 (HTTP), 443 (HTTPS), 3002 (monitoring)
- Accès SSH

---

## 7. Étapes de déploiement

### 7.1 Environnement de développement

```bash
# 1. Cloner le dépôt
git clone https://github.com/NathanLeRoux29/CesiZen.git
cd CesiZen
git checkout dev

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec les valeurs locales

# 3. Démarrer le backend
cd backend
npm install
npm run dev
# API disponible sur http://localhost:3001

# 4. Démarrer le frontend (nouveau terminal)
cd frontend
npm install
npm run dev
# Frontend disponible sur http://localhost:3000

# 5. Démarrer le backoffice (nouveau terminal)
cd backoffice
npm install
npm run dev
# Backoffice disponible sur http://localhost:5173
```

### 7.2 Environnement de pré-production / production (Docker)

```bash
# 1. Cloner le dépôt (ou se placer sur la bonne branche)
git clone https://github.com/NathanLeRoux29/CesiZen.git
cd CesiZen
git checkout preprod   # ou main pour la production

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec des valeurs sécurisées :
#   - DB_ROOT_PASSWORD : mot de passe fort
#   - DB_PASSWORD : mot de passe fort
#   - JWT_SECRET : chaîne aléatoire longue (min 32 caractères)
#   - NODE_ENV : production
#   - VITE_API_URL : URL publique de l'API (ex: https://api.cesizen.fr)

# 3. Construire et démarrer tous les services
docker compose up --build -d

# 4. Vérifier que tous les services sont opérationnels
docker compose ps

# 5. Consulter les logs en cas de problème
docker compose logs -f backend
```

### 7.3 Vérification post-déploiement

| Vérification | URL | Résultat attendu |
|---|---|---|
| API backend | `http://localhost:3001/` | `{"message": "Bienvenue sur l'API CesiZen"}` |
| Documentation Swagger | `http://localhost:3001/api-docs` | Interface Swagger |
| Frontend | `http://localhost:5173` | Page d'accueil CesiZen |
| Backoffice | `http://localhost:5174` | Page de connexion admin |
| Monitoring | `http://localhost:3002` | Dashboard Uptime Kuma |

### 7.4 Mise à jour d'une version existante

```bash
# 1. Récupérer les dernières modifications
git pull origin main   # ou preprod

# 2. Reconstruire et redémarrer les services modifiés
docker compose up --build -d

# 3. Vérifier les logs
docker compose ps
docker compose logs -f
```

### 7.5 Procédure de rollback

En cas de problème après une mise à jour :

```bash
# 1. Identifier le commit stable précédent
git log --oneline -10

# 2. Revenir au commit stable
git checkout <sha_du_commit_stable>

# 3. Supprimer les volumes si la base de données est corrompue
docker compose down -v

# 4. Redéployer
docker compose up --build -d
```

> ⚠️ `docker compose down -v` supprime les données de la base. À n'utiliser qu'en dernier recours. En production, restaurer depuis une sauvegarde.

---

## 8. Gestion des secrets et sécurité des variables

| Variable | Sensible | Règle |
|----------|----------|-------|
| `DB_ROOT_PASSWORD` | Oui | Jamais dans Git, min 16 caractères |
| `DB_PASSWORD` | Oui | Jamais dans Git, min 16 caractères |
| `JWT_SECRET` | Oui | Jamais dans Git, min 32 caractères aléatoires |
| `NODE_ENV` | Non | `production` obligatoire en prod |
| `VITE_API_URL` | Non | URL publique en prod, `localhost` en dev |

Le fichier `.env` est listé dans `.gitignore` et `.dockerignore`. Seul `.env.example` est versionné, sans valeurs réelles.

---

## 9. Ressources nécessaires — Estimation serveur de production

| Ressource | Minimum | Recommandé |
|-----------|---------|------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 Go | 4 Go |
| Stockage | 20 Go SSD | 40 Go SSD |
| Bande passante | 100 Mbps | 1 Gbps |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Coût estimé (VPS) | ~5€/mois | ~15€/mois |

---

## 10. Monitoring et supervision

**Uptime Kuma** est déployé comme service Docker et surveille la disponibilité des services.

Configuration des monitors recommandée :
- Monitor HTTP → `http://localhost:3001/` (backend)
- Monitor HTTP → `http://localhost:5173` (frontend)
- Monitor HTTP → `http://localhost:5174` (backoffice)
- Alertes par email en cas d'indisponibilité

Accès au dashboard : `http://localhost:3002`

---

## 11. Évolutions prévues

### 11.1 Déploiement continu sur VPS (CD)

Actuellement les pipelines CI/CD vérifient et construisent les images Docker mais ne les déploient pas automatiquement sur un serveur. L'évolution prévue est d'ajouter un job de déploiement dans `build-main.yml` qui se connecte au VPS via SSH et redémarre les conteneurs :

```yaml
# Job à ajouter dans build-main.yml une fois le VPS disponible
deploy:
  needs: build-images        # S'exécute uniquement si le build a réussi
  runs-on: ubuntu-latest
  steps:
    - name: Déploiement sur le VPS
      uses: appleboy/ssh-action@v1
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /opt/cesizen
          git pull origin main
          docker compose up --build -d
```

**Secrets GitHub à configurer :**

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Adresse IP ou domaine du VPS |
| `SSH_USER` | Utilisateur SSH (ex: `ubuntu`) |
| `SSH_PRIVATE_KEY` | Clé privée SSH pour l'authentification |

### 11.2 Versioning des images Docker

Actuellement les images sont taguées `:latest` et `:preprod`. En production réelle, chaque image devrait être taguée avec la version SemVer ET le SHA du commit pour une traçabilité complète :

```bash
# Exemple de tags pour une image de production
cesizen-backend:latest          # Toujours la version courante
cesizen-backend:v0.1.0          # Version SemVer figée
cesizen-backend:a3f9c12         # SHA du commit (traçabilité exacte)
```

Ces images seraient ensuite poussées vers un registry Docker (Docker Hub ou GitHub Container Registry) pour être déployées depuis le VPS sans avoir à rebuilder sur le serveur.

### 11.3 Registry Docker

```bash
# Workflow futur : push vers GitHub Container Registry
docker push ghcr.io/nathanleroux29/cesizen-backend:latest
docker push ghcr.io/nathanleroux29/cesizen-backend:v0.1.0

# Sur le VPS : pull et redémarrage
docker compose pull
docker compose up -d
```
