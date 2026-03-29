const ArticleFavoriteDAO = require('../dao/ArticleFavoriteDAO');

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
                return res.status(400).json({ error: 'userId et articleId sont requis' });
            }
            
            // Éviter les doublons
            const exists = await ArticleFavoriteDAO.isFavorite(userId, articleId);
            if (exists) {
                return res.status(409).json({ error: 'L\'article est déjà en favori' });
            }

            await ArticleFavoriteDAO.add(userId, articleId);
            res.status(201).json({ message: 'Article ajouté aux favoris' });
        } catch (error) {
            console.error('Erreur ArticleFavoriteController.add:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * Supprime un article des favoris.
     */
    static async remove(req, res) {
        try {
            const { userId, articleId } = req.query; // On peut passer par query ou params
            if (!userId || !articleId) {
                return res.status(400).json({ error: 'userId et articleId sont requis' });
            }

            await ArticleFavoriteDAO.remove(userId, articleId);
            res.json({ message: 'Article retiré des favoris' });
        } catch (error) {
            console.error('Erreur ArticleFavoriteController.remove:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * Récupère les articles favoris d'un utilisateur.
     */
    static async getByUser(req, res) {
        try {
            const { userId } = req.params;
            const favorites = await ArticleFavoriteDAO.getByUser(userId);
            res.json(favorites);
        } catch (error) {
            console.error('Erreur ArticleFavoriteController.getByUser:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * Vérifie si un article est en favori.
     */
    static async check(req, res) {
        try {
            const { userId, articleId } = req.query;
            const isFavorite = await ArticleFavoriteDAO.isFavorite(userId, articleId);
            res.json({ isFavorite });
        } catch (error) {
            console.error('Erreur ArticleFavoriteController.check:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = ArticleFavoriteController;
