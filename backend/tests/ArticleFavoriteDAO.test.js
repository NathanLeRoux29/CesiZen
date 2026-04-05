const ArticleFavoriteDAO = require('../src/dao/ArticleFavoriteDAO');
const db = require('../config/db');

jest.mock('../config/db');

describe('ArticleFavoriteDAO', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('add', () => {
        it('doit ajouter un article aux favoris', async () => {
            db.query.mockResolvedValue([{ insertId: 5 }]);
            const result = await ArticleFavoriteDAO.add(1, 10);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO favorites'),
                [1, 10]
            );
            expect(result).toBe(5);
        });
    });

    describe('isFavorite', () => {
        it('doit retourner true si l\'article est déjà en favori', async () => {
            db.query.mockResolvedValue([[{ id: 1 }]]);
            const result = await ArticleFavoriteDAO.isFavorite(1, 10);
            expect(result).toBe(true);
        });

        it('doit retourner false si l\'article n\'est pas en favori', async () => {
            db.query.mockResolvedValue([[]]);
            const result = await ArticleFavoriteDAO.isFavorite(1, 10);
            expect(result).toBe(false);
        });
    });

    describe('getByUser', () => {
        it('doit retourner la liste des articles favoris d\'un utilisateur', async () => {
            const mockArticles = [{ id: 10, title: 'Article Cool' }];
            db.query.mockResolvedValue([mockArticles]);
            const result = await ArticleFavoriteDAO.getByUser(1);
            expect(result).toEqual(mockArticles);
        });
    });
});
