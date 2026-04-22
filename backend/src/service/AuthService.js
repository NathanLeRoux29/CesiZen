const bcrypt = require('bcrypt');
const AuthDao = require('../dao/AuthDao');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Service d'authentification - Logique métier.
 */
class AuthService {
    /**
     * Connecte un utilisateur.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{token: string, user: Object}>}
     * @throws {Error} Si identifiants invalides
     */
    static async login(email, password) {
        const user = await AuthDao.getByEmail(email);

        if (!user) {
            logger.warn('AuthService', 'Échec de connexion - utilisateur non trouvé', { email });
            throw new Error('Email ou mot de passe incorrect');
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            logger.warn('AuthService', 'Échec de connexion - mot de passe incorrect', { email });
            throw new Error('Email ou mot de passe incorrect');
        }

        const token = generateToken(user);
        delete user.password;

        logger.info('AuthService', 'Connexion réussie', { email });
        return { token, user };
    }

    /**
     * Enregistre un nouvel utilisateur.
     * @param {Object} userData - { username, email, password }
     * @returns {Promise<{token: string, user: Object}>}
     * @throws {Error} Si l'email existe déjà
     */
    static async register(userData) {
        const { username, email, password } = userData;

        const existingUser = await AuthDao.getByEmail(email);
        if (existingUser) {
            logger.warn('AuthService', 'Tentative d\'inscription avec email déjà utilisé', { email });
            throw new Error('Cet email est déjà utilisé');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userId = await AuthDao.create({ username, email, password: hashedPassword });
        const newUser = await AuthDao.getById(userId);

        const token = generateToken(newUser);

        logger.info('AuthService', 'Nouvel utilisateur enregistré', { userId, email });
        return { token, user: newUser };
    }
}

module.exports = AuthService;