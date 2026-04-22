const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connecte un utilisateur et retourne un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur et retourne un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', AuthController.register);

module.exports = router;
