const BreathExerciseDAO = require('../dao/BreathExerciseDAO');
const logger = require('../utils/logger');

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
            logger.info('BreathController', 'Liste des exercices récupérée', { count: exercises.length });
            res.json(exercises);
        } catch (error) {
            logger.error('BreathController', 'Erreur lors de la récupération des exercices', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des exercices' });
        }
    }

    static async show(req, res) {
        try {
            const exercise = await BreathExerciseDAO.getById(req.params.id);
            if (!exercise) {
                logger.warn('BreathController', 'Exercice non trouvé', { exerciseId: req.params.id });
                return res.status(404).json({ error: 'Exercice non trouvé' });
            }
            logger.info('BreathController', 'Exercice récupéré', { exerciseId: req.params.id });
            res.json(exercise);
        } catch (error) {
            logger.error('BreathController', 'Erreur lors de la récupération d\'un exercice', error, { exerciseId: req.params.id });
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'exercice' });
        }
    }
}

module.exports = BreathController;
