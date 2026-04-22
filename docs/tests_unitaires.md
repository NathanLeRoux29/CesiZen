# Tests Unitaires - CesiZen

Ce document détaille les tests unitaires visant à vérifier la logique métier et les fonctions critiques de l'application de manière isolée.

## 1. Module Utilisateur (Stores/Logic)

### [TU-USER-01] - Calcul des statistiques utilisateur
- **Composant** : `userStore.js`
- **Entrée** : Liste d'articles consultés (ID: 1, 2, 3).
- **Fonction** : `updateStats()`
- **Résultat Attendu** : Le compteur `articlesViewed` doit être égal à 3.

### [TU-USER-02] - Validation du format d'email
- **Composant** : Validation formulaire
- **Entrée** : "test@cesi", "test.fr", "test@cesi.fr"
- **Fonction** : `validateEmail()`
- **Résultat Attendu** : Seul "test@cesi.fr" doit retourner `true`.

## 2. Module Articles (Logic)

### [TU-ART-01] - Sélection de l'article du jour
- **Composant** : `articleService.js`
- **Entrée** : Date fixe (ex: 2026-04-06).
- **Fonction** : `getArticleOfTheDay()`
- **Résultat Attendu** : Retourne systématiquement le même article pour cette date spécifique.

### [TU-ART-02] - Filtrage par catégorie
- **Composant** : `articleService.js`
- **Entrée** : Liste d'articles brute, Catégorie: "Méditation".
- **Fonction** : `filterArticlesByCategory()`
- **Résultat Attendu** : La liste résultante ne contient que des articles dont la catégorie est "Méditation".

## 3. Module Respiration (Logic)

### [TU-RES-01] - Calcul de la durée totale d'un cycle
- **Composant** : `breathingTimer.js`
- **Entrée** : Technique 4-7-8 (4s inspire, 7s rétention, 8s expire).
- **Fonction** : `calculateCycleDuration()`
- **Résultat Attendu** : La fonction doit retourner 19 secondes.
