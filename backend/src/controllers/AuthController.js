const AuthService = require('../service/AuthService');
const logger = require('../utils/logger');

/**
 * Contrôleur d'authentification.
 */
class AuthController {
    /**
     * POST /api/users/login
     * Connecte un utilisateur et retourne un JWT.
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email et mot de passe requis' });
            }

            const { token, user } = await AuthService.login(email, password);

            res.json({
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin,
                    is_active: user.is_active
                }
            });
        } catch (error) {
            if (error.message === 'Email ou mot de passe incorrect') {
                return res.status(401).json({ error: error.message });
            }
            logger.error('AuthController', 'Erreur lors de la connexion', error, { email: req.body.email });
            res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
        }
    }

    /**
     * POST /api/users/register
     * Enregistre un nouvel utilisateur et retourne un JWT.
     */
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Nom d\'utilisateur, email et mot de passe requis' });
            }

            const { token, user } = await AuthService.register({ username, email, password });

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin,
                    is_active: user.is_active
                }
            });
        } catch (error) {
            if (error.message === 'Cet email est déjà utilisé') {
                return res.status(409).json({ error: error.message });
            }
            logger.error('AuthController', 'Erreur lors de l\'enregistrement', error, { email: req.body.email });
            res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
        }
    }
}

module.exports = AuthController;