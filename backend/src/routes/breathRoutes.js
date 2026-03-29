const express = require('express');
const router = express.Router();
const BreathController = require('../controllers/BreathController');

/**
 * @swagger
 * /api/breathing:
 *   get:
 *     summary: Récupère tous les exercices de respiration
 *     tags: [Breathing]
 *     responses:
 *       200:
 *         description: Liste des exercices
 */
router.get('/', BreathController.list);

/**
 * @swagger
 * /api/breathing/{id}:
 *   get:
 *     summary: Récupère un exercice spécifique par ID
 *     tags: [Breathing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'exercice
 *       404:
 *         description: Exercice non trouvé
 */
router.get('/:id', BreathController.show);

module.exports = router;
