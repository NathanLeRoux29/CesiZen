const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

/**
 * @swagger
 * /api/users/find:
 *   get:
 *     summary: Trouve un utilisateur par email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/find', UserController.getByEmail);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     tags: [Users]
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
 */
router.post('/register', UserController.register);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connecte un utilisateur via email et mot de passe
 *     tags: [Users]
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
router.post('/login', UserController.login);

module.exports = router;
