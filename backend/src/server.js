const app = require('./app');
const db = require('./config/db');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

/**
 * Démarrage du serveur sur le port spécifié dans les variables d'environnement.
 */
app.listen(PORT, async () => {
    logger.info('Server', `Serveur démarré sur http://localhost:${PORT}`);

    // Test de la connexion à la base de données
    try {
        await db.getConnection();
        logger.info('Database', 'Connexion à la base de données réussie !');
    } catch (error) {
        logger.error('Database', 'Erreur de connexion à la base de données', error);
    }
});
