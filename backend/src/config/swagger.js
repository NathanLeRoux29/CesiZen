const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 3001;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CesiZen API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API CesiZen (Projet CESI)',
    },
    servers: [
      {
        url: '/',
        description: 'Serveur de développement (URL relative)',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
