const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

// Mock de la base de données
jest.mock('../src/config/db');

describe('Article Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/articles', () => {
        it('doit retourner tous les articles actifs', async () => {
            const mockArticles = [
                { id: 1, title: 'Test 1', is_active: 1 },
                { id: 2, title: 'Test 2', is_active: 1 }
            ];
            db.query.mockResolvedValue([mockArticles]);

            const response = await request(app).get('/api/articles');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].title).toBe('Test 1');
        });
    });

    describe('GET /api/articles/:id', () => {
        it('doit retourner un article spécifique', async () => {
            const mockArticle = { id: 1, title: 'Test 1' };
            db.query.mockResolvedValue([[mockArticle]]);

            const response = await request(app).get('/api/articles/1');

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test 1');
        });

        it('doit retourner 404 si l\'article n\'existe pas', async () => {
            db.query.mockResolvedValue([[]]);

            const response = await request(app).get('/api/articles/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Article non trouvé');
        });
    });
});
