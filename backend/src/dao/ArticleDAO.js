const db = require('../config/db');
console.log('--- LOADING ArticleDAO.js ---');

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
        const query = `
            SELECT a.*, c.label as category 
            FROM articles a 
            JOIN categories c ON a.id_category = c.id 
            WHERE a.is_active = 1 
            ORDER BY a.created_at DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    /**
     * Récupère un article par son identifiant unique.
     * @param {number} id ID de l'article.
     * @returns {Promise<Object|null>} L'article trouvé ou null.
     */
    static async getById(id) {
        const query = `
            SELECT a.*, c.label as category 
            FROM articles a 
            JOIN categories c ON a.id_category = c.id 
            WHERE a.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Récupère les articles par catégorie.
     */
    static async getByCategory(categoryId) {
        const [rows] = await db.query('SELECT * FROM articles WHERE id_category = ? AND is_active = 1', [categoryId]);
        return rows;
    }

    /**
     * Crée un nouvel article.
     */
    static async create(data) {
        const { title, content, summary, media_url, id_category, author } = data;
        const [result] = await db.query(
            'INSERT INTO articles (title, content, summary, media_url, id_category, author, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, content, summary, media_url, id_category, author || 'Équipe CesiZen', true, new Date()]
        );
        return result.insertId;
    }

    /**
     * Met à jour un article.
     */
    static async update(id, data) {
        console.log('ArticleDAO.update hit with:', { id, ...data });
        const { title, content, summary, media_url, id_category, author, is_active } = data;
        const sql = 'UPDATE articles SET title = ?, content = ?, summary = ?, media_url = ?, id_category = ?, author = ?, is_active = ? WHERE id = ?';
        const params = [title, content, summary, media_url, id_category, author, is_active, id];
        console.log('Executing SQL:', sql);
        await db.query(sql, params);
    }

    /**
     * Supprime un article.
     */
    static async delete(id) {
        console.log('ArticleDAO.delete hit with ID:', id);
        // Supprimer les favoris liés d'abord pour éviter l'erreur de clé étrangère
        await db.query('DELETE FROM favorites WHERE article_id = ?', [id]);
        await db.query('DELETE FROM articles WHERE id = ?', [id]);
    }
}

module.exports = ArticleDAO;
