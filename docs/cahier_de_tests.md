# Cahier de Tests - CesiZen

Ce document regroupe les scénarios de **tests fonctionnels** pour l'application CesiZen. Il permet de s'assurer de l'adéquation entre les besoins identifiés et les fonctionnalités implémentées, tant pour les utilisateurs finaux que pour les administrateurs.

---

## 1. Application Utilisateur

### 1.1 Articles et Contenu

#### [ART-01] - Consulter la liste des articles
- **Pré-conditions** : Application lancée sur la page d'accueil.
- **Étapes** :
    1. Cliquer sur "Catalogue de détente" dans la barre de navigation ou sur le bouton "Découvrir le catalogue" sur l'accueil.
- **Résultat Attendu** : La page catalogue s'affiche et liste l'ensemble des articles disponibles.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [ART-02] - Consulter un article spécifique
- **Pré-conditions** : Être sur la page catalogue.
- **Étapes** :
    1. Cliquer sur la carte ou le titre d'un article de la liste.
- **Résultat Attendu** : L'article complet s'ouvre, affichant le titre, l'image d'illustration, la catégorie et le texte intégral.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [ART-03] - Filtrer par catégorie
- **Pré-conditions** : Être sur la page catalogue.
- **Étapes** :
    1. Cliquer sur l'onglet d'une catégorie spécifique (ex: "Méditation", "Yoga").
- **Résultat Attendu** : La liste s'actualise pour ne montrer que les articles appartenant à la catégorie sélectionnée.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [ART-04] - Marquer une activité comme favorite
- **Pré-conditions** : Utilisateur connecté, sur un article ou dans le catalogue.
- **Étapes** :
    1. Cliquer sur l'icône "Cœur" ou le bouton "Ajouter aux favoris".
- **Résultat Attendu** : L'icône change d'état (remplie) et le compteur de favoris sur la page profil s'incrémente.
- **Statut** : [ ] PASSED / [ ] FAILED

---

### 1.2 Exercices de Respiration

#### [RES-01] - Paramétrer une séance de respiration
- **Pré-conditions** : Être sur la page "Exercice de respiration".
- **Étapes** :
    1. Ajuster la durée via le curseur.
    2. Sélectionner une technique.
    3. Choisir un type d'exercice.
- **Résultat Attendu** : Les choix sont visuellement sélectionnés et mis à jour sur l'interface.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [RES-02] - Sauvegarder les paramètres d'exercice
- **Pré-conditions** : Paramètres modifiés sur la page de configuration.
- **Étapes** :
    1. Cliquer sur le bouton "Sauvegarder la configuration".
- **Résultat Attendu** : Un message de confirmation apparaît et les préférences sont enregistrées pour les prochaines sessions.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [RES-03] - Lancer un exercice de respiration
- **Pré-conditions** : Configuration terminée ou par défaut.
- **Étapes** :
    1. Cliquer sur le bouton "Lancer l'exercice".
- **Résultat Attendu** : L'animation de respiration démarre en suivant le rythme de la technique choisie.
- **Statut** : [ ] PASSED / [ ] FAILED

---

### 1.3 Authentification et Profil

#### [AUTH-01] - Accéder à la page de connexion
- **Pré-conditions** : Utilisateur non connecté.
- **Étapes** :
    1. Cliquer sur l'icône de compte dans la barre de navigation.
- **Résultat Attendu** : Le formulaire de connexion (Email et Mot de passe) s'affiche.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [AUTH-02] - Créer un compte utilisateur
- **Pré-conditions** : Sur la page de connexion.
- **Étapes** :
    1. Cliquer sur le lien "Créer un compte".
    2. Remplir les champs requis (Nom, Email, Mot de passe).
    3. Valider l'inscription.
- **Résultat Attendu** : Le compte est créé et l'utilisateur est automatiquement connecté ou invité à se connecter.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [AUTH-03] - Se connecter à son compte
- **Pré-conditions** : Compte utilisateur existant.
- **Étapes** :
    1. Saisir un email et un mot de passe valides.
    2. Cliquer sur "Se connecter".
- **Résultat Attendu** : L'utilisateur est redirigé vers l'accueil, l'icône de profil indique qu'il est connecté.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [AUTH-04] - Réinitialisation de son mot de passe
- **Pré-conditions** : Sur la page de connexion, utilisateur ayant oublié son mot de passe.
- **Étapes** :
    1. Cliquer sur "Mot de passe oublié ?".
    2. Saisir son adresse email.
    3. Cliquer sur le lien reçu par email (simulé) et saisir un nouveau mot de passe.
- **Résultat Attendu** : Le mot de passe est mis à jour et l'utilisateur peut se connecter avec le nouveau mot de passe.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [PROF-01] - Accéder à sa page utilisateur
- **Pré-conditions** : Utilisateur connecté.
- **Étapes** :
    1. Cliquer sur l'icône de profil.
