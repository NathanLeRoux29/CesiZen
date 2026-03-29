const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { swaggerUi, specs } = require('./config/swagger');

app.use(cors()); 
app.use(express.json()); 

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

app.use('/api/articles', articleRoutes);
app.use('/api/breathing', breathRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
