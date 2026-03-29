const BreathingFavoriteDAO = require('../dao/BreathingFavoriteDAO');

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
            res.json(favorites);
        } catch (error) {
            console.error('Erreur BreathingFavoriteController.list:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des favoris' });
        }
    }

    /**
     * Enregistre un nouveau favori avec vérification d'unicité.
     */
    static async create(req, res) {
        try {
            const { user_id, name, breath_in, breath_hold, breath_out, duration, sound_type, vibration_intensity } = req.body;
            
            if (!user_id || !name) {
                return res.status(400).json({ error: 'User ID et nom du favori requis' });
            }

            // Vérification d'unicité
            const existing = await BreathingFavoriteDAO.getByName(user_id, name);
            if (existing) {
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

            res.status(201).json({ id: favoriteId, message: 'Favori ajouté avec succès' });
        } catch (error) {
            console.error('Erreur BreathingFavoriteController.create:', error);
            res.status(500).json({ error: 'Erreur lors de l\'ajout du favori' });
        }
    }

    /**
     * Met à jour un favori existant.
     */
    static async update(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            
            const updated = await BreathingFavoriteDAO.update(id, data);
            if (!updated) return res.status(404).json({ error: 'Favori non trouvé' });
            
            res.json({ message: 'Favori mis à jour avec succès' });
        } catch (error) {
            console.error('Erreur BreathingFavoriteController.update:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    }

    /**
     * Supprime un favori.
     */
    static async delete(req, res) {
        try {
            const id = req.params.id;
            const deleted = await BreathingFavoriteDAO.delete(id);
            if (!deleted) return res.status(404).json({ error: 'Favori non trouvé' });
            res.json({ message: 'Favori supprimé avec succès' });
        } catch (error) {
            console.error('Erreur BreathingFavoriteController.delete:', error);
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    }
}

module.exports = BreathingFavoriteController;
