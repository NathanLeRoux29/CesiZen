const db = require('../config/db');

/**
 * Data Access Object (DAO) pour les Utilisateurs.
 */
class UserDAO {
    /**
     * Récupère un utilisateur par son email.
     * @param {string} email 
     * @returns {Promise<Object|null>}
     */
    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Crée un nouvel utilisateur.
     * @param {Object} userData 
     * @returns {Promise<number>} ID de l'utilisateur créé.
     */
    static async create(userData) {
        const { username, email, password } = userData;
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, is_admin, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, password, false, true, new Date()]
        );
        return result.insertId;
    }
}

module.exports = UserDAO;
