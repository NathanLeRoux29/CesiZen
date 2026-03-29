const BreathExerciseDAO = require('../dao/BreathExerciseDAO');

/**
 * Contrôleur pour les exercices de respiration.
 */
class BreathController {
    /**
     * Liste tous les exercices.
     */
    static async list(req, res) {
        try {
            const exercises = await BreathExerciseDAO.getAll();
            res.json(exercises);
        } catch (error) {
            console.error('Erreur BreathController.list:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des exercices' });
        }
    }

    /**
     * Récupère un exercice par son ID.
     */
    static async show(req, res) {
        try {
            const exercise = await BreathExerciseDAO.getById(req.params.id);
            if (!exercise) return res.status(404).json({ error: 'Exercice non trouvé' });
            res.json(exercise);
        } catch (error) {
            console.error('Erreur BreathController.show:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'exercice' });
        }
    }
}

module.exports = BreathController;
