const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Middleware de protection des routes via JWT.
 * Extrait le token du header Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('AuthMiddleware', 'Token manquant ou mal formaté', { url: req.originalUrl });
        return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn('AuthMiddleware', 'Token invalide ou expiré', { error: error.message, url: req.originalUrl });
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
}

/**
 * Middleware optionnel - Attache l'utilisateur si token présent, sinon continue sans.
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.substring(7);

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
    } catch (error) {
        // Token invalide mais on continue quand même
    }

    next();
}

/**
 * Middleware vérifiant que l'utilisateur est admin.
 * Doit être utilisé APRÈS authMiddleware (req.user doit exister).
 */
function adminMiddleware(req, res, next) {
    if (!req.user || !req.user.is_admin) {
        logger.warn('AdminMiddleware', 'Accès admin refusé', { url: req.originalUrl, userId: req.user?.id });
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    next();
}

module.exports = {
    authMiddleware,
    optionalAuth,
    adminMiddleware
};