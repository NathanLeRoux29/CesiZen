const ArticleDAO = require('../dao/ArticleDAO');

/**
 * Contrôleur pour les Articles.
 * Fait le lien entre les requêtes HTTP et le DAO.
 */
class ArticleController {
    /**
     * Récupère et renvoie tous les articles actifs.
     * @param {Object} req Requête Express.
     * @param {Object} res Réponse Express.
     */
    static async list(req, res) {
        try {
            const articles = await ArticleDAO.getAllActive();
            res.json(articles);
        } catch (error) {
            console.error('Erreur ArticleController.list:', error);
            res.status(500).json({ error: error.message, stack: error.stack });
        }
    }

    /**
     * Récupère et renvoie un article spécifique par son ID.
     * @param {Object} req Requête Express.
     * @param {Object} res Réponse Express.
     */
    static async show(req, res) {
        const id = req.params.id;
        try {
            const article = await ArticleDAO.getById(id);
            if (!article) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }
            res.json(article);
        } catch (error) {
            console.error('Erreur ArticleController.show:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'article' });
        }
    }
}

module.exports = ArticleController;
