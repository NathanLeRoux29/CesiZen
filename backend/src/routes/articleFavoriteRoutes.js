const express = require('express');
const router = express.Router();
const ArticleFavoriteController = require('../controllers/ArticleFavoriteController');

/**
 * @swagger
 * tags:
 *   name: ArticleFavorites
 *   description: Gestion des articles favoris
 */

/**
 * @swagger
 * /api/favorites/articles:
 *   post:
 *     summary: Ajouter un article aux favoris
 *     tags: [ArticleFavorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               articleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Succès
 */
router.post('/', ArticleFavoriteController.add);

/**
 * @swagger
 * /api/favorites/articles:
 *   delete:
 *     summary: Retirer un article des favoris
 *     tags: [ArticleFavorites]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *       - in: query
 *         name: articleId
 *         required: true
 *     responses:
 *       200:
 *         description: Succès
 */
router.delete('/', ArticleFavoriteController.remove);

/**
 * @swagger
 * /api/favorites/articles/user/{userId}:
 *   get:
 *     summary: Liste des articles favoris d'un utilisateur
 *     tags: [ArticleFavorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Liste d'articles
 */
router.get('/user/:userId', ArticleFavoriteController.getByUser);

/**
 * @swagger
 * /api/favorites/articles/check:
 *   get:
 *     summary: Vérifie si un article est en favori
 *     tags: [ArticleFavorites]
 *     parameters:
 *       - in: query
 *         name: userId
 *       - in: query
 *         name: articleId
 *     responses:
 *       200:
 *         description: { isFavorite: boolean }
 */
router.get('/check', ArticleFavoriteController.check);

module.exports = router;
