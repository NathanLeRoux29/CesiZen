const db = require('../config/db');

/**
 * Data Access Object (DAO) pour les Articles.
 * Gère toutes les interactions directes avec la table 'articles'.
 */
class ArticleDAO {
    /**
     * Récupère tous les articles actifs de la base de données.
     * @returns {Promise<Array>} Liste d'articles.
     */
    static async getAllActive() {
        const [rows] = await db.query('SELECT * FROM articles WHERE is_active = 1 ORDER BY created_at DESC');
        return rows;
    }

    /**
     * Récupère un article par son identifiant unique.
     * @param {number} id ID de l'article.
     * @returns {Promise<Object|null>} L'article trouvé ou null.
     */
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Récupère les articles par catégorie.
     * @param {number} categoryId ID de la catégorie.
     * @returns {Promise<Array>} Liste d'articles filtrés.
     */
    static async getByCategory(categoryId) {
        const [rows] = await db.query('SELECT * FROM articles WHERE id_category = ? AND is_active = 1', [categoryId]);
        return rows;
    }
}

module.exports = ArticleDAO;
