const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');

/**
 * Routes pour la gestion des articles.
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupère tous les articles actifs
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get('/', ArticleController.list);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupère un article spécifique par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'article
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', ArticleController.show);

module.exports = router;
