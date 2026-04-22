const UserDAO = require('../dao/UserDAO');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

/**
 * Contrôleur pour la gestion des utilisateurs.
 */
class UserController {
    /**
     * Récupère un utilisateur par son email (exemple pour recherche).
     */
    static async getByEmail(req, res) {
        try {
            const user = await UserDAO.getByEmail(req.query.email);
            if (!user) {
                logger.warn('UserController', 'Utilisateur non trouvé', { email: req.query.email });
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            delete user.password;
            logger.info('UserController', 'Utilisateur trouvé par email', { email: req.query.email });
            res.json(user);
        } catch (error) {
            logger.error('UserController', 'Erreur lors de la recherche par email', error, { email: req.query.email });
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * Enregistre un nouvel utilisateur avec mot de passe haché.
     */
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const userId = await UserDAO.create({ username, email, password: hashedPassword });
            logger.info('UserController', 'Nouvel utilisateur enregistré', { userId, email });
            res.status(201).json({ id: userId, message: 'Utilisateur créé avec succès' });
        } catch (error) {
            logger.error('UserController', 'Erreur lors de l\'enregistrement', error, { email });
            res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserDAO.getByEmail(email);

            if (!user) {
                logger.warn('UserController', 'Échec de connexion - utilisateur non trouvé', { email });
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                logger.warn('UserController', 'Échec de connexion - mot de passe incorrect', { email });
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            delete user.password;
            logger.info('UserController', 'Connexion réussie', { email });
            res.json({ message: 'Connexion réussie', user });
        } catch (error) {
            logger.error('UserController', 'Erreur lors de la connexion', error, { email });
            res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
        }
    }
}

module.exports = UserController;
