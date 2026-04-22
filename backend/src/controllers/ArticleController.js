const ArticleDAO = require('../dao/ArticleDAO');
const logger = require('../utils/logger');

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
            logger.info('ArticleController', 'Liste des articles récupérée', { count: articles.length });
            res.json(articles);
        } catch (error) {
            logger.error('ArticleController', 'Erreur lors de la récupération des articles', error);
            res.status(500).json({ error: error.message, stack: error.stack });
        }
    }

    static async show(req, res) {
        const id = req.params.id;
        try {
            const article = await ArticleDAO.getById(id);
            if (!article) {
                logger.warn('ArticleController', 'Article non trouvé', { articleId: id });
                return res.status(404).json({ error: 'Article non trouvé' });
            }
            logger.info('ArticleController', 'Article récupéré', { articleId: id });
            res.json(article);
        } catch (error) {
            logger.error('ArticleController', 'Erreur lors de la récupération d\'un article', error, { articleId: id });
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'article' });
        }
    }
}

module.exports = ArticleController;
