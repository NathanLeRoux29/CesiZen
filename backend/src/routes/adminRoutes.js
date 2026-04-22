const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion administrative (Utilisateurs et Articles)
 */

// Toutes les routes admin nécessitent une authentification ET le rôle admin
router.use(authMiddleware, adminMiddleware);

// Gestion des Utilisateurs
router.get('/users', AdminController.getUsers);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// Gestion des Articles
router.post('/articles', AdminController.createArticle);
router.put('/articles/:id', AdminController.updateArticle);
router.delete('/articles/:id', AdminController.deleteArticle);

module.exports = router;
