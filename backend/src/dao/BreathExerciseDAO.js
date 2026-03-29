const db = require('../config/db');

/**
 * Data Access Object (DAO) pour les Exercices de Respiration.
 */
class BreathExerciseDAO {
    /**
     * Récupère tous les exercices de respiration.
     * @returns {Promise<Array>}
     */
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM breath_exercises');
        return rows;
    }

    /**
     * Récupère un exercice par son ID.
     * @param {number} id 
     * @returns {Promise<Object|null>}
     */
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM breath_exercises WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = BreathExerciseDAO;
