Lance un audit de sécurité complet du projet CesiZen en utilisant le skill `security-audit`.

Suis exactement le processus décrit dans le skill :
1. Phase 1 — Cartographie : exécute les commandes bash pour lister les fichiers, routes, middlewares et variables d'environnement
2. Phase 2 — Vérifications OWASP : exécute chaque bloc de commandes (A01 à A10), note les fichiers et lignes concernés
3. Phase 3 — Génère le rapport dans `docs/deploiement/audit_securite_$ARGUMENTS.md` (si pas d'argument, utilise la date du jour au format YYYY-MM-DD)

Le rapport doit :
- Classer les findings du plus critique au moins critique
- Pointer vers des fichiers et numéros de ligne réels
- Inclure un extrait de code pour chaque finding
- Indiquer le statut de chaque finding (corrigé, planifié, non corrigé)
- Terminer par un plan d'actions prioritaires
