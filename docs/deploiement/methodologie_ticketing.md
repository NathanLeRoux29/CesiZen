# Méthodologie de gestion des tickets — CesiZen

**Projet :** CesiZen — Plateforme de bien-être mental

CesiZen dispose de deux canaux de ticketing complémentaires :

| Canal | Acteurs | Outil |
|-------|---------|-------|
| **Signalements utilisateurs** | Visiteurs et utilisateurs de l'app | Formulaire in-app → Backoffice |
| **Issues développeurs** | Équipe technique | GitHub Issues → Workflow dev |

---

## 1. Ticketing client — Signalements in-app

### 1.1 Présentation

Tout visiteur peut signaler un problème via le bouton **"Signaler un problème"** présent en permanence dans le footer de l'application. Aucun compte n'est requis.

Les signalements sont stockés en base de données MySQL et consultables par les administrateurs dans le backoffice à l'adresse `/admin/reports`.

### 1.2 Formulaire de signalement

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| Catégorie | Oui | Bug / Suggestion / Autre |
| Description | Oui | Texte libre, 10–2000 caractères |
| Email | Non | Pour recontacter l'utilisateur si nécessaire |
| Page concernée | Non | Auto-rempli avec l'URL courante |

**Protection anti-spam :** 5 soumissions maximum par minute et par IP.

### 1.3 Statuts des signalements

| Statut | Signification |
|--------|---------------|
| **Nouveau** | Signalement reçu, non traité |
| **En cours** | En cours d'analyse ou de correction |
| **Résolu** | Traité (corrigé, rejeté ou archivé) |

### 1.4 Workflow de traitement

```
Utilisateur soumet un signalement (footer frontend)
         │
         ▼
  Enregistré en base — statut : Nouveau
         │
         ▼
  Admin consulte le backoffice (/admin/reports)
         │
         ▼
  Analyse du signalement
         │
    ┌────┴──────────────────────┐
  Actionnable                Non actionnable
  (bug confirmé, suggestion)  (doublon, hors scope)
    │                               │
  Statut → En cours            Statut → Résolu
    │
    ▼
  Issue GitHub créée (section 2)
    │
    ▼
  Workflow développeur normal
    │
    ▼
  Statut signalement → Résolu
```

### 1.5 Lien avec GitHub Issues

Lorsqu'un signalement donne lieu à une issue GitHub, indiquer dans la description de l'issue la catégorie et la date du signalement pour maintenir la traçabilité. Il n'y a pas de lien automatique entre les deux systèmes.

---

## 2. Ticketing développeur — GitHub Issues

### 2.1 Labels

| Label | Couleur | Usage |
|-------|---------|-------|
| `bug` | Rouge | Dysfonctionnement ou comportement inattendu |
| `feat` | Bleu | Nouvelle fonctionnalité ou évolution |
| `security` | Rouge foncé | Vulnérabilité ou problème de sécurité |
| `docs` | Bleu foncé | Création ou mise à jour de documentation |
| `chore` | Gris | Maintenance technique (dépendances, config...) |
| `urgent` | Rouge vif | Priorité haute, à traiter immédiatement |

Un label de type (`bug`, `feat`, `security`...) et un label de priorité (`urgent`) peuvent être combinés sur une même issue.

### 2.2 Templates d'issues

Trois formulaires structurés sont disponibles lors de la création d'une issue :

| Template | Usage |
|----------|-------|
| **Rapport de bug** | Signaler un dysfonctionnement avec étapes de reproduction |
| **Demande de fonctionnalité** | Proposer une évolution avec critères d'acceptation |
| **Rapport de sécurité** | Signaler une vulnérabilité avec niveau de sévérité |

### 2.3 Milestones

Les issues sont regroupées par version exemple:

| Milestone | Description |
|-----------|-------------|
| `v0.1.0 — MVP` | Containerisation Docker, CI/CD GitHub Actions |
| `v0.2.0 — Sécurisation` | Plan de sécurité, RGPD, gestion des accès |
| `v1.0.0 — Production` | Première mise en production réelle |

