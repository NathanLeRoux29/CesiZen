const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const bcrypt = require('bcrypt');

jest.mock('../src/config/db');
jest.mock('bcrypt');

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users/login', () => {
        it('doit connecter un utilisateur avec les bons identifiants', async () => {
            const mockUser = { id: 1, email: 'test@cesizen.fr', password: 'hashedpassword', username: 'Tester' };
            db.query.mockResolvedValue([[mockUser]]);
            bcrypt.compare.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/users/login')
                .send({ email: 'test@cesizen.fr', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body.user.username).toBe('Tester');
        });

        it('doit refuser la connexion si le mot de passe est faux', async () => {
            const mockUser = { id: 1, email: 'test@cesizen.fr', password: 'hashedpassword' };
            db.query.mockResolvedValue([[mockUser]]);
            bcrypt.compare.mockResolvedValue(false);

            const response = await request(app)
                .post('/api/users/login')
                .send({ email: 'test@cesizen.fr', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Email ou mot de passe incorrect');
        });
    });

    describe('POST /api/users/register', () => {
        it('doit créer un nouvel utilisateur', async () => {
            db.query.mockResolvedValueOnce([[]]); // Pas d'utilisateur existant
            bcrypt.hash.mockResolvedValue('hashedpassword');
            db.query.mockResolvedValueOnce([{ insertId: 10 }]); // Insertion succès

            const response = await request(app)
                .post('/api/users/register')
                .send({ username: 'newbie', email: 'new@cesizen.fr', password: 'password123' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Utilisateur créé avec succès');
        });
    });
});
