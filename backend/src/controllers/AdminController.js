const UserDAO = require('../dao/UserDAO');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const ArticleDAO = require('../dao/ArticleDAO');

/**
 * Contrôleur pour les actions d'administration.
 */
class AdminController {
    // --- Gestion des Utilisateurs ---
    
    static async getUsers(req, res) {
        try {
            const users = await UserDAO.getAll();
            logger.info('AdminController', 'Récupération de tous les utilisateurs', { count: users.length });
            res.json(users);
        } catch (error) {
            logger.error('AdminController', 'Erreur lors de la récupération des utilisateurs', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await UserDAO.delete(id);
            logger.info('AdminController', 'Utilisateur supprimé', { userId: id });
            res.json({ message: 'Utilisateur supprimé' });
        } catch (error) {
            logger.error('AdminController', 'Erreur lors de la suppression d\'un utilisateur', error, { userId: id });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { username, email, is_admin, is_active } = req.body;
            await UserDAO.update(id, {
                username,
                email,
                is_admin: is_admin === true || is_admin === 'true',
                is_active: is_active === true || is_active === 'true'
            });
            logger.info('AdminController', 'Utilisateur mis à jour', { userId: id });
            res.json({ message: 'Utilisateur mis à jour' });
        } catch (error) {
            logger.error('AdminController', 'Erreur lors de la mise à jour d\'un utilisateur', error, { userId: req.params.id });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async updateUserPassword(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ error: 'Mot de passe requis' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await UserDAO.updatePassword(id, hashedPassword);
            logger.info('AdminController', 'Mot de passe utilisateur mis à jour', { userId: id });
            res.json({ message: 'Mot de passe mis à jour' });
        } catch (error) {
            logger.error('AdminController', 'Erreur lors de la mise à jour du mot de passe', error, { userId: req.params.id });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // --- Gestion des Articles ---

    static async createArticle(req, res) {
        try {
            const articleId = await ArticleDAO.create(req.body);
            logger.info('AdminController', 'Article créé', { articleId });
            res.status(201).json({ id: articleId, message: 'Article créé' });
        } catch (error) {
            logger.error('AdminController', 'Erreur lors de la création d\'un article', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async updateArticle(req, res) {
        try {
            const { id } = req.params;
            await ArticleDAO.update(id, req.body);
            logger.info('AdminController', 'Article mis à jour', { articleId: id });
            res.json({ message: 'Article mis à jour' });
        } catch (error) {
            logger.error('AdminController', 'Erreur lors de la mise à jour d\'un article', error, { articleId: id });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async deleteArticle(req, res) {
        try {
            const { id } = req.params;
            await ArticleDAO.delete(id);
            logger.info('AdminController', 'Article supprimé', { articleId: id });
            res.json({ message: 'Article supprimé' });
        } catch (error) {
            logger.error('AdminController', 'Erreur lors de la suppression d\'un article', error, { articleId: id });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = AdminController;
