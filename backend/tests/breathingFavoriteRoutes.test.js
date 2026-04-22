const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const { generateToken } = require('../src/utils/jwt');

jest.mock('../src/config/db');

describe('Breathing Favorite Routes', () => {
    let authToken;

    beforeAll(() => {
        const mockUser = { id: 1, email: 'test@example.com', is_admin: false };
        authToken = generateToken(mockUser);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/breathing/favorites/user/:userId', () => {
        it('doit retourner les favoris de respiration d\'un utilisateur', async () => {
            const mockFavorites = [{ id: 1, name: 'Séance Zen' }];
            db.query.mockResolvedValue([mockFavorites]);

            const response = await request(app)
                .get('/api/breathing/favorites/1')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockFavorites);
        });
    });

    describe('POST /api/breathing/favorites', () => {
        it('doit ajouter un favori de respiration', async () => {
            db.query.mockResolvedValueOnce([{ insertId: 5 }]); // Ajouté

            const response = await request(app)
                .post('/api/breathing/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ user_id: 1, name: 'Test', breath_in: 4, breath_hold: 4, breath_out: 4 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Favori ajouté avec succès');
        });
    });
});