---

## 3. Workflow développeur

### 3.1 Schéma complet

```
Signalement (client via app / équipe interne)
         │
         ▼
  Issue créée sur GitHub
  (via template approprié)
         │
         ▼
  Triage : label + milestone + assigné
         │
         ▼
  Branche créée depuis dev selon le type :
  feature/nom  →  nouvelle fonctionnalité
  fix/nom      →  correction de bug
  security/nom →  correctif de sécurité
         │
         ▼
  Développement + tests locaux
         │
         ▼
  Pull Request vers dev
  (référence l'issue avec "Closes #XX")
         │
         ▼
  CI automatique (Jest + Playwright)
         │
    ┌────┴────┐
  Échec      Succès
    │           │
  Correction  Code review
    │           │
    └────┬──────┘
         │
         ▼
  Merge dans dev
  → Issue fermée automatiquement
         │
         ▼
  PR dev → preprod → main
  (selon la criticité du fix)
```

### 3.2 Fermeture automatique d'une issue

En incluant `Closes #XX` dans le message de la PR (où `XX` est le numéro de l'issue), GitHub ferme automatiquement l'issue au moment du merge.

```
# Exemple de description de PR
Corrige le bug d'encodage UTF-8 sur les caractères accentués.

Closes #3
```

---

## 4. Règles de priorité

| Sévérité | Délai de prise en charge | Branche cible |
|----------|--------------------------|---------------|
| `urgent` + `security` | Immédiat | Hotfix direct sur `preprod` |
| `urgent` + `bug` | < 24h | `feature/* / fix/* / security/*` → `dev` en priorité |
| `bug` standard | < 1 semaine | `feature/* / fix/* / security/*` → `dev` |
| `feat` | Planifié (milestone) | `feature/* / fix/* / security/*` → `dev` |
| `docs` / `chore` | Flexible | `feature/* / fix/* / security/*` → `dev` |

---

## 5. Tableau Kanban — GitHub Projects

Un tableau de bord visuel suit l'avancement de toutes les issues :

| Colonne | Description |
|---------|-------------|
| **Backlog** | Issues identifiées, non planifiées |
| **À faire** | Issues planifiées pour le sprint/milestone en cours |
| **En cours** | Issues en développement actif |
| **En review** | PR ouverte, en attente de validation |
| **Terminé** | Issues mergées et fermées |

**Automatisations actives (GitHub Projects) :**

| Déclencheur | Colonne cible |
|-------------|---------------|
| Issue créée | `Backlog` |
| Issue réouverte | `À faire` |
| PR mergée | `Terminé` |
| Issue fermée | `Terminé` |

**Déplacements manuels :**

| Moment | Action |
|--------|--------|
| Tu commences à travailler | Déplacer en `En cours` |
| Tu ouvres une PR | Déplacer en `En review` |

---

## 6. Exemple concret — Traitement d'un bug signalé par un utilisateur

**Situation :** Un utilisateur signale via l'app que les caractères accentués s'affichent mal.

```
1. L'admin voit le signalement dans le backoffice (/admin/reports)
   Catégorie : bug
   Description : "Les titres d'articles affichent des caractères bizarres (Méditation → MÃ©ditation)"
   Statut → En cours

2. Création de l'issue GitHub
   Title : [BUG] Caractères accentués corrompus (Méditation → MÃ©ditation)
   Label : bug + urgent
   Milestone : v0.1.0 — MVP
   Assigné : NathanLeRoux29

3. Création de la branche
   git checkout -b fix/encodage-utf8

4. Correction du code + tests locaux

5. Pull Request
   Title : "fix: correction encodage UTF-8 MySQL"
   Body : "Closes #1"
   → CI lance les tests automatiquement

6. Merge après CI verte
   → Issue #1 fermée automatiquement

7. Signalement backoffice → Statut : Résolu
```
