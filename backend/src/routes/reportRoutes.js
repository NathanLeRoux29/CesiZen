const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const ReportController = require('../controllers/ReportController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const submitLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Trop de signalements, réessaie dans une minute.' }
});

const submitValidation = [
    body('category').isIn(['bug', 'suggestion', 'autre']).withMessage('Catégorie invalide'),
    body('description').isString().trim().isLength({ min: 10, max: 2000 }).withMessage('Description : 10 à 2000 caractères'),
    body('email').optional({ nullable: true, checkFalsy: true }).isEmail().normalizeEmail().withMessage('Email invalide'),
    body('page_url').optional({ nullable: true, checkFalsy: true }).isString().trim().isLength({ max: 500 }).withMessage('URL trop longue'),
];

const statusValidation = [
    body('status').isIn(['nouveau', 'en_cours', 'resolu']).withMessage('Statut invalide'),
];

// Route publique
router.post('/', submitLimiter, submitValidation, ReportController.submit);

// Routes admin
router.use(authMiddleware, adminMiddleware);
router.get('/', ReportController.list);
router.patch('/:id', statusValidation, ReportController.updateStatus);
router.delete('/:id', ReportController.remove);

module.exports = router;
