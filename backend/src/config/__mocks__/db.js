/**
 * Mock du pool de base de données pour les tests Jest.
 * Permet de simuler les réponses de 'db.query' sans se connecter à MySQL.
 */
const dbMock = {
    query: jest.fn()
};

module.exports = dbMock;
