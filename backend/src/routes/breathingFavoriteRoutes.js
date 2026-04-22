const express = require('express');
const router = express.Router();
const BreathingFavoriteController = require('../controllers/BreathingFavoriteController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/breathing/favorites/{userId}:
 *   get:
 *     summary: Récupère tous les favoris d'un utilisateur
 *     tags: [Breathing]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 */

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

router.get('/:userId', BreathingFavoriteController.list);

/**
 * @swagger
 * /api/breathing/favorites:
 *   post:
 *     summary: Enregistre une configuration de respiration en favori
 *     tags: [Breathing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               breath_in:
 *                 type: integer
 *               breath_hold:
 *                 type: integer
 *               breath_out:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               sound_type:
 *                 type: string
 *               vibration_intensity:
 *                 type: string
 */
router.post('/', BreathingFavoriteController.create);

/**
 * @swagger
 * /api/breathing/favorites/{id}:
 *   put:
 *     summary: Met à jour une configuration de respiration existante
 *     tags: [Breathing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
router.put('/:id', BreathingFavoriteController.update);

/**
 * @swagger
 * /api/breathing/favorites/{id}:
 *   delete:
 *     summary: Supprime un favori
 *     tags: [Breathing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete('/:id', BreathingFavoriteController.delete);

module.exports = router;
