# Tests de Non-Régression (TNR) - CesiZen

L'objectif des tests de non-régression est de s'assurer que les nouvelles modifications n'ont pas cassé les fonctionnalités existantes les plus critiques.

## 1. Parcours Critique (Santé Mentale)

### [TNR-01] - Accès aux articles après mise à jour
- **Objectif** : Vérifier que l'ajout d'une nouvelle catégorie d'article ne corrompt pas l'affichage global.
- **Scénario** :
    1. Ajouter une catégorie au catalogue via le backoffice.
    2. Naviguer sur le front-end.
- **Vérification** : La page catalogue s'affiche sans erreur 500 et les anciens articles sont toujours présents.

## 2. Authentification et Sécurité

### [TNR-02] - Persistence de la session utilisateur
- **Objectif** : S'assurer que les correctifs sur le store Pinia ne causent pas de déconnexions intempestives.
- **Scénario** :
    1. Se connecter.
    2. Rafraîchir la page (F5).
- **Vérification** : L'utilisateur doit rester connecté et son compte accessible.

## 3. Performance et Responsive

### [TNR-03] - Affichage mobile après modifications UI
- **Objectif** : Garantir que l'ajout de nouveaux composants ne casse pas le layout mobile.
- **Scénario** :
    1. Ouvrir l'application sur un écran < 600px.
    2. Ouvrir le menu drawer.
- **Vérification** : Aucun élément ne dépasse de l'écran, le bouton de fermeture est accessible.
