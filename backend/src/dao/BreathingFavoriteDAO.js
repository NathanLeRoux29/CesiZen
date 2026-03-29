const pool = require('../config/db');

/**
 * Data Access Object pour les favoris de respiration.
 */
class BreathingFavoriteDAO {
    /**
     * Récupère tous les favoris d'un utilisateur.
     */
    static async getAllByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM breathing_favorites WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    /**
     * Crée un nouveau favori.
     */
    static async create(data) {
        const { user_id, name, breath_in, breath_hold, breath_out, duration, sound_type, vibration_intensity } = data;
        const [result] = await pool.query(
            `INSERT INTO breathing_favorites 
            (user_id, name, breath_in, breath_hold, breath_out, duration, sound_type, vibration_intensity) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, name, breath_in, breath_hold, breath_out, duration, sound_type, vibration_intensity]
        );
        return result.insertId;
    }

    /**
     * Récupère un favori par son nom pour un utilisateur.
     */
    static async getByName(userId, name) {
        const [rows] = await pool.query(
            'SELECT * FROM breathing_favorites WHERE user_id = ? AND name = ?',
            [userId, name]
        );
        return rows[0];
    }

    /**
     * Met à jour un favori existant.
     */
    static async update(id, data) {
        const { name, breath_in, breath_hold, breath_out, duration, sound_type, vibration_intensity } = data;
        const [result] = await pool.query(
            `UPDATE breathing_favorites 
            SET name = ?, breath_in = ?, breath_hold = ?, breath_out = ?, duration = ?, sound_type = ?, vibration_intensity = ?
            WHERE id = ?`,
            [name, breath_in, breath_hold, breath_out, duration, sound_type, vibration_intensity, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Supprime un favori par son ID.
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM breathing_favorites WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = BreathingFavoriteDAO;
