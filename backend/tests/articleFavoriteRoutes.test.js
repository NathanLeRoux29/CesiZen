const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

jest.mock('../src/config/db');

describe('Article Favorite Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/favorites/articles', () => {
        it('doit ajouter un article aux favoris', async () => {
            db.query.mockResolvedValueOnce([[]]); // Pas encore en favori
            db.query.mockResolvedValueOnce([{ insertId: 1 }]); // Ajouté

            const response = await request(app)
                .post('/api/favorites/articles')
                .send({ userId: 1, articleId: 5 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Article ajouté aux favoris');
        });

        it('doit retourner 409 si l\'article est déjà en favori', async () => {
            db.query.mockResolvedValueOnce([[{ id: 1 }]]); // Déjà présent

            const response = await request(app)
                .post('/api/favorites/articles')
                .send({ userId: 1, articleId: 5 });

            expect(response.status).toBe(409);
        });
    });

    describe('GET /api/favorites/articles/user/:userId', () => {
        it('doit retourner la liste des favoris d\'un utilisateur', async () => {
            const mockArticles = [{ id: 5, title: 'Article 5' }];
            db.query.mockResolvedValue([mockArticles]);

            const response = await request(app).get('/api/favorites/articles/user/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockArticles);
        });
    });
});
