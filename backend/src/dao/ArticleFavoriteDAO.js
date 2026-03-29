const db = require('../config/db');

/**
 * Data Access Object (DAO) pour les Favoris d'Articles.
 */
class ArticleFavoriteDAO {
    /**
     * Ajoute un article aux favoris d'un utilisateur.
     */
    static async add(userId, articleId) {
        const [result] = await db.query(
            'INSERT INTO favorites (user_id, article_id) VALUES (?, ?)',
            [userId, articleId]
        );
        return result.insertId;
    }

    /**
     * Supprime un article des favoris d'un utilisateur.
     */
    static async remove(userId, articleId) {
        await db.query(
            'DELETE FROM favorites WHERE user_id = ? AND article_id = ?',
            [userId, articleId]
        );
    }

    /**
     * Récupère tous les articles favoris d'un utilisateur.
     */
    static async getByUser(userId) {
        const [rows] = await db.query(
            `SELECT a.* FROM articles a 
             JOIN favorites f ON a.id = f.article_id 
             WHERE f.user_id = ?`,
            [userId]
        );
        return rows;
    }

    /**
     * Vérifie si un article est en favori pour un utilisateur.
     */
    static async isFavorite(userId, articleId) {
        const [rows] = await db.query(
            'SELECT id FROM favorites WHERE user_id = ? AND article_id = ?',
            [userId, articleId]
        );
        return rows.length > 0;
    }
}

module.exports = ArticleFavoriteDAO;
