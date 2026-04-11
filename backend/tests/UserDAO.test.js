const UserDAO = require('../src/dao/UserDAO');
const db = require('../src/config/db');

// Mock de la base de données
jest.mock('../src/config/db');

describe('UserDAO', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getByEmail', () => {
        it('doit retourner un utilisateur par son email', async () => {
            const mockUser = { id: 1, email: 'test@example.com', username: 'tester' };
            db.query.mockResolvedValue([[mockUser]]);

            const result = await UserDAO.getByEmail('test@example.com');

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users WHERE email = ?'), ['test@example.com']);
            expect(result).toEqual(mockUser);
        });

        it('doit retourner null si l\'utilisateur n\'existe pas', async () => {
            db.query.mockResolvedValue([[]]);

            const result = await UserDAO.getByEmail('notfound@example.com');

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('doit insérer un nouvel utilisateur', async () => {
            db.query.mockResolvedValue([{ insertId: 10 }]);

            const userData = {
                username: 'newuser',
                email: 'new@example.com',
                password: 'hashedpassword'
            };

            const result = await UserDAO.create(userData);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                [userData.username, userData.email, userData.password, false, true, expect.any(Date)]
            );
            expect(result).toBe(10);
        });
    });
});