- **Résultat Attendu** : La page "Mon Compte" s'affiche avec les statistiques (articles vus, favoris, séances) et les options de profil.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [PROF-02] - Modifier son adresse mail
- **Pré-conditions** : Sur la page "Mon Compte".
- **Étapes** :
    1. Cliquer sur "Modifier le profil".
    2. Saisir la nouvelle adresse email.
    3. Cliquer sur "Enregistrer".
- **Résultat Attendu** : La nouvelle adresse email est enregistrée et affichée sur le profil.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [PROF-03] - Modifier son mot de passe
- **Pré-conditions** : Sur la page "Mon Compte".
- **Étapes** :
    1. Cliquer sur "Modifier le profil".
    2. Saisir le nouveau mot de passe.
    3. Confirmer l'enregistrement.
- **Résultat Attendu** : Le mot de passe est mis à jour dans le système.
- **Statut** : [ ] PASSED / [ ] FAILED

---

## 2. Interface d'Administration (Backoffice)

### 2.1 Gestion des Comptes Utilisateurs

#### [USR-01] - Créer un compte utilisateur
- **Pré-conditions** : Connecté en tant qu'administrateur dans le backoffice.
- **Étapes** :
    1. Aller dans l'onglet "Utilisateurs".
    2. Cliquer sur "Ajouter".
    3. Remplir les informations et valider.
- **Résultat Attendu** : Le nouvel utilisateur apparaît dans la liste des comptes.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [USR-02] - Modifier un compte utilisateur
- **Pré-conditions** : Liste des utilisateurs affichée.
- **Étapes** :
    1. Cliquer sur l'icône de modification pour un utilisateur.
    2. Changer le nom ou l'email.
    3. Sauvegarder les modifications.
- **Résultat Attendu** : Les informations sont mises à jour dans la liste.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [USR-03] - Désactiver un compte utilisateur
- **Pré-conditions** : Liste des utilisateurs affichée.
- **Étapes** :
    1. Cliquer sur l'option "Désactiver" pour un utilisateur.
- **Résultat Attendu** : Le statut de l'utilisateur passe en "Inactif", il ne peut plus se connecter.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [USR-04] - Supprimer un compte utilisateur
- **Pré-conditions** : Liste des utilisateurs affichée.
- **Étapes** :
    1. Cliquer sur l'icône de suppression.
    2. Confirmer l'action.
- **Résultat Attendu** : L'utilisateur est retiré de la liste et de la base de données.
- **Statut** : [ ] PASSED / [ ] FAILED

---

### 2.2 Gestion des Comptes Administrateurs

#### [ADM-01] - Créer un compte administrateur
- **Pré-conditions** : Droits super-admin requis.
- **Étapes** :
    1. Accéder à la gestion des administrateurs.
    2. Créer un nouvel accès (Email, Role).
- **Résultat Attendu** : Un nouvel administrateur est créé avec les permissions correspondantes.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [ADM-02] - Modifier un compte administrateur
- **Pré-conditions** : Liste des administrateurs affichée.
- **Étapes** :
    1. Éditer les informations d'un compte admin existant.
- **Résultat Attendu** : Les modifications sont prises en compte.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [ADM-03] - Désactiver un compte administrateur
- **Pré-conditions** : Liste des administrateurs affichée.
- **Étapes** :
    1. Basculer le statut d'un admin vers "Désactivé".
- **Résultat Attendu** : L'administrateur perd immédiatement ses accès au backoffice.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [ADM-04] - Supprimer un compte administrateur
- **Pré-conditions** : Liste des administrateurs affichée.
- **Étapes** :
    1. Cliquer sur supprimer et confirmer.
- **Résultat Attendu** : Le compte admin est supprimé.
- **Statut** : [ ] PASSED / [ ] FAILED

---

### 2.3 Gestion des Contenus d'Information

#### [CNT-01] - Créer un contenu d'information (Article)
- **Pré-conditions** : Connecté au backoffice.
- **Étapes** :
    1. Aller dans la gestion des contenus.
    2. Cliquer sur "Ajouter un article".
    3. Remplir le titre, le contenu et choisir une catégorie.
    4. Publier l'article.
- **Résultat Attendu** : L'article est enregistré et devient consultable sur l'application utilisateur.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [CNT-02] - Modifier un contenu d'information
- **Pré-conditions** : Liste des articles affichée.
- **Étapes** :
    1. Sélectionner un article à éditer.
    2. Modifier le texte ou la catégorie.
    3. Enregistrer les changements.
- **Résultat Attendu** : Les changements sont visibles immédiatement sur l'application.
- **Statut** : [ ] PASSED / [ ] FAILED

#### [CNT-03] - Désactiver un contenu d'information
- **Pré-conditions** : Liste des articles affichée.
- **Étapes** :
    1. Cliquer sur "Désactiver" ou "Masquer" pour un article.
- **Résultat Attendu** : L'article n'apparaît plus dans le catalogue utilisateur.
- **Statut** : [ ] PASSED / [ ] FAILED
