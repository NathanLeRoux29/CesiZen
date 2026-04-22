const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cesizen-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Génère un token JWT pour un utilisateur.
 * @param {Object} user - Utilisateur (doit contenir id, email, is_admin)
 * @returns {string} Token JWT signé
 */
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Vérifie et décode un token JWT.
 * @param {string} token - Token JWT à vérifier
 * @returns {Object} Payload décodé
 * @throws {Error} Si le token est invalide ou expiré
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken,
    JWT_SECRET
};