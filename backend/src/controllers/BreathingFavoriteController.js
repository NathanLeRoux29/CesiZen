const BreathingFavoriteDAO = require('../dao/BreathingFavoriteDAO');
const logger = require('../utils/logger');

/**
 * Contrôleur pour les favoris de respiration.
 */
class BreathingFavoriteController {
    /**
     * Récupère tous les favoris d'un utilisateur.
     */
    static async list(req, res) {
        try {
            const userId = req.params.userId;
            const favorites = await BreathingFavoriteDAO.getAllByUserId(userId);
            logger.info('BreathingFavoriteController', 'Favoris de respiration récupérés', { userId, count: favorites.length });
            res.json(favorites);
        } catch (error) {
            logger.error('BreathingFavoriteController', 'Erreur lors de la récupération des favoris', error, { userId: req.params.userId });
            res.status(500).json({ error: 'Erreur lors de la récupération des favoris' });
        }
    }

    static async create(req, res) {
        try {
            const { user_id, name, breath_in, breath_hold, breath_out, duration, sound_type, vibration_intensity } = req.body;

            if (!user_id || !name) {
                logger.warn('BreathingFavoriteController', 'Paramètres manquants pour créer un favori');
                return res.status(400).json({ error: 'User ID et nom du favori requis' });
            }

            const existing = await BreathingFavoriteDAO.getByName(user_id, name);
            if (existing) {
                logger.warn('BreathingFavoriteController', 'Favori avec ce nom existe déjà', { user_id, name });
                return res.status(400).json({ error: 'Un favori avec ce nom existe déjà' });
            }

            const favoriteId = await BreathingFavoriteDAO.create({
                user_id,
                name,
                breath_in,
                breath_hold,
                breath_out,
                duration,
                sound_type,
                vibration_intensity
            });

            logger.info('BreathingFavoriteController', 'Favori de respiration créé', { favoriteId, user_id, name });
            res.status(201).json({ id: favoriteId, message: 'Favori ajouté avec succès' });
        } catch (error) {
            logger.error('BreathingFavoriteController', 'Erreur lors de la création du favori', error, { user_id });
            res.status(500).json({ error: 'Erreur lors de l\'ajout du favori' });
        }
    }

    static async update(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;

            const updated = await BreathingFavoriteDAO.update(id, data);
            if (!updated) {
                logger.warn('BreathingFavoriteController', 'Favori non trouvé pour mise à jour', { favoriteId: id });
                return res.status(404).json({ error: 'Favori non trouvé' });
            }

            logger.info('BreathingFavoriteController', 'Favori mis à jour', { favoriteId: id });
            res.json({ message: 'Favori mis à jour avec succès' });
        } catch (error) {
            logger.error('BreathingFavoriteController', 'Erreur lors de la mise à jour', error, { favoriteId: req.params.id });
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    }

    static async delete(req, res) {
        try {
            const id = req.params.id;
            const deleted = await BreathingFavoriteDAO.delete(id);
            if (!deleted) {
                logger.warn('BreathingFavoriteController', 'Favori non trouvé pour suppression', { favoriteId: id });
                return res.status(404).json({ error: 'Favori non trouvé' });
            }
            logger.info('BreathingFavoriteController', 'Favori supprimé', { favoriteId: id });
            res.json({ message: 'Favori supprimé avec succès' });
        } catch (error) {
            logger.error('BreathingFavoriteController', 'Erreur lors de la suppression', error, { favoriteId: req.params.id });
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    }
}

module.exports = BreathingFavoriteController;
