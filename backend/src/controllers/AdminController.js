const UserDAO = require('../dao/UserDAO');
console.log('--- LOADING AdminController.js ---');
const ArticleDAO = require('../dao/ArticleDAO');

/**
 * Contrôleur pour les actions d'administration.
 */
class AdminController {
    // --- Gestion des Utilisateurs ---
    
    static async getUsers(req, res) {
        try {
            const users = await UserDAO.getAll();
            res.json(users);
        } catch (error) {
            console.error('AdminController.getUsers:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await UserDAO.delete(id);
            res.json({ message: 'Utilisateur supprimé' });
        } catch (error) {
            console.error('AdminController.deleteUser:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            await UserDAO.update(id, req.body);
            res.json({ message: 'Utilisateur mis à jour' });
        } catch (error) {
            console.error('AdminController.updateUser:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // --- Gestion des Articles ---

    static async createArticle(req, res) {
        try {
            const articleId = await ArticleDAO.create(req.body);
            res.status(201).json({ id: articleId, message: 'Article créé' });
        } catch (error) {
            console.error('AdminController.createArticle:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async updateArticle(req, res) {
        try {
            const { id } = req.params;
            await ArticleDAO.update(id, req.body);
            res.json({ message: 'Article mis à jour' });
        } catch (error) {
            console.error('AdminController.updateArticle:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async deleteArticle(req, res) {
        try {
            const { id } = req.params;
            await ArticleDAO.delete(id);
            res.json({ message: 'Article supprimé' });
        } catch (error) {
            console.error('AdminController.deleteArticle:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = AdminController;
