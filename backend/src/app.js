const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const { swaggerUi, specs } = require('./config/swagger');

app.use(cors());
app.use(express.json());

// Middleware de logging des requêtes HTTP
app.use((req, res, next) => {
    logger.logRequest(req);
    next();
}); 

/**
 * Documentation Swagger accessible via /api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * Route de base pour vérifier que l'API fonctionne.
 */
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API CesiZen" });
});

// Importation des routes
const articleRoutes = require('./routes/articleRoutes');
const breathRoutes = require('./routes/breathRoutes');
const userRoutes = require('./routes/userRoutes');
const breathingFavoriteRoutes = require('./routes/breathingFavoriteRoutes');
const articleFavoriteRoutes = require('./routes/articleFavoriteRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/articles', articleRoutes);
app.use('/api/breathing', breathRoutes);
app.use('/api/breathing/favorites', breathingFavoriteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites/articles', articleFavoriteRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
