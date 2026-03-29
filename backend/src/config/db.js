const mysql = require('mysql2');
require('dotenv').config();

/**
 * Création d'un pool de connexions à la base de données MySQL.
 * Le pool permet de gérer efficacement plusieurs connexions simultanées.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exporte le pool sous forme de promesse pour utiliser async/await
module.exports = pool.promise();
