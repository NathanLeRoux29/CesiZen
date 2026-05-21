const { validationResult } = require('express-validator');
const ReportDAO = require('../dao/ReportDAO');
const logger = require('../utils/logger');

class ReportController {
    static async submit(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const { category, description, email, page_url } = req.body;
            const id = await ReportDAO.create({ category, description, email, page_url });
            logger.info('ReportController', 'Signalement créé', { id });
            res.status(201).json({ message: 'Signalement enregistré', id });
        } catch (error) {
            logger.error('ReportController', 'Erreur lors de la création du signalement', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async list(req, res) {
        try {
            const { status, category } = req.query;
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const parsedLimit = parseInt(req.query.limit, 10);
            const limit = [10, 25, 50].includes(parsedLimit) ? parsedLimit : 10;
            const [data, total] = await Promise.all([
                ReportDAO.findAll({ status, category, page, limit }),
                ReportDAO.count({ status, category })
            ]);
            res.json({ data, total, page, limit });
        } catch (error) {
            logger.error('ReportController', 'Erreur lors de la récupération des signalements', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async updateStatus(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const { status } = req.body;
            const affected = await ReportDAO.updateStatus(id, status);
            if (affected === 0) return res.status(404).json({ error: 'Signalement non trouvé' });
            logger.info('ReportController', 'Statut mis à jour', { id, status });
            res.json({ message: 'Statut mis à jour' });
        } catch (error) {
            logger.error('ReportController', 'Erreur lors de la mise à jour du statut', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const affected = await ReportDAO.delete(id);
            if (affected === 0) return res.status(404).json({ error: 'Signalement non trouvé' });
            logger.info('ReportController', 'Signalement supprimé', { id });
            res.json({ message: 'Signalement supprimé' });
        } catch (error) {
            logger.error('ReportController', 'Erreur lors de la suppression du signalement', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = ReportController;
