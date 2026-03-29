const app = require('./app');
const db = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

/**
 * Démarrage du serveur sur le port spécifié dans les variables d'environnement.
 */
app.listen(PORT, async () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    
    // Test de la connexion à la base de données
    try {
        await db.getConnection();
        console.log('Connexion à la base de données réussie !');
    } catch (error) {
        console.error('Erreur de connexion à la base de données :', error.message);
    }
});
