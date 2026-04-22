const AuthService = require('../service/AuthService');
const UserDAO = require('../dao/UserDAO');
const AuthDao = require('../dao/AuthDao');
const bcrypt = require('bcrypt');
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

    /**
     * PUT /api/users/profile
     * Met à jour le profil de l'utilisateur connecté.
     */
    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { username, email } = req.body;

            if (!username || !email) {
                return res.status(400).json({ error: 'Nom d\'utilisateur et email requis' });
            }

            await UserDAO.update(userId, { username, email });
            const updatedUser = await AuthDao.getById(userId);

            res.json({
                message: 'Profil mis à jour',
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    is_admin: updatedUser.is_admin,
                    is_active: updatedUser.is_active
                }
            });
        } catch (error) {
            logger.error('AuthController', 'Erreur lors de la mise à jour du profil', error, { userId: req.user?.id });
            res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil' });
        }
    }

    /**
     * PUT /api/users/password
     * Met à jour le mot de passe de l'utilisateur connecté.
     */
    static async updatePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
            }

            const user = await AuthDao.getByIdWithPassword(userId);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserDAO.updatePassword(userId, hashedPassword);

            res.json({ message: 'Mot de passe mis à jour' });
        } catch (error) {
            logger.error('AuthController', 'Erreur lors de la mise à jour du mot de passe', error, { userId: req.user?.id });
            res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du mot de passe' });
        }
    }
}

module.exports = AuthController;