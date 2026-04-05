const BreathingFavoriteDAO = require('../src/dao/BreathingFavoriteDAO');
const db = require('../config/db');

jest.mock('../config/db');

describe('BreathingFavoriteDAO', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllByUserId', () => {
        it('doit retourner les favoris de respiration d\'un utilisateur', async () => {
            const mockFavorites = [{ id: 1, name: 'Ma Séance' }];
            db.query.mockResolvedValue([mockFavorites]);
            const result = await BreathingFavoriteDAO.getAllByUserId(1);
            expect(result).toEqual(mockFavorites);
        });
    });

    describe('create', () => {
        it('doit créer un nouveau favori de respiration', async () => {
            db.query.mockResolvedValue([{ insertId: 50 }]);
            const favoriteData = { userId: 1, name: 'Test', inhale: 4, hold: 7, exhale: 8 };
            const result = await BreathingFavoriteDAO.create(favoriteData);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO breathing_favorites'),
                expect.any(Array)
            );
            expect(result).toBe(50);
        });
    });

    describe('update', () => {
        it('doit mettre à jour un favori existant', async () => {
            db.query.mockResolvedValue([{ affectedRows: 1 }]);
            const favoriteData = { id: 1, name: 'Updated', inhale: 5 };
            const result = await BreathingFavoriteDAO.update(favoriteData);
            expect(result).toBe(true);
        });
    });
});
