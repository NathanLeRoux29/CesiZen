const db = require('../config/db');

/**
 * Data Access Object (DAO) pour l'authentification.
 */
class AuthDao {
    /**
     * Récupère un utilisateur par son email (avec mot de passe).
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Crée un nouvel utilisateur.
     * @param {Object} userData - { username, email, password }
     * @returns {Promise<number>} ID de l'utilisateur créé
     */
    static async create(userData) {
        const { username, email, password } = userData;
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, is_admin, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, password, false, true, new Date()]
        );
        return result.insertId;
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    static async getById(id) {
        const [rows] = await db.query(
            'SELECT id, username, email, is_admin, is_active, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Récupère un utilisateur par son ID (avec mot de passe).
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    static async getByIdWithPassword(id) {
        const [rows] = await db.query(
            'SELECT id, username, email, password, is_admin, is_active, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = AuthDao;