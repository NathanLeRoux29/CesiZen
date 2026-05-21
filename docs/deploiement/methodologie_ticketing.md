# Méthodologie de gestion des tickets — CesiZen

**Outil :** GitHub Issues  
**Projet :** CesiZen — Plateforme de bien-être mental

---

## 1. Organisation des issues

### 1.1 Labels

| Label | Couleur | Usage |
|-------|---------|-------|
| `bug` | Rouge | Dysfonctionnement ou comportement inattendu |
| `feat` | Bleu | Nouvelle fonctionnalité ou évolution |
| `security` | Rouge foncé | Vulnérabilité ou problème de sécurité |
| `docs` | Bleu foncé | Création ou mise à jour de documentation |
| `chore` | Gris | Maintenance technique (dépendances, config...) |
| `urgent` | Rouge vif | Priorité haute, à traiter immédiatement |

Un label de type (`bug`, `feat`, `security`...) et un label de priorité (`urgent`) peuvent être combinés sur une même issue.

### 1.2 Templates d'issues

Trois formulaires structurés sont disponibles lors de la création d'une issue :

| Template | Usage |
|----------|-------|
| **Rapport de bug** | Signaler un dysfonctionnement avec étapes de reproduction |
| **Demande de fonctionnalité** | Proposer une évolution avec critères d'acceptation |
| **Rapport de sécurité** | Signaler une vulnérabilité avec niveau de sévérité |

### 1.3 Milestones

Les issues sont regroupées par version exemple:

| Milestone | Description |
|-----------|-------------|
| `v0.1.0 — MVP` | Containerisation Docker, CI/CD GitHub Actions |
| `v0.2.0 — Sécurisation` | Plan de sécurité, RGPD, gestion des accès |
| `v1.0.0 — Production` | Première mise en production réelle |

---

## 2. Workflow de traitement d'un ticket

### 2.1 Schéma complet

```
Signalement (client / équipe)
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

### 2.2 Fermeture automatique d'une issue

En incluant `Closes #XX` dans le message de la PR (où `XX` est le numéro de l'issue), GitHub ferme automatiquement l'issue au moment du merge.

```
# Exemple de description de PR
Corrige le bug d'encodage UTF-8 sur les caractères accentués.

Closes #3
```

---

## 3. Règles de priorité

| Sévérité | Délai de prise en charge | Branche cible |
|----------|--------------------------|---------------|
| `urgent` + `security` | Immédiat | Hotfix direct sur `preprod` |
| `urgent` + `bug` | < 24h | `feature/* / fix/* / security/*` → `dev` en priorité |
| `bug` standard | < 1 semaine | `feature/* / fix/* / security/*` → `dev` |
| `feat` | Planifié (milestone) | `feature/* / fix/* / security/*` → `dev` |
| `docs` / `chore` | Flexible | `feature/* / fix/* / security/*` → `dev` |

---

## 4. Tableau Kanban — GitHub Projects

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

Le déplacement "assigné → En cours" n'est pas automatisable nativement sur GitHub Projects — il se fait manuellement au moment où le développeur commence le travail.

---

## 5. Exemple concret — Traitement d'un bug

**Situation :** Un utilisateur signale que les caractères accentués s'affichent mal.

```
1. Création de l'issue
   Title : [BUG] Caractères accentués corrompus (Méditation → MÃ©ditation)
   Label : bug + urgent
   Milestone : v0.1.0 — MVP
   Assigné : NathanLeRoux29

2. Création de la branche
   git checkout -b fix/encodage-utf8

3. Correction du code + tests locaux

4. Pull Request
   Title : "fix: correction encodage UTF-8 MySQL"
   Body : "Closes #1"
   → CI lance les tests automatiquement

5. Merge après CI verte
   → Issue #1 fermée automatiquement
   → Carte déplacée dans "Terminé" sur le Kanban
```
