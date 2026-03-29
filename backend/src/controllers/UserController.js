const UserDAO = require('../dao/UserDAO');
const bcrypt = require('bcrypt');

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
            if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
            
            // Ne jamais renvoyer le mot de passe (même haché) en clair dans une recherche
            delete user.password;
            res.json(user);
        } catch (error) {
            console.error('Erreur UserController.getByEmail:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * Enregistre un nouvel utilisateur avec mot de passe haché.
     */
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // Hachage du mot de passe avec bcrypt (10 "tours" de sel)
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            const userId = await UserDAO.create({ username, email, password: hashedPassword });
            res.status(201).json({ id: userId, message: 'Utilisateur créé avec succès' });
        } catch (error) {
            console.error('Erreur UserController.register:', error);
            res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
        }
    }

    /**
     * Connecte un utilisateur existant.
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserDAO.getByEmail(email);
            
            if (!user) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            // Comparaison du mot de passe en clair avec le mot de passe haché en base
            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            // Ne pas renvoyer le mot de passe au client
            delete user.password;
            res.json({ message: 'Connexion réussie', user });
        } catch (error) {
            console.error('Erreur UserController.login:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
        }
    }
}

module.exports = UserController;
