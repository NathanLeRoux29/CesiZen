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
    /**
     * Récupère tous les utilisateurs.
     */
    static async getAll() {
        const [rows] = await db.query('SELECT id, username, email, is_admin, is_active, created_at FROM users');
        return rows;
    }

    /**
     * Supprime ou désactive un utilisateur.
     */
    static async delete(id) {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
    }

    /**
     * Met à jour un utilisateur.
     */
    static async update(id, userData) {
        const { username, email, is_admin, is_active } = userData;
        await db.query(
            'UPDATE users SET username = ?, email = ?, is_admin = ?, is_active = ? WHERE id = ?',
            [username, email, is_admin, is_active, id]
        );
    }

    /**
     * Met à jour le mot de passe d'un utilisateur.
     */
    static async updatePassword(id, hashedPassword) {
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
    }
}

module.exports = UserDAO;
