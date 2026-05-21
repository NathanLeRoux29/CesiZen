const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

jest.mock('../src/config/db');

// Disable rate limiting in tests
jest.mock('express-rate-limit', () => () => (req, res, next) => next());

describe('Report Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/reports', () => {
        it('doit créer un signalement valide', async () => {
            db.query.mockResolvedValue([{ insertId: 1 }]);

            const response = await request(app).post('/api/reports').send({
                category: 'bug',
                description: 'Le bouton ne fonctionne pas correctement',
                email: 'user@example.com',
                page_url: 'http://localhost:5173/home'
            });

            expect(response.status).toBe(201);
            expect(response.body.id).toBe(1);
        });

        it('doit rejeter une description trop courte', async () => {
            const response = await request(app).post('/api/reports').send({
                category: 'bug',
                description: 'court'
            });

            expect(response.status).toBe(422);
            expect(response.body.errors).toBeDefined();
        });

        it('doit rejeter une catégorie invalide', async () => {
            const response = await request(app).post('/api/reports').send({
                category: 'inconnu',
                description: 'Une description suffisamment longue pour passer la validation'
            });

            expect(response.status).toBe(422);
        });

        it('doit rejeter un email invalide', async () => {
            const response = await request(app).post('/api/reports').send({
                category: 'bug',
                description: 'Une description suffisamment longue pour passer la validation',
                email: 'pas-un-email'
            });

            expect(response.status).toBe(422);
        });

        it('doit accepter un signalement sans email ni page_url', async () => {
            db.query.mockResolvedValue([{ insertId: 2 }]);

            const response = await request(app).post('/api/reports').send({
                category: 'suggestion',
                description: 'Il faudrait ajouter un mode sombre à lapplication'
            });

            expect(response.status).toBe(201);
        });
    });

    describe('GET /api/reports', () => {
        it('doit retourner 401 sans token admin', async () => {
            const response = await request(app).get('/api/reports');
            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /api/reports/:id', () => {
        it('doit retourner 401 sans token admin', async () => {
            const response = await request(app).patch('/api/reports/1').send({ status: 'resolu' });
            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /api/reports/:id', () => {
        it('doit retourner 401 sans token admin', async () => {
            const response = await request(app).delete('/api/reports/1');
            expect(response.status).toBe(401);
        });
    });
});
