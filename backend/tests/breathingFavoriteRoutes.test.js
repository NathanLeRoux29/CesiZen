const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

jest.mock('../config/db');

describe('Breathing Favorite Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/breathing/favorites/user/:userId', () => {
        it('doit retourner les favoris de respiration d\'un utilisateur', async () => {
            const mockFavorites = [{ id: 1, name: 'Séance Zen' }];
            db.query.mockResolvedValue([mockFavorites]);

            const response = await request(app).get('/api/breathing/favorites/user/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockFavorites);
        });
    });

    describe('POST /api/breathing/favorites', () => {
        it('doit ajouter un favori de respiration', async () => {
            db.query.mockResolvedValueOnce([{ insertId: 5 }]); // Ajouté

            const response = await request(app)
                .post('/api/breathing/favorites')
                .send({ userId: 1, name: 'Test', inhale: 4, hold: 4, exhale: 4 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Favori ajouté avec succès');
        });
    });
});
