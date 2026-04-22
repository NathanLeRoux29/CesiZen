const ArticleFavoriteDAO = require('../dao/ArticleFavoriteDAO');
const logger = require('../utils/logger');

/**
 * Contrôleur pour les Favoris d'Articles.
 */
class ArticleFavoriteController {
    /**
     * Ajoute un article aux favoris.
     */
    static async add(req, res) {
        try {
            const { userId, articleId } = req.body;
            if (!userId || !articleId) {
                logger.warn('ArticleFavoriteController', 'Paramètres manquants pour ajouter aux favoris');
                return res.status(400).json({ error: 'userId et articleId sont requis' });
            }

            const exists = await ArticleFavoriteDAO.isFavorite(userId, articleId);
            if (exists) {
                logger.warn('ArticleFavoriteController', 'Article déjà en favori', { userId, articleId });
                return res.status(409).json({ error: 'L\'article est déjà en favori' });
            }

            await ArticleFavoriteDAO.add(userId, articleId);
            logger.info('ArticleFavoriteController', 'Article ajouté aux favoris', { userId, articleId });
            res.status(201).json({ message: 'Article ajouté aux favoris' });
        } catch (error) {
            logger.error('ArticleFavoriteController', 'Erreur lors de l\'ajout aux favoris', error, { userId, articleId });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async remove(req, res) {
        try {
            const { userId, articleId } = req.query;
            if (!userId || !articleId) {
                logger.warn('ArticleFavoriteController', 'Paramètres manquants pour retirer des favoris');
                return res.status(400).json({ error: 'userId et articleId sont requis' });
            }

            await ArticleFavoriteDAO.remove(userId, articleId);
            logger.info('ArticleFavoriteController', 'Article retiré des favoris', { userId, articleId });
            res.json({ message: 'Article retiré des favoris' });
        } catch (error) {
            logger.error('ArticleFavoriteController', 'Erreur lors du retrait des favoris', error, { userId, articleId });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async getByUser(req, res) {
        try {
            const { userId } = req.params;
            const favorites = await ArticleFavoriteDAO.getByUser(userId);
            logger.info('ArticleFavoriteController', 'Favoris récupérés', { userId, count: favorites.length });
            res.json(favorites);
        } catch (error) {
            logger.error('ArticleFavoriteController', 'Erreur lors de la récupération des favoris', error, { userId });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async check(req, res) {
        try {
            const { userId, articleId } = req.query;
            const isFavorite = await ArticleFavoriteDAO.isFavorite(userId, articleId);
            res.json({ isFavorite });
        } catch (error) {
            logger.error('ArticleFavoriteController', 'Erreur lors de la vérification du favori', error, { userId, articleId });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = ArticleFavoriteController;
